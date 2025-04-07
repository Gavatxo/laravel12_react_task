import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import TaskTable from "../Tasks/TaskTable";
import { Link } from "@inertiajs/react";

const getStatusBadge = (status) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
          Completed
        </Badge>
      );
    case "in_progress":
      return <Badge variant="secondary">In Progress</Badge>;
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        >
          Pending
        </Badge>
      );
    case "canceled":
      return <Badge variant="destructive">Canceled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Show({ project, tasks, queryParams }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Project Details
        </h2>
      }
    >
      <Head title={project.name} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {/* Hero section with image */}
            <div className="relative h-64 bg-gray-200">
              <img
                src={project.image_path}
                alt={project.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/1200x400.png/f0f0f0?text=Project+Image";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl font-bold text-white">
                  {project.name}
                </h1>
                <div className="mt-2">{getStatusBadge(project.status)}</div>
              </div>
            </div>

            {/* Project details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left section - Project metadata */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Project Info</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Project ID</p>
                        <p className="font-medium">{project.id}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="mt-1">
                          {getStatusBadge(project.status)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-medium">{project.due_date}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="font-medium">{project.created_at}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Team</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Created By</p>
                        <div className="flex items-center mt-1">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {project.created_by.name.charAt(0)}
                          </div>
                          <span className="ml-2 font-medium">
                            {project.created_by.name}
                          </span>
                        </div>
                      </div>

                      {project.updated_by && (
                        <div>
                          <p className="text-sm text-gray-500">Updated By</p>
                          <div className="flex items-center mt-1">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                              {project.updated_by.name.charAt(0)}
                            </div>
                            <span className="ml-2 font-medium">
                              {project.updated_by.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section - Description and content */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {/* You can add more content blocks here */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Tasks</h3>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Add Task
                      </button>
                    </div>

                    {tasks ? (
                      <TaskTable
                        tasks={tasks}
                        projectId={project.id}
                        queryParams={queryParams}
                      />
                    ) : (
                      <p className="text-gray-500 italic p-4 text-center">
                        No tasks available for this project.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-end space-x-4">
                <Link
                  href={route("project.index")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Back to Projects
                </Link>
                <Link
                  href={route("project.edit", project.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
