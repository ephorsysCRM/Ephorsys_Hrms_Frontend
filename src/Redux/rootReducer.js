import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

import authReducer from "./features/auth/authSlice";
import departmentReducer from "./features/department/departmentSlice";

const storage = createWebStorage("local");

const authPersistConfig = {
    key: "auth",
    storage,

    // Persist user identity only.
    // Authentication is revalidated through the HTTP-only cookie.
    whitelist: [
        "admin",
        "user",
        "userType",
        "role",
    ],
};

const persistedAuthReducer = persistReducer(
    authPersistConfig,
    authReducer
);

const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    department: departmentReducer,
});

export default rootReducer;