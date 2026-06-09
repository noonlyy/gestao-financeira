import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#000000', 
        tabBarInactiveTintColor: '#999999', 
        
        headerStyle: {
          backgroundColor: '#000000', 
          borderBottomWidth: 1,
          borderBottomColor: '#333333',
        },
        headerTintColor: '#FFFFFF', 
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      {/* ABA 1: INDEX */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Transações',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="exchange" color={color} />,
        }}
      />

      {/* ABA 2: RESUMO */}
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="pie-chart" color={color} />,
        }}
      />

      {/* ABA 3: ADD TRANSACTIONS */}
      <Tabs.Screen
        name="add-transactions" 
        options={{
          title: 'Nova Transação',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="plus-circle" color={color} />,
        }}
      />

      {/* ABA 4: GERENCIAR CATEGORIAS (Corrigindo o ícone e o texto) */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="tags" color={color} />,
        }}
      />
    </Tabs>
  );
}