import { useContext, useEffect, useState } from "react";
import { Text, TextInput, View, findNodeHandle } from "react-native";
import MyContext from "../../configs/MyContext";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
const MakePreSription = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [appointment, setAppointments] = useState([]);
  const [idAppointment, setIdAppointment] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [disgnosis, setDisgnosis] = useState("");
  const [daySupply, setDaySupply] = useState("");
  const [followupdate, setForllowUpdate] = useState("");
  const [advice, setAdvice] = useState("");
  const [inforMedicine, setInformedicine] = useState([]);
  const [createPrecription, setCreatePrescription] = useState({
    appointment: "",
    diagnosis: "",
    prescription_details: [],
    days_supply: "",
    advice: "",
    follow_up_date: "",
  });
  console.log(inforMedicine);
  useEffect(() => {
    if (route.params && route.params.infor) {
      setInformedicine(route.params.infor);
    }
  }, [route.params]);
  useEffect(() => {
    try {
      const listAppointmentAccept = async () => {
        const data = await fetch(
          "http://192.168.109.2:8000/users/appointments/?status=confirmed",
          {
            headers: {
              Authorization: `Bearer ${accessTk}`,
            },
          }
        );
        const res = await data.json();
        setAppointments(res.results);
      };
      listAppointmentAccept();
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  }, []);
  const handleAppointmentClick = (id) => {
    // Xử lý khi click vào một appointment
    setSelectedAppointmentId(id === selectedAppointmentId ? id : null);
    setIdAppointment(id);
    navigation.navigate("Medicine");
  };
  const handlePrescriptionsClick = async () => {
    // Cập nhật trạng thái createPrecription với các giá trị mới nhất
    setCreatePrescription((prev) => ({
      ...prev,
      appointment: idAppointment,
      diagnosis: disgnosis,
      days_supply: daySupply,
      advice: advice,
      follow_up_date: followupdate,
      prescription_details: [...prev.prescription_details, ...inforMedicine],
    }));
    // Ghi log trạng thái đã cập nhật
    console.log("creaatePrescription", createPrecription);
  };
  const handlePostAPI = async () => {
    console.log("createPrecription", createPrecription);
    try {
      const request = await fetch("http://10.17.67.164:8000/prescriptions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessTk}`,
        },
        body: JSON.stringify(createPrecription),
      });
      console.log("createPrecription json", createPrecription);
      if (!request.ok) {
        throw new Error(
          `HTTP error! Status: ${request.status}, ${request.statusText}`
        );
      }

      const data = await request.json();
      console.log("data prescription:", data);
    } catch (ex) {
      console.error(ex);
    }
  };
  const handleAppointmentExamination = async () => {
    try {
      const response = fetch(
        `http://10.17.67.164:8000/appointments/${idAppointment}/examination/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessTk}`,
          },
        }
      );
      console.log("id appointment examination", idAppointment);
      const res = (await response).json();
      console.log("Appointment Examination", res);
    } catch (ex) {
      console.error(ex);
    }
  };
  const handleAppointmentExaminationCompleted = async () => {
    try {
      const response = fetch(
        `http://10.17.67.164:8000/appointments/${idAppointment}/complete-examination/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessTk}`,
          },
        }
      );
      const res = (await response).json();
      console.log("Appointment Examination Completed", res);
    } catch (ex) {
      console.error(ex);
    }
  };
  console.log(inforMedicine);
  return (
    <View style={Styles.container}>
      <View>
        <Text>Danh sách các cuộc hẹn</Text>
        {loading === true ? (
          <ActivityIndicator />
        ) : (
          appointment.map((appoint) => (
            <TouchableOpacity
              key={appoint.id}
              style={[
                { marginBottom: 20 },
                appoint.id === selectedAppointmentId &&
                  Styles.selectedAppointment,
              ]}
              onPress={() => {
                handlePrescriptionsClick();
                handleAppointmentClick(appoint.id);
                handleAppointmentExamination();
              }}
            >
              <View key={appoint.id} style={{ marginBottom: 10 }}>
                <Text>Patient Name: {appoint.patient.fullname}</Text>
                <Text>Patient ID: {appoint.patient.id}</Text>
                <Text>Date: {appoint.date}</Text>
                <Text>Time: {appoint.time}</Text>
                <Text>Status: {appoint.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={Styles.disgnosis}>
        <Text>Chẩn đoán</Text>
        <TextInput
          value={disgnosis}
          onChangeText={(text) => setDisgnosis(text)}
          style={Styles.input}
          placeholder="Nhập chẩn đoán"
        ></TextInput>
      </View>
      {/* <TouchableOpacity
        style={[Styles.prescription_details, { flexDirection: "row" }]}
      >
        <Text style={{ marginTop: 4 }}> Vào chi tiết </Text>
        <TouchableOpacity>
          <Icon name="plus" size={30}></Icon>
        </TouchableOpacity>
      </TouchableOpacity> */}
      <View style={Styles.advice}>
        <Text>Lời khuyên</Text>
        <TextInput
          value={advice}
          onChangeText={(text) => setAdvice(text)}
          style={Styles.input}
          placeholder="Nhập lời khuyên"
        ></TextInput>
      </View>
      <View style={Styles.daySupply}>
        <Text>Cấp toa</Text>
        <TextInput
          value={daySupply}
          onChangeText={(text) => setDaySupply(text)}
          style={Styles.input}
          placeholder="Nhập số ngày uống thuốc"
        ></TextInput>
      </View>
      <View style={Styles.follow_up_date}>
        <Text>Ngày tái khám </Text>
        <TextInput
          value={followupdate}
          onChangeText={(text) => setForllowUpdate(text)}
          style={Styles.input}
          placeholder="Nhập vào ngày tái khám"
        ></TextInput>
      </View>

      <View>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            handleAppointmentExaminationCompleted();
          }}
        >
          <Text style={Styles.buttonText}> Xác nhận khám xong </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            handlePostAPI();
          }}
        >
          <Text style={Styles.buttonText}> Tạo toa thuốc </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  listAppointmentAccepted: {
    backgroundColor: "#a8e0e0", // Màu nền khi được chọn
    borderWidth: 2,
    borderColor: "#37aea8", // Màu viền khi được chọn
  },
  selectedAppointment: {
    backgroundColor: "#37aea8", // Màu nền khi được chọn
  },
  input: {
    padding: 5,
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: 300,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  button: {
    marginBottom: 10,
    backgroundColor: "#37aea8",
    paddingVertical: 12,
    borderRadius: 10,
    width: 300,
    shadowColor: "#37aea8",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MakePreSription;
