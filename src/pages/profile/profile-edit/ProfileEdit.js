import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {ActivityIndicator, Avatar, Button, Card, Modal, Portal, Provider, RadioButton} from 'react-native-paper';
import {roleCode} from '../../../constants/role-code';
import {getProfileCustById, getProfileEmpById, getCompanies, updateProfileCust} from '../../../service/import.service';
import {getRole} from '../../login/Login';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Header from '../../header/Header';

function ProfileEdit({route, navigation}) {
  const [visible, setVisible] = React.useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [profile, setProfile] = useState({});
  const [role, setRole] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const {id} = route.params;
  useFocusEffect(
    useCallback(() => {
      getRole()
        .then(res => setRole(res))
        .catch(e => console.log(e));

      getCompanies()
        .then(res => setCompanies(res.datas))
        .catch(e => console.log(e));
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (role == roleCode.PIC) {
        getProfileEmp();
      } else if (role == roleCode.CUST) {
        getProfileCust();
      }
    }, [role]),
  );

  const getProfileCust = async () => {
    setLoading(true);
    await getProfileCustById(id)
      .then(res => {
        setProfile(res.data);
        console.log(res.data.fileId);
      })
      .catch(e => console.log(e));
    setLoading(false);
  };

  const getProfileEmp = async () => {
    setLoading(true);
    await getProfileEmpById(id)
      .then(res => {
        setProfile(res.data);
      })
      .catch(e => console.log(e));
    setLoading(false);
  };

  const color = '#49983b';

  const editImageHandler = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      }).catch(e => console.log('ini error'));

      const fileName = res[0].name;
      const uri = res[0].uri;
      const ext = await fileName.substring(fileName.lastIndexOf('.') + 1);
      await RNFS.readFile(res[0].uri, 'base64')
        .then(res => {
          setIsUpdate(true);
          setProfile({
            ...profile,
            fileName: res,
            fileExt: ext,
            fileUri: uri,
          });
        })
        .catch(e => console.log(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const firstNameHandler = text => {
    setProfile({...profile, firstName: text});
  };

  const addressHandler = text => {
    setProfile({...profile, address: text});
  };

  const lastNameHandler = text => {
    setProfile({...profile, lastName: text});
  };

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const editHandler = () => {
    if (role == roleCode.CUST) {
      const edit = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        address: profile.address,
        companyId: profile.companyId,
        id: profile.id,
        isActive: profile.isActive,
        version: profile.version,
        fileName: profile.fileName,
        fileExt: profile.fileExt,
      };

      updateProfileCust(edit)
        .then(() => navigation.navigate('Detail'))
        .catch(e => console.log(e));
    }
  };

  return (
    <View>
      <Header title="Ubah Profil" icon="account" />
      {loading && <ActivityIndicator animating={loading} color="#49983b" size="large" style={styles.loading} />}
      {!loading && <ScrollView style={styles.page}>
        <View style={styles.image}>
          <Avatar.Image
            size={250}
            source={
              isUpdate
                ? {uri: profile.fileUri}
                : {uri: `http://192.168.10.105:3333/files/${profile.fileId}`}
            }
          />
          <Avatar.Icon
            style={styles.edit_btn}
            icon="pencil"
            size={60}
            onTouchEnd={() => editImageHandler()}
          />
        </View>
        <Text style={styles.label}>E-MAIL : </Text>
        <Text style={styles.form}>{profile.email}</Text>
        <Text style={styles.label}>NAMA DEPAN : </Text>
        <TextInput
          onChangeText={firstNameHandler}
          style={styles.form}
          value={profile.firstName}
        />
        <Text style={styles.label}>NAMA BELAKANG : </Text>
        <TextInput
          onChangeText={lastNameHandler}
          style={styles.form}
          value={profile.lastName}
        />
        <Text style={styles.label}>ALAMAT : </Text>
        <TextInput
          onChangeText={addressHandler}
          style={styles.form}
          value={profile.address}
        />
        <Text style={styles.label}>NOMOR TELEPON : </Text>
        <Text style={styles.form}>{profile.phoneNumb}</Text>
        <View style={[styles.label, styles.flex]}>
          <Text style={[styles.flex_1, styles.bold]}>ASAL PERUSAHAAN</Text>
          <Text
            style={[styles.btn_color, styles.align_right]}
            onPress={showModal}>
            PILIH
          </Text>
        </View>

        <Provider>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <RadioButton.Group
                onValueChange={value =>
                  setProfile({...profile, companyId: value})
                }
                value={profile.companyId}>
                {companies.map(d => (
                  <RadioButton.Item
                    key={d.id}
                    label={d.companyName}
                    value={d.id}
                  />
                ))}
              </RadioButton.Group>
            </Modal>
          </Portal>
        </Provider>
        <Card.Actions style={styles.margin_t_10}>
          <Button buttonColor={color} textColor="white" onPress={editHandler}>
            SIMPAN
          </Button>
        </Card.Actions>
      </ScrollView>}
    </View>
  );
}

const styles = StyleSheet.create({
  margin_t_10: {
    marginTop: 10
  },
  loading: {
    marginTop: '70%'
  },
  page: {
    height: '92%',
  },
  form: {
    borderWidth: 1,
    borderColor: '#49983b',
    marginVertical: '2%',
    backgroundColor: 'white',
    height: 50,
    color: 'black',
    paddingVertical: 15,
    paddingStart: 10,
    width: '95%',
    marginStart: '2.5%',
    borderRadius: 15
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
  },
  flex_1: {
    flex: 1,
  },
  btn_color: {
    fontWeight: 'bold',
    color: '#49983b',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    marginStart: '2.5%',
    color: 'black',
    fontWeight: 'bold',
  },
  align_right: {
    textAlign: 'right',
    marginRight: '3%',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  edit_btn: {
    top: '-15%',
    right: '-15%',
    backgroundColor: '#49983b',
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
});

export default ProfileEdit;
