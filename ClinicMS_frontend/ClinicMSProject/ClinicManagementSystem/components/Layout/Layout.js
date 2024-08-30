import { useContext } from "react";
import { Button } from "react-native";
import MyContext from "../../configs/MyContext";
import React from "react";
import Login from "../Login/Login";
const Layout = ({ navigation }) => {
  const [user, dispatch] = useContext(MyContext);
  const layout = () => {
    dispatch({
      type: "logout",
    });
    navigation.navigate("Login");
  };
  return <Button onPress={layout} title="Logout" />;
};
export default Layout;
