import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

export default function GlobalState({ children }) {
  // Novo estado para guardar o usuário logado
  const [user, setUser] = useState(null); 

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nova função para fazer login
  const loginUser = useCallback((name) => {
    setUser({ name });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    refresh(); 
  }, [refresh]);

  const addTransaction = useCallback(async (data) => {
    try {
      const newTx = await api.createTransaction(data);
      setTransactions((prev) => [newTx, ...prev]);
    } catch (e) {
      alert("Erro ao adicionar transação: " + e.message);
    }
  }, []);

  const removeTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (e) {
      alert("Erro ao remover transação: " + e.message);
    }
  }, []);

  const addCategory = useCallback(async (data) => {
    try {
      const newCat = await api.createCategory(data);
      setCategories((prev) => [...prev, newCat]);
    } catch (e) {
      alert("Erro ao adicionar categoria: " + e.message);
    }
  }, []);

  // AJUSTADO: Agora limpa a categoria E some com os gastos vinculados na mesma hora!
  const removeCategory = useCallback(async (id) => {
    try {
      await api.deleteCategory(id);
      
      // 1. Remove a categoria deletada da lista de categorias
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      
      // 2. O PULO DO GATO: Filtra e joga fora da tela todas as transações que pertenciam a essa categoria excluída!
      setTransactions((prev) => prev.filter((tx) => tx.categoryId !== id));

    } catch (e) {
      alert("Erro ao remover categoria: " + e.message);
    }
  }, []);

  return (
    <MoneyContext.Provider value={{
      user, loginUser, // <-- Disponibilizando para o resto do app
      transactions, categories, loading, error, refresh,
      addTransaction, removeTransaction, addCategory, removeCategory,
    }}>
      {children}
    </MoneyContext.Provider>
  );
}