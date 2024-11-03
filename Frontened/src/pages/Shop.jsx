import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Category from '../components/Shop/Category';
import Navbar from '../components/Home/Hero/Navbar';
import Footer from '../components/Home/Footer';
import AllProducts from '../components/Shop/AllProducts';
import CartIcon from '../components/Home/CartIcon';
import axios from 'axios';
import { config } from '../config';

const Shop = () => {
  const apiUrl = config.apiBaseUrl;
  const [animate, setAnimate] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [sort, setSort] = useState(''); // Track the sorting option
  const [categories, setCategories] = useState([]); // Store categories

  const location = useLocation();

  const getCategoryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('category');

    if (!categoryId) {
      return { id: null, name: 'All Products' };
    }

    const selectedCategory = categories.find(cat => String(cat.id) === categoryId);
    return { id: categoryId, name: selectedCategory ? selectedCategory.category_name : 'Category' };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryId = getCategoryFromUrl().id;

    setAnimate(true);
    setShowProducts(false);

    const timeout = setTimeout(() => {
      if (categoryId === null) {
        fetchAllProducts();
      } else {
        fetchProductsByCategory(categoryId);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.search, sort]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/products`);
      const sortedProducts = sortProducts(response.data);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
    setShowProducts(true);
  };

  const fetchProductsByCategory = async (category_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/products/category/${category_id}`);
      const sortedProducts = sortProducts(response.data);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
    setLoading(false);
    setShowProducts(true);
  };

  const sortProducts = (products) => {
    if (sort === 'lowToHigh') {
      return [...products].sort((a, b) => a.offer_price - b.offer_price);
    } else if (sort === 'highToLow') {
      return [...products].sort((a, b) => b.offer_price - a.offer_price);
    }
    return products;
  };

  const category = getCategoryFromUrl();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <CartIcon />

      <div className="container mx-auto flex flex-col md:flex-row items-start pt-10 md:pt-20">
        {/* Left Sidebar */}
        <div className={`hidden md:block basis-1/4 transform transition-all duration-700 ease-out ${animate ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <Category />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full md:basis-3/4 p-2">
          {/* Category Name and Sort */}
          <div className="flex justify-between items-center lg:ml-8 mb-4">
            <span className="md:hidden text-md font-semi-bold">
              Shop/{category.name} {/* এখানে categoryName দেখাবে */}
            </span>
            <div>
              <label className="inline lg:block text-lg font-bold mb-2">Sort by:</label>
              <select
                className="border rounded-lg p-2 w-48"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products display */}
          <div className={`p-2 transform transition-all duration-700 ease-out ${showProducts ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            {loading ? <p>Loading...</p> : <AllProducts products={products} />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
