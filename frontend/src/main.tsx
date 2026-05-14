import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './AuthContext';
import { OrderProvider } from './OrderContext';
import { NotificationProvider } from './NotificationContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <OrderProvider>
          <Router>
            <App />
          </Router>
        </OrderProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);
