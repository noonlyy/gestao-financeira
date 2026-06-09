import { colors } from "./colors"

export const categories = {
  income: {
    icon: "work",
    background: colors.categoryIncome || "#2A9D8F",
    name: "income",
    displayName: "Renda"
  },
  food: {
    icon: "fastfood",
    background: colors.categoryFood || "#E76F51",
    name: "food",
    displayName: "Alimentação"
  },
  house: {
    icon: "home",
    background: colors.categoryHouse || "#F4A261",
    name: "house",
    displayName: "Casa"
  },
  education: {
    icon: "book",
    background: colors.categoryEducation || "#457B9D",
    name: "education",
    displayName: "Educação"
  },
  travel: {
    icon: "airplanemode-active",
    background: colors.categoryTravel || "#A8DADC",
    name: "travel",
    displayName: "Viagens"
  }
}