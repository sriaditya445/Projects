import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    name: '',
    price: '',
    category: 'Oversized',
    image: '',
    description: '',
    sizes: 'S, M, L, XL'
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        ...product,
        sizes: product.sizes.join(', ')
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      sizes: formData.sizes.split(',').map(s => s.trim())
    };

    try {
      if (editingId) {
        await productAPI.update(editingId, payload);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create({ ...payload, id: String(Date.now()) });
        toast.success('Product added successfully');
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 dark:bg-darkBg min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage product inventory</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded font-bold uppercase tracking-wider text-sm flex items-center hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors"
          >
            <Plus size={16} className="mr-2" /> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100 dark:bg-gray-800" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">₹{product.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 mx-2 p-1">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No products found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-darkCard w-full max-w-lg rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden select-text">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white">
                    <option value="Oversized">Oversized</option>
                    <option value="Classic">Classic</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input required type="url" name="image" value={formData.image} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white" placeholder="https://..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sizes (comma separated)</label>
                <input required type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white" placeholder="S, M, L, XL" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2.5 text-gray-900 dark:text-white resize-none"></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-bold hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors">
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
