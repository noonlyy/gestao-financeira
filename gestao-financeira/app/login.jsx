import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { router } from "expo-router";
import { MoneyContext } from "../contexts/GlobalState";

// Importando a logo que você adicionou na pasta images
// CORREÇÃO DO CAMINHO: Apenas um '../' para sair de 'app' e ir para 'images'
const vascoLogo = require('../assets/images/vasco.png');

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(MoneyContext);

  const handleLogin = () => {
    if (name.trim() === "" || password.trim() === "") {
      Alert.alert("Acesso Negado", "Por favor, preencha seu nome e senha.");
      return;
    }
    
    if (password !== "123456") {
      Alert.alert("Erro de Validação", "Senha incorreta. (Dica: use 123456)");
      return;
    }

    loginUser(name);
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* ESCUDO DO VASCO NO TOPO DO LOGIN */}
        <View style={styles.logoContainer}>
          <Image source={vascoLogo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Vasco Finanças</Text>
        <Text style={styles.subtitle}>Gestão Financeira da Colina</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* BOTÃO PRETO ESTILO VASCO */}
        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    elevation: 4, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Detalhe premium: Borda lateral vermelha (Vasco)
    borderLeftWidth: 6,
    borderLeftColor: "#ED1C24",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#000000", // Cor alterada de verde para Preto Vasco
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});