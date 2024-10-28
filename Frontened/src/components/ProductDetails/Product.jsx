import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/ProductThunks';
import { addToCart, increaseQuantity, decreaseQuantity } from '../../redux/CartSlice'; // Import actions for increasing and decreasing quantity
import axios from 'axios';
import { config } from '../../config';

const Product = () => {
  const url = config.apiBaseUrl;
  const { id } = useParams(); // Extract the product ID from the URL
  const navigate = useNavigate(); // useNavigate to redirect
  const dispatch = useDispatch();

  const { products, status, error } = useSelector((state) => state.products); // Access products and status from Redux
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(''); // State for selected size
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1); // Local state to manage product quantity

  // Fetch products when the component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    axios.get(`${url}/sizes`)
      .then(response => {
        setSizes(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Find the product by ID from the Redux store once products are available
  useEffect(() => {
    if (status === 'succeeded' && products.length > 0) {
      const foundProduct = products.find((p) => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setProduct(null);
      }
    }
  }, [products, status, id]);

  if (status === 'loading') {
    return <div className="text-center my-4 animate-pulse">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center my-4 text-red-500">
        {error}
        <br />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/products')} // Redirect back to product listing page
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center my-4 text-red-500">
        Product not found.
        <br />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/products')} // Redirect back to product listing page
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Handle "Buy Now" click, redirect to checkout
  const handleBuyNow = (product) => {
    dispatch(addToCart({ ...product, quantity, size: selectedSize })); // Add product with quantity and size
    navigate('/checkout', { state: { product, selectedSize } }); // Pass product and size details to checkout
  };

  // Handle increase quantity
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle decrease quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2 p-4">
          <img
            src={`../../assets/images/${product.product_image}`}
            alt={product.product_name}
            className="h-full w-full object-cover object-center rounded-lg group-hover:opacity-75"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-4 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
          <p className="text-gray-700 text-sm md:text-base">{product.product_description}</p>

          {/* Display price and offer price */}
          <div className="flex">
            {product.offer_price ? (
              <>
                <p className="text-lg font-medium text-gray-500 line-through mr-2">৳{product.product_price}</p>
                <p className="text-xl font-bold text-red-500">৳{product.offer_price}</p>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-800">৳{product.product_price}</p>
            )}
          </div>

          {/* Size selection if applicable */}
          {product.size === 'Yes' && (
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">Choose a size</option>
                {sizes.map((size) =>
                  <option key={size.id} value={size.size}>{size.size}</option>
                )}
              </select>
            </div>
          )}

          {/* Quantity controls */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={handleDecreaseQuantity}
              disabled={quantity === 1}
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={handleIncreaseQuantity}
            >
              +
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => handleBuyNow(product)}
            disabled={product.size === 'Yes' && !selectedSize} // Disable button if size is required and not selected
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
