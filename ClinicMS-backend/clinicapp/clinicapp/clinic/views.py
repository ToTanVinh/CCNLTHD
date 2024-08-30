import calendar
from datetime import datetime, date, timedelta

from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.db.models import Sum, Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .forms import StatsForm
from .dao import (
    send_book_appointment_success_email,
    send_confirm_appointment_success_email,
    send_cancel_appointment_success_email,
    is_max_appointment_per_day_reached,
    is_slot_available,
)
from .models import (
    MyUser, Doctor, WorkSchedule, Appointment, Medicine, Prescription, PrescriptionDetail, Invoice
)
from .perms import IsAdmin, IsDoctor, IsNurse, IsPatient
from .serializers import (
    MyUserSerializer, MyUserListSerializer,
    DoctorSerializer, DoctorListSerializer, DoctorIntroduceSerializer,
    AppointmentSerializer, AppointmentListSerializer, AppointmentDetailSerializer,
    MedicineSerializer, PrescriptionSerializer, PrescriptionListSerializer,
    InvoiceSerializer, InvoiceListSerializer,
    WorkScheduleSerializer,
    MedicalRecordSerializer,
)


# Create your views here.
class MyUserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = MyUser.objects.filter(is_active=True).all()
    serializer_class = MyUserSerializer
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.action in ['register', ]:
            if self.request.data.get('role') == 'patient':
                permission_classes = [permissions.AllowAny]
            else:
                permission_classes = [IsAdmin]
        elif self.action in ['profile', 'update_profile', 'appointments', 'prescriptions', 'invoices', 'work_schedule']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['medical_record', 'patient_info']:
            permission_classes = [IsDoctor]
        elif self.action in ['list', ]:
            permission_classes = [IsAdmin]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    @action(methods=['post'], url_path='register', url_name='register', detail=False)
    def register(self, request, *args, **kwargs):
        serializer = MyUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data.get('role')
        user = serializer.save()
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)
        return Response(MyUserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='profile', url_name='profile', detail=False)
    def profile(self, request):
        return Response(MyUserSerializer(request.user).data)

    @action(methods=['patch'], url_path='update-profile', url_name='update-profile', detail=False)
    def update_profile(self, request, *args, **kwargs):
        serializer = MyUserSerializer(data=request.data, instance=request.user, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in serializer.validated_data.items():
            setattr(request.user, field, value)

        role = request.data.get('role')
        if role and role != request.user.role:
            if IsAdmin().has_permission(request, self):
                request.user.groups.clear()
                group, = Group.objects.get_or_create(name=role)
                request.user.groups.add(group)
            else:
                return Response({'error': 'You are not allowed to update role of this user'},
                                status=status.HTTP_403_FORBIDDEN)

        request.user.save()
        return Response(MyUserSerializer(request.user).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='appointments', url_name='appointments', detail=False)
    def appointments(self, request, *args, **kwargs):
        app_status = request.query_params.get('status', None)
        app_date = request.query_params.get('date', None)

        filters = {}
        if app_status:
            filters['status'] = app_status
        if app_date:
            filters['date'] = app_date

        user_roles = {
            'doctor': lambda: {'doctor': request.user},
            'nurse': lambda: {},  # Trả về tất cả lịch hẹn
            'patient': lambda: {'patient': request.user}
        }

        role_filter = user_roles.get(request.user.role)
        if role_filter:
            filters.update(role_filter())

        queryset = Appointment.objects.filter(**filters).all()
        serializer = AppointmentListSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = AppointmentListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='prescriptions', url_name='prescriptions', detail=False)
    def prescriptions(self, request, *args, **kwargs):
        date = request.query_params.get('date', None)

        filters = {}
        if date:
            filters['created_date'] = date
        if request.user.role == 'patient':
            filters['patient'] = request.user
        if request.user.role == 'doctor':
            filters['doctor'] = request.user

        queryset = Prescription.objects.filter(**filters).all()
        serializer = PrescriptionListSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PrescriptionListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='invoices', url_name='invoices', detail=False)
    def invoices(self, request, *args, **kwargs):
        invoice_status = request.query_params.get('status', None)
        invoice_date = request.query_params.get('date', None)

        filters = {}
        if invoice_status:
            filters['status'] = invoice_status
        if invoice_date:
            filters['created_date__date'] = invoice_date

        if request.user.role == 'patient':
            filters['patient'] = request.user

        queryset = Invoice.objects.filter(**filters).all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = InvoiceListSerializer(page, many=True)
        else:
            serializer = InvoiceListSerializer(queryset, many=True)

        if not serializer.data:
            return Response({'error': 'No invoices found'}, status=status.HTTP_404_NOT_FOUND)

        return self.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='work-schedule', url_name='work-schedule', detail=False)
    def work_schedule(self, request, *args, **kwargs):
        if request.user.role == 'patient':
            return Response({'error': 'You are not allowed to view this action'}, status=status.HTTP_403_FORBIDDEN)
        date = request.query_params.get('date', None)
        queryset = WorkSchedule.objects.filter(employee=request.user, active=True).all()
        if date:
            queryset = queryset.filter(from_date__lte=date, to_date__gte=date)
        serializer = WorkScheduleSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = WorkScheduleSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(methods=['get'], url_path='medical-record', url_name='medical-record', detail=True)
    def medical_record(self, request, *args, **kwargs):
        user = get_object_or_404(MyUser, pk=kwargs.get('pk'))
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        if not start_date or not end_date:
            return Response({'error': 'Missing start date or end date parameter'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        prescriptions = Prescription.objects.filter(
            patient=user,
            active=True,
            created_date__date__range=[start_date, end_date]
        ).order_by('-created_date')

        serializer = MedicalRecordSerializer(prescriptions, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='patient-info', url_name='patient-info', detail=True)
    def patient_info(self, request, *args, **kwargs):
        user = get_object_or_404(MyUser, pk=kwargs.get('pk'))
        serializer = MyUserListSerializer(user)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = MyUser.objects.filter(is_active=True).all()
        serializer = MyUserListSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = MyUserListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class DoctorViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'time_slots', 'introduce', 'find']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        queryset = Doctor.objects.all()
        serializer = DoctorListSerializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = DoctorListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        doctor = get_object_or_404(Doctor, user_id=kwargs.get('pk'))
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    @action(methods=['get'], url_path='time-slots', url_name='time-slots', detail=True)
    def time_slots(self, request, pk=None):
        doctor = get_object_or_404(Doctor, user_id=pk)

        # Lấy thời gian từ query parameters
        date_param = request.query_params.get('date', None)

        if not date_param:
            return Response({'error': 'Missing date parameter'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_obj = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        if is_max_appointment_per_day_reached(date_obj):
            return Response({'error': 'Maximum appointment per day reached'}, status=status.HTTP_400_BAD_REQUEST)

        work_schedules = WorkSchedule.objects.filter(
            employee=doctor.user,
            from_date__lte=date_obj,
            to_date__gte=date_obj,
            active=True
        ).prefetch_related('shift')

        booked_appointments = Appointment.objects.filter(
            doctor=doctor.user,
            date=date_obj,
            status__in=['pending_confirmation', 'confirmed']
        ).values_list('time', flat=True)

        time_slots = []
        for schedule in work_schedules:
            for shift in schedule.shift.all():
                current_time = datetime.combine(date_obj, shift.start_time)
                end_time = datetime.combine(date_obj, shift.end_time)

                while current_time <= end_time and current_time + timedelta(minutes=30) <= end_time:
                    if current_time.time() not in booked_appointments:
                        time_slots.append(current_time.strftime('%H:%M'))
                    current_time += timedelta(minutes=30)

        return Response({'available_time_slots': time_slots})

    @action(methods=['get'], url_path='introduce', url_name='introduce', detail=True)
    def introduce(self, request, pk=None):
        doctor = get_object_or_404(Doctor, user_id=pk)
        serializer = DoctorIntroduceSerializer(doctor)
        return Response(serializer.data)

    @action(methods=['get'], url_path='find', url_name='find', detail=False)
    def find(self, request, **kwargs):
        kw = request.query_params.get('kw', None)
        doctor = Doctor.objects.filter(Q(user__fullname__icontains=kw) | Q(speciality__icontains=kw))
        serializer = DoctorListSerializer(doctor, many=True)
        page = self.paginate_queryset(doctor)
        if page is not None:
            serializer = DoctorListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class AppointmentViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action in ['create', ]:
            permission_classes = [IsPatient]
        elif self.action in ['retrieve', 'cancel', 'confirm']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['examination', 'complete_examination']:
            permission_classes = [IsDoctor]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data
        patient = data.get('patient')
        doctor = data.get('doctor')
        date = data.get('date')
        time = data.get('time')

        # Kiểm tra nếu time slot trống và hợp lệ cho bác sĩ
        if not is_slot_available(date, time, doctor):
            return Response({'error': 'Time slot is not available for the selected doctor'},
                            status=status.HTTP_400_BAD_REQUEST)

        if patient is None:
            data['patient'] = request.user.id
        if doctor is None:
            return Response({'error': 'Doctor is required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AppointmentSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        appointment = serializer.save()
        send_book_appointment_success_email(appointment)
        return Response(AppointmentDetailSerializer(appointment).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='cancel', url_name='cancel', detail=True)
    def cancel(self, request, *args, **kwargs):
        appointment = get_object_or_404(Appointment, pk=kwargs.get('pk'))
        if IsPatient().has_permission(request, self) and appointment.patient != request.user:
            return Response({'error': 'You are not allowed to cancel this appointment'},
                            status=status.HTTP_403_FORBIDDEN)
        if appointment.status in ['pending_confirmation', 'confirmed']:
            appointment.status = 'cancelled'
            appointment.cancellation_reason = request.data.get('cancellation_reason', '')
            appointment.save()

            send_cancel_appointment_success_email(appointment)
            return Response(AppointmentSerializer(appointment).data)
        else:
            return Response({'error': 'Appointment cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='confirm', url_name='confirm', detail=True)
    def confirm(self, request, *args, **kwargs):
        appointment = get_object_or_404(Appointment, pk=kwargs.get('pk'))
        if appointment.status == 'pending_confirmation':
            if request.user.groups.filter(name='nurse').exists():
                appointment.status = 'confirmed'
                appointment.nurse = request.user
                appointment.save()

                send_confirm_appointment_success_email(appointment)
                return Response(AppointmentSerializer(appointment).data)
            else:
                return Response({'error': 'Only nurses can confirm appointments'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Appointment cannot be confirmed'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='examination', url_name='examination', detail=True)
    def examination(self, request, *args, **kwargs):
        appointment = get_object_or_404(Appointment, pk=kwargs.get('pk'))
        if appointment.status == 'confirmed':
            if appointment.doctor == request.user:
                appointment.status = 'examination_in_progress'
                appointment.save()
                return Response(AppointmentSerializer(appointment).data)
            else:
                return Response({'error': 'Only doctor for this appointment can start examination'},
                                status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Appointment cannot be started'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='complete-examination', url_name='complete-examination', detail=True)
    def complete_examination(self, request, *args, **kwargs):
        appointment = get_object_or_404(Appointment, pk=kwargs.get('pk'))
        if appointment.status == 'examination_in_progress':
            if appointment.doctor == request.user:
                appointment.status = 'exam_completed'
                appointment.save()
                return Response(AppointmentSerializer(appointment).data)
            else:
                return Response({'error': 'Only doctor for this appointment can complete examination'},
                                status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Appointment cannot be completed'}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        appointment = get_object_or_404(Appointment, pk=kwargs.get('pk'))

        if ((request.user.role == 'patient' and appointment.patient != request.user)
                or (request.user.role == 'doctor' and appointment.doctor != request.user)):
            return Response({'error': 'You are not allowed to view this appointment'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data)


class MedicineViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Medicine.objects.filter(active=True).all()
    serializer_class = MedicineSerializer
    pagination_class = PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'find']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    @action(methods=['get'], url_path='find', url_name='find', detail=False)
    def find(self, request, **kwargs):
        kw = request.query_params.get('kw', None)
        medicine = Medicine.objects.filter(name__icontains=kw)
        serializer = MedicineSerializer(medicine, many=True)
        page = self.paginate_queryset(medicine)
        if page is not None:
            serializer = MedicineSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class PrescriptionViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Prescription.objects.filter(active=True).all()
    serializer_class = PrescriptionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', ]:
            permission_classes = [IsDoctor]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data

        appointment = Appointment.objects.get(pk=data.get('appointment'))
        if appointment.status != 'exam_completed':
            return Response({'error': 'Appointment is not completed yet'}, status=status.HTTP_400_BAD_REQUEST)
        if Prescription.objects.filter(appointment=appointment).exists():
            return Response({'error': 'Prescription already created for this appointment'},
                            status=status.HTTP_400_BAD_REQUEST)
        if appointment.doctor != request.user:
            return Response({'error': 'You are not allowed to create prescription for this appointment'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = PrescriptionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        prescription = serializer.save()

        for medicine_data in data.get('prescription_details', []):
            medicine = Medicine.objects.get(pk=medicine_data['medicine'])
            detail = PrescriptionDetail.objects.create(
                prescription=prescription,
                medicine=medicine,
                quantity=medicine_data['quantity'],
                morning_dose=medicine_data.get('morning_dose', 0),
                afternoon_dose=medicine_data.get('afternoon_dose', 0),
                evening_dose=medicine_data.get('evening_dose', 0),
                note=medicine_data.get('note', None),
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InvoiceViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Invoice.objects.filter(active=True).all()
    serializer_class = InvoiceSerializer

    def get_permissions(self):
        if self.action in ['retrieve', ]:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['create', 'cancel', 'pay']:
            permission_classes = [IsNurse]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = InvoiceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='pay', url_name='pay', detail=True)
    def pay(self, request, *args, **kwargs):
        try:
            invoice = Invoice.objects.get(pk=kwargs.get('pk'))  # Lock row for update
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)

        payment_method = request.data.get('payment_method')
        if payment_method is None:
            return Response({'error': 'Payment method is required'}, status=status.HTTP_400_BAD_REQUEST)

        if invoice.status != 'pending':
            return Response({'error': 'Invoice cannot be paid'}, status=status.HTTP_400_BAD_REQUEST)

        invoice.status = 'paid'
        invoice.payment_method = payment_method
        invoice.payment_date = datetime.now()
        invoice.save()

        return Response(InvoiceSerializer(invoice).data)

    @action(methods=['post'], url_path='cancel', url_name='cancel', detail=True)
    def cancel(self, request, *args, **kwargs):
        invoice = Invoice.objects.get(pk=kwargs.get('pk'))
        if invoice.status in ['pending', 'paid']:
            invoice.status = 'cancelled'
            invoice.save()
            return Response(InvoiceSerializer(invoice).data)
        else:
            return Response({'error': 'Invoice cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        invoice = get_object_or_404(Invoice, pk=kwargs.get('pk'))
        if request.user.role == 'patient' and invoice.patient != request.user:
            return Response({'error': 'You are not allowed to view this invoice'}, status=status.HTTP_403_FORBIDDEN)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    def get_appointment(self, pk):
        try:
            return Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            raise Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

    def check_appointment_status(self, appointment):
        if appointment.status != 'exam_completed':
            raise Response({'error': 'Appointment is not completed yet'}, status=status.HTTP_400_BAD_REQUEST)

    def check_existing_invoice(self, appointment):
        if Invoice.objects.filter(appointment=appointment, status__in=('pending', 'paid')).exists():
            raise Response({'error': 'Invoice already created for this appointment and cancelled'},
                           status=status.HTTP_400_BAD_REQUEST)


@login_required(login_url='/admin/login/')
def admin_stats(request):
    if request.user.role != 'admin':
        return HttpResponse('You are not allowed to view this page', status=403)
    form = StatsForm(request.GET)

    if form.is_valid():
        stats_type = form.cleaned_data['type']
        start_year = form.cleaned_data['start_year']
        end_year = form.cleaned_data['end_year']

        if stats_type == 'month':
            month_data = get_month_stats(start_year)
            context = {
                'stats_type': stats_type,
                'month_data': month_data,
                'form': form,
            }
            return render(request, 'clinic/stats.html', context)
        elif stats_type == 'quarter':
            quarter_data = get_quarter_stats(start_year)
            context = {
                'stats_type': stats_type,
                'quarter_data': quarter_data,
                'form': form,
            }
            return render(request, 'clinic/stats.html', context)
        elif stats_type == 'year':
            year_data = get_year_stats(start_year, end_year)
            context = {
                'stats_type': stats_type,
                'year_data': year_data,
                'form': form,
            }
            return render(request, 'clinic/stats.html', context)

    # Nếu form không hợp lệ
    month_data = get_month_stats()
    quarter_data = get_quarter_stats()
    year_data = get_year_stats(start_year=None, end_year=None)
    context = {
        'stats_type': None,
        'month_data': month_data,
        'quarter_data': quarter_data,
        'year_data': year_data,
        'form': form,
    }
    return render(request, 'clinic/stats.html', context)


def get_month_stats(selected_year=None):
    # Lấy dữ liệu từ database
    appointments = Appointment.objects.filter(status='exam_completed')

    if selected_year:
        appointments = appointments.filter(date__year=selected_year)
    else:
        selected_year = date.today().year

    # Tính toán số lượng bệnh nhân và doanh thu theo tháng
    month_data = []
    for month in range(1, 13):
        month_start = date(selected_year, month, 1) if selected_year else date.today().replace(month=month, day=1)
        month_end = month_start + timedelta(days=calendar.monthrange(month_start.year, month)[1] - 1)

        # Tính toán số lượng bệnh nhân
        patient_count = appointments.filter(date__gte=month_start, date__lte=month_end).count()

        # Tính toán doanh thu (từ Invoice)
        revenue = Invoice.objects.filter(
            created_date__gte=month_start,
            created_date__lte=month_end,
            status='paid'
        ).aggregate(total=Sum('total'))['total'] or 0

        month_data.append({'month': month, 'patient_count': patient_count, 'revenue': revenue})

    return month_data


def get_quarter_stats(selected_year=None):
    # Lấy dữ liệu từ database
    appointments = Appointment.objects.filter(status='exam_completed')

    if selected_year:
        appointments = appointments.filter(date__year=selected_year)
    else:
        selected_year = date.today().year

    # Tính toán số lượng bệnh nhân và doanh thu theo quý
    quarter_data = []
    for quarter in range(1, 5):
        # Tính toán ngày bắt đầu và kết thúc của quý
        quarter_start = date(selected_year, 3 * quarter - 2, 1) if selected_year else date.today().replace(
            month=3 * quarter - 2, day=1)
        quarter_end = quarter_start + relativedelta(months=3, days=-1)

        # Tính toán số lượng bệnh nhân
        patient_count = appointments.filter(date__gte=quarter_start, date__lte=quarter_end).count()

        # Tính toán doanh thu (từ Invoice)
        revenue = Invoice.objects.filter(
            created_date__gte=quarter_start,
            created_date__lte=quarter_end,
            status='paid'
        ).aggregate(total=Sum('total'))['total'] or 0

        quarter_data.append({'quarter': quarter, 'patient_count': patient_count, 'revenue': revenue})

    return quarter_data


def get_year_stats(start_year=None, end_year=None):
    # Lấy dữ liệu từ database
    appointments = Appointment.objects.filter(status='exam_completed')

    # Tính toán số lượng bệnh nhân và doanh thu theo năm
    year_data = []

    # Nếu không có start_year, lấy 10 năm trước
    current_year = date.today().year
    start_year = start_year or (current_year - 10)

    # Nếu không có end_year, lấy năm hiện tại
    end_year = end_year or current_year

    for year in range(start_year, end_year + 1):
        # Tính toán ngày bắt đầu và kết thúc của năm
        year_start = date(year, month=1, day=1)
        year_end = date(year, month=12, day=31)

        # Tính toán số lượng bệnh nhân
        patient_count = appointments.filter(date__gte=year_start, date__lte=year_end).count()

        # Tính toán doanh thu (từ Invoice)
        revenue = \
            Invoice.objects.filter(created_date__gte=year_start, created_date__lte=year_end, status='paid').aggregate(
                total=Sum('total'))['total'] or 0

        year_data.append({'year': year, 'patient_count': patient_count, 'revenue': revenue})

    return year_data