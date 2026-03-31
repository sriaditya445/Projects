import axios from 'axios';

const isGithub = window.location.hostname.includes('github.io');

const api = axios.create({
  baseURL: isGithub ? '/Projects' : 'http://localhost:3002',
  timeout: 5000,
});

// Mock helper to grab the static JSON file when hosted on GitHub Pages
const fetchStaticDB = async () => {
  const res = await axios.get('/Projects/db.json');
  return res.data;
};

export const productAPI = {
  getAll: async () => {
    if (isGithub) {
      const db = await fetchStaticDB();
      return { data: db.products || [] };
    }
    return api.get('/products');
  },
  getById: async (id) => {
    if (isGithub) {
      const db = await fetchStaticDB();
      return { data: db.products.find(p => String(p.id) === String(id)) || null };
    }
    return api.get(`/products/${id}`);
  },
  create: (data) => isGithub ? Promise.resolve({ data: { ...data, id: String(Date.now()) } }) : api.post('/products', data),
  update: (id, data) => isGithub ? Promise.resolve({ data }) : api.put(`/products/${id}`, data),
  delete: (id) => isGithub ? Promise.resolve({ data: {} }) : api.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: async () => {
    if (isGithub) {
      // Just return empty array on first load since it's static
      return { data: [] };
    }
    return api.get('/cart');
  },
  addToCart: (data) => isGithub ? Promise.resolve({ data: { ...data, id: String(Date.now()) } }) : api.post('/cart', data),
  updateCart: (id, data) => isGithub ? Promise.resolve({ data }) : api.put(`/cart/${id}`, data),
  removeFromCart: (id) => isGithub ? Promise.resolve({ data: {} }) : api.delete(`/cart/${id}`),
};

export const orderAPI = {
  createOrder: (data) => isGithub ? Promise.resolve({ data: { ...data, id: String(Date.now()) } }) : api.post('/orders', data),
};

export default api;
