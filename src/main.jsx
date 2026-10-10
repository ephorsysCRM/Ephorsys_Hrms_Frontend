import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'

import { store, persistor } from './Redux/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />

        {/* Toast above modal and overlay */}
        <Toaster
          position='top-right'
          containerStyle={{
            zIndex: 99999
          }}
          toastOptions={{
            style: {
              zIndex: 99999
            }
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
)
