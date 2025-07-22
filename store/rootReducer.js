import { combineReducers } from 'redux';

import auth from './auth/reducer';
import app from './app/reducer';
import currency from './currency/reducer';

export default combineReducers({
    auth,
    app,
currency,
});
