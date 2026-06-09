import { Text, TextInput, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"

export default function DescriptionInput({ form, setForm, valueInputRef }) {
  return (
    <View>
      <Text style={globalStyles.inputLabel}>Descrição</Text>
      <TextInput
        value={form.description}
        returnKeyType="next"
        onChangeText={(text) => setForm({ ...form, description: text })}
        onSubmitEditing={() => valueInputRef.current?.focus()} // Pula para o input de valor
        style={globalStyles.input}
        placeholder="Ex: Almoço, Salário..."
      />
    </View>
  )
}