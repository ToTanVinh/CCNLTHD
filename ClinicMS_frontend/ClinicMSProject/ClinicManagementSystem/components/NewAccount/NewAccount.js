import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAvoidingView, Platform } from "react-native";
const NewAccount = () => {
  const handleRegister = () => {
    console.log("Đã nhấn nút Đăng kí");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Styles.container}
    >
      <View style={Styles.title}>
        <Text style={Styles.text}>
          Đăng kí tài khoản sẽ giúp bạn sử dụng được đầy đủ các tính năng của
          chúng tôi
        </Text>
      </View>

      <View style={Styles.formInput}>
        <View style={Styles.input}>
          <View style={Styles.iconSection}>
            <Icon name="user" size={20} />
          </View>
          <TextInput
            placeholder="Tài khoản đăng nhập"
            style={Styles.inputText}
          />
        </View>
        <View style={Styles.input}>
          <View style={Styles.iconSection}>
            <Icon name="lock" size={20} />
          </View>
          <TextInput
            placeholder="Nhập mật khẩu"
            secureTextEntry
            style={Styles.inputText}
          />
        </View>
        <View style={Styles.input}>
          <View style={Styles.iconSection}>
            <Icon name="lock" size={20} />
          </View>
          <TextInput
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            style={Styles.inputText}
          />
        </View>
        <View style={Styles.registerButton}>
          <TouchableOpacity style={Styles.Button} onPress={handleRegister}>
            <Text style={Styles.completeButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={Styles.note}>
        <View>
          <Text style={Styles.textNote}>
            Bằng cách nhấn nút "Đăng kí" tôi xác nhận đã đọc và đồng ý với các
            Quy định sử dụng và Chính sách quền riêng tư
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default NewAccount;
