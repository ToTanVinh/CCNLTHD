import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Styles from "./Styles";
import Icon from "react-native-vector-icons/FontAwesome";
import MyContext from "../../configs/MyContext";
import API from "../../configs/API";
import Register from "../RegisterMain/RegisterMain";
import endpoints from "../../configs/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
const Login = ({ navigation, route }) => {
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [secureText, setSecureText] = useState(true);
  const [usernameFoucused, setUserNameFocused] = useState(false);
  const [passwordFoucused, setPassWordFocused] = useState(false);
  const [loading, setloading] = useState(false);
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const handleSecuceText = () => {
    setSecureText(!secureText);
  };
  const handleLogin = () => {
    // Xử lý logic đăng nhập
    console.log("Username:", username);
    console.log("Password:", password);
  };
  const handleUsernameFocus = () => {
    setUserNameFocused(true);
  };
  const handleUsernameBlur = () => {
    setUserNameFocused(false);
  };
  const handlePassWordFocus = () => {
    setPassWordFocused(true);
  };
  const handlePassWordBlur = () => {
    setPassWordFocused(false);
  };
  const Client = {
    client_id: "yJomfznqNZwpY02LSsBUH1mECbuL2NBLF63Xa4VJ",
    client_secret:
      "A7qepbZIwDs46JuDaqWGBCHp4kDPkpyELJdV0p7v9ocy3xXmmUvet5erO03D1Jq2USVVqHo46ac8W1JvaHDxt12ZKV9Vp7c3Dc279wiOXyEGubOuUe1Je2LBHTmwvyFM",
  };
  const login = async () => {
    setloading(true);
    try {
      const response = await fetch("http://10.17.67.164:8000/o/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          client_id: Client.client_id,
          client_secret: Client.client_secret,
          grant_type: "password",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAccessTk(data.access_token);
      await AsyncStorage.setItem("access-token", data.access_token);
      const userResponse = await fetch(
        "http://10.17.67.164:8000/users/profile/",
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const u = await userResponse.json();
      dispatch({
        type: "login",
        payload: u,
      });

      // if (u.role === "patient" || u.role === "nurse" || u.role === "doctor") {
      //   navigation.push("App", { userRole: u.role });
      // }
      // navigation.navigate("Đặt lịch", {
      //   params: { access_token: data.access_token },
      // });
      // console.log(u.role);
    } catch (ex) {
      console.error(ex);
    } finally {
      setloading(false);
    }

    useEffect(() => {
      console.log("user app", user);
      // Khi user thay đổi, kiểm tra role và chuyển hướng
      if (user && user.role) {
        if (user.role === "patient") {
          navigation.navigate("Trang chủ của patient");
        } else if (user.role === "nurse") {
          navigation.navigate("Trang chủ của nurse");
        } else {
          navigation.navigate("Trang chủ của doctor");
        }
      }
    }, [user]);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Styles.container}
    >
      <View style={{ flex: 1 }}>
        <Image source={require("../Image/avatar.jpg")} style={Styles.image} />
      </View>

      <View style={{ flex: 2, marginTop: 120 }}>
        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "absolute",
              left: 8,
              top: 10,
              zIndex: 1,
            }}
          >
            <Icon name="user" size={20} />
          </View>
          <TextInput
            style={[
              Styles.input,
              {
                borderColor: usernameFoucused ? "#37aea8" : "gray",
                borderWidth: 1,
              },
            ]}
            onFocus={handleUsernameFocus}
            onBlur={() => {
              handleDismissKeyboard();
              handleUsernameBlur();
            }}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Số điện thoại/email đã đăng kí"
          />
        </View>

        <View style={{ position: "relative" }}>
          <View style={{ position: "absolute", left: 8, top: 10, zIndex: 1 }}>
            <Icon name="lock" size={20} />
          </View>
          <TextInput
            style={[
              Styles.input,
              {
                borderColor: passwordFoucused ? "#37aea8" : "gray",
                borderWidth: 1,
              },
            ]}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Nhập mật khẩu"
            secureTextEntry={secureText}
            onBlur={() => {
              handleDismissKeyboard();
              handlePassWordBlur();
            }}
            onFocus={handlePassWordFocus}
          />
          <TouchableOpacity
            onPress={handleSecuceText}
            style={{ position: "absolute", right: 8, top: 10, zIndex: 1 }}
          >
            <Icon name={secureText ? "eye-slash" : "eye"} size={20} />
          </TouchableOpacity>
        </View>

        <View>
          {loading === true ? (
            <ActivityIndicator />
          ) : (
            <>
              <TouchableOpacity
                style={Styles.button}
                onPress={login}
                activeOpacity={0.8}
              >
                <Text style={Styles.buttonText}>Đăng nhập</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View
        style={{
          flex: 1,
          marginBottom: 55,
          paddingLeft: 8,
        }}
      >
        <View>
          <TouchableOpacity style={Styles.forgotPassword}>
            <Text
              style={{
                color: "#37aea8",
                fontSize: 15,
                marginBottom: 10,
                paddingLeft: 64,
              }}
            >
              Quên mật khẩu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginTop: 1 }}>Bạn chưa có tài khoản? </Text>
          <View>
            <TouchableOpacity
              style={Styles.registerLink}
              onPress={() => navigation.navigate("Đăng kí")}
            >
              <Text style={{ color: "#37aea8", fontSize: 15 }}>
                {" "}
                Đăng kí ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
