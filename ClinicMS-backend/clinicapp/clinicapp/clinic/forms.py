from django import forms
from datetime import datetime


class StatsForm(forms.Form):
    STATS_CHOICES = [
        ('month', 'Theo tháng'),
        ('quarter', 'Theo quý'),
        ('year', 'Theo năm'),
    ]

    type = forms.ChoiceField(choices=STATS_CHOICES, label='Loại thống kê')
    start_year = forms.IntegerField(required=False, label='Từ năm')
    end_year = forms.IntegerField(required=False, label='Đến năm')

    def clean(self):
        cleaned_data = super().clean()
        start_year = cleaned_data.get('start_year')
        end_year = cleaned_data.get('end_year')

        # Nếu không có start_year, chọn 10 năm trước
        if not start_year:
            cleaned_data['start_year'] = datetime.today().year - 10

        # Nếu không có end_year, chọn năm hiện tại
        if not end_year:
            cleaned_data['end_year'] = datetime.today().year

        return cleaned_data
