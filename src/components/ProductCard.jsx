import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    // Using default size S if not selected (could prompt users instead)
    addToCart(product, product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'S', 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block relative overflow-hidden rounded-xl bg-gray-100 dark:bg-darkCard transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="aspect-[4/5] overflow-hidden bg-gray-200 w-full relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Unic+Empire' }}
        />
        {/* Overlay category tag */}
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm uppercase tracking-wider text-gray-800 dark:text-gray-200">
          {product.category}
        </span>
      </div>
      
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            ₹{product.price}
          </span>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
