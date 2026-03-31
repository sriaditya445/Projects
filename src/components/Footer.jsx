import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Scissors } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-darkCard border-t border-gray-200 dark:border-gray-800 pt-12 pb-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Scissors className="text-accent" size={24} />
              <span className="font-bold text-xl uppercase tracking-tighter">Unic Empire</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Premium custom oversized t-shirts. Design your style, wear your identity. Crafted with perfection and premium quality materials.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-accent transition-colors"><Mail size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Phone size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><MapPin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Shop</Link></li>
              <li><Link to="/design" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Custom Design</Link></li>
              <li><Link to="/cart" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Customer Care</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Shipping Options</a></li>
              <li><a href="#" className="text-gray-500 hover:text-accent dark:text-gray-400 transition-colors">Returns & Exchanges</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center whitespace-nowrap">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Unic Empire. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
