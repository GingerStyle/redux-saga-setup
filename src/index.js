import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
import firstReducer from './Reducers/firstReducer.js';
import secondReducer from './Reducers/secondReducer.js';
import elementListReducer from './Reducers/elementListReducer.js';

const sagaMiddleware = createSagaMiddleware();

function* watcherSaga() {
    yield takeEvery('FETCH_ELEMENTS', fetchElements);
    yield takeEvery('POST_ELEMENT', postElement);
}

function* fetchElements() {
    try {
        const elementsResponse = yield axios.get('/api/element');
        yield put({type: 'SET_ELEMENTS', payload: elementsResponse.data});
    } catch (error){
        console.log('error fetchElements', error);
    }
}

function* postElement(action) {
    try {
        yield axios.post('/api/element', {newElement: action.payload});
        yield put({type: 'FETCH_ELEMENTS'});
    } catch (error){
        console.log('error in postElement', error);
    }
}


// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        firstReducer,
        secondReducer,
        elementListReducer,
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(<Provider store={storeInstance}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
