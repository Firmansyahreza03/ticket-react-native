import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button, Card, Modal, Portal, Provider, RadioButton} from 'react-native-paper';
import {findByIdTicket, getPriorities, getProductByCust, postTicket} from '../../../service/import.service';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {useDispatch} from 'react-redux';
import {add} from '../../../redux/actions/ticketAction';
import Header from '../../header/Header';

function TicketForm({navigation}) {
  const [upload, setUpload] = useState({
    fileName: null,
    fileType: null,
  });
  const [priority, setPriority] = useState([]);
  const [product, setProduct] = useState([]);
  const [visiblePriority, setVisiblePriority] = useState(false);
  const [visibleProduct, setVisibleProduct] = useState(false);
  const [form, setForm] = useState({
    description: '',
    title: '',
    priorityId: 0,
    productId: 0,
    fileName: null,
    fileExt: null,
  });

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getProductByCust()
        .then(res => setProduct(res.datas))
        .catch(e => console.log(e));

      getPriorities()
        .then(res => setPriority(res.datas))
        .catch(e => console.log(e));
    }, []),
  );

  const color = '#49983b';

  const uploadImageHandler = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).catch(e => console.log('ini error'));

      const fileName = res[0].name;
      const ext = await fileName.substring(fileName.lastIndexOf('.') + 1);
      await RNFS.readFile(res[0].uri, 'base64')
        .then(
          res =>
            setForm({
              ...form,
              fileName: res,
              fileExt: ext,
            }),
          setUpload({
            fileName: fileName,
            fileType: res[0].type,
          }),
        )
        .catch(e => console.log(e));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        alert('canceled');
      } else {
        alert('unknown error: ' + JSON.stringify(err));
      }
    }
  };

  const descriptionHandler = text => {
    setForm({...form, description: text});
  };

  const titleHandler = text => {
    setForm({...form, title: text});
  };

  const showModalPriority = () => setVisiblePriority(true);

  const showModalProduct = () => setVisibleProduct(true);

  const hideModal = () => {
    setVisiblePriority(false);
    setVisibleProduct(false);
  };

  const submitHandler = () => {
    postTicket(form)
      .then(res => {
        findByIdTicket(res.data.id).then(res => {
          dispatch(add(res.data));
          navigation.navigate('List');
        });
      })
      .catch(e => console.log(e));
  };

  return (
    <View>
      <Header icon="ticket" title="Ticket Baru" />
      <ScrollView style={styles.page}>
        <View style={[styles.image_position, styles.vertical_margin]}>
          <Image
            source={require('../../../assets/Tickets-icon.png')}
            style={styles.image}
          />
        </View>
        <Text style={[styles.label, styles.vertical_margin]}>JUDUL : </Text>
        <TextInput style={styles.form} onChangeText={titleHandler} />
        <Text style={[styles.label, styles.vertical_margin]}>
          PERMASALAHAN :
        </Text>
        <TextInput style={styles.form} onChangeText={descriptionHandler} />
        <View style={[styles.label, styles.flex, styles.vertical_margin]}>
          <Text style={[styles.flex_1, styles.bold]}>PRIORITAS</Text>
          <Text
            style={[styles.btn_color, styles.align_right]}
            onPress={showModalPriority}>
            PILIH
          </Text>
        </View>
        <View style={[styles.label, styles.flex, styles.vertical_margin]}>
          <Text style={[styles.flex_1, styles.bold]}>PRODUK</Text>
          <Text
            style={[styles.btn_color, styles.align_right]}
            onPress={showModalProduct}>
            PILIH
          </Text>
        </View>
        <Text style={[styles.vertical_margin, styles.label]}>LAMPIRAN</Text>
        {upload.fileName && (
          <View style={styles.file_bg}>
            <Text style={styles.file_desc}>Nama File : {upload.fileName}</Text>
            <Text style={[styles.file_desc, styles.file_type]}>
              Bentuk File : {upload.fileType}
            </Text>
          </View>
        )}
        <Button
          style={[styles.upload_btn, styles.vertical_margin]}
          textColor="white"
          onPress={uploadImageHandler}>
          UPLOAD BERKAS
        </Button>

        <Provider>
          <Portal>
            <Modal
              visible={visiblePriority}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <RadioButton.Group
                onValueChange={value => setForm({...form, priorityId: value})}
                value={form.priorityId}>
                {priority.map(d => (
                  <RadioButton.Item
                    color='#49983b'
                    key={d.id}
                    label={d.priorityName}
                    value={d.id}
                  />
                ))}
              </RadioButton.Group>
            </Modal>
          </Portal>
        </Provider>

        <Provider>
          <Portal>
            <Modal
              visible={visibleProduct}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <RadioButton.Group
                onValueChange={value => setForm({...form, productId: value})}
                value={form.productId}>
                {product.map(d => (
                  <RadioButton.Item
                    color='#49983b'
                    key={d.id}
                    label={d.productName}
                    value={d.id}
                  />
                ))}
              </RadioButton.Group>
            </Modal>
          </Portal>
        </Provider>
        <Card.Actions style={styles.btn_submit}>
          <Button buttonColor={color} textColor="white" onPress={submitHandler}>
            MASUKAN
          </Button>
        </Card.Actions>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  file_bg: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
  },
  page:{
    height: '92%'
  },
  file_desc: {
    marginStart: '2.5%',
    color: 'black',
  },
  file_type: {
    marginTop: '2.5%'
  },
  form: {
    borderRadius: 15,
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
    width: 200,
    height: 200,
  },
  image_position: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_submit: {
    marginTop: '10%',
    marginBottom: '5%',
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  upload_btn: {
    borderWidth: 1,
    backgroundColor: '#49983b',
    width: '50%',
    marginStart: '25%',
  },
  vertical_margin: {
    marginTop: '5%',
  },
});

export default TicketForm;
