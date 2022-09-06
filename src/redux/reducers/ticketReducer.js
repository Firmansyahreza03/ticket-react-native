const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_TICKET':
      return action.payload;
    case 'ADD_TICKET':
      const newData = action.payload;
      return [newData, ...state];
    default:
      return state;
  }
};
