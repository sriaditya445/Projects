import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user: formData,
        items: cart,
        total: cartTotal,
        date: new Date().toISOString(),
        status: 'Processing'
      };
      
      await orderAPI.createOrder(orderData);
      await clearCart();
      setSuccess(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error("Error creating order", error);
      toast.error('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-darkBg transition-colors px-4">
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
          Thank you for choosing Unic Empire. Your custom oversized identity is being crafted and will be shipped soon.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-gray-50 dark:bg-darkCard p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none" />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || cart.length === 0}
                  className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black font-bold h-14 uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? 'Processing...' : `Place Order (₹${cartTotal})`}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-gray-800 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Order Items</h2>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded bg-gray-200" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
