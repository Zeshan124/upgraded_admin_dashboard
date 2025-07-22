import { CACHE_KEY } from '~/util';
import { actionTypes } from './action';
import Cookies from 'js-cookie';


const initialState = {
  selectedCurrency: 'PKR',
  exchangeRates: {},
  loading: false,
  error: null
};

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENCY:
      // Update cookie when currency changes
      Cookies.set(CACHE_KEY, JSON.stringify({
        selectedCurrency: action.payload,
        rates: state.exchangeRates,
        timestamp: Date.now()
      }), { expires: 10/24 }); // Expire in 10 hours
      
      return {
        ...state,
        selectedCurrency: action.payload
      };
      
    case actionTypes.TOGGLE_CURRENCY:
      const newCurrency = state.selectedCurrency === 'PKR' ? 'USD' : 'PKR';
      
      // Update cookie when currency toggles
      Cookies.set(CACHE_KEY, JSON.stringify({
        selectedCurrency: newCurrency,
        rates: state.exchangeRates,
        timestamp: Date.now()
      }), { expires: 10/24 }); // Expire in 10 hours
      
      return {
        ...state,
        selectedCurrency: newCurrency
      };
      
    case actionTypes.FETCH_RATES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case actionTypes.FETCH_RATES_SUCCESS:
      // Update cookie with new rates
      Cookies.set(CACHE_KEY, JSON.stringify({
        selectedCurrency: state.selectedCurrency,
        rates: action.payload,
        timestamp: Date.now()
      }), { expires: 1 }); // Expire in 1 day
      
      return {
        ...state,
        exchangeRates: action.payload,
        loading: false
      };
      
    case actionTypes.FETCH_RATES_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case actionTypes.LOAD_CACHED_DATA:
      return {
        ...state,
        selectedCurrency: action.payload.selectedCurrency || state.selectedCurrency,
        exchangeRates: action.payload.rates || state.exchangeRates
      };
      
    default:
      return state;
  }
}