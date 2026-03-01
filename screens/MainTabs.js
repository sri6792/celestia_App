// screens/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10,8,30,0.9)',
          borderTopWidth: 0,
          position: 'absolute',
          height: 64,
          marginBottom: 8,
          marginHorizontal: 12,
          borderRadius: 20,
          shadowColor: '#7b5df0',
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={26} color={focused ? '#7b5df0' : '#bfc7db'} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
