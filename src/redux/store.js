import {
    configureStore,
} from "@reduxjs/toolkit";

import {
    persistStore,
} from "redux-persist";

import rootReducer from "./rootReducer";


// =====================================================
// STORE
// =====================================================

export const store =
    configureStore({

        reducer:
            rootReducer,

        middleware:
            (getDefaultMiddleware) =>
                getDefaultMiddleware({

                    // redux-persist actions
                    // are non-serializable
                    serializableCheck:
                        false,

                }),

    });


// =====================================================
// PERSISTOR
// =====================================================

export const persistor =
    persistStore(store);