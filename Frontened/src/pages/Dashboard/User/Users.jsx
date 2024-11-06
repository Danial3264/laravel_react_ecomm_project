import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../../config';
import UpdateUser from './UpdateUser';

const Users = () => {
    const apiUrl = config.apiBaseUrl;
    const [users, setUsers] = useState([]);  // Ensure users is initialized as an array
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}/users`)
            .then(response => {
                console.log('user:', response.data);
                setUsers(Array.isArray(response.data.users) ? response.data.users : []);
 
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    console.log('Users:',users)

    // Handle edit button click
    const handleEdit = (user) => {
        setEditingUser(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role
        });
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission to update the user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiUrl}/users/${editingUser}`, formData);
            setUsers(users.map(user => user.id === editingUser ? { ...user, ...formData } : user));
            setEditingUser(null);  // Close the edit form
            setFormData({});
        } catch (error) {
            console.error("There was an error updating the user!", error);
        }
    };

    // Handle delete button click
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios.delete(`${apiUrl}/users/${id}`)
                .then(response => {
                    console.log("User deleted successfully:", response.data);
                    const filteredUsers = users.filter((user) => user.id !== id);
                    setUsers(filteredUsers);
                })
                .catch(error => {
                    console.error("There was an error deleting the user!", error);
                });
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">User Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.map((user) => (  // Safeguard to ensure users is an array
                        <tr key={user.id} className="hover:bg-gray-100 text-center">
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">{user.role}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Show edit form if editing */}
            {editingUser && (
                <UpdateUser
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default Users;
