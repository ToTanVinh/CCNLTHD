import { View, Text, ActivityIndicator, Image } from "react-native";
import Styles from "./Styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { useContext, useState } from "react";
import MyContext from "../../configs/MyContext";
import * as ImagePicker from "expo-image-picker";
import API from "../../configs/API";
import endpoints from "../../configs/API";
import mime from "mime";
const Register = ({ navigation }) => {
  const [user, setUser] = useState({
    fullname: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    role: "patient",
    username: "",
    password: "",
    avatar: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const register = async () => {
    const form = new FormData();
    for (let key in user)
      if (key === "avatar") {
        form.append(key, {
          uri: user[key].uri,
          name: user[key].fileName,
          type: mime.getType(user[key].uri),
        });
      } else form.append(key, user[key]);
    console.log("form.avatar.uri", form.avatar);
    try {
      const response = await fetch("http://10.17.67.164:8000/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, ${response.statusText}`
        );
      }
      console.log(form);
      const data = await response.json();
      console.log("data", data);
      navigation.navigate("Login");
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };
  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Pemission deny");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync();
      console.log("ImagePicker Result:", res);
      if (!res.canceled) {
        // res.assets[0]
        change("avatar", res.assets[0]);
      }
    }
  };

  const change = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };
  const [gender, setGender] = useState(null);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };
  user.gender = gender;
  const [focus, setFocus] = useState(false);
  const handleBlur = () => {
    setFocus(false);
  };
  const handleFocus = () => {
    setFocus(true);
  };

  const [focus1, setFocus1] = useState(false);
  const handleBlur1 = () => {
    setFocus1(false);
  };
  const handleFocus1 = () => {
    setFocus1(true);
  };

  const [focus2, setFocus2] = useState(false);
  const handleBlur2 = () => {
    setFocus2(false);
  };
  const handleFocus2 = () => {
    setFocus2(true);
  };

  const [focus3, setFocus3] = useState(false);
  const handleBlur3 = () => {
    setFocus3(false);
  };
  const handleFocus3 = () => {
    setFocus3(true);
  };

  const [focus4, setFocus4] = useState(false);
  const handleBlur4 = () => {
    setFocus4(false);
  };
  const handleFocus4 = () => {
    setFocus4(true);
  };

  const [focus5, setFocus5] = useState(false);
  const handleBlur5 = () => {
    setFocus5(false);
  };
  const handleFocus5 = () => {
    setFocus5(true);
  };

  const [focus6, setFocus6] = useState(false);
  const handleBlur6 = () => {
    setFocus6(false);
  };
  const handleFocus6 = () => {
    setFocus6(true);
  };

  const [focus7, setFocus7] = useState(false);
  const handleBlur7 = () => {
    setFocus6(false);
  };
  const handleFocus7 = () => {
    setFocus6(true);
  };
  const [ho, setHo] = useState(null);
  const [ngaySinh, setNgaySinh] = useState(null);
  const [MatKhau, setMatKhau] = useState(null);
  const [dienThoai, setDienThoai] = useState(null);
  const [DangNhap, setDangNhap] = useState(null);
  const [email, setEmail] = useState(null);

  // const handleComplete = () => {
  //   console.log("Họ tên:", ho);
  //   console.log("Ngày sinh:", ngaySinh);
  //   console.log("MatKhau/CMND:", MatKhau);
  //   console.log("Số điện thoại:", dienThoai);
  //   console.log("Địa chỉ:", DangNhap);
  //   console.log("Email:", email);
  //   console.log("Giới tính:", gender);
  // };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Styles.container}
    >
      {/* <View style={Styles.avatar}>
        <View>
          <Icon name="user-circle" size={55} color="#888888"></Icon>
          <View
            style={{ position: "absolute", bottom: 10, right: 1510, zIndex: 1 }}
          >
            <Icon name="camera" size={110} color="#888888"></Icon>
          </View>
        </View>
      </View> */}

      <View style={Styles.formInput}>
        <View style={{ position: "relative" }}>
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="pencil" size={15}></Icon>
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
            placeholder="Họ và tên người dùng"
            value={user.fullname}
            onChangeText={(t) => change("fullname", t)}
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
            value={user.date_of_birth}
            onChangeText={(t) => change("date_of_birth", t)}
          />
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="calendar" size={15}></Icon>
          </View>
        </View>

        <View style={{ position: "relative" }}>
          <TextInput
            onBlur={handleBlur4}
            onFocus={handleFocus4}
            style={[
              {
                borderColor: focus4 ? "#37aea8" : "grey",
                borderWidth: 2,
              },
              Styles.input,
            ]}
            placeholder="Tên đăng nhập"
            value={user.username}
            onChangeText={(t) => change("username", t)}
          />
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="home" size={15}></Icon>
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
            placeholder="Mật khẩu"
            value={user.password}
            onChangeText={(t) => change("password", t)}
          />
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="file" size={15}></Icon>
          </View>
        </View>

        <View style={{ position: "relative" }}>
          <TextInput
            onBlur={handleBlur3}
            onFocus={handleFocus3}
            style={[
              {
                borderColor: focus3 ? "#37aea8" : "grey",
                borderWidth: 2,
              },
              Styles.input,
            ]}
            placeholder="Số điện thoại"
            value={user.phone_number}
            onChangeText={(t) => change("phone_number", t)}
          />
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="phone" size={15}></Icon>
          </View>
        </View>

        <View style={{ position: "relative" }}>
          <TextInput
            onBlur={handleBlur5}
            onFocus={handleFocus5}
            style={[
              {
                borderColor: focus5 ? "#37aea8" : "grey",
                borderWidth: 2,
              },
              Styles.input,
            ]}
            placeholder="Email"
            value={user.email}
            onChangeText={(t) => change("email", t)}
          />
          <View style={{ position: "absolute", top: 21, left: 10 }}>
            <Icon name="envelope" size={15}></Icon>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={[
              {
                borderColor: focus7 ? "#37aea8" : "grey",
                borderWidth: 2,
              },
              Styles.input,
            ]}
            onPress={picker}
          >
            <Text>Chọn ảnh đại diện</Text>
          </TouchableOpacity>
          {user.avatar ? (
            <Image style={Styles.avatar} source={{ uri: user.avatar.uri }} />
          ) : (
            ""
          )}
        </View>
      </View>

      <View style={Styles.gender}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Giới tính</Text>

        <View style={Styles.genderButton}>
          <TouchableOpacity
            style={[
              Styles.genderButtonStyle,
              gender === "male" && Styles.selectedGender,
            ]}
            onPress={() => handleGenderSelect("male")}
          >
            <Text style={Styles.genderButtonText}>Nam</Text>
            {gender === "male" && (
              <Icon name="check" size={15} color="#001100" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              Styles.genderButtonStyle,
              gender === "female" && Styles.selectedGender,
            ]}
            onPress={() => handleGenderSelect("female")}
          >
            <Text style={Styles.genderButtonText}>Nữ</Text>
            {gender === "female" && (
              <Icon name="check" size={15} color="#001100" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={Styles.conplete}>
        {loading === true ? (
          <ActivityIndicator />
        ) : (
          <>
            <View>
              <TouchableOpacity
                style={Styles.completeButton}
                // onPress={handleComplete}
                onPress={register}
              >
                <Text style={Styles.completeButtonText}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
export default Register;
