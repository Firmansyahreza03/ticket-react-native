import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Avatar, Button, Card, Paragraph, Title} from 'react-native-paper';
import {statusCode} from '../../../constants/status-code';
import {getAllComments, getTicketDetail, updateStatus, postComment} from '../../../service/import.service';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

function TicketDetail({route}) {
  const {id} = route.params;
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

  const getDetail = () => {
    getTicketDetail(id)
      .then(res => setDetail(res.data))
      .catch(e => console.log(e));
  };

  const getComments = () => {
    getAllComments(id)
      .then(res => setComments(res.datas))
      .catch(e => console.log(e));
  };

  const downloadFile = () => {
    Linking.openURL(`http://192.168.10.105:3333/files/${detail.fileId}`);
  };

  const changeStatus = () => {
    updateStatus({id: id, updatedBy: ''})
      .then(() => setToggleEdit(!toggleEdit))
      .catch(e => console.log(e));
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

  const color = "#49983b";

  return (
    <View>
      <Card mode="outlined">
        <Card.Content style={[styles.margin_y_20, styles.pad_t_20]}>
          <Title style={[styles.title]}>
            {detail.statusName == statusCode.CLS
              ? `${detail.title} (CLOSED)`
              : detail.title}
          </Title>
          <Paragraph style={[styles.margin_y_20, styles.desc]}>
            {detail.description}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={downloadFile} textColor={color}>Download File</Button>
          <Button onPress={changeStatus} buttonColor={color}>Ubah status</Button>
        </Card.Actions>
      </Card>
      <ScrollView style={detail.statusName != statusCode.CLS ? {height: '50%'} : {height: '70%'}}>
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
                  }} textColor={color}>
                  Download File
                </Button>
              </Card.Actions>
            )}
          </Card>
        ))}
      </ScrollView>

      {detail.statusName != statusCode.CLS && (
        <Card style={[styles.margin_t_20]}>
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
            <Button onPress={fileHandler} textColor={color}>Upload</Button>
            <Button onPress={commentHandler} buttonColor={color}>Kirim</Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  margin_y_20 : {
    marginVertical: 20
  },
  pad_t_20: {
    paddingTop: 20
  },
  title: {
    fontSize: 25
  },
  desc: {
    fontSize: 18
  },
  margin_t_20 : {
    marginTop: 20
  },
  form: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10
  },
})

export default TicketDetail;
