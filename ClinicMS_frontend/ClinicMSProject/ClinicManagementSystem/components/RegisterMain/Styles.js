import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  selectedGender: {
    borderColor: "#37aea8",
    borderWidth: 1.5,
  },
  formInput: {
    justifyContent: "flex-start",
    textAlign: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  input: {
    marginTop: 5,
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingLeft: 30,
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
  conplete: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButton: {
    width: 320,
    height: 60,
    backgroundColor: "#37aea8",
    borderRadius: 10,
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 15,
  },
});
