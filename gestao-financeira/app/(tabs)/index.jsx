import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MoneyContext } from '../../contexts/GlobalState';

export default function TransactionsScreen() {
  // Agora desestruturamos o contexto como OBJETO
  const { transactions, removeTransaction, loading, error, refresh } = useContext(MoneyContext);

  const handleDelete = (id) => {
    Alert.alert("Excluir", "Deseja remover esta transação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => removeTransaction(id) }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10 }}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={refresh}>
          <Text style={styles.btnText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        // Pull-to-refresh: puxar a lista para baixo recarrega a API
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleDelete(item.id)} style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.cat}>{item.category?.displayName || 'Sem categoria'}</Text>
            </View>
            <Text style={[styles.val, { color: item.category?.isIncome ? '#2E7D32' : '#D32F2F' }]}>
              R$ {Number(item.value).toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: '#777', fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, marginBottom: 10, borderRadius: 8, elevation: 1 },
  cardInfo: { flex: 1 },
  desc: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cat: { fontSize: 12, color: '#666', marginTop: 4 },
  val: { fontSize: 16, fontWeight: 'bold' }
});