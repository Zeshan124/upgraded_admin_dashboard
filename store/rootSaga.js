import { all } from 'redux-saga/effects';
import AppSaga from './app/saga';
import AuthSaga from './auth/saga';
import currencySaga from './currency/saga';

export default function* rootSaga() {
    yield all([AppSaga(), AuthSaga(), currencySaga()]);
}
