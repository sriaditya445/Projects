import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const categories = ['All', 'Oversized', 'Classic', 'Hoodies', 'Custom'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Filter by Category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }
    
    setFilteredProducts(result);
  }, [search, category, products]);

  return (
    <div className="bg-white dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">The Collection</h1>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                  category === cat 
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black dark:bg-darkCard dark:text-gray-300 dark:border-gray-700 dark:hover:border-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-accent focus:border-accent bg-gray-50 dark:bg-darkCard dark:text-white py-2.5 transition-colors focus:outline-none focus:ring-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found.</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-6 text-accent hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
