import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { config } from '../../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch CSRF token before login
  const getCsrfToken = () => {
    return fetch(`${config.apiBaseUrl}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include', // Include credentials to handle cookies
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);

      if (data.access_token) {
        // Store the access token in local storage or session storage
        localStorage.setItem('authToken', data.access_token);

        // Navigate to the dashboard upon successful login
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Invalid email or password'); // Display error if login fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none w-full"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-gray-500 text-center mt-4">
          Don't have an account? <a href="/register" className="text-indigo-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
