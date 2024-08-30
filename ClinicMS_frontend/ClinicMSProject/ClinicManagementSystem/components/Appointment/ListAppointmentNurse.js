import React, { useState, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import MyContext from "../../configs/MyContext";
import { ScrollView } from "react-native";

const ListAppointmentNurse = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [showCompletedAppointments, setShowCompletedAppointments] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handlePostAPI = async () => {
    try {
      const request = await fetch(
        `http://10.17.67.164:8000/appointments/${selectedAppointments}/confirm/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessTk}`,
          },
        }
      );
      if (!request.ok) {
        throw new Error(
          `HTTP error! Status: ${request.status}, ${request.statusText}`
        );
      }
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          "http://10.17.67.164:8000/users/appointments/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessTk}`,
            },
          }
        );

        const data = await res.json();

        setAppointments(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointments((prevSelected) =>
      prevSelected.includes(appointmentId)
        ? prevSelected.filter((id) => id !== appointmentId)
        : [...prevSelected, appointmentId]
    );
  };

  const handleCreateInvoice = () => {
    // Filter selected appointments that have the status "exam_completed"
    const completedAppointments = selectedAppointments.filter(
      (appointmentId) =>
        appointments.find((appointment) => appointment.id === appointmentId)
          .status === "exam_completed"
    );

    if (completedAppointments.length === 0) {
      Alert.alert(
        "Không có cuộc hẹn đã khám được chọn",
        "Vui lòng chọn cuộc hẹn đã khám để tạo hóa đơn."
      );
      return;
    }

    // Logic to create invoices for completedAppointments
    // ...

    setSelectedAppointments([]);
  };
  const handleCreateMoveButton = () => {
    // Filter selected appointments that have the status "exam_completed"
    const completedAppointments = selectedAppointments.filter(
      (appointmentId) =>
        appointments.find((appointment) => appointment.id === appointmentId)
          .status === "pending_confirmation"
    );

    if (completedAppointments.length === 0) {
      Alert.alert(
        "Không có cuộc hẹn đã khám được chọn",
        "Vui lòng chọn cuộc hẹn đã khám để tạo hóa đơn."
      );
      return;
    }
    // Logic to create invoices for completedAppointments
    // ...
    setSelectedAppointments([]);
  };

  const filterAppointmentsByStatus = (status) => {
    setSelectedStatus(status);
  };

  console.log("Number of Appointments:", appointments.length);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách cuộc hẹn</Text>

      <View style={styles.filterContainer}>
        <Text>Bộ lọc trạng thái:</Text>
        <View style={styles.sidebar}>
          <TouchableOpacity
            onPress={() => filterAppointmentsByStatus("pending_confirmation")}
            style={[
              styles.filterButton,
              selectedStatus === "pending_confirmation" &&
                styles.selectedFilter,
            ]}
          >
            <Text>Chờ khám</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              filterAppointmentsByStatus("examination_in_progress")
            }
            style={[
              styles.filterButton,
              selectedStatus === "examination_in_progress" &&
                styles.selectedFilter,
            ]}
          >
            <Text>Đang khám</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterAppointmentsByStatus("exam_completed")}
            style={[
              styles.filterButton,
              showCompletedAppointments && styles.selectedFilter,
            ]}
          >
            <Text>Đã khám</Text>
          </TouchableOpacity>
        </View>
      </View>
      {appointments
        .filter((item) =>
          selectedStatus ? item.status === selectedStatus : true
        )
        .map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleAppointmentClick(item.id)}
            style={{
              backgroundColor: selectedAppointments.includes(item.id)
                ? "lightblue"
                : "white",
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text>{`Bệnh nhân: ${item.patient.fullname}`}</Text>
            <Text>{`Bác sĩ: ${item.doctor.fullname}`}</Text>
            <Text>{`Ngày: ${item.date}`}</Text>
            <Text>{`Thời gian: ${item.time}`}</Text>
            <Text>{`Trạng thái: ${item.status}`}</Text>
          </TouchableOpacity>
        ))}

      {selectedAppointments.length > 0 &&
        selectedStatus === "exam_completed" && (
          <View style={styles.selectedAppointmentsContainer}>
            <Text>Cuộc hẹn đã chọn:</Text>
            {selectedAppointments.map((appointmentId) => (
              <Text key={appointmentId}>{`ID Cuộc hẹn: ${appointmentId}`}</Text>
            ))}
            <Button title="Tạo Hóa đơn" onPress={handleCreateInvoice} />
          </View>
        )}
      {selectedAppointments.length > 0 &&
        selectedStatus === "pending_confirmation" && (
          <View style={styles.selectedAppointmentsContainer}>
            <Text>Cuộc hẹn đã chọn:</Text>
            {selectedAppointments.map((appointmentId) => (
              <Text key={appointmentId}>{`ID Cuộc hẹn: ${appointmentId}`}</Text>
            ))}
            <Button
              title="Xác Nhận"
              onPress={() => {
                handleCreateMoveButton();
                handlePostAPI();
              }}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  sidebar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedAppointmentsContainer: {
    marginTop: 16,
  },
});

export default ListAppointmentNurse;
