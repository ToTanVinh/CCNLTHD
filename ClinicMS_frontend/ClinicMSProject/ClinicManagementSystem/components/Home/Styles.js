import { StyleSheet } from "react-native";
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  title: {
    paddingHorizontal: 20,
  },
  textTitle: {
    fontSize: 25,
  },
  titleDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  animate: {
    marginTop: 5,
    height: 150,
    width: "100%",
    resizeMode: "contain",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  containerInfor: {
    marginTop: 10,
    height: 200,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  iconSection: {
    paddingTop: 20,
    marginTop: 5,
    width: "30%",
    alignItems: "center",
  },
});
export default Styles;
