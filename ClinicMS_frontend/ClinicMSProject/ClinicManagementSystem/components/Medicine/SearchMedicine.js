import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import MyContext from "../../configs/MyContext";

const MedicationSearchScreen = ({ navigation, route }) => {
  const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicationResults, setMedicationResults] = useState([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const handleSearchMedication = async () => {
    try {
      const response = await fetch(
        `http://192.168.109.2:8000/medicines/find/?kw=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${accessTk}`,
          },
        }
      );
      const data = await response.json();
      console.log("thuoc :", data);
      if (data.results) {
        setMedicationResults(data.results);
      }
    } catch (error) {
      console.error("Error fetching medication:", error);
    }
  };

  const handleSelectMedication = (medicationId, medicationName) => {
    if (medicationId === selectedMedicationId) {
      setSelectedMedicationId(null);
    } else {
      setSelectedMedicationId(medicationId);

      navigation.navigate("PrescriptionDetail", { id: medicationId });
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.searchMedicine}>
        <View style={Styles.search}>
          <TextInput
            style={Styles.input}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Nhập vào tên thuốc"
          />
        </View>
        <TouchableOpacity
          onPress={handleSearchMedication}
          style={Styles.button}
        >
          <Text
            style={{ color: "white", alignContent: "center", marginLeft: 120 }}
          >
            Search
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView style={[Styles.formSearch, { marginTop: 29 }]}>
          {medicationResults.map((medication) => (
            <TouchableOpacity
              key={medication.id}
              onPress={() =>
                handleSelectMedication(medication.id, medication.name)
              }
              style={[
                Styles.input,
                { height: 100, justifyContent: "center" },
                medication.id === selectedMedicationId &&
                  Styles.selectedMedication,
              ]}
            >
              <View>
                <Text>Tên thuốc : {medication.name}</Text>
                <Text>ID: {medication.id}</Text>
                <Text>Miêu tả: {medication.description}</Text>
                <Text>Loại thuốc:{medication.unit}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
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
  searchMedicine: {},
  search: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  selectedMedication: {
    backgroundColor: "#37aea8", // Apply a different background color to the selected item
  },
});
export default MedicationSearchScreen;
