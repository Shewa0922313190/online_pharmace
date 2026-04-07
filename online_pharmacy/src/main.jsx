import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import router from './routers/router';
import { RouterProvider } from 'react-router-dom'
import { CartProvider } from './Contexts/CartContext'; // Adjust path as needed
import { AuthProvider } from './Contexts/AuthContext'; 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthProvider> {/* If you use AuthContext */}
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
     
   
  </React.StrictMode>
);