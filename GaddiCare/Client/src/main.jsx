import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import store from './store'
import AppProvider from './components/ContextApi'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <AppProvider>
    <RouterProvider router={router} />
    </AppProvider>
    </Provider>
  </StrictMode>,
)
