import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  line: {
    backgroundColor: colors.secondaryText,
    height: 1,
    opacity: 0.2,
    marginVertical: 6,
  },
  primaryText: {
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: "500",
  },
  secondaryText: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  positiveText: {
    fontSize: 16,
    color: colors.positiveText,
    fontWeight: "bold",
  },
  negativeText: {
    fontSize: 16,
    color: colors.negativesText || "#ff4444",
    fontWeight: "bold",
  },
});