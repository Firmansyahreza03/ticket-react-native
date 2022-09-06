import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {loginUser} from '../../service/import.service';
import LinearGradient from 'react-native-linear-gradient';

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const getToken = async () => {
  try {
    const token = await getData().then(res => res.data.token);
    return token;
  } catch (e) {
    console.log('token doesnt exist');
  }
};

export const getRole = async () => {
  try {
    const role = await getData().then(res => res.data.roleCode);
    return role;
  } catch (e) {
    console.log('role doesnt exist');
  }
};

function Login({navigation}) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const emailHandler = text => {
    setForm({...form, email: text});
  };

  const passwordHandler = text => {
    setForm({...form, password: text});
  };

  const loginHandler = () => {
    if (form.email) {
      loginUser(form).then(res => {
        if (res) {
          storeData(res);
          navigation.navigate('Menu');
        }
      });
    }
  };

  const storeData = async data => {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (e) {
      console.log('error storing');
    }
  };

  return (
    <View style={styles.home_page}>
      <Text style={styles.title}>E-Ticket</Text>
      <TextInput
        style={[styles.form, styles.radius]}
        onChangeText={emailHandler}
        placeholder="Masukan Username"
        textAlign='center'
      />
      <TextInput
        style={[styles.form, styles.radius]}
        onChangeText={passwordHandler}
        placeholder="Masukan Password"
        secureTextEntry={true}
        textAlign='center'
      />
      <LinearGradient
        colors={['#579f4c', '#49983b', '#346a19']}
        style={[styles.radius, styles.space]}>
        <TouchableHighlight
          onPress={loginHandler}
          style={styles.radius}
          underlayColor="#346a19">
          <View style={styles.button}>
            <Text style={styles.btn_label}>Masuk</Text>
          </View>
        </TouchableHighlight>
      </LinearGradient>
      <Text style={styles.space}>&copy; Reza 2022</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
  },
  space: {
    marginTop: 10,
  },
  title: {
    marginTop: '-30%',
    fontSize: 40,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#49983b',
  },
  button: {
    alignItems: 'center',
    padding: 10,
    width: 280,
    margin: 10,
  },
  btn_label: {
    color: 'white',
    fontSize: 20,
  },
  home_page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  form: {
    justifyContent: 'center',
    width: 300,
    backgroundColor: 'white',
    color: 'black', //untuk warna tulisan
    marginVertical: 5,
    borderColor: '#5FD068',
    borderWidth: 1,
  },
});

export default Login;
