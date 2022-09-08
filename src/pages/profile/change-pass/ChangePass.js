import React, { useState } from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { changePass } from '../../../service/import.service';
import Header from '../../header/Header';

function ChangePass({navigation}) {
  const [form, setForm] = useState({
    oldPass: undefined,
    newPass: undefined
  })

  const oldPasswordHandler = text => {
    setForm({...form, oldPass: text})
  }

  const newPasswordHandler = text => {
    setForm({...form, newPass: text})
  }

  const changePassHandler = () => {
    changePass(form).then(() => navigation.navigate("Detail")).catch(e => console.log(e))
  }

  return (
    <>
      <Header title="Ganti Password" icon="account" />
      <View style={styles.home_page}>
        <TextInput
          style={[styles.form, styles.radius]}
          onChangeText={oldPasswordHandler}
          placeholder="Masukan Password Lama"
          secureTextEntry={true}
          textAlign="center"
        />
        <TextInput
          style={[styles.form, styles.radius]}
          onChangeText={newPasswordHandler}
          placeholder="Masukan Password Baru"
          secureTextEntry={true}
          textAlign="center"
        />
        <LinearGradient
          colors={['#579f4c', '#49983b', '#346a19']}
          style={[styles.radius, styles.space]}>
          <TouchableHighlight
            onPress={changePassHandler}
            style={styles.radius}
            underlayColor="#346a19">
            <View style={styles.button}>
              <Text style={styles.btn_label}>Ganti Password</Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  radius: {
    borderRadius: 15,
  },
  space: {
    marginTop: 10,
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
    marginVertical: 15,
    borderColor: '#5FD068',
    borderWidth: 1,
  },
});

export default ChangePass;
