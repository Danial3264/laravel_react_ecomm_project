import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { config } from '../../../config';


const ViewSteadfast = () => {


    const apiUrl = config.apiBaseUrl;
    const baseUrl = config.customUrl;

    const [couriers, setCouriers] = useState([]);

    useEffect(() => {
        axios.get(`${apiUrl}/sf`)
            .then(response => {
              setCouriers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the couriers!", error);
            });
    }, []);

    const handleDelete = (id) => {

        console.log(id)
        if (window.confirm("Are you sure you want to delete this slide?")) {
            axios.delete(`${apiUrl}/sf/${id}`) // Assuming your backend API follows REST conventions
            .then(response => {
                console.log("courier deleted successfully:", response.data);
                // Update the state to reflect the deleted slide
                const filteredCourier = couriers.filter((courier) => courier.id !== id);
                setCouriers(filteredCourier);
            })
            .catch(error => {
                console.error("There was an error deleting the courier!", error);
            });
        }
    };
    
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Courier API</h2>

        <table className="table-auto w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Steadfast Api</th>
                    <th className="border px-4 py-2">Steadfast Secret Key</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
            </thead>
      

            {couriers.map((courier)=>(
            <tbody>
                <tr className="hover:bg-gray-100 text-center">
                    <td className="border px-4 py-2">{courier.sf_api}</td>
                    <td className="border px-4 py-2">{courier.sf_secret_key}</td>
                    <td className="border px-4 py-2"> 
                    <button
                        onClick={() => handleDelete(courier.id)} // Corrected to use orderId
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

export default ViewSteadfast
