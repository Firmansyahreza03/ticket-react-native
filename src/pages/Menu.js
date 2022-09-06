import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ticket from './ticket/Ticket';
import Profile from './profile/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({navigation}) => {
  useEffect(() => {
    AsyncStorage.clear().then(() => {
      navigation.navigate('Login');
    });
  }, []);
};

function Menu() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Ticket"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#49983b',
      }}>
      <Tab.Screen
        name="Ticket"
        component={Ticket}
        options={{
          tabBarLabel: 'Ticket',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="ticket" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarLabel: 'Log-out',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="logout-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Menu;
