import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((product, prescription) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.product_ID === product.product_ID);
      
      if (existingItem) {
        // For prescription items, check if prescription is provided
        if (product.category === 'Prescription' && !prescription && !existingItem.prescription) {
          throw new Error('Prescription required for this medication');
        }
        
        return prevItems.map(item =>
          item.product.product_ID === product.product_ID
            ? { ...item, quantity: item.quantity + 1, prescription: prescription || item.prescription }
            : item
        );
      }
      
      // For prescription items, require prescription
      if (product.category === 'Prescription' && !prescription) {
        throw new Error('Prescription required for this medication');
      }
      
      return [...prevItems, { product, quantity: 1, prescription }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.product.product_ID !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.product_ID === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const getPrescriptionForProduct = useCallback((productId) => {
    const item = items.find(i => i.product.product_ID === productId);
    return item?.prescription;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getPrescriptionForProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};