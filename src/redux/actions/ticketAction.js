export const load = data => {
  return {
    type: 'LOAD_TICKET',
    payload: data,
  };
};

export const add = data => {
  return {
    type: 'ADD_TICKET',
    payload: data,
  };
};

export const editStatus = (id, statusName) => {
  return {
    type: 'EDIT_STATUS',
    payload: {
      id,
      statusName,
    },
  };
};
