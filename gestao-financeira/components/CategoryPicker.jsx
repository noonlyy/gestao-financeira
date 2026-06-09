import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constants/colors"
import { categories } from "../constants/categories"

export default function CategoryPicker({ form, setForm }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.category}
          onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label={categories.income.displayName} value={categories.income.name} />
          <Picker.Item label={categories.food.displayName} value={categories.food.name} />
          <Picker.Item label={categories.house.displayName} value={categories.house.name} />
          <Picker.Item label={categories.education.displayName} value={categories.education.name} />
          <Picker.Item label={categories.travel.displayName} value={categories.travel.name} />
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: 50,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.primaryContrast,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
  }
})