import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { combineReducers } from "redux";

import { authReducer } from "./auth.reducer";
import { questionReducer } from "./questions.reducer";
import  {answerReducer}  from "./answers.reducer";
import { alertReducer } from "./alert.reducer";
import { loadingReducer } from "./loading.reducer";

const reducer = combineReducers({ auth: authReducer, question: questionReducer, answer: answerReducer, alert: alertReducer, loading: loadingReducer });
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;