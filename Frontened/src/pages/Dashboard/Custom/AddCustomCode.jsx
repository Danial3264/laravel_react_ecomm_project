import axios from 'axios';
import React, { useState } from 'react';
import { config } from '../../../config';

const AddCustomCode = ({ onCustomCreated }) => {  // Receive the prop

  const apiUrl = config.apiBaseUrl;
  const [formData, setFormdata] = useState({
    head_code: '',
    body_code: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  
    axios.post(`${apiUrl}/custom`, formData)
      .then(response => {
        console.log('Custom Code created successfully:', response.data);

        // Call the onCategoryCreated function to update the menu
        if (onCustomCreated) {
            onCustomCreated();  // Call the function to switch to 'viewCategory'
        }
      })
      .catch(error => {
        console.error('There was an error creating the Custom Code:', error);
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Custom Code</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-gray-700">Head Custom Code </label>
          <input
            type="text"
            name="head_code"
            value={formData.head_code}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Head Code"
          />
        </div>

        <div>
          <label className="block text-gray-700">Body Custom Code</label>
          <input
            type="text"
            name="body_code"
            value={formData.body_code}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Body Code"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomCode;
