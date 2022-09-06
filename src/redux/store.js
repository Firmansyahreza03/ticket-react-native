import {createStore, combineReducers, applyMiddleware} from 'redux';
import ticketReducer from './reducers/ticketReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  tickets: ticketReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
