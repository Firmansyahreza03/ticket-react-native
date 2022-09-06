import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, Card, Paragraph, Title} from 'react-native-paper';
import {roleCode} from '../../../constants/role-code';
import {getProfileCust,getProfileEmployee} from '../../../service/import.service';
import {getRole} from '../../login/Login';

function ProfileDetail({navigation}) {
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState({});

  useFocusEffect(
    useCallback(() => {
      getRole()
        .then(res => setRole(res))
        .catch(e => console.log(e));
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (role == roleCode.ADMIN || role == roleCode.PIC) {
        getProfileEmp();
        console.log(role);
      } else if (role == roleCode.CUST) {
        getProfileCustomer();
        console.log(role);
      }
    }, [role]),
  );

  const getProfileEmp = () => {
    getProfileEmployee()
      .then(res => setProfile(res.data))
      .catch(e => console.log(e));
  };

  const getProfileCustomer = () => {
    getProfileCust()
      .then(res => {
        setProfile(res.data);
        console.log(res.data.fileId);
      })
      .catch(e => console.log(e));
  };

  const edit = props => {
    navigation.navigate('Edit', {
      id: props.id,
    });
  };

  const color = '#49983b';

  return (
    <View>
      <Card>
        <View style={[styles.image]}>
          <Avatar.Image
            size={250}
            source={{
              uri: `http://192.168.10.105:3333/files/${profile.fileId}`,
              headers: {
                Pragma: 'no-cache',
              },
            }}
          />
        </View>
        <Card.Content>
          <Title>{`${profile.firstName} ${profile.lastName}`}</Title>
          <Paragraph style={styles.form}>
            <Text>Nomor Telepon : </Text>
            <Text>{profile.phoneNumb}</Text>
          </Paragraph>
          <Paragraph style={styles.form}>
            <Text>Alamat : </Text>
            <Text>{profile.address}</Text>
          </Paragraph>
          <Paragraph style={styles.form}>
            <Text>Perusahaan : </Text>
            <Text>{profile.companyName}</Text>
          </Paragraph>
          <Paragraph style={styles.form}>
            <Text>Email : </Text>
            <Text>{profile.email}</Text>
          </Paragraph>
        </Card.Content>
        <Card.Actions style={[styles.form, styles.margin_x_20]}>
          <Button textColor={color} onPress={() => edit({...profile})}>
            Ubah
          </Button>
        </Card.Actions>
        <Card.Content style={styles.attention}>
          <Paragraph>Perhatian</Paragraph>
          <Paragraph>1. Email tidak dapat diganti</Paragraph>
          <Paragraph>2. Nomor telepon tidak dapat diganti</Paragraph>
          <Paragraph>
            3. Untuk pengubahan data diatas harus melalui admin
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  attention: {
    borderWidth: 1,
    borderColor: 'red',
    maxWidth: '90%',
    marginStart: '5%',
    marginVertical: '6%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  form: {
    marginVertical: 10,
  },
  margin_x_20: {
    marginHorizontal: 20,
  },
});

export default ProfileDetail;
