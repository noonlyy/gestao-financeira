import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MoneyContext } from '../../contexts/GlobalState';
import { Picker } from '@react-native-picker/picker';

export default function AddTransactionScreen() {
  const { addTransaction, categories } = useContext(MoneyContext);
  
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Define a primeira categoria como padrão automaticamente ao carregar
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSave = async () => {
    if (!description || !value || !categoryId) {
      return Alert.alert("Aviso", "Preencha todos os campos.");
    }

    setIsSaving(true);
    await addTransaction({
      description,
      value: parseFloat(value.replace(',', '.')), // Garante que vírgula vira ponto
      date: new Date().toISOString(),
      categoryId
    });
    setIsSaving(false);

    Alert.alert("Sucesso", "Transação adicionada!");
    setDescription('');
    setValue('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={styles.input} 
        value={description} 
        onChangeText={setDescription} 
        placeholder="Ex: Almoço no shopping" 
      />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={setValue} 
        placeholder="Ex: 45.50" 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={categoryId} 
          onValueChange={(itemValue) => setCategoryId(itemValue)}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.displayName} value={cat.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={isSaving}>
        {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Salvar Transação</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#DDD' },
  pickerContainer: { backgroundColor: '#FFF', borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#DDD' },
  btn: { backgroundColor: '#007BFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});