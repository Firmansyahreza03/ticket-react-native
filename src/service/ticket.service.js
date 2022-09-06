import {getApiLogin, postApiLogin, putApiLogin} from '../api/api';

export const getTickets = () => {
  return getApiLogin('http://192.168.10.105:3333/tickets');
};

export const getTicketDetail = id => {
  return getApiLogin(`http://192.168.10.105:3333/tickets/${id}`);
};

export const getAllTicketByCustomer = () => {
  return getApiLogin(`http://192.168.10.105:3333/tickets/customers`);
};

export const getAllTicketByPic = () => {
  return getApiLogin(`http://192.168.10.105:3333/tickets/pic`);
};

export const getAllComments = id => {
  return getApiLogin(`http://192.168.10.105:3333/comments/tickets/${id}`);
};

export const updateStatus = data => {
  return putApiLogin('http://192.168.10.105:3333/tickets', data);
};

export const postComment = data => {
  return postApiLogin('http://192.168.10.105:3333/comments', data);
};

export const postTicket = data => {
  return postApiLogin('http://192.168.10.105:3333/tickets', data);
};

export const findByIdTicket = id => {
  return getApiLogin(`http://192.168.10.105:3333/tickets/${id}`);
};
