import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Product from './components/Product';
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import Cart from './components/Cart';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div id="app-container" className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Navbar onSelectCategory={handleCategorySelect} />
            <Routes>
              <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/product/update/:id" element={<UpdateProduct />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
