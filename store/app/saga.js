import { all, put, takeEvery } from 'redux-saga/effects';

import { actionTypes, toggleDrawerMenuSuccess,toggleDrawerMenuWebSuccess } from './action';

function* toggleDrawerMenuSaga({ payload }) {
    try {
        yield put(toggleDrawerMenuSuccess(payload));
    } catch (err) {
        console.error(err);
    }
}

function* toggleDrawerWebMenuSaga({ payload }) {
    try {
        yield put(toggleDrawerMenuWebSuccess(payload));
    } catch (err) {
        console.error(err);
    }
}

export default function* rootSaga() {
    yield all([
        takeEvery(actionTypes.TOGGLE_DRAWER_MENU, toggleDrawerMenuSaga),
        takeEvery(actionTypes.TOGGLE_DRAWER_WEB_MENU, toggleDrawerWebMenuSaga),
    ]);
}
