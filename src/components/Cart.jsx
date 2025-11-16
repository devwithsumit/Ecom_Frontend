import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartWithImages = async () => {
      if (cart.length > 0) {
        const itemsWithImages = await Promise.all(
          cart.map(async (item) => {
            try {
              const response = await api.get(`/products/${item.id}/image`, {
                responseType: 'blob',
              });
              if (response.data?.size > 0) {
                const imageUrl = URL.createObjectURL(response.data);
                return { ...item, imageUrl };
              } else {
                return { ...item, imageUrl: null };
              }
            } catch (error) {
              console.error('Error fetching image:', error);
              return { ...item, imageUrl: null };
            }
          })
        );
        setCartItems(itemsWithImages);
      } else {
        setCartItems([]);
      }
    };

    fetchCartWithImages();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          if (item.quantity < item.stockQuantity) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error('Cannot add more than available stock');
          }
        }
        return item;
      })
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    if (window.confirm('Proceed with checkout?')) {
      setLoading(true);
      try {
        for (const item of cartItems) {
          const updatedStockQuantity = item.stockQuantity - item.quantity;
          const updatedProductData = {
            ...item,
            stockQuantity: updatedStockQuantity,
          };

          const imageResponse = await api.get(`/products/${item.id}/image`, {
            responseType: 'blob',
          });
          const imageFile = new File([imageResponse.data], item.imageName, {
            type: imageResponse.data.type,
          });

          const formData = new FormData();
          formData.append('imageFile', imageFile);
          formData.append(
            'product',
            new Blob([JSON.stringify(updatedProductData)], { type: 'application/json' })
          );

          await api.put(`/products/${item.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        clearCart();
        setCartItems([]);
        toast.success('Checkout successful!');
      } catch (error) {
        console.error('Error during checkout:', error);
        toast.error('Checkout failed');
      } finally {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-96">
            <i className="bi bi-cart-x text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started!</p>
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-slate-700"
            >
              {/* Product Image */}
              <div className="shrink-0 w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="bi bi-image text-3xl text-gray-400"></i>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{item.brand}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Price: <span className="font-semibold">₹{item.price}</span>
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                >
                  <i className="bi bi-dash-lg text-lg text-gray-900 dark:text-white"></i>
                </button>
                <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                >
                  <i className="bi bi-plus-lg text-lg text-gray-900 dark:text-white"></i>
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right min-w-24">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <i className="bi bi-trash3-fill text-lg"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Subtotal:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-gray-200 dark:bg-slate-700 mb-6"></div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin mr-2"></i>Processing...
              </>
            ) : (
              <>
                <i className="bi bi-credit-card mr-2"></i>Proceed to Checkout
              </>
            )}
          </button>

          <Link
            to="/"
            className="block text-center mt-4 py-3 px-6 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

