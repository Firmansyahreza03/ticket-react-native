import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {Avatar, Button, Card} from 'react-native-paper';
import {roleCode} from '../../../constants/role-code';
import {getAllTicketByCustomer, getAllTicketByPic, getTickets} from '../../../service/import.service';
import {getRole} from '../../login/Login';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useEffect} from 'react';
import {load} from '../../../redux/actions/ticketAction';
import {statusCode} from '../../../constants/status-code';
import Header from '../../header/Header';

function TicketList({navigation}) {
  const tickets = useSelector(store => store.tickets, shallowEqual);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getRole()
      .then(res => setRole(res))
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (role == roleCode.ADMIN) {
      getTicketSuperAdmin();
    } else if (role == roleCode.PIC) {
      getTicketPic();
    } else if (role == roleCode.CUST) {
      getTicketCust();
    }
  }, [role]);

  const getTicketSuperAdmin = async () => {
    setLoading(true);
    await getTickets()
      .then(res => dispatch(load(res.datas)))
      .catch(e => console.log(e));
    setLoading(false);
  };

  const getTicketPic = async () => {
    setLoading(true);
    await getAllTicketByPic()
      .then(res => dispatch(load(res.datas)))
      .catch(e => console.log(e));
    setLoading(false);
  };

  const getTicketCust = async () => {
    setLoading(true);
    await getAllTicketByCustomer()
      .then(res => {
        dispatch(load(res.datas));
      })
      .catch(e => console.log(e));
    setLoading(false);
  };

  const DataTicket = props => {
    return (
      <View style={styles.flex_row}>
        <Text
          style={
            props.statusName == statusCode.CLS
              ? [styles.margin_5, styles.red_color]
              : styles.margin_5
          }>
          {props.code}
        </Text>
        <Text
          style={props.statusName == statusCode.CLS ? [styles.red_color, styles.margin_5] : [styles.margin_5]}>
          {(props.priorityName).substring(0,1)}
        </Text>
        <Text style={props.statusName == statusCode.CLS ? styles.red_color : ''}>{props.productName}</Text>
      </View>
    );
  };

  const RightContentCard = props => {
    return (
      <View style={styles.rightContent}>
        <Text style={props.statusName == statusCode.CLS ? styles.red_color : ''}>{Date(props.createdAt).substring(0,15)}</Text>
        <Text style={props.statusName == statusCode.CLS ? [styles.red_color, styles.margin_t_5] : styles.margin_t_5}>{props.picName}</Text>
      </View>
    )
  }

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
        right={() => <RightContentCard {...props} />}
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
      <Header icon="ticket" title="Daftar Ticket" />
      {role == roleCode.CUST && <Button
        onPress={goToAddForm}
        mode="contained"
        icon="plus"
        buttonColor="#49983b"
        style={styles.btn_add}>
        TAMBAH TIKET
      </Button>}
      <ScrollView style={role == roleCode.CUST ? styles.page_cust : styles.page_pic}>
        {loading && <ActivityIndicator animating={loading} color="#49983b" size="large" style={styles.loading} />}
        {!loading && tickets.map(d => {
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
  loading: {
    marginTop: '70%'
  },
  page_cust: {
    height: '85%',
  },
  page_pic: {
    height: '92%',
  },
  btn_add: {
    borderRadius: 0,
    paddingVertical: 10,
  },
  flex_row: {
    flex: 1,
    flexDirection: 'row',
  },
  margin_5: {
    marginEnd: 5,
  },
  red_color: {
    color: 'red',
  },
  icon: {
    backgroundColor: '#49983b',
  },
  rightContent: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginEnd: 5
  },
  margin_t_5:{
    marginTop: '5%'
  }
});

export default TicketList;
