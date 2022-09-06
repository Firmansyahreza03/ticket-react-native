const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_TICKET':
      return action.payload;
    case 'ADD_TICKET':
      const newData = action.payload;
      return [newData, ...state];
    case 'EDIT_STATUS':
      console.log('yang dipencet : ' + action.payload.id);
      return state.map(d => {
        if (d.id == action.payload.id) {
          return {...d, statusName: action.payload.statusName}
        } else {
          return d;
        }
      });
    default:
      return state;
  }
};
