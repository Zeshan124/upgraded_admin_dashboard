import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import { actionTypes, fetchRatesSuccess, fetchRatesFailure, loadCachedData } from './action';
import Cookies from 'js-cookie';
import { CACHE_KEY } from '~/util';


// Selectors
const getSelectedCurrency = state => state.currency.selectedCurrency;
const getExchangeRates = state => state.currency.exchangeRates;

// Load cached data from cookies on application start
export function* loadCachedDataSaga() {
  try {
    const cached = Cookies.get(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const { timestamp } = parsed;
      
      if (Date.now() - timestamp < CACHE_DURATION) {

        yield put(loadCachedData(parsed));
      }
    }
  } catch (e) {
    // Remove the cookie in case of any errors
    Cookies.remove(CACHE_KEY);
  }
}

// Fetch exchange rates
export function* fetchRatesSaga() {
  try {
    const response = yield call(fetch, 'https://api.exchangerate-api.com/v4/latest/PKR');
    const data = yield call([response, response.json]);
    const rates = { USD: data.rates.USD };
    
    yield put(fetchRatesSuccess(rates));
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    yield put(fetchRatesFailure(error.message));
  }
}

// Check if we need to fetch rates when currency changes
export function* watchCurrencyChange() {
  const selectedCurrency = yield select(getSelectedCurrency);
  const exchangeRates = yield select(getExchangeRates);
  
  if (selectedCurrency === 'USD' && !exchangeRates.USD) {
    yield put({ type: actionTypes.FETCH_RATES_REQUEST });
  }
}

// Root saga
export default function* currencySaga() {
  yield all([
    call(loadCachedDataSaga), // Run on startup
    takeLatest(actionTypes.SET_CURRENCY, watchCurrencyChange),
    takeLatest(actionTypes.TOGGLE_CURRENCY, watchCurrencyChange),
    takeLatest(actionTypes.FETCH_RATES_REQUEST, fetchRatesSaga)
  ]);
}