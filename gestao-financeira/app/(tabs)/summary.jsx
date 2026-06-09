import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MoneyContext } from '../../contexts/GlobalState';

export default function SummaryScreen() {
  const { transactions, categories } = useContext(MoneyContext);

  // Calcula Receitas e Despesas baseado no boolean "isIncome" da categoria
  const totalIncome = transactions
    .filter(tx => tx.category?.isIncome)
    .reduce((acc, curr) => acc + Number(curr.value), 0);
    
  const totalExpense = transactions
    .filter(tx => !tx.category?.isIncome)
    .reduce((acc, curr) => acc + Number(curr.value), 0);

  const balance = totalIncome - totalExpense;

  // Agrupa o total por cada categoria dinâmica
  const categoryTotals = categories.map(cat => {
    const total = transactions
      .filter(tx => tx.categoryId === cat.id)
      .reduce((acc, curr) => acc + Number(curr.value), 0);
    return { ...cat, total };
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Saldo Atual</Text>
        <Text style={[styles.balanceValue, { color: balance >= 0 ? '#2E7D32' : '#D32F2F' }]}>
          R$ {balance.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.subtitle}>Resumo por Categoria</Text>
      {categoryTotals.map(cat => (
        <View key={cat.id} style={[styles.catCard, { borderLeftColor: cat.background }]}>
          <Text style={styles.catName}>{cat.displayName}</Text>
          <Text style={styles.catTotal}>R$ {cat.total.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  balanceCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 24, elevation: 2 },
  balanceTitle: { fontSize: 16, color: '#666', marginBottom: 8 },
  balanceValue: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  catCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 10, borderLeftWidth: 6, elevation: 1 },
  catName: { fontSize: 16, color: '#333' },
  catTotal: { fontSize: 16, fontWeight: 'bold', color: '#555' }
});