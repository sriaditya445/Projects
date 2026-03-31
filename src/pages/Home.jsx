import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getAll();
        // Just take the first 3 for featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-gray-900 dark:bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Design Your Style, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">
                Wear Your Identity
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-lg font-light">
              Premium quality oversized t-shirts tailored for comfort and custom-made to express who you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm inline-flex items-center justify-center hover:bg-gray-200 transition-colors rounded-sm shadow-xl group">
                Shop Collection 
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/design" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-widest text-sm inline-flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-sm">
                Create Custom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-darkBg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Trending Now</h2>
              <p className="text-gray-500 dark:text-gray-400">Our most popular pieces right now.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-accent hover:text-red-600 font-semibold group">
              View All <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center text-accent font-semibold group border border-accent rounded-full px-6 py-3 hover:bg-accent hover:text-white transition-colors">
              View All Products <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
