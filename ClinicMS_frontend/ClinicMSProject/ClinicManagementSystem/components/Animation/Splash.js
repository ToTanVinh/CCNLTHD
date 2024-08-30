import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require("../Image/avatar.jpg")} style={styles.logo} />
      <Text style={styles.title}>DoctorApp</Text>
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#37aea8",
  },
  logo: {
    width: 150,
    height: 150,
    bordorRadius: 75,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 20 },
});
