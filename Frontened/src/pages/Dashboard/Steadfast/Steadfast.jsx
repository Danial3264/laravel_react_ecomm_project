import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../redux/OrdersSlice';
import axios from 'axios';
import { config } from '../../../config';

const Steadfast = () => {

  const apiUrl = config.apiBaseUrl;
  const baseUrl = config.customUrl;
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  const [couriers, setCouriers] = useState()

  // State to store the status of each order
  const [orderStatuses, setOrderStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filter for completed orders only and remove duplicates based on orderNumber
  const completedOrders = orders
    .filter(order => order.payment_status === 'Delivered')
    .reduce((acc, order) => {
      if (!acc.find(item => item.orderNumber === order.orderNumber)) {
        acc.push(order);
      }
      return acc;
    }, []);

    useEffect(() => {
      axios.get(`${apiUrl}/sf`)
          .then(response => {
            setCouriers(response.data);
          })
          .catch(error => {
              console.error("There was an error fetching the Slider!", error);
          });
    }, []);

  // Fetch statuses for all unique completed orders
  useEffect(() => {
    const fetchStatuses = async () => {
      // Ensure both completedOrders and couriers are valid arrays before proceeding
      if (completedOrders.length === 0 || !couriers?.length) return;
  
      try {
        const statuses = {};
        const { sf_api, sf_secret_key } = couriers[0] || {}; // Ensure couriers[0] exists
  
        if (!sf_api || !sf_secret_key) {
          console.error('API or Secret Key is missing');
          return;
        }
  
        for (const order of completedOrders) {
          try {
            const response = await axios.get(`https://portal.packzy.com/api/v1/status_by_invoice/${order.orderNumber}`,
              {
                headers: {
                  'Api-Key': sf_api, // Replace this with actual API key
                  'Secret-Key': sf_secret_key, // Use dynamic secret key
                  'Content-Type': 'application/json',
                }
              }
            );
            statuses[order.orderNumber] = response.data.delivery_status;
          } catch (error) {
            console.error(`Failed to fetch status for order ${order.orderNumber}`, error);
          }
        }
        setOrderStatuses(statuses);
      } catch (error) {
        console.error('Failed to fetch order statuses', error);
      }
    };
  
    fetchStatuses();
  }, [completedOrders, couriers]);
  

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Invoice</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {completedOrders.map(order => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{order.orderNumber}</td>
              <td className="border px-4 py-2">{order.customer.name}</td>
              <td className="border px-4 py-2">{order.customer.phone_number}</td>
              <td className="border px-4 py-2">
                {orderStatuses[order.orderNumber] || 'Loading status...'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Steadfast;
