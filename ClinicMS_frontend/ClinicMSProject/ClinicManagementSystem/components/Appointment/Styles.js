import { StyleSheet } from "react-native";
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  customer: {
    marginTop: 5,
  },
  iconSection: {
    marginTop: 10,
    position: "relative",
    marginLeft: 20,
  },
  icon: {
    position: "absolute",
    left: 30,
    top: 36,
  },
  infor: {
    marginTop: 10,
  },
  Text: {
    fontWeight: "500",
    fontSize: 15,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    marginBottom: 5,
    paddingLeft: 35,
    height: 50,
    borderRadius: 10,
  },

  selectedGender: {
    borderColor: "#37aea8",
    borderWidth: 1.5,
  },
  gender: {
    marginTop: 10,
  },
  genderButton: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  genderButtonStyle: {
    width: 120,
    height: 40,
    backgroundColor: "#edeaea",
    borderRadius: 10,
  },
  genderButtonText: {
    color: "#37aea8",
    textAlign: "center",
    paddingTop: 10,
  },
  scheduleAppointment: {
    marginTop: 20,
  },
  reason: {
    marginTop: 30,
    height: 50,
    width: "100%",
    backgroundColor: "#37aea8",
    borderRadius: 10,
  },
  textButton: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
    color: "white",
  },
  description: {},
});
export default Styles;
