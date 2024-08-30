import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import MyContext from "../../configs/MyContext";
import { useState } from "react";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";
const ProfileNurse = () => {
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const profile = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(
          "http://10.17.67.164:8000/users/profile/",
          {
            headers: {
              Authorization: `Bearer ${accessTk}`,
            },
          }
        );
        const u = await userResponse.json();
        setData(u);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };
    profile();
  }, []);
  return (
    <View>
      <View style={Styles.container}>
        <Image source={{ uri: data.avatar }} style={Styles.iconContainer} />
      </View>
      <View style={Styles.infor}>
        {loading ? (
          <ActivityIndicator size="large" color="#37aea8" />
        ) : (
          <>
            <Text style={Styles.Text}>Thông tin cơ bản</Text>
            <View style={Styles.infoUser}>
              <Text style={Styles.infoText}>
                Họ và tên đầy đủ:{data.fullname}
              </Text>
              <Text style={Styles.infoText}>
                Ngày sinh: {data.date_of_birth}
              </Text>
              <Text style={Styles.infoText}>
                Số điện thoại: {data.phone_number}
              </Text>
              <Text style={Styles.infoText}>Email: {data.email} </Text>
              <Text style={Styles.infoText}>Giới tính: {data.gender} </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileNurse;
const Styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  Text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  infoUser: {
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 5,
  },
});
