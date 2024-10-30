import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { config } from '../../../config';


const ViewCustomCode = () => {

    const apiUrl = config.apiBaseUrl;
    const baseUrl = config.customUrl;

    const [codes, setCodes] = useState([]);

    useEffect(() => {
        axios.get(`${apiUrl}/custom`)
            .then(response => {
                setCodes(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`${apiUrl}/custom/${id}`) // Assuming your backend API follows REST conventions
            .then(response => {
                console.log("custom deleted successfully:", response.data);
                // Update the state to reflect the deleted category
                const filteredCodes = codes.filter((code) => code.id !== id);
                setCodes(filteredCodes);
            })
            .catch(error => {
                console.error("There was an error deleting the code!", error);
            });
        }
    };
    
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Vied Code</h2>

        <table className="table-auto w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Head code</th>
                    <th className="border px-4 py-2">Body Code</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
            </thead>
      

        {codes.map((code)=>(
            
                
                <tbody key={code.id}>
                <tr className="hover:bg-gray-100 text-center">
                    <td className="border px-4 py-2">{code.head_code}</td>
                    <td className="border px-4 py-2">{code.body_code}</td>
                    <td className="border px-4 py-2"> 
                    <button
                        onClick={() => handleDelete(code.id)} // Corrected to use orderId
                        className="text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
            
                </tbody>
            

        ))}
    </table> 
  </div>
  )
}

export default ViewCustomCode
