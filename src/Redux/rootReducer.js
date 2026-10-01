import { combineReducers } from "@reduxjs/toolkit";

import {
    persistReducer,
} from "redux-persist";

import createWebStorage from
    "redux-persist/es/storage/createWebStorage";

import authReducer from
    "./features/auth/authSlice";


const storage =
    createWebStorage("local");


const authPersistConfig = {

    key: "auth",

    storage,

    // Only admin data will persist.
    // Access token will NOT be persisted.

    whitelist: [
        "admin",
    ],
};


const persistedAuthReducer =
    persistReducer(
        authPersistConfig,
        authReducer
    );


const rootReducer =
    combineReducers({

        auth:
            persistedAuthReducer,

    });


export default rootReducer;