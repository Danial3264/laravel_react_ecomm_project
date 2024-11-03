import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import Search from './Search';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, increaseQuantity } from '../../../redux/CartSlice';
import Logo from './Logo';
import { config } from '../../../config';

const Navbar = () => {
  const apiUrl = config.apiBaseUrl;
  const baseUrl = config.customUrl;
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // সাইডবার খোলা অবস্থার জন্য state
  const [isOpenSearch, setOpenSearch] = useState(window.innerWidth >= 768); // Desktop মোডে সবসময় ওপেন থাকবে
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const products = useSelector((state) => state.products.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearch = () => {
    setOpenSearch(!isOpenSearch);
  };

  const handleProductSearch = (searchValue) => {
    const value = searchValue.toLowerCase();
    if (value === '') {
      setFilteredProducts([]);
      return;
    }
    const newProducts = products.filter((product) => {
      const productName = product.product_name.toLowerCase();
      return productName.includes(value);
    });

    setFilteredProducts(newProducts);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // সাইডবার টগল ফাংশন
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    axios.get(`${apiUrl}/categories`)
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });

    // রিসাইজ হলে মোবাইল/ডেস্কটপ অনুযায়ী সার্চের অবস্থা পরিবর্তন করবে
    const handleResize = () => {
      setOpenSearch(window.innerWidth >= 768); // মোবাইলে ক্লিক করলে, ডেস্কটপে সবসময় খোলা থাকবে
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sidebar এর বাইরে ক্লিক করলে সাইডবার বন্ধ করা হবে
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, product) => acc + product.product_price * product.quantity, 0);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));  // Add product to cart
  };

  const handleIncreaseQuantity = (productId, size) => {
    dispatch(increaseQuantity({ id: productId, size }));
  };

  const handleDecreaseQuantity = (productId, size) => {
    dispatch(decreaseQuantity({ id: productId, size }));
  };

  const getCartItem = (productId, size) => {
    return cartItems.find((item) => item.id === productId && item.size === size);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center space-x-2">
        <Link to="/" className="text-white font-bold text-xl"><Logo /></Link>

        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link to="/shop" className="text-gray-300 hover:text-white">Shop</Link>
        </div>

        <div className="flex items-center space-x-4 text-white">
          {/* ডেস্কটপে সার্চ সবসময় খোলা থাকবে, মোবাইলে ক্লিক করলে খোলা হবে */}
          {window.innerWidth < 768 ? (
            <FaSearch onClick={handleSearch} className="cursor-pointer" />
          ) : null}
          {isOpenSearch ? <Search onSearch={handleProductSearch} /> : null}

          {/* মোবাইল সাইডবার টগল বাটন */}
          <FaBars onClick={toggleSidebar} className="cursor-pointer md:hidden" />
        </div>
      </div>

      {/* Backdrop যখন সাইডবার ওপেন থাকবে */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}  // ব্যাকড্রপে ক্লিক করলে সাইডবার বন্ধ হবে
        />
      )}

      {/* সাইডবার */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 sidebar`}
      >
        <div className='mt-10'>
          <FaTimes className="absolute top-4 right-4 cursor-pointer" onClick={toggleSidebar} />
          {categories.map((category) => (
            <Link
              to={`/shop?category=${category.id}`}
              key={category.id}
              className="block py-2 px-6 text-gray-300 hover:bg-gray-700 border-b border-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              {category.category_name}
            </Link>
          ))}
        </div>
      </div>

      {isOpenSearch && filteredProducts.length > 0 && (
        <div className="absolute bg-white shadow-lg rounded-lg w-full max-w-md mt-2 right-0 text-black p-4 z-50 space-y-2">
          {filteredProducts.map((product) => {
            const cartItem = getCartItem(product.id, product.size); // Update to include size
            return (
              <div key={product.id} className="block hover:bg-gray-100 p-2 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <img className="w-12 h-12 rounded-lg object-cover" src={`${baseUrl}${product.product_image}`} alt={product.product_name} />
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{product.product_name}</p>
                      <p className="text-gray-500">Price: ৳{product.offer_price || product.product_price}</p>
                      {cartItem ? (
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDecreaseQuantity(cartItem.id, cartItem.size)}>-</button>
                          <span className="text-lg font-semibold">{cartItem.quantity}</span>
                          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => handleIncreaseQuantity(cartItem.id, cartItem.size)}>+</button>
                        </div>
                      ) : (
                        <button className="rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 text-md font-semibold p-2 mt-2 hover:animate-bounce" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
