import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Upload, Type, Image as ImageIcon, Save } from 'lucide-react';

const CustomDesign = () => {
  const { addToCart } = useCart();
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [tshirtColor, setTshirtColor] = useState('black');
  
  // Realistically we'd use html2canvas or fabric.js. For mock purposes we will just visually layer it.
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return;
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSaveToCart = () => {
    // Generate a mock product payload and pass to cart
    const customProduct = {
      id: `custom-${Date.now()}`, // Temporary ID
      name: `Custom ${tshirtColor.charAt(0).toUpperCase() + tshirtColor.slice(1)} T-Shirt`,
      price: 1299,
      category: 'Custom',
      // Since local blob URLs won't persist across sessions or on other pages safely without DB storage,
      // we use a placeholder or data URI. In a real app we upload first.
      image: image ? image : (tshirtColor === 'black' ? 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800' : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'),
      sizes: ['M', 'L', 'XL'],
      description: `Custom designed t-shirt with text: "${text}"`
    };
    
    addToCart(customProduct, 'M', 1);
  };

  return (
    <div className="bg-gray-50 dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Design Studio</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Bring your vision to life. Add graphics and text to create your custom identity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-4 space-y-8 bg-white dark:bg-darkCard p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            
            {/* Base Color Selection */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Base Canvas</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTshirtColor('black')}
                  className={`w-12 h-12 rounded-full bg-black border-4 shadow-md transition-transform hover:scale-110 ${tshirtColor === 'black' ? 'border-accent' : 'border-transparent'}`}
                />
                <button 
                  onClick={() => setTshirtColor('white')}
                  className={`w-12 h-12 rounded-full bg-gray-100 border-4 shadow-md transition-transform hover:scale-110 ${tshirtColor === 'white' ? 'border-accent' : 'border-transparent'}`}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center"><ImageIcon size={18} className="mr-2" /> Design Graphic</h3>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-accent transition-colors cursor-pointer group">
                <Upload className="mb-2 text-gray-400 group-hover:text-accent transition-colors" size={24} />
                <span className="text-sm text-gray-500 font-medium">Click to upload format (PNG/JPG)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Custom Text */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center"><Type size={18} className="mr-2" /> Custom Text</h3>
              <input 
                type="text" 
                placeholder="Enter text..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={20}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-accent focus:border-accent outline-none"
              />
            </div>

            <button 
              onClick={handleSaveToCart}
              className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black font-bold h-14 uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-colors flex items-center justify-center rounded group"
            >
              <Save size={18} className="mr-2" />
              Save to Cart
            </button>
          </div>

          {/* Canvas Preview Area */}
          <div className="lg:col-span-8 flex justify-center bg-gray-200 dark:bg-gray-800/20 p-12 rounded-2xl border border-gray-100 dark:border-gray-800 relative min-h-[600px] overflow-hidden">
            
            {/* The base shirt (using solid placeholder approximation due to lack of transparent mockups) */}
            <div 
              className={`relative w-full max-w-sm aspect-[3/4] rounded-[3rem] shadow-2xl flex flex-col items-center pt-24 transition-colors duration-500 ${tshirtColor === 'black' ? 'bg-[#151515]' : 'bg-[#F5F5F5]'}`}
            >
              <div className="absolute top-[-10px] w-32 h-16 rounded-b-[50%] bg-gray-200 dark:bg-gray-800/20" /> {/* Neck hole mock */}
              
              {/* Graphic container */}
              <div className="relative w-48 h-56 border border-dashed border-gray-400/30 flex flex-col items-center justify-center p-2 mt-4 hover:border-accent group">
                {image && (
                  <img src={image} alt="Custom design" className="w-full h-auto object-contain max-h-40 mb-4 z-10 drop-shadow-lg" />
                )}
                
                {text && (
                  <p className={`text-2xl font-black uppercase text-center break-words w-full z-10 ${tshirtColor === 'black' ? 'text-white' : 'text-black'}`}>
                    {text}
                  </p>
                )}

                {(!image && !text) ? (
                  <span className="text-gray-400 absolute opacity-50 text-sm">Design Area</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
