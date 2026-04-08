
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { Toaster } from '@/components/ui/sonner';

import Header from './markup/components/Header';
import ProtectedRoute from './markup/components/ProtectedRoute';
import { CartProvider } from './Contexts/CartContext'; // Adjust path as needed
import { AuthProvider } from './Contexts/AuthContext'; 

// Public Pages
import HomePage from './markup/pages/public/Home';
import ProductCatalogPage from './markup/pages/public/ProductCatalogPage';
import ProductDetailPage from './markup/pages/public/ProductDetailPage';
import LoginPage from './markup/components/Login';
import RegisterPage from './markup/components/RegisterPage';

// Customer Pages
import CustomerDashboard from './markup/pages/customer/CustomerDashboard';
import CartPage from './markup/pages/customer/CartPage';
import CheckoutPage from './markup/pages/customer/CheckoutPage';
import OrderHistoryPage from './markup/pages/customer/OrderHistoryPage';
import PrescriptionUploadPage from './markup/pages/customer/PrescriptionUploadPage';
import ProfilePage from './markup/pages/customer/ProfilePage';
function App() {
 

  return (
       <>
       <AuthProvider> {/* If you use AuthContext */}
             <CartProvider>
              <Router>

          <div className="min-h-screen bg-background">
            <Header/>
            <main>
              <Routes>
                     {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductCatalogPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                 {/* Customer Routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                   <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                   <Route
                  path="/customer/orders"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/customer/prescriptions"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <PrescriptionUploadPage />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/customer/profile"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
             </Routes>
            </main>

          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </> )
}

export default App
