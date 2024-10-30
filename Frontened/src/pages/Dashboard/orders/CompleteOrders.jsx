import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, deleteOrder, updateOrder } from '../../../redux/OrdersSlice';
import UpdateOrder from './UpdateOrder';
import axios from 'axios';
import { config } from '../../../config';

const CompleteOrders = () => {
  const dispatch = useDispatch();
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox
  const [couriers, setCouriers] = useState([]);
  const apiUrl = config.apiBaseUrl;

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Fetch couriers on component mount
  useEffect(() => {
    axios.get(`${apiUrl}/sf`)
      .then(response => {
        setCouriers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the couriers!", error);
      });
  }, [apiUrl]);

  const { orders, status, error } = useSelector((state) => state.orders);
  const pendingOrders = orders.filter(order => order.payment_status === 'Completed');
  const selectedCompletedOrders = pendingOrders.filter(order => {
    return selectedOrders.includes(String(order.id));
  });

  const handleSendToSteadfast = async () => {
    const bulkData = selectedCompletedOrders.map(order => {
      const totalAmount = parseFloat(order.total_amount) + parseFloat(order.shipping_cost);
      return {
        invoice: order.orderNumber,
        recipient_name: order.customer.name,
        recipient_phone: order.customer.phone_number,
        recipient_address: order.customer.address,
        cod_amount: totalAmount,
        note: order.note || ''
      };
    });

    const { sf_api, sf_secret_key } = couriers[0] || {};
    const url = 'https://portal.packzy.com/api/v1';

    try {
      const response = await axios.post(`${url}/create_order/bulk-order`, bulkData, {
        headers: {
          'Api-Key': sf_api,
          'Secret-Key': sf_secret_key,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.bulkData && response.data.bulkData.length === 0) {
        alert('No orders were processed. Please check the input data.');
      } else {
        alert('Orders sent successfully!');
      }
    } catch (error) {
      alert('Failed to send orders.');
    }
  };

  // Handle edit button click
  const handleEdit = (order) => {
    setEditingOrder(order.orderId);
    setFormData({
      name: order.name,
      phone_number: order.phone_number,
      address: order.address,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      customer_id: order.customer_id,
      shipping_cost: order.shipping_cost,
      items: order.items.map(item => ({
        product_id: item.product_id,
        order_id: item.order_id,
        product_name: item.product_name,
        quantity: item.quantity,
        size: item.size,
      })),
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes for individual items
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  // Remove an item from the order and delete it from the database
  const removeItem = async (index, order_id, product_id) => {
    try {
      await axios.delete(`/order-item/${order_id}/${product_id}`);
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: updatedItems,
      });
      alert('Item removed successfully');
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item from the order');
    }
  };

  // Handle form submission for updating the order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm('Are you sure you want to update this order?')) {
      dispatch(updateOrder({ id: editingOrder, updatedOrder: formData }));
      dispatch(fetchOrders());
      setEditingOrder(null);
    }
  };

  // Handle delete button click
  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(orderId));
      dispatch(fetchOrders());
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter(id => id !== orderId);
      } else {
        return [...prevSelectedOrders, orderId];
      }
    });
  };

  // Handle "Select All" checkbox toggle
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedOrders(groupedPendingOrders.map(order => order.orderId)); // Select all orders
    } else {
      setSelectedOrders([]); // Deselect all orders
    }
  };

  // Group orders by their order ID
  const groupOrders = (orders) => {
    const groupedOrders = {};

    orders.forEach((order) => {
      if (!groupedOrders[order.id]) {
        groupedOrders[order.id] = {
          name: order.customer.name,
          phone_number: order.customer.phone_number,
          address: order.customer.address,
          total_amount: order.total_amount,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          items: [],
          shipping_cost: order.shipping_cost,
        };
      }
      order.items.forEach((item) => {
        groupedOrders[order.id].items.push({
          product_id: item.product_id,
          order_id: item.order_id,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
          size: item.size,
        });
      });
    });

    return Object.entries(groupedOrders).map(([orderId, orderData]) => ({
      orderId,
      ...orderData,
    }));
  };

  const groupedPendingOrders = groupOrders(pendingOrders);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-screen">
      <h2 className="text-2xl font-bold mb-4">Completed Orders</h2>

      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {groupedPendingOrders && groupedPendingOrders.length > 0 ? (
        <>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  Select All
                </th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Phone Number</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Sub-Total</th>
                <th className="border px-4 py-2">Shipping Cost</th>
                <th className="border px-4 py-2">Total Amount</th>
                <th className="border px-4 py-2">Payment Method</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedPendingOrders.map((order) => (
                <tr key={order.orderId} className="border">
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderId)}
                      onChange={() => handleCheckboxChange(order.orderId)}
                    />
                  </td>
                  <td className="border px-4 py-2">{order.name}</td>
                  <td className="border px-4 py-2">{order.phone_number}</td>
                  <td className="border px-4 py-2">{order.address}</td>
                  <td className="border px-4 py-2">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <strong>{item.product_name}</strong> - Quantity: {item.quantity} - Size: {item.size}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">{order.total_amount}</td>
                  <td className="border px-4 py-2">{order.shipping_cost}</td>
                  <td className="border px-4 py-2">
                    {(parseFloat(order.total_amount) + parseFloat(order.shipping_cost)).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{order.payment_method}</td>
                  <td className="border px-4 py-2">{order.payment_status}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelete(order.orderId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSendToSteadfast}
              disabled={selectedOrders.length === 0}
            >
              Send to Steadfast
            </button>
          </div>
        </>
      ) : (
        <p>No completed orders available.</p>
      )}
      {editingOrder && (
        <UpdateOrder
          editingOrder={editingOrder}
          formData={formData}
          handleInputChange={handleInputChange}
          handleItemChange={handleItemChange}
          handleSubmit={handleSubmit}
          removeItem={removeItem}
        />
      )}
    </div>
  );
};

export default CompleteOrders;
