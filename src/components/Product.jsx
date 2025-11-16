import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);

        if (response.data.imageName) {
          const imageResponse = await api.get(`/products/${id}/image`, {
            responseType: 'blob',
          });
          if (imageResponse.data?.size > 0) {
            setImageUrl(URL.createObjectURL(imageResponse.data));
          } else {
            setImageUrl(null);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        refreshData();
        navigate('/');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Product not found</p>
      </div>
    );
  }
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex items-center justify-center">
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <i className="bi bi-image text-6xl text-gray-400"></i>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Listed:{' '}
                  <span className="font-semibold">
                    {new Date(product.releaseDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </div>

              <h1 className="text-4xl font-bold mb-2 capitalize text-blue-600 dark:text-blue-400">
                {product.name}
              </h1>
              <p className="text-lg italic font-light text-gray-600 dark:text-gray-400">
                {product.brand}
              </p>
            </div>

            <div className="my-6">
              <h3 className="text-lg font-bold mb-2 text-blue-600 dark:text-blue-400">
                PRODUCT DESCRIPTION
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            </div>

            <div className="h-px bg-gray-300 dark:bg-slate-700 my-4"></div>

            <div className="mb-4">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{product.price}
                </span>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-slate-800 border-l-4 border-green-500">
                <p className="text-gray-900 dark:text-gray-100">
                  Stock Available:{' '}
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    {product.stockQuantity}
                  </span>
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.productAvailable || product.stockQuantity === 0}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform ${product.productAvailable && product.stockQuantity > 0
                  ? 'bg-blue-600 dark:bg-blue-600 text-white hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                  }`}
              >
                {product.productAvailable && product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/product/update/${id}`)}
                className="flex-1 py-3 px-6 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-700"
              >
                <i className="bi bi-pencil-fill mr-2"></i>Update
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-6 bg-red-600 dark:bg-red-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:bg-red-700 dark:hover:bg-red-700"
              >
                <i className="bi bi-trash3-fill mr-2"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

