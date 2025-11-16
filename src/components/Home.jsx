import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import api from '../utils/axios';

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const fetchProductsWithImages = async () => {
      if (data && data.length > 0) {
        setLoading(true);
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await api.get(`/products/${product.id}/image`, {
                responseType: 'blob',
              });
              if (response.data?.size > 0) {
                const imageUrl = URL.createObjectURL(response.data);
                return { ...product, imageUrl };
              } else {
                return { ...product, imageUrl: null };
              }
            } catch (error) {
              console.error(`Error fetching image for product ${product.id}:`, error);
              return { ...product, imageUrl: null };
            }
          })
        );
        setProducts(productsWithImages);
        setLoading(false);
      }
    };

    fetchProductsWithImages();
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex justify-center items-center min-h-96">
              <div className="text-center">
                <i className="bi bi-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Products Available</h2>
              </div>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 ${!product.productAvailable ? 'opacity-60 grayscale' : ''
                  }`}
              >
                <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
                  <div className="relative w-full h-44 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="bi bi-image text-4xl text-gray-400"></i>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <div>
                      <h5 className="text-lg font-bold mb-1 text-gray-900 dark:text-white truncate">
                        {product.name.toUpperCase()}
                      </h5>
                      <div className="flex justify-between">
                        <span className="block text-xs italic text-gray-600 dark:text-gray-400">
                          ~ {product.brand}
                        </span>
                        <span className="block text-xs text-gray-600 dark:text-gray-400">
                          {new Date(product.releaseDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2 border-gray-200 dark:border-slate-600" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <i className="bi bi-currency-rupee"></i>
                        {product.price}
                      </span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Stock: {product.stockQuantity}
                      </span>
                    </div>
                    <button
                      className={`mt-2 w-full py-2 rounded-lg font-bold text-white transition-all duration-300 ${product.productAvailable && product.stockQuantity > 0
                        ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                        : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.productAvailable && product.stockQuantity > 0) {
                          addToCart(product);
                        }
                      }}
                      disabled={!product.productAvailable || product.stockQuantity === 0}
                    >
                      {product.stockQuantity > 0 && product.productAvailable
                        ? 'Add to Cart'
                        : product.stockQuantity === 0
                          ? 'Out of Stock'
                          : 'Unavailable'}
                    </button>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

