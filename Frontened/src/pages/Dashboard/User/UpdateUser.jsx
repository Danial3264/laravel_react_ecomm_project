import React from "react";

const UpdateUser = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Edit User</h3>
      
      {/* User Name */}
      <div className="mb-2">
        <label className="block mb-1">User Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-2">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* User Role */}
      <div className="mb-2">
        <label className="block text-gray-700">Select User Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      {/* Submit Button */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Update User
      </button>
    </form>
  );
};

export default UpdateUser;
