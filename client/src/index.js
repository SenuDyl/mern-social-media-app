import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from './state';
//Used to create the REDUX store
import { configureStore } from '@reduxjs/toolkit';
//Make the Redux store available to the entire app
import { Provider } from 'react-redux';
//Responsible for persisting the Redux state
import {
  persistStore, //Store in local storage
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
//Manage and persist the Redux state across page reloads or browser sessions
import storage from 'redux-persist/lib/storage';
//Delay the rendering of the app until the persisted state has been retrieved and saved to Redux
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>

        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


