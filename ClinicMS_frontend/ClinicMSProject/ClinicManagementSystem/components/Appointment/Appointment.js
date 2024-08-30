import {
  Platform,
  Text,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Styles from "./Styles";
import React, { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-radio-buttons-group";
import { useContext } from "react";
import MyContext from "../../configs/MyContext";
const Appointment = ({ navigation, route }) => {
  const [gender, setGender] = useState(null);
  const [focus, setFocus] = useState(false);
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const [doctor, setDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  console.log("access token apointment:", accessTk);
  // const { params } = route;
  // const access_token = params ? params.params.access_token : null;
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch("http://10.17.67.164:8000/doctors/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessTk}`,
          },
        });

        const data = await res.json();
        setDoctor(data);
        console.log("data: ", data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [accessTk]);
  const handleBlur = () => {
    setFocus(false);
  };
  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur1 = () => {
    setFocus1(false);
  };
  const handleFocus1 = () => {
    setFocus1(true);
  };
  const handleBlur2 = () => {
    setFocus2(false);
  };
  const handleFocus2 = () => {
    setFocus2(true);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Empty");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setText(fDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const customFilter = (date) => {
    // Get the selected time in minutes
    const selectedTime = date.getHours() * 60 + date.getMinutes();

    // Calculate the lower and upper bounds for allowed time range (7:00 AM to 4:30 PM)
    const lowerBound = 7 * 60; // 7:00 AM in minutes
    const upperBound = 16.5 * 60; // 4:30 PM in minutes

    // Check if the selected time is within the allowed range and is a multiple of 30 minutes
    return (
      selectedTime >= lowerBound &&
      selectedTime <= upperBound &&
      date.getMinutes() % 30 === 0
    );
  };

  const timeSlots = [
    "7:15",
    "7:30",
    "7:45",
    "8:00",
    "8:15",
    "8:30",
    "8:45",
    "9:00",
    "9:15",
    "9:30",
    "9:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
  ];

  const [selectedTime, setSelectedTime] = useState(null);

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (text) => {
    setDescription(text);
  };
  const scheduleAppointment = async () => {
    try {
      const appointmentData = {
        date: date.toISOString().split("T")[0], // Chuyển đổi ngày thành chuỗi ISO và lấy phần "YYYY-MM-DD"
        time: selectedTime,
        doctor: selectedDoctor,
        description: description,
      };

      const res = await fetch("http://10.17.67.164:8000/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessTk}`,
        },
        body: JSON.stringify(appointmentData),
      });
      console.log("date fetch", appointmentData.date);
      console.log("description fetch", appointmentData.description);
      console.log("doctor id", appointmentData.doctor);
      console.log("thoi gian", appointmentData.time);
      if (res.ok) {
        const data = await res.json();
        console.log("Lịch hẹn đã được đặt thành công:", data);
      } else {
        console.error("Đặt lịch hẹn không thành công. Mã lỗi:", res.status);
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={Styles.container}>
          {/* <View style={Styles.customer}>
          <Text style={Styles.Text}>Khách hàng</Text>
          <View style={Styles.iconSection}>
            <Icon name="user-circle" size={50} color="#37aea8" />
            <Icon style={Styles.icon} name="plus" size={20} color="black" />
          </View>
        </View> */}

          {/* <View style={Styles.infor}>
              <Text style={Styles.Text}>Thông tin người đặt lịch</Text>
              <View style={Styles.inputContainer}>
                <View style={{ position: "relative" }}>
                  <View style={{ position: "absolute", top: 15, left: 10 }}>
                    <Icon name="pencil" size={20} />
                  </View>
                  <TextInput
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={[
                      {
                        borderColor: focus ? "#37aea8" : "grey",
                        borderWidth: 2,
                      },
                      Styles.input,
                    ]}
                    placeholder="Họ và tên đầy đủ"
                  />
                </View>

                <View style={{ position: "relative" }}>
                  <TextInput
                    onBlur={handleBlur1}
                    onFocus={handleFocus1}
                    style={[
                      {
                        borderColor: focus1 ? "#37aea8" : "grey",
                        borderWidth: 2,
                      },
                      Styles.input,
                    ]}
                    placeholder="Ngày sinh"
                  />
                  <View style={{ position: "absolute", top: 15, left: 10 }}>
                    <Icon name="calendar" size={20}></Icon>
                  </View>
                </View>

                <View style={{ position: "relative" }}>
                  <TextInput
                    onBlur={handleBlur2}
                    onFocus={handleFocus2}
                    style={[
                      {
                        borderColor: focus2 ? "#37aea8" : "grey",
                        borderWidth: 2,
                      },
                      Styles.input,
                    ]}
                    placeholder="Số điện thoại"
                  />
                  <View style={{ position: "absolute", top: 15, left: 10 }}>
                    <Icon name="phone" size={20}></Icon>
                  </View>
                </View>
              </View>
            </View>

            <View style={Styles.gender}>
              <Text style={Styles.Text}>Giới tính</Text>

              <View style={Styles.genderButton}>
                <TouchableOpacity
                  style={[
                    Styles.genderButtonStyle,
                    gender === "Nam" && Styles.selectedGender,
                  ]}
                  onPress={() => handleGenderSelect("Nam")}
                >
                  <Text style={Styles.genderButtonText}>Nam</Text>
                  {gender === "Nam" && (
                    <Icon name="check" size={20} color="#10" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    Styles.genderButtonStyle,
                    gender === "Nữ" && Styles.selectedGender,
                  ]}
                  onPress={() => handleGenderSelect("Nữ")}
                >
                  <Text style={Styles.genderButtonText}>Nữ</Text>
                  {gender === "Nữ" && <Icon name="check" size={20} color="#10" />}
                </TouchableOpacity>
              </View>
            </View> */}

          <View style={Styles.scheduleAppointment}>
            <View style={Styles.scheduleDetail}>
              <Text style={Styles.Text}>Lịch hẹn</Text>
              <Text style={{ marginTop: 10 }}>Ngày mong muốn khám</Text>
              <View style={{ marginTop: 10 }}>
                <Button
                  color="#37aea8"
                  title="Ngày hẹn"
                  onPress={() => showMode("date")}
                ></Button>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  minimumDate={new Date()} // Chỉ cho phép chọn từ ngày hiện tại
                />
              )}

              <View style={{ marginTop: 10 }}>
                <Text>Chọn giờ mong muốn</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {timeSlots.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        backgroundColor:
                          selectedTime === time ? "#37aea8" : "grey",
                        margin: 5,
                        padding: 10,
                      }}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={{
                          color: selectedTime === time ? "white" : "black",
                        }}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* <View>
                  {timeSlots.map((timeSlot) => (
                    <TouchableOpacity
                      key={timeSlot.key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 10,
                      }}
                      onPress={() => setSelectedTimeSlot(timeSlot.key)}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor:
                            selectedTimeSlot === timeSlot.key
                              ? "#37aea8"
                              : "grey",
                          backgroundColor:
                            selectedTimeSlot === timeSlot.key
                              ? "#37aea8"
                              : "white",
                        }}
                      />
                      <Text style={{ marginLeft: 10 }}>{timeSlot.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View> */}
              {/* </View> */}
            </View>
          </View>
          {loading === true ? (
            <ActivityIndicator />
          ) : (
            <View>
              <Text>Danh sách bác sĩ</Text>
              {doctor &&
              Array.isArray(doctor.results) &&
              doctor.results.length > 0 ? (
                doctor.results.map((d) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#37aea8",
                      margin: 5,
                      height: 50,
                      width: "100%",
                      padding: 10,
                    }}
                    key={d.id}
                    onPress={() => setSelectedDoctor(d.user.id)}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text>ID: {d.id}</Text>
                      <Text> - Fullname: {d.user.fullname}</Text>
                      <Text> - Speciality: {d.speciality}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Không có bác sĩ nào</Text>
              )}
            </View>
          )}
          <View style={Styles.description}>
            <Text style={Styles.Text}>Lý do khám</Text>
            <TextInput
              multiline
              numberOfLines={4}
              style={Styles.input}
              placeholder="Vui lòng mô tả rõ triệu chứng của bạn bà nhu cầu thăm khám"
              value={description}
              onChangeText={handleDescriptionChange}
            />
          </View>

          <View style={Styles.reason}>
            <View>
              <TouchableOpacity onPress={scheduleAppointment}>
                <Text style={Styles.textButton}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Appointment;
