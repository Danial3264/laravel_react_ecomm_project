import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import Thanks from "./pages/Thanks";
import ProductDetails from "./pages/ProductDetails";
import Display from "./pages/Dashboard/Display";
import ViewCategory from "./pages/Dashboard/Category/ViewCategory";
import Login from "./pages/Dashboard/Login";
import PrivateRoute from "./pages/Dashboard/PrivateRoute";
import Contact from "./pages/optional/Contact";
import Shipping from "./pages/optional/Shipping";
import PrivacyPolicy from "./pages/optional/PrivacyPolicy";
import TermsOfService from "./pages/optional/TermsOfService";
import Returns from "./pages/optional/Return";
import axios from "axios";
import { config } from "./config";

const apiUrl = config.apiBaseUrl;

function App() {
  useEffect(() => {
    // API থেকে head_code এবং body_code ফেচ করা
    axios.get(`${apiUrl}/custom`)
      .then((response) => {
        const data = response.data;
        if (data) {
          // head এবং body তে ইনজেক্ট করা
          injectCustomCode(data.head_code, data.body_code);
        }
      })
      .catch((error) => console.error("Error fetching custom code:", error));
  }, []);

  const injectCustomCode = (headCode, bodyCode) => {
    // Head section এ কোড যুক্ত করা
    if (headCode) {
      const headScript = document.createElement("script");
      headScript.innerHTML = headCode;
      document.head.appendChild(headScript);
    }

    // Body section এ কোড যুক্ত করা
    if (bodyCode) {
      const bodyScript = document.createElement("div");
      bodyScript.innerHTML = bodyCode;
      document.body.appendChild(bodyScript);
    }
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/Thanks" element={<Thanks />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
          <Route path="/returns" element={<Returns />} />

          {/* Protecting dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Display />
              </PrivateRoute>
            }
          />
          <Route
            path="/view-category"
            element={
              <PrivateRoute>
                <ViewCategory />
              </PrivateRoute>
            }
          />

          {/* Optional: Redirect unknown routes to Home or 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
