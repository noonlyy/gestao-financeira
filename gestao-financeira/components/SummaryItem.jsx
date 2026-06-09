import { StyleSheet, Text, View } from "react-native";
import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";
import { globalStyles } from "../styles/globalStyles";

export default function SummaryItem({ category, value }) {
  const categoryConfig = categories[category] ?? categories.food;
  const valueStyle = category === "income" ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={styles.itemContainer}>
      <CategoryItem category={category} />
      <View style={styles.textContainer}>
        <Text style={globalStyles.primaryText}>{categoryConfig.displayName}</Text>
        <Text style={valueStyle}>
          {value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
  },
});