<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Resources\TaskResource;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();

        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where('name', 'like', '%' . request("name") . '%');
        }
        if (request("status")) {
            $query->where('status', request("status"));
        }

        
        $projects = $query->orderBy($sortFields, $sortDirection)->paginate(10);

        return inertia('Projects/Index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
         // Création d'un nouveau projet
         $data = $request->validated();
    
         // Ajout des informations utilisateur
         $data['created_by'] = Auth::id();
         $data['updated_by'] = Auth::id();
         
         // Traitement de l'image si elle existe
         if ($request->hasFile('image')) {
             // On stocke dans un dossier organisé par année/mois 
             $path = $request->file('image')->store('projects', 'public');
             $data['image_path'] = $path;
         }


    
    // Enregistrement du projet
    Project::create($data);
    
    // Redirection avec message de succès
    return redirect()->route('project.index')
        ->with('success', 'Project created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $tasksQuery = $project->tasks()->with(['assignedUser']);
    
        // Filtres
        if (request("title")) {
            $tasksQuery->where('title', 'like', '%' . request("title") . '%');
        }
        if (request("status")) {
            $tasksQuery->where('status', request("status"));
        }
        
        // Tri
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');
        $tasksQuery->orderBy($sortField, $sortDirection);
        
        // Pagination
        $tasks = $tasksQuery->paginate(5);
        
        return inertia('Projects/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return inertia('Projects/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name;
        $project->delete();

        return to_route('project.index')
            ->with('success', 'Project \''.$name.'\' deleted successfully.');
    }
}
