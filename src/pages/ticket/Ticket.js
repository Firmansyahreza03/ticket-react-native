import React from 'react';
import TicketList from './ticket-list/TicketList';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TicketDetail from './ticket-detail/TicketDetail';
import TicketForm from './ticket-form/TicketForm';

function Ticket() {
  const Tab = createNativeStackNavigator();
  return (    
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="List" component={TicketList} />
      <Tab.Screen name="Detail" component={TicketDetail} />
      <Tab.Screen name="Form" component={TicketForm} />
    </Tab.Navigator>
  );
}

export default Ticket;
