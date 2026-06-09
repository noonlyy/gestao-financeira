import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import GlobalState from "../contexts/GlobalState";
// Importando o LogBox APENAS do react-native padrão do projeto
import { LogBox } from "react-native";

// Desativa todos os avisos amarelos/pretos de desenvolvimento na tela
LogBox.ignoreAllLogs();

export default function RootLayout() {
  return (
    <GlobalState>
      <StatusBar backgroundColor={colors.primary} style="light" />
      {/* Definimos o "login" como a primeira tela a ser carregada */}
      <Stack initialRouteName="login">
        {/* Registramos a tela de login escondendo o cabeçalho dela */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GlobalState>
  );
}