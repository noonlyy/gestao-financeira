import React, { useContext, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, RefreshControl, Modal, TextInput, Platform, UIManager, LayoutAnimation, Vibration, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoneyContext } from '../../contexts/GlobalState';
import { api } from '../../services/api';

// IMPORTANTE: Certifique-se de ter colocado o arquivo 'vasco.png' na pasta assets/images/
// CORREÇÃO DO ERRO DO PRINT: Mude de '../../../' para '../../'
const vascoLogo = require('../../assets/images/vasco.png');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MONTHS = [
  { label: "Jan", value: 0 }, { label: "Fev", value: 1 }, { label: "Mar", value: 2 },
  { label: "Abr", value: 3 }, { label: "Mai", value: 4 }, { label: "Jun", value: 5 },
  { label: "Jul", value: 6 }, { label: "Ago", value: 7 }, { label: "Set", value: 8 },
  { label: "Out", value: 9 }, { label: "Nov", value: 10 }, { label: "Dez", value: 11 }
];

// NOVA COR DO PROJETO: PRETO (VASCO)
const PRIMARY_COLOR = '#000000'; 

export default function TransactionsScreen() {
  const { user, transactions, removeTransaction, loading, error, refresh } = useContext(MoneyContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editValue, setEditValue] = useState('');

  const handleMonthChange = (monthValue) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMonth(monthValue);
  };

  const handleLongPress = (tx) => {
    Vibration.vibrate(40);
    setSelectedTx(tx);
    setEditDesc(tx.description);
    setEditValue(String(tx.value));
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editDesc.trim() || !editValue.trim()) {
      Alert.alert("Aviso", "A descrição e o valor não podem ficar vazios.");
      return;
    }
    try {
      await api.updateTransaction(selectedTx.id, {
        description: editDesc,
        value: Number(editValue.replace(',', '.')), 
        date: selectedTx.date, 
        categoryId: selectedTx.categoryId 
      });
      setModalVisible(false);
      refresh(); 
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar a transação.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Atenção", "Deseja mesmo excluir esta transação?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          await removeTransaction(selectedTx.id);
          setModalVisible(false);
        } 
      }
    ]);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      if (!item.date) return false;
      const txDate = new Date(item.date);
      return txDate.getMonth() === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{ marginTop: 10 }}>Carregando transações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER PERSONALIZADO DO VASCO */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeText}>
              Olá, <Text style={styles.userName}>{user?.name || 'Torcedor'}</Text>! 👋
            </Text>
            <Text style={styles.welcomeSubtitle}>Gestão Financeira da Colina</Text>
          </View>
          {/* AQUI ESTÁ O SÍMBOLO DO VASCO */}
          <Image 
            source={vascoLogo} 
            style={styles.vascoLogoStyle} 
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtrar por mês:</Text>
        <View style={styles.monthsGrid}>
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month.value}
              style={[
                styles.monthButton,
                selectedMonth === month.value && styles.monthButtonActive
              ]}
              onPress={() => handleMonthChange(month.value)}
            >
              <Text style={[
                styles.monthText,
                selectedMonth === month.value && styles.monthTextActive
              ]}>
                {month.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={[PRIMARY_COLOR]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#CCC" />
            <Text style={styles.empty}>Nenhuma transação na conta.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            onLongPress={() => handleLongPress(item)} 
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.cat}>{item.category?.displayName || 'Sem categoria'}</Text>
            </View>
            <Text style={[styles.val, { color: item.category?.isIncome ? '#2E7D32' : '#D32F2F' }]}>
              {item.category?.isIncome ? '+' : '-'} R$ {Number(item.value).toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="create-outline" size={24} color="#333" />
              <Text style={styles.modalTitle}>Gerenciar Transação</Text>
            </View>
            
            <TextInput style={styles.input} placeholder="Descrição" value={editDesc} onChangeText={setEditDesc} />
            <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={editValue} onChangeText={setEditValue} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.actionText, { color: '#555' }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSaveEdit}>
                <Text style={styles.actionText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  empty: { textAlign: 'center', marginTop: 10, color: '#999', fontSize: 16 },
  
  welcomeCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: PRIMARY_COLOR },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 22, color: '#333' },
  userName: { fontWeight: 'bold', color: PRIMARY_COLOR }, // Nome em Preto
  welcomeSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
  
  // Estilo da Logo do Vasco
  vascoLogoStyle: { width: 40, height: 40 },

  filterContainer: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 16, elevation: 1 },
  filterTitle: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  monthButton: { width: '23%', paddingVertical: 8, alignItems: 'center', borderRadius: 6, marginBottom: 6, backgroundColor: '#F0F0F0' },
  monthButtonActive: { backgroundColor: PRIMARY_COLOR, elevation: 2 }, // Botão ativo em Preto
  monthText: { fontSize: 13, color: '#666', fontWeight: '600' },
  monthTextActive: { color: '#FFF', fontWeight: 'bold' },

  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, marginBottom: 10, borderRadius: 12, elevation: 2 },
  cardInfo: { flex: 1 },
  desc: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cat: { fontSize: 13, color: '#888', marginTop: 4 },
  val: { fontSize: 16, fontWeight: '900' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  actionBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  saveBtn: { backgroundColor: PRIMARY_COLOR, flex: 2 }, // Botão salvar em Preto
  deleteBtn: { backgroundColor: '#F44336', flex: 1 },
  cancelBtn: { backgroundColor: '#E0E0E0', flex: 1.5 },
  actionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});