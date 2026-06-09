import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MoneyContext } from '../../contexts/GlobalState';
// SVG importado para fatiar a pizza perfeitamente com cores dinâmicas!
import Svg, { Circle } from 'react-native-svg';

// Lista de meses para o nosso filtro
const MONTHS = [
  { label: "Jan", value: 0 }, { label: "Fev", value: 1 }, { label: "Mar", value: 2 },
  { label: "Abr", value: 3 }, { label: "Mai", value: 4 }, { label: "Jun", value: 5 },
  { label: "Jul", value: 6 }, { label: "Ago", value: 7 }, { label: "Set", value: 8 },
  { label: "Out", value: 9 }, { label: "Nov", value: 10 }, { label: "Dez", value: 11 }
];

export default function SummaryScreen() {
  const { transactions, categories } = useContext(MoneyContext);
  
  // Estado do filtro de mês (Inicia no mês atual)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // 1. Filtra as transações baseadas no mês selecionado
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      if (!item.date) return false;
      const txDate = new Date(item.date);
      return txDate.getMonth() === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  // 2. Calcula Receitas e Despesas do mês selecionado
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(tx => tx.category?.isIncome)
      .reduce((acc, curr) => acc + Number(curr.value), 0);
  }, [filteredTransactions]);
      
  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter(tx => !tx.category?.isIncome)
      .reduce((acc, curr) => acc + Number(curr.value), 0);
  }, [filteredTransactions]);

  const balance = totalIncome - totalExpense;

  // 3. Agrupa o total por categoria dinâmica
  const categoryTotals = useMemo(() => {
    return categories.map(cat => {
      const total = filteredTransactions
        .filter(tx => tx.categoryId === cat.id)
        .reduce((acc, curr) => acc + Number(curr.value), 0);
      return { ...cat, total };
    });
  }, [categories, filteredTransactions]);

  // 4. Prepara as porcentagens e calcula as posições (offsets) de cada fatia na pizza
  const chartData = useMemo(() => {
    const expensesOnly = categoryTotals.filter(c => !c.isIncome && c.total > 0);
    const totalExpensesSum = expensesOnly.reduce((acc, c) => acc + c.total, 0);

    let accumulatedPercentage = 0;

    return expensesOnly.map(c => {
      const percentage = totalExpensesSum > 0 ? (c.total / totalExpensesSum) * 100 : 0;
      const currentOffset = accumulatedPercentage;
      accumulatedPercentage += percentage; // Soma para a próxima fatia começar onde a anterior terminou

      return {
        ...c,
        percentage,
        offset: currentOffset
      };
    });
  }, [categoryTotals]);

  // Constantes de cálculo para o desenho do círculo SVG
  const RADIUS = 50;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Raio matemático do traçado (314.16)

  return (
    <ScrollView style={styles.container}>
      {/* FILTRO DE MÊS (Sincronizado) */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Resumo do Mês:</Text>
        <View style={styles.monthsGrid}>
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month.value}
              style={[
                styles.monthButton,
                selectedMonth === month.value && styles.monthButtonActive
              ]}
              onPress={() => setSelectedMonth(month.value)}
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

      {/* CARD DO SALDO */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Saldo do Mês</Text>
        <Text style={[styles.balanceValue, { color: balance >= 0 ? '#2E7D32' : '#ED1C24' }]}>
          R$ {balance.toFixed(2)}
        </Text>
      </View>

      {/* SEÇÃO DA DISTRIBUIÇÃO DE GASTOS */}
      <Text style={styles.subtitle}>Distribuição de Gastos</Text>
      {chartData.length === 0 ? (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>Sem despesas registradas neste mês.</Text>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          
          {/* GRAPH PIZZA REAL COM MULTICORES */}
          <View style={styles.pieWrapper}>
            <Svg width="160" height="160" viewBox="0 0 120 120">
              {/* Círculo base cinza claro no fundo */}
              <Circle cx="60" cy="60" r={RADIUS} stroke="#E0E0E0" strokeWidth="14" fill="none" />
              
              {/* Renderiza dinamicamente cada fatia colorida com base nas porcentagens */}
              {chartData.map(item => {
                const strokeDashoffset = CIRCUMFERENCE - (item.percentage / 100) * CIRCUMFERENCE;
                const rotation = (item.offset / 100) * 360 - 90; // Começa no topo (-90 graus)

                return (
                  <Circle
                    key={item.id}
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    stroke={item.background || '#ED1C24'}
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} 60 60)`}
                    strokeLinecap="round" // Dá um acabamento arredondado premium nas fatias
                  />
                );
              })}
            </Svg>

            {/* Texto central por cima do gráfico donut */}
            <View style={styles.innerCircleTextContainer}>
              <Text style={styles.innerCircleText}>Despesas</Text>
            </View>
          </View>
          
          {/* Legendas com as cores certas */}
          <View style={styles.legendContainer}>
            {chartData.map(item => (
              <View key={item.id} style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: item.background || '#ED1C24' }]} />
                <Text style={styles.legendText}>
                  {item.displayName}: <Text style={{ fontWeight: 'bold' }}>{item.percentage.toFixed(0)}%</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* LISTA DE CATEGORIAS */}
      <Text style={styles.subtitle}>Resumo por Categoria</Text>
      {categoryTotals.map(cat => (
        <View key={cat.id} style={[styles.catCard, { borderLeftColor: cat.background || '#000000' }]}>
          <Text style={styles.catName}>{cat.displayName}</Text>
          <Text style={styles.catTotal}>R$ {cat.total.toFixed(2)}</Text>
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  
  filterContainer: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 16, elevation: 1 },
  filterTitle: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  monthButton: { width: '23%', paddingVertical: 6, alignItems: 'center', borderRadius: 4, marginBottom: 6, backgroundColor: '#EAEAEA' },
  
  monthButtonActive: { backgroundColor: '#000000' },
  monthText: { fontSize: 12, color: '#555', fontWeight: '500' },
  monthTextActive: { color: '#FFF', fontWeight: 'bold' },

  balanceCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 8, alignItems: 'center', marginBottom: 24, elevation: 2 },
  balanceTitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  balanceValue: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333', marginTop: 8 },
  
  // Estilos da Pizza SVG Fatiada
  chartContainer: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 24, alignItems: 'center', elevation: 1 },
  pieWrapper: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  innerCircleTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  innerCircleText: { fontSize: 15, fontWeight: 'bold', color: '#444' },

  legendContainer: { width: '100%', marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorBox: { width: 14, height: 14, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 14, color: '#444' },
  emptyChart: { backgroundColor: '#FFF', padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  emptyChartText: { color: '#777', fontSize: 14 },

  catCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 10, borderLeftWidth: 6, elevation: 1 },
  catName: { fontSize: 16, color: '#333' },
  catTotal: { fontSize: 16, fontWeight: 'bold', color: '#555' }
});