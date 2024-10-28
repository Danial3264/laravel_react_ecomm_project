<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        // সব ইউজারকে ডাটাবেস থেকে রিট্রিভ করা
        $users = User::all();

        // JSON ফরম্যাটে রেসপন্স করা
        return response()->json([
            'message' => 'Users retrieved successfully!',
            'users' => $users
        ], 200);
    }

    public function store(Request $request)
    {
        // ডাটা ভ্যালিডেশন করা
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // ইউজার তৈরি করা
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // সফল হলে রেসপন্স রিটার্ন করা
        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user
        ], 201);
    }
}
