import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

import authReducer from "./features/auth/authSlice";
import departmentReducer from "./features/department/departmentSlice";
import employeeReducer from "./features/employee/employeeSlice";
import attendanceReducer from "./features/attendance/attendanceSlice";

// =====================================================
// STORAGE
// =====================================================

const storage = createWebStorage("local");

// =====================================================
// AUTH PERSIST CONFIG
// =====================================================

const authPersistConfig = {
    key: "auth",
    storage,

    // Persist user identity only.
    // Authentication is revalidated through
    // the HTTP-only cookie.
    whitelist: [
        "admin",
        "user",
        "userType",
        "role",
    ],
};

// =====================================================
// PERSIST AUTH REDUCER
// =====================================================

const persistedAuthReducer = persistReducer(
    authPersistConfig,
    authReducer
);

// =====================================================
// ROOT REDUCER
// =====================================================

const rootReducer = combineReducers({
    auth: persistedAuthReducer,

    department: departmentReducer,

    employee: employeeReducer,

    attendance: attendanceReducer,
});

export default rootReducer;