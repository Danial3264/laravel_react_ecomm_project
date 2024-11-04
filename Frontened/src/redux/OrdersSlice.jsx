import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from 'axios';
import { config } from '../config';

const apiUrl = config.apiBaseUrl;

// Fetch orders from the backend
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get(`${apiUrl}/orders`);
  console.log('Orders fetched from API:', response.data);  
  return response.data;
});

// Async thunk to delete an order from the backend
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/orders/${orderId}`);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete order');
    }
  }
);

// Update order async thunk
export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, updatedOrder }, { rejectWithValue }) => {
  console.log(updatedOrder)
  try {
    const response = await axios.put(`${apiUrl}/orders/${id}`, updatedOrder);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to update order');
  }
});

// Thunk to remove an item from an order
export const removeOrderItem = createAsyncThunk(
  'orders/removeOrderItem',
  async ({ orderId, productId, updatedItems }, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/items/${orderId}/${productId}`);
      return { orderId, updatedItems };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to remove item');
    }
  }
);

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete order';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update order';
      })
      .addCase(removeOrderItem.fulfilled, (state, action) => {
        const { orderId, updatedItems } = action.payload;
        const orderIndex = state.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].items = updatedItems;
        }
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove item';
      });
  },
});

export default OrdersSlice.reducer;
