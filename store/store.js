import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import { createWrapper } from "next-redux-wrapper";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    // Use the modern Redux DevTools approach
    const composeEnhancers =
      (typeof window !== 'undefined' && 
       window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    return composeEnhancers(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const makeStore = (context) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore, { debug: false });

/*
const persistConfig = {
    key: 'qistbazaar',
    storage,
    whitelist: ['cart', 'compare', 'auth', 'wishlist'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        persistedReducer,
        initialState,
        bindMiddleware([sagaMiddleware])
    );

    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
}

export default configureStore;
*/