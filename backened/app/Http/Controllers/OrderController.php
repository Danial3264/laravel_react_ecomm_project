<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        try {
            $orders = Order::with(['customer', 'items'])->get(); 
            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch orders', 'message' => $e->getMessage()], 500);
        }
    }
    

    public function createOrder(Request $request)
    {
        $request->validate([
            'customer.name' => 'required|string',
            'customer.address' => 'required|string',
            'customer.phone_number' => 'required|string',
            'customer.email' => 'nullable|email',
            'orderNumber' => 'required|string',
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
            'transaction_mobile' => $request->input('payment_method') !== 'cash_on_delivery' ? 'required|string' : 'nullable|string', // Validate only for non-COD
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_price' => 'required|numeric',
            'items.*.size' => 'nullable|string',
            'items.*.quantity' => 'required|integer',
            'shipping_cost' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Customer data insertion
            $customerData = $request->input('customer');
            $customer = Customer::create($customerData);
            // dd($customer); // Uncomment this line to check customer insertion

            // Order data insertion
            $orderData = [
                'orderNumber' => $request->input('orderNumber'),
                'customer_id' => $customer->id,
                'total_amount' => $request->input('total'),
                'shipping_cost' => $request->input('shipping_cost'),
                'payment_method' => $request->input('payment_method'),
                'tnx_mobile_number' => $request->input('payment_method') === 'cash_on_delivery' ? '0' : $request->input('transaction_mobile'), // Set to null for COD
            ];

            $order = Order::create($orderData);
            // dd($order); // Uncomment this line to check order insertion

            // Order items insertion
            $items = $request->input('items');
            foreach ($items as $item) {
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['product_name'],
                    'product_price' => $item['product_price'],
                    'size' => $item['size'] ?? null,
                    'quantity' => $item['quantity'],
                ];
                OrderItem::create($orderItemData);
                // dd($orderItemData); // Uncomment this line to check order items insertion
            }

            DB::commit();
            return response()->json(['message' => 'Order created successfully!'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateOrder(Request $request, $id)
{
    $request->validate([
        'customer.name' => 'required|string',
        'customer.address' => 'required|string',
        'customer.phone_number' => 'required|string',
        'customer.email' => 'nullable|email',
        'orderNumber' => 'required|string',
        'total' => 'required|numeric',
        'payment_method' => 'required|string',
        'transaction_mobile' => $request->input('payment_method') !== 'cash_on_delivery' ? 'required|string' : 'nullable|string', 
        'items' => 'required|array',
        'items.*.id' => 'required|integer',
        'items.*.product_name' => 'required|string',
        'items.*.product_price' => 'required|numeric',
        'items.*.size' => 'nullable|string',
        'items.*.quantity' => 'required|integer',
        'shipping_cost' => 'nullable|numeric',
    ]);

    DB::beginTransaction();

    try {
        $order = Order::findOrFail($id);
        $customerData = $request->input('customer');
        $order->customer->update($customerData);
        $orderData = [
            'orderNumber' => $request->input('orderNumber'),
            'total_amount' => $request->input('total'),
            'shipping_cost' => $request->input('shipping_cost'),
            'payment_method' => $request->input('payment_method'),
            'tnx_mobile_number' => $request->input('payment_method') === 'cash_on_delivery' ? '0' : $request->input('transaction_mobile'), // Set to null for COD
        ];
        $order->update($orderData);
        $order->items()->delete();

        $items = $request->input('items');
        foreach ($items as $item) {
            $orderItemData = [
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'product_name' => $item['product_name'],
                'product_price' => $item['product_price'],
                'size' => $item['size'] ?? null,
                'quantity' => $item['quantity'],
            ];
            OrderItem::create($orderItemData);
        }

        DB::commit();
        return response()->json(['message' => 'Order updated successfully!'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to update order', 'message' => $e->getMessage()], 500);
    }
}
public function deleteOrder($id)
{
    DB::beginTransaction();

    try {
        $order = Order::findOrFail($id);
        $order->items()->delete();
        $order->delete();

        DB::commit();
        return response()->json(['message' => 'Order deleted successfully!'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to delete order', 'message' => $e->getMessage()], 500);
    }
}



}
