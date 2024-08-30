import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import React, { useReducer } from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Login from "./components/Login/Login";
import RegisterMain from "./components/RegisterMain/RegisterMain";
import NewAccount from "./components/NewAccount/NewAccount";
import Home from "./components/Home/Home";
import MyContext from "./configs/MyContext";
import MyUserReducer from "./Reducer/MyUserReducer";
import Layout from "./components/Layout/Layout";
import Appointment from "./components/Appointment/Appointment";
import Profile from "./components/Profile/Profile";
import Icon from "react-native-vector-icons/FontAwesome";
import Splash from "./components/Animation/Splash";
import HomeNurse from "./components/Home/HomeNurse";
import { useEffect } from "react";
import HomeDocTor from "./components/Home/HomeDoctor";
import ProfileDoctor from "./components/Profile/ProfileDoctor";
import ProfileNurse from "./components/Profile/ProfileNurse";
import ListAppointmentNurse from "./components/Appointment/ListAppointmentNurse";
import invoice from "./components/Invoice/Invoice";
import MedicationSearchScreen from "./components/Medicine/SearchMedicine";
import MakePreSription from "./components/Prescription/MakePresription";
import prescriptionDetail from "./components/Prescription/PrescriptionDetail";
import PrescriptionDetail from "./components/Prescription/PrescriptionDetail";
import MedicalRecord from "./components/Prescription/MedicalRecord";
import Invoice from "./components/Invoice/Invoice";
const Tab = createBottomTabNavigator();

const App = ({ navigation, route }) => {
  // // Đảm bảo rằng route được định nghĩa
  // const { params } = route || {};
  // // Trích xuất userRole hoặc gán giá trị mặc định là null
  // const { userRole } = params || { userRole: null };
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [accessTk, setAccessTk] = useState("");

  return (
    <MyContext.Provider value={[user, dispatch, accessTk, setAccessTk]}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Login"
          screenOptions={({ route, navigation }) => ({
            headerRight: () => <Layout navigation={navigation} />,
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;

              if (route.name === "Login") {
                iconName = "user";
              } else if (route.name === "Trang chủ của patient") {
                iconName = "home";
              } else if (route.name === "Appointment") {
                iconName = "calendar";
              } else if (route.name === "Đăng kí") {
                iconName = "registered";
              } else if (route.name === "Tài khoản") {
                iconName = "user";
              } else if (route.name === "Trang chủ của nurse") {
                iconName = "home";
              } else if (route.name === "Danh sách lịch hẹn") {
                iconName = "list";
              } else if (route.name === "Invoice") {
                iconName = "file-text-o";
              } else if (route.name === "Trang chủ của doctor") {
                iconName = "home";
              } else if (route.name === "MakePrescription") {
                iconName = "file-text";
              } else if (route.name === "Medicine") {
                iconName = "medkit";
              } else if (route.name === "PrescriptionDetail") {
                iconName = "file-text";
              } else if (route.name === "MedicalRecord") {
                iconName = "file-text-o";
              }

              const iconColor = focused ? "#37aea8" : "gray";
              return <Icon name={iconName} size={30} color={iconColor} />;
            },
          })}
        >
          {user === null && (
            <>
              <Tab.Screen
                name="demo"
                options={{ tabBarStyle: { display: "none" } }}
                component={Splash}
              />
              <Tab.Screen
                name="Login"
                component={Login}
                options={{ tabBarStyle: { display: "none" } }}
              />
              <Tab.Screen
                name="Đăng kí"
                component={RegisterMain}
                options={{ name: "Đăng kí" }}
              />
            </>
          )}

          {user !== null && (
            <>
              {user?.role === "patient" && (
                <>
                  <Tab.Screen
                    name="Trang chủ của patient"
                    component={Home}
                    options={{ name: "Trang chủ" }}
                  />

                  <Tab.Screen
                    name="Appointment"
                    component={Appointment}
                    options={{ name: "Appointment" }}
                  />

                  <Tab.Screen
                    name="Tài khoản"
                    component={Profile}
                    options={{ name: "Tài khoản" }}
                  />
                </>
              )}
              {user?.role === "nurse" && (
                <>
                  <Tab.Screen
                    name="Trang chủ của nurse"
                    component={HomeNurse}
                    options={{ name: "Trang chủ" }}
                  />

                  <Tab.Screen
                    name="Tài khoản"
                    component={ProfileNurse}
                    options={{ name: "Tài khoản" }}
                  />
                  <Tab.Screen
                    name="Danh sách lịch hẹn"
                    component={ListAppointmentNurse}
                    options={{ name: "Lịch hẹn" }}
                  />
                  <Tab.Screen
                    name="Invoice"
                    component={Invoice}
                    options={{ name: "Hóa đơn" }}
                  />
                </>
              )}

              {user?.role === "doctor" && (
                <>
                  <Tab.Screen
                    name="Trang chủ của doctor"
                    component={HomeDocTor}
                    options={{ name: "Trang chủ" }}
                  />
                  <Tab.Screen
                    name="MakePrescription"
                    component={MakePreSription}
                    options={{ name: "MakePrescription" }}
                  />
                  <Tab.Screen
                    name="Medicine"
                    component={MedicationSearchScreen}
                    options={{ name: "Medicine" }}
                  />
                  <Tab.Screen
                    name="PrescriptionDetail"
                    component={PrescriptionDetail}
                    options={{ name: "Medicine" }}
                  />
                  <Tab.Screen
                    name="MedicalRecord"
                    component={MedicalRecord}
                    options={{ name: "MedicalRecord" }}
                  />
                  <Tab.Screen
                    name="Tài khoản"
                    component={ProfileDoctor}
                    options={{ name: "Tài khoản" }}
                  />
                </>
              )}
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </MyContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
