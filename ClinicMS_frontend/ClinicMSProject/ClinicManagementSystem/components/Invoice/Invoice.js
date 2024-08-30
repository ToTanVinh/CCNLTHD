import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { useState } from "react";
const Invoice = () => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <TextInput
        style={styles.input}
        placeholder="Tổng số tiền cần thanh toán"
      ></TextInput>

      {/* Button thanh toán trực tiếp */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePaymentMethod("Thanh toán bằng tiền mặt")}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Thanh toán tiền mặt</Text>
        </View>
      </TouchableOpacity>

      {/* Button thanh toán qua Momo */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePaymentMethod("Thanh toán qua momo")}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Thanh toán qua Momo</Text>
        </View>
      </TouchableOpacity>
      {paymentMethod && (
        <Image
          source={
            paymentMethod === "Thanh toán qua momo"
              ? require("../Image/momo.png")
              : null
          }
          style={styles.largeIcon}
        />
      )}
      {/* Thêm điều kiện kiểm tra paymentMethod để ẩn hình ảnh */}
      {!paymentMethod && (
        <Text style={styles.subtitle}>
          Vui lòng chọn phương thức thanh toán
        </Text>
      )}
      {/* Hiển thị hình ảnh khi có phương thức thanh toán được chọn */}
      {/* {paymentMethod && (
        <Image
          source={
            paymentMethod === "Momo"
              ? require("../Image/momo.png")
              : require("../Image/zalo.png")
          }
          style={styles.largeIcon}
        />
      )} */}

      {/* Thêm điều kiện kiểm tra paymentMethod để ẩn hình ảnh */}
      {/* {!paymentMethod && (
        <Text style={styles.subtitle}>
          Vui lòng chọn phương thức thanh toán
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  drugList: {
    width: "80%",
    maxHeight: 200,
    marginBottom: 10,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  button: {
    fontSize: 20,
    backgroundColor: "#37aea8",
    width: "80%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  largeIcon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
});

export default Invoice;
