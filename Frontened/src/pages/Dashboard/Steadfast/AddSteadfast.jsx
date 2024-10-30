import axios from 'axios';
import React, { useState } from 'react';
import { config } from '../../../config';

const AddSteadfast = ({ onCourierCreated }) => {
  const apiUrl = config.apiBaseUrl;

  const [formData, setFormData] = useState({
    sf_api: '',
    sf_secret_key: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    axios.post(`${apiUrl}/sf`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Courier created successfully:', response.data);
        setMessage('Courier created successfully!');
        setIsSubmitting(false);
        onCourierCreated(); // Notify parent component
        setFormData({
          sf_api: '',
          sf_secret_key: ''
        }); // Clear the form
      })
      .catch(error => {
        console.error('There was an error creating the slider:', error);
        setMessage('Error creating courier!');
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Courier</h2>

      {message && <p className="mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* API */}
        <div>
          <label className="block text-gray-700">API</label>
          <input
            type="text"
            name="sf_api"
            value={formData.sf_api}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter API"
            required
          />
        </div>

        {/* Secret Key */}
        <div>
          <label className="block text-gray-700">Secret Key</label>
          <input
            type="text"
            name="sf_secret_key"
            value={formData.sf_secret_key}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Secret Key"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create API'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSteadfast;
