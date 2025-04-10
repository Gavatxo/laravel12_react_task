<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::query();

        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where('name', 'like', '%' . request("name") . '%');
        }
        if (request("email")) {
            $query->where('email', 'like', '%' . request("email") . '%');
        }

        if (request("name")) {
            $query->where('name', 'like', '%' . request("name") . '%');
        }

        if (request("sort_field") === 'created_at') {
            $query->orderBy('created_at', request("sort_direction", 'desc'));
        }
                
        $users = $query->orderBy($sortFields, $sortDirection)->paginate(10);

        return inertia('Users/Index', [
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Création d'un nouvel utilisateur
        $data = $request->validated();

        // Ajout des informations utilisateur
        $data['created_by'] = Auth::id();

        // Enregistrement de l'utilisateur
        User::create($data);

        return redirect()->route('user.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
