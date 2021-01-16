import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Controller from "./components/Pages/Controller";
import Settings from './components/Pages/Settings';
import BtConnection from './components/Pages/BtConnection';
import { BtProvider } from "./components/BtContext";

const Stack = createStackNavigator();

export default function App () {

  return (
    <BtProvider>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Controller" options={{headerShown: false}} 
              component={Controller} />
            <Stack.Screen name="Settings" options={{headerShown: false}} 
              component={Settings} />
              <Stack.Screen name="BtConnection" options={{headerShown: false}} 
              component={BtConnection} />
          </Stack.Navigator>
      </NavigationContainer>
    </BtProvider>
  );
};