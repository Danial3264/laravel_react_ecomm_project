<?php

namespace App\Http\Controllers;

use App\Models\Item; // Use the correct model

class ItemController extends Controller
{

    public function index()
    {
        $item = Item::all();
        return response()->json($item, 200);
    }


    public function destroy($order_id, $product_id)
    {
        // Find the order item by order_id and product_id
        $orderItem = Item::where('order_id', $order_id)
                         ->where('product_id', $product_id)
                         ->first();

        // Check if the order item exists
        if ($orderItem) {
            $orderItem->delete();  // Delete the order item
            return response()->json(['message' => 'Order item deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Order item not found'], 404);
        }
    }
}
