import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Truck } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, 1);
  };

  if (loading) return <Loader />;
  if (error || !product) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-darkBg">
      <h2 className="text-2xl font-bold dark:text-white">Product not found.</h2>
      <Link to="/shop" className="mt-4 text-accent hover:underline">Return to Shop</Link>
    </div>
  );

  return (
    <div className="bg-white dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="bg-gray-100 dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm aspect-[4/5] relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Unic+Empire' }}
            />
          </div>
          
          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-sm font-bold text-accent tracking-widest uppercase mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-medium text-gray-900 dark:text-white mb-8">
              ₹{product.price}
            </p>
            
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {product.description}
            </p>
            
            {/* Size Selector */}
            <div className="mb-8 border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Select Size</h3>
                <button className="text-sm text-gray-500 underline dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 flex items-center justify-center border font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-300 text-gray-900 hover:border-black dark:border-gray-700 dark:text-white dark:hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest mb-6 hover:bg-accent hover:text-white transition-colors dark:hover:bg-accent dark:hover:text-white"
            >
              Add to Cart
            </button>
            
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 mt-auto pt-8">
              <div className="flex items-center">
                <Truck size={18} className="mr-3 text-gray-400" />
                <span>Free shipping on orders over ₹1500</span>
              </div>
              <div className="flex items-center">
                <Check size={18} className="mr-3 text-gray-400" />
                <span>Premium Quality Material & Stitching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
