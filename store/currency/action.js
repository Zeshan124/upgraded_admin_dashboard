export const actionTypes = {
  SET_CURRENCY: 'SET_CURRENCY',
  TOGGLE_CURRENCY: 'TOGGLE_CURRENCY',
  FETCH_RATES_REQUEST: 'FETCH_RATES_REQUEST',
  FETCH_RATES_SUCCESS: 'FETCH_RATES_SUCCESS',
  FETCH_RATES_FAILURE: 'FETCH_RATES_FAILURE',
  LOAD_CACHED_DATA: 'LOAD_CACHED_DATA'
};


export function setProducts(products) {
  return { type: actionTypes.SET_PRODUCTS, payload: products };
}
export const setCurrency = (currency) => ({
  type: actionTypes.SET_CURRENCY,
  payload: currency
});

export const toggleCurrency = () => ({
  type: actionTypes.TOGGLE_CURRENCY
});

export const fetchRatesRequest = () => ({
  type: actionTypes.FETCH_RATES_REQUEST
});

export const fetchRatesSuccess = (rates) => ({
  type: actionTypes.FETCH_RATES_SUCCESS,
  payload: rates
});

export const fetchRatesFailure = (error) => ({
  type: actionTypes.FETCH_RATES_FAILURE,
  payload: error
});

export const loadCachedData = (data) => ({
  type: actionTypes.LOAD_CACHED_DATA,
  payload: data
});
