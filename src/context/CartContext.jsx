import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  // Sync from server on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await cartAPI.getCart();
        setCart(data);
        localStorage.setItem('cart', JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching cart from API", error);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product, size, quantity = 1) => {
    try {
      // Check if item already exists in cart with same size
      const existingItem = cart.find(item => item.productId === product.id && item.size === size);
      
      let newCart;
      if (existingItem) {
        // Update quantity
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + quantity };
        await cartAPI.updateCart(existingItem.id, updatedItem);
        newCart = cart.map(item => item.id === existingItem.id ? updatedItem : item);
      } else {
        // Create new cart item
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity
        };
        const { data } = await cartAPI.addToCart(newItem);
        newCart = [...cart, data];
      }
      
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const itemToUpdate = cart.find(item => item.id === id);
      if (!itemToUpdate) return;
      
      const updatedItem = { ...itemToUpdate, quantity: newQuantity };
      await cartAPI.updateCart(id, updatedItem);
      
      const newCart = cart.map(item => item.id === id ? updatedItem : item);
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartAPI.removeFromCart(id);
      const newCart = cart.filter(item => item.id !== id);
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      toast.info('Item removed from cart');
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const clearCart = async () => {
    try {
      // JSON server doesn't support bulk delete, so we might need to delete one by one
      const deletePromises = cart.map(item => cartAPI.removeFromCart(item.id));
      await Promise.all(deletePromises);
      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
