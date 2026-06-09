import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MoneyContext } from '../../contexts/GlobalState';

const PRESET_COLORS = ["#FFB6B6", "#82C9DE", "#E6E088", "#AB8FBE", "#DEA17B", "#DE9AC3"];

export default function CategoriesScreen() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);

  // Estados do formulário
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [icon, setIcon] = useState('label'); // Ícone padrão
  const [background, setBackground] = useState(PRESET_COLORS[0]);
  const [isIncome, setIsIncome] = useState(false);

  const handleCreate = async () => {
    if (!name || !displayName) {
      return Alert.alert("Aviso", "Preencha o nome técnico e o nome de exibição.");
    }
    
    await addCategory({
      name: name.toLowerCase().replace(/\s+/g, '-'), // Garante formatação técnica
      displayName,
      icon,
      background,
      isIncome
    });

    // Limpa o formulário após salvar
    setName('');
    setDisplayName('');
    setIcon('label');
    setBackground(PRESET_COLORS[0]);
    setIsIncome(false);
  };

  const handleDelete = (id, isDefault) => {
    if (isDefault) {
      return Alert.alert("Bloqueado", "Categorias padrão não podem ser excluídas.");
    }
    
    Alert.alert("Atenção", "Deseja excluir esta categoria?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => removeCategory(id) }
    ]);
  };

  const renderCategory = ({ item }) => (
    <View style={[styles.categoryCard, { borderLeftColor: item.background }]}>
      <View style={[styles.iconBox, { backgroundColor: item.background }]}>
        <MaterialIcons name={item.icon} size={24} color="#FFF" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.displayName}</Text>
        <Text style={styles.cardSubtitle}>
          #{item.name} • {item.isDefault ? 'Padrão' : 'Personalizada'}
        </Text>
        {item.isIncome && <Text style={styles.incomeTag}>Receita</Text>}
      </View>
      {!item.isDefault && (
        <TouchableOpacity onPress={() => handleDelete(item.id, item.isDefault)} style={styles.deleteBtn}>
          <MaterialIcons name="delete" size={24} color="#FF5252" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Formulário de Criação */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Nova Categoria</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome Técnico (ex: saude, lazer)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome de Exibição (ex: Saúde e Bem-estar)"
          value={displayName}
          onChangeText={setDisplayName}
        />
        
        <View style={styles.row}>
          <Text>É uma receita?</Text>
          <Switch value={isIncome} onValueChange={setIsIncome} />
        </View>

        <Text style={styles.label}>Cor de fundo:</Text>
        <View style={styles.colorPalette}>
          {PRESET_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                background === color && styles.colorSelected
              ]}
              onPress={() => setBackground(color)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Text style={styles.addButtonText}>Criar Categoria</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Categorias */}
      <Text style={[styles.sectionTitle, { marginLeft: 16, marginTop: 16 }]}>Categorias Cadastradas</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  form: { backgroundColor: '#FFF', padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 8, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { marginBottom: 8, color: '#555' },
  colorPalette: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  colorSelected: { borderWidth: 3, borderColor: '#333' },
  addButton: { backgroundColor: '#007BFF', padding: 14, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, marginBottom: 10, borderRadius: 8, borderLeftWidth: 6, elevation: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 12, color: '#777', marginTop: 2 },
  incomeTag: { backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: 10, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  deleteBtn: { padding: 8 }
});