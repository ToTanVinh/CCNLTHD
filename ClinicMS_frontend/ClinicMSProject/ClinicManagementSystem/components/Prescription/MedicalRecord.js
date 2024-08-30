import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import MyContext from "../../configs/MyContext";

const MedicalRecord = () => {
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [patient, setPatient] = useState({});
  const [medicalRecord, setMedicalRecord] = useState([]);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const profile = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(
          "http://127.0.0.1:8000/users/7/medical-record/?start_date=2024-01-01&end_date=2024-03-03",
          {
            headers: {
              Authorization: `Bearer ${accessTk}`,
            },
          }
        );
        const u = await userResponse.json();
        setPatient(u);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };
    profile();
  }, []);

  useEffect(() => {
    const fetchMedicalRecordData = async () => {
      try {
        setLoading(true);
        if (patient.id) {
          const medicalRecordResponse = await fetch(
            `http://10.17.67.164:8000/users/${patient.id}/medical-record/`,
            {
              headers: {
                Authorization: `Bearer ${accessTk}`,
              },
              method: "GET",
              params: {
                start_date: startDate,
                end_date: endDate,
              },
            }
          );

          const medicalRecordData = await medicalRecordResponse.json();
          setMedicalRecord(medicalRecordData);
        } else {
          console.warn("Patient ID not found.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecordData();
  }, [patient.id, startDate, endDate]);

  const renderItem = ({ item }) => (
    <View style={styles.medicalRecordItem}>
      <Image source={{ uri: item.doctor.avatar }} style={styles.doctorAvatar} />
      <View>
        <Text>Chẩn đoán: {item.diagnosis}</Text>
        <Text>Bác sĩ: {item.doctor.fullname}</Text>
        <Text>Ngày khám: {item.created_date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: patient.avatar }} style={styles.patientAvatar} />
      <Text>{patient.fullname}</Text>
      {patient.gender === "male" ? <Text>Nam</Text> : <Text>Nữ</Text>}
      <Text>From:</Text>
      <TextInput
        value={startDate}
        onChangeText={(text) => setStartDate(text)}
        style={styles.input}
      />
      <Text>To:</Text>
      <TextInput
        value={endDate}
        onChangeText={(text) => setEndDate(text)}
        style={styles.input}
      />

      <FlatList
        data={medicalRecord}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF5FB", // Lighter background for better readability
    alignItems: "center",
    padding: 16,
  },
  patientAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Increased border radius for a smoother look
    marginBottom: 20, // Increased spacing for visual separation
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between", // Align text to edges for better layout
    marginBottom: 10,
  },
  patientName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  patientGender: {
    // Adjust colors as needed for contrast
    fontSize: 14,
    color: "#888",
  },
  input: {
    height: 40,
    backgroundColor: "#F5F5F5", // Light gray background for input fields
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15, // Increased spacing for visual separation
    paddingHorizontal: 15,
    width: "100%",
    fontSize: 16, // Increased font size for better readability
  },
  datePickerLabel: {
    fontWeight: "bold",
  },
  medicalRecordList: {
    marginBottom: 20, // Spacing before the list
  },
  medicalRecordItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Increased spacing between items
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50, // Rounder edges for the avatar
    marginRight: 15,
  },
  medicalRecordDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  medicalRecordText: {
    fontSize: 14,
  },
});

export default MedicalRecord;
