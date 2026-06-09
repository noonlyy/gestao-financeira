import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { categories } from "../constants/categories";
import { colors } from "../constants/colors";

export default function CategoryItem({ category }) {
  const categoryConfig = categories[category] ?? categories.food;

  return (
    <View style={[styles.background, { backgroundColor: categoryConfig.background }]}>
      <MaterialIcons
        name={categoryConfig.icon}
        size={22}
        color={colors.primaryContrast || "#ffffff"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});