import {
    combineReducers,
} from "@reduxjs/toolkit";

import {
    persistReducer,
} from "redux-persist";

import createWebStorage from
    "redux-persist/es/storage/createWebStorage";

import authReducer from
    "./features/auth/authSlice";

import departmentReducer from
    "./features/department/departmentSlice";


// =====================================================
// LOCAL STORAGE
// =====================================================

const storage =
    createWebStorage("local");


// =====================================================
// AUTH PERSIST CONFIG
// =====================================================
//
// Only admin information will be persisted.
//
// JWT is NOT stored in:
// - Redux
// - localStorage
// - sessionStorage
//
// JWT is stored in HTTP-only cookie by backend.
// =====================================================

const authPersistConfig = {

    key: "auth",

    storage,

    whitelist: [
        "admin",
    ],

};


// =====================================================
// PERSIST AUTH REDUCER
// =====================================================

const persistedAuthReducer =
    persistReducer(
        authPersistConfig,
        authReducer
    );


// =====================================================
// ROOT REDUCER
// =====================================================

const rootReducer =
    combineReducers({

        // =================================================
        // AUTH
        // =================================================

        auth:
            persistedAuthReducer,


        // =================================================
        // DEPARTMENT
        // =================================================

        department:
            departmentReducer,

    });


export default rootReducer;