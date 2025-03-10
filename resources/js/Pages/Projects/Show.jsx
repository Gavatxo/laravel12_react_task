import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ project }) {
    return (
        <AuthenticatedLayout
        header={
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {project.name}
          </h2>
        }
        >
        <Head title={project.name} />
        <pre>{JSON.stringify(project)}</pre>
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              
            </div>
          </div>
      </div>
        </AuthenticatedLayout>
    );