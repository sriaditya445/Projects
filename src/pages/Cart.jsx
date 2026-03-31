import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-darkBg transition-colors duration-300 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
          Looks like you haven't added any products to your cart yet. Discover your new identity!
        </p>
        <Link to="/shop" className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest inline-flex items-center justify-center hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors rounded-sm shadow-xl">
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight">Shopping Bag ({cartCount})</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-gray-50 dark:bg-darkCard rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <Link to={`/product/${item.productId}`} className="w-full sm:w-32 h-40 shrink-0 bg-gray-200 rounded-lg overflow-hidden block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        <Link to={`/product/${item.productId}`} className="hover:text-accent font-medium transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Size: <span className="font-semibold text-gray-900 dark:text-gray-300">{item.size}</span></p>
                    </div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">₹{item.price}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-sm font-medium"
                    >
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 dark:bg-darkCard p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-800 sticky top-24 transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between">
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">₹{cartTotal}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest flex items-center justify-center hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors rounded shadow-lg group"
              >
                Proceed to Checkout <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 flex justify-center items-center">
                Secure checkout provided by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
