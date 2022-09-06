import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, Card} from 'react-native-paper';
import {roleCode} from '../../../constants/role-code';
import {getAllTicketByCustomer, getAllTicketByPic, getTickets} from '../../../service/import.service';
import {getRole} from '../../login/Login';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useEffect} from 'react';
import {load} from '../../../redux/actions/ticketAction';
import {statusCode} from '../../../constants/status-code';

function TicketList({navigation}) {
  const tickets = useSelector(store => store.tickets, shallowEqual);
  const [role, setRole] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    getRole()
      .then(res => setRole(res))
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (role == roleCode.ADMIN) {
      getTicketSuperAdmin();
      console.log(roleCode.ADMIN);
    } else if (role == roleCode.PIC) {
      getTicketPic();
      console.log(roleCode.PIC);
    } else if (role == roleCode.CUST) {
      getTicketCust();
      console.log(roleCode.CUST);
    }
  }, [role]);

  const getTicketSuperAdmin = () => {
    getTickets()
      .then(res => dispatch(load(res.datas)))
      .catch(e => console.log(e));
  };

  const getTicketPic = () => {
    getAllTicketByPic()
      .then(res => dispatch(load(res.datas)))
      .catch(e => console.log(e));
  };

  const getTicketCust = () => {
    getAllTicketByCustomer()
      .then(res => {
        dispatch(load(res.datas));
      })
      .catch(e => console.log(e));
  };

  const DataTicket = props => {
    return (
      <View style={styles.flex_row}>
        <Text
          style={
            props.statusName == statusCode.CLS
              ? [styles.margin_10, styles.red_color]
              : styles.margin_10
          }>
          {props.code}
        </Text>
        <Text
          style={props.statusName == statusCode.CLS ? styles.red_color : ''}>
          {props.priorityName}
        </Text>
      </View>
    );
  };

  const CardComponent = props => {
    return (
      <Card.Title
        titleStyle={props.statusName == statusCode.CLS ? styles.red_color : ''}
        title={
          props.statusName == statusCode.CLS
            ? `${props.title} (CLOSED)`
            : props.title
        }
        subtitle={<DataTicket {...props} />}
        left={() => <Avatar.Icon icon="ticket" size={50} style={styles.icon} />}
      />
    );
  };

  const goToDetail = props => {
    navigation.navigate('Detail', {
      id: props.id,
    });
  };

  const goToAddForm = () => {
    navigation.navigate('Form');
  };

  return (
    <View>
      <Button
        onPress={goToAddForm}
        mode="contained"
        icon="plus"
        buttonColor="#49983b"
        style={styles.btn_add}>
        TAMBAH TIKET
      </Button>
      <ScrollView style={styles.page}>
        {tickets.map(d => {
          return (
            <View key={d.id} onTouchEnd={() => goToDetail({...d})}>
              <CardComponent {...d} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    height: '90%',
  },
  btn_add: {
    borderRadius: 0,
    paddingVertical: 10,
  },
  flex_row: {
    flex: 1,
    flexDirection: 'row',
  },
  margin_10: {
    marginEnd: 10,
  },
  red_color: {
    color: 'red',
  },
  icon: {
    backgroundColor: '#49983b',
  },
});

export default TicketList;
