import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ThemeContext from '../context/ThemeContext';
import AppContext from '../context/AppContext';
import api from '../utils/axios';

const navlinks = [
  { to: '/', label: 'Home' },
  { to: '/add-product', label: 'Add Product' },
  { to: '/cart', label: 'Cart' },
]


const Navbar = ({ onSelectCategory }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { cart } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeLink, setActiveLink] = useState('/');

  const categories = ['Laptop', 'Headphone', 'Mobile', 'Electronics', 'Toys', 'Fashion'];

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (value.length >= 1) {
      try {
        const response = await api.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      onSelectCategory('');
    } else {
      setSelectedCategory(category);
      onSelectCategory(category);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/"
          onClick={() => {
            setActiveLink('/');
            setSelectedCategory('');
            onSelectCategory('');
          }}
          className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-colors">
          Sheryians
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">

          {navlinks.map((link) => {
            return (
              <Link key={link.to} to={link.to} onClick={() => {
                setActiveLink(link.to);
                setSelectedCategory('');
                onSelectCategory('');
              }}
                className={` hover:text-blue-600 dark:hover:text-blue-400 transition-colors 
                font-medium ${link.to === activeLink ? 'text-blue-500 font-bold' : 'text-gray-900 dark:text-gray-100'}`}>
                {link.label}
              </Link>
            )
          })}
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className={`  hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center
              ${selectedCategory !== '' ? 'text-blue-500 font-bold' : 'text-gray-900 dark:text-gray-100'}`}>
              Categories
              <i className="bi bi-chevron-down ml-1 text-sm"></i>
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`block w-full text-left px-4 py-3 hover:bg-blue-600 hover:text-white 
                    transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCategory === category ? 'bg-blue-600! text-white' : 'dark:text-gray-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:flex relative">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSearchResults && searchResults.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                {searchResults.map((result) => (
                  <li key={result.id} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                    <Link
                      to={`/product/${result.id}`}
                      className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-blue-600 hover:text-white transition-colors"
                      onClick={() => setShowSearchResults(false)}
                    >
                      {result.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-yellow-400 hover:opacity-80 transition-colors"
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'} text-lg`}></i>
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 hover:bg-blue-600 hover:text-white transition-colors border border-gray-300 dark:border-slate-600"
          >
            <i className="bi bi-cart text-lg"></i>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-lg`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/add-product"
              className="block text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Product
            </Link>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Categories</p>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="block w-full text-left py-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

