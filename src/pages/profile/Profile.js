import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileDetail from './profile-detail/ProfileDetail';
import ProfileEdit from './profile-edit/ProfileEdit';
import ChangePass from './change-pass/ChangePass';

function Profile() {
  const Tab = createNativeStackNavigator();
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Detail" component={ProfileDetail} />
      <Tab.Screen name="Edit" component={ProfileEdit} />
      <Tab.Screen name="ChangePass" component={ChangePass} />
    </Tab.Navigator>
  );
}

export default Profile;
