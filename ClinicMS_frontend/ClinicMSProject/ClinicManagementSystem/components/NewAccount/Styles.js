import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    flex: 1,
  },
  text: {
    color: "gray",
    marginTop: 50,
  },
  formInput: {
    flex: 2,
    paddingBottom: 25,
  },
  input: {
    color: "black",
    marginTop: 10,
    borderColor: "gray",
    borderWidth: 1,
    width: 350,
    height: 50,
    borderRadius: 10,
    paddingLeft: 40,
    paddingTop: 8,
    position: "relative",
  },
  iconSection: {
    position: "absolute",
    left: 12,
    top: 12,
  },
  inputText: {
    backgroundColor: "graylight",
  },
  registerButton: {},
  Button: {
    backgroundColor: "#37aea8",
    height: 50,
    marginTop: 20,
    borderRadius: 10,
  },
  completeButtonText: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  note: {
    flex: 1,
    marginTop: 55,
    paddingBottom: 50,
  },
  textNote: {
    color: "gray",
  },
});
