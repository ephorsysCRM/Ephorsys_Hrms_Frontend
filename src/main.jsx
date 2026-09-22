import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Toaster } from "react-hot-toast";

import App from "./App.jsx";

import {
  store,
  persistor,
} from "./Redux/store";


createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <App />
        <Toaster position="top-right" />
      </PersistGate>
    </Provider>
  </StrictMode>
);