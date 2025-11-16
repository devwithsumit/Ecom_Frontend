import { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const AppContext = createContext({
  data: [],
  isError: false,
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  refreshData: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      toast.success('Quantity updated in cart');
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      toast.success('Product added to cart');
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    toast.success('Product removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const refreshData = async () => {
    try {
      const response = await api.get('/products');
      setData(response.data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, clearCart, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

