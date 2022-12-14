import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {ActivityIndicator, Avatar, Button, Card, Chip, Paragraph, Title} from 'react-native-paper';
import {statusCode} from '../../../constants/status-code';
import {getAllComments, getTicketDetail, updateStatus, postComment} from '../../../service/import.service';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {useDispatch} from 'react-redux';
import {editStatus} from '../../../redux/actions/ticketAction';
import Header from '../../header/Header';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

function TicketDetail({route}) {
  const {id} = route.params;
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [detail, setDetail] = useState({});
  const [comments, setComments] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [formComment, setFormComment] = useState({
    headerId: id,
    commentText: '',
    fileName: null,
    fileExt: null,
  });
  const [upload, setUpload] = useState({
    fileName: null,
    fileExtension: null,
  });

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getDetail();
      getComments();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      getDetail();
      getComments();
    }, [toggleEdit]),
  );

  const getDetail = async () => {
    setLoading(true);
    await getTicketDetail(id)
      .then(res => setDetail(res.data))
      .catch(e => console.log(e));
  };

  const getComments = async () => {
    await getAllComments(id)
      .then(res => setComments(res.datas))
      .catch(e => console.log(e));
    setLoading(false);
  };

  const downloadFile = () => {
    Linking.openURL(`http://192.168.10.105:3333/files/${detail.fileId}`);
  };

  const changeStatus = async () => {
    setLoading(true);
    await updateStatus({id: id, updatedBy: ''})
      .then(() => {
        setToggleEdit(!toggleEdit);
        if (detail.statusName == statusCode.CLS) {
          dispatch(editStatus(id, statusCode.ROPN));
        } else {
          dispatch(editStatus(id, statusCode.CLS));
        }
      })
      .catch(e => console.log(e));
    setLoading(false);
  };

  const LeftContent = props => (
    <Avatar.Image
      size={40}
      source={{uri: `http://192.168.10.105:3333/files/${props.photoId}`}}
    />
  );

  const commentTextHandler = text => {
    setFormComment({...formComment, commentText: text});
    setCommentText(text);
  };

  const commentHandler = async () => {
    const form = {
      headerId: formComment.headerId,
      commentText: formComment.commentText,
      fileName: upload.fileName,
      fileExt: upload.fileExtension,
    };
    await postComment(form)
      .then(() => {
        setCommentText('');
        setToggleEdit(!toggleEdit);
        setFormComment({...formComment, commentText: null});
      })
      .catch(e => console.log(e));
  };

  const fileHandler = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      }).catch(e => console.log('ini error'));

      const fileName = res[0].name;
      const ext = await fileName.substring(fileName.lastIndexOf('.') + 1);
      await RNFS.readFile(res[0].uri, 'base64')
        .then(res => {
          setUpload({
            fileName: res,
            fileExtension: ext,
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

  const color = '#49983b';

  return (
    <View>
      <Header title={`Tiket : ${detail.code}`} icon="ticket" />
      {loading && <ActivityIndicator animating={loading} color="#49983b" size="large" style={styles.loading} />}
      {!loading && <Card>
        <Card.Content style={[styles.margin_y_20, styles.pad_t_20]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.label, styles.purple]}><Icon name="folder" />{detail.productName}</Text>
            <Text style={[styles.label, styles.margin_s_10, detail.priorityName=="High" ? styles.red_label : detail.priorityName=="Medium" ? styles.blue_label : styles.green_label]}>{detail.priorityName}</Text>
            <Text style={[styles.label, styles.margin_s_10, detail.statusName==statusCode.CLS ? styles.grey_label : styles.red_label]}>{detail.statusName}</Text>
          </View>
          <Title style={[styles.title]}>
            {detail.title}
          </Title>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'black'}}>{Date(detail.createdAt).substring(0,21)} | </Text>
              <Text style={{fontWeight:'bold', color: 'black'}}>Nama PIC : {detail.picName}</Text>
            </View>
            <Paragraph style={[styles.margin_y_20, styles.desc]}>
              {detail.description}
            </Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={downloadFile} textColor={color}>
            Unduh lampiran
          </Button>
          <Button onPress={changeStatus} buttonColor={color}>
            Ubah status
          </Button>
        </Card.Actions>
      </Card>}
      {!loading && <ScrollView
        style={
          detail.statusName != statusCode.CLS
            ? {height: '45%'}
            : {height: '65%'}
        }>
        {comments.map(d => (
          <Card key={d.id} style={[styles.margin_t_20]}>
            <Card.Title
              title={d.creatorName}
              subtitle={d.commentText}
              left={() => <LeftContent {...d} />}
            />
            {d.fileId && (
              <Card.Actions>
                <Button
                  onPress={() => {
                    Linking.openURL(
                      `http://192.168.10.105:3333/files/${d.fileId}`,
                    );
                  }}
                  textColor={color}>
                  Download File
                </Button>
              </Card.Actions>
            )}
          </Card>
        ))}
      </ScrollView>}

      {!loading && detail.statusName != statusCode.CLS && (
        <Card mode='outlined'>
          <Card.Content>
            <Text>Komentar</Text>
            <TextInput
              placeholder="Ketik komentarmu..."
              style={[styles.form]}
              onChangeText={commentTextHandler}
              value={commentText}
            />
          </Card.Content>
          <Card.Actions>
            <Button onPress={fileHandler} textColor={color}>
              Upload
            </Button>
            <Button onPress={commentHandler} buttonColor={color}>
              Kirim
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: 'white',
    padding: 7,
    textAlign: 'center',
    marginBottom: 5,
    borderRadius: 10,
    fontWeight: 'bold'
  },
  margin_s_10:{
    marginStart: 10,
  },
  purple:{
    backgroundColor: 'purple'
  },
  red_label: {
    backgroundColor: 'red'
  },
  green_label: {
    backgroundColor: 'green'
  },
  grey_label: {
    backgroundColor: 'grey'
  },
  blue_label: {
    backgroundColor: 'blue'
  },
  loading: {
    marginTop: '70%'
  },
  margin_y_20: {
    marginVertical: 20,
  },
  pad_t_20: {
    paddingTop: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 25,
  },
  desc: {
    fontSize: 18,
  },
  margin_t_20: {
    marginTop: 20,
  },
  form: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
  },
});

export default TicketDetail;
