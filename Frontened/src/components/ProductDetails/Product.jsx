import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/ProductThunks';
import { addToCart, increaseQuantity, decreaseQuantity } from '../../redux/CartSlice';
import axios from 'axios';
import { config } from '../../config';
import ReactImageMagnify from 'react-image-magnify';

const Product = () => {
  const apiUrl = config.apiBaseUrl;
  const baseUrl = config.customUrl;
  const { id } = useParams(); // Extract the product ID from the URL
  const navigate = useNavigate(); // useNavigate to redirect
  const dispatch = useDispatch();

  const { products, status, error } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // Related products state
  const [selectedSize, setSelectedSize] = useState(''); // State for selected size
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Scroll to top whenever id changes (when a new product is viewed)
  useEffect(() => {
    window.scrollTo(0, 0); // স্ক্রল টু টপ
  }, [id]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    axios.get(`${apiUrl}/sizes`)
      .then(response => {
        setSizes(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (status === 'succeeded' && products.length > 0) {
      const foundProduct = products.find((p) => p.id.toString() === id);
      setProduct(foundProduct);

      if (foundProduct) {
        const related = products.filter(
          (p) => p.category_id === foundProduct.category_id && p.id !== foundProduct.id
        );
        setRelatedProducts(related);
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
          onClick={() => navigate('/products')}
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
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleBuyNow = (product) => {
    dispatch(addToCart({ ...product, quantity, size: selectedSize }));
    navigate('/checkout', { state: { product, selectedSize } });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:w-1/2 p-4">
        <ReactImageMagnify
            {...{
              smallImage: {
                alt: product.product_name,
                isFluidWidth: true,
                src: `${baseUrl}${product.product_image}`,
              },
              largeImage: {
                src: `${baseUrl}${product.product_image}`,
                width: 1200,
                height: 1800,
              },
              enlargedImagePosition: 'over',
            }}
          />
        </div>

        <div className="md:w-1/2 p-4 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
          <p className="text-gray-700 text-sm md:text-base">{product.product_description}</p>

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

          <button
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => handleBuyNow(product)}
            disabled={product.size === 'Yes' && !selectedSize}
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="bg-white shadow-lg rounded-lg p-4">
                            <div
                className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7"
                onClick={() => window.location.href = `/product/${relatedProduct.id}`} // Add this to handle image click for navigation
                style={{ cursor: "pointer" }} // Change cursor to indicate clickability
              >
                <img
                  src={`${baseUrl}${relatedProduct.product_image}`}
                  alt={relatedProduct.product_name}
                  className="h-50 w-full object-cover mb-4"
                />
              </div>

              <h3 className="text-lg font-semibold">{relatedProduct.product_name}</h3>
              <p className="text-red-500 font-bold">৳{relatedProduct.offer_price || relatedProduct.product_price}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
