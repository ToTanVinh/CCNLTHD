import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native";

const PrescriptionDetail = ({ navigation, route }) => {
  const [medicationId, setMedicationId] = useState(null);
  const [quanlity, setQuanlity] = useState(null);
  const [morning, setMorning] = useState(null);
  const [afternoon, setAfternoon] = useState(null);
  const [evening, setEvening] = useState(null);
  const infor = {
    medicine: parseInt(medicationId, 10),
    quantity: parseInt(quanlity, 10),
    morning_dose: parseInt(morning, 10),
    afternoon_dose: parseInt(afternoon, 10),
    evening_dose: parseInt(evening, 10),
  };
  console.log(infor);
  // Sử dụng useEffect để thiết lập giá trị ban đầu khi component được tạo
  useEffect(() => {
    if (route.params && route.params.id) {
      setMedicationId(route.params.id);
    }
  }, [route.params]);
  const handleClick = () => {
    navigation.navigate("MakePrescription", { infor: infor });
  };

  return (
    <View style={Styles.container}>
      <View>
        <Text>Số lượng thuốc</Text>
        <TextInput
          style={Styles.input}
          placeholder="Nhập vào số lượng thuốc"
          value={quanlity}
          onChangeText={(text) => setQuanlity(text)}
        />
      </View>
      <View>
        <Text>Số lượng thuốc uống vào buổi sáng</Text>
        <TextInput
          style={Styles.input}
          placeholder="Nhập vào số lượng thuốc"
          value={morning}
          onChangeText={(text) => setMorning(text)}
        />
      </View>
      <View>
        <Text>Số lượng thuốc uống vào buổi trưa</Text>
        <TextInput
          style={Styles.input}
          placeholder="Nhập vào số lượng thuốc"
          value={afternoon}
          onChangeText={(text) => setAfternoon(text)}
        />
      </View>
      <View>
        <Text>Số lượng thuốc uống vào buổi tối</Text>
        <TextInput
          style={Styles.input}
          placeholder="Nhập vào số lượng thuốc"
          value={evening}
          onChangeText={(text) => setEvening(text)}
        />
      </View>
      <View>
        <TouchableOpacity style={Styles.button} onPress={handleClick}>
          <Text style={Styles.buttonText}> Xác nhận </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
export default PrescriptionDetail;
