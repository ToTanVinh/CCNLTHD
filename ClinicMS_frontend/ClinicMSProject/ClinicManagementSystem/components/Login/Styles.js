import { StyleSheet } from "react-native";
import { Platform } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 190,
    height: 190,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 95,
  },
  sectionIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingLeft: 30,
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: 300,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#37aea8",
    paddingVertical: 12,
    borderRadius: 10,
    width: 300,
    shadowColor: "#37aea8",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  forgotPassword: {},
  registerLink: {},
});
