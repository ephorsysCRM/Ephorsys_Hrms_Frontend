import { combineReducers } from "@reduxjs/toolkit";
import {
    persistReducer,
} from "redux-persist";

import createWebStorage from
    "redux-persist/es/storage/createWebStorage";

import authReducer from "./features/auth/authSlice";

const storage =
    createWebStorage("local");

const authPersistConfig = {
    key: "auth",
    storage,

    // Only these fields will be stored
    whitelist: [
        "admin",
    ],
};

const persistedAuthReducer =
    persistReducer(
        authPersistConfig,
        authReducer
    );

const rootReducer = combineReducers({
    auth: persistedAuthReducer,
});

export default rootReducer;