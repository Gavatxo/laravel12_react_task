import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Badge } from "@/components/ui/badge";

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
      return <Badge variant="v outline">{status}</Badge>;
  }
};

import { Head, Link } from "@inertiajs/react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function Index({ projects, queryParams=null }) {

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if(value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
  }

  const onKeyPress = (e, name) => {
    if(e.key !== 'Enter') return;

    searchFieldChanged(name, e.target.value);
  }
  
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Projects
        </h2>
      }
    >
      <Head title="Projects" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé par</TableHead>
                    <TableHead className="text-nowrap">
                      Date de création
                    </TableHead>
                    <TableHead className="text-nowrap">
                      Date d'échéance
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead>
                      <Input
                        placeholder="Nom du projet"
                        className="w-full"
                        onBlur={(e) =>
                          searchFieldChanged("name", e.target.value)
                        }
                        onKeyPress={(e) => {
                          onKeyPress(e, "name");
                        }}
                      />
                    </TableHead>
                    <TableHead className="text-nowrap py-2">
                      <Select 
                      className="w-full"
                      onChange={(e) => searchFieldChanged("status", e.target.value)}>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableHead>
                    <TableHead>Créé par</TableHead>
                    <TableHead className="text-nowrap"></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.data &&
                    projects.data.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <img
                            src={project.image_path}
                            className="w-20 h-20 rounded-full"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {project.id}
                        </TableCell>
                        <TableCell className="font-medium text-nowrap">
                          {project.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {project.created_by.name}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {project.created_at}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {project.due_date}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={route("project.edit", project.id)}
                            className="text-blue-500 hover:underline mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                          >
                            Edit
                          </Link>
                          <Link
                            href={route("project.destroy", project.id)}
                            className="text-red-500 hover:underline mr-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                          >
                            Delete
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Pagination>
              <PaginationContent>
                {/* Bouton précédent */}
                <PaginationItem>
                  {projects.links && projects.links.prev ? (
                    <PaginationPrevious
                      as={Link}
                      href={projects.links.prev}
                      preserveScroll
                      preserveState
                    />
                  ) : (
                    <PaginationPrevious disabled />
                  )}
                </PaginationItem>

                {/* Pages numérotées avec limitation */}
                {projects.meta && projects.meta.links && (
                  <>
                    {/* Première page toujours affichée */}
                    {projects.meta.links.length > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          as={Link}
                          href={projects.meta.links[1].url}
                          isActive={projects.meta.links[1].active}
                          preserveScroll
                          preserveState
                        >
                          {projects.meta.links[1].label}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis si la page actuelle est loin du début */}
                    {projects.meta.current_page > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Pages autour de la page actuelle (page courante et une de chaque côté) */}
                    {projects.meta.links
                      .filter(
                        (link) =>
                          !isNaN(parseInt(link.label)) &&
                          Math.abs(
                            parseInt(link.label) - projects.meta.current_page
                          ) <= 1 &&
                          parseInt(link.label) > 1 &&
                          parseInt(link.label) < projects.meta.last_page
                      )
                      .map((link, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            as={Link}
                            href={link.url}
                            isActive={link.active}
                            preserveScroll
                            preserveState
                          >
                            {link.label}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {/* Ellipsis si la page actuelle est loin de la fin */}
                    {projects.meta.current_page <
                      projects.meta.last_page - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Dernière page toujours affichée */}
                    {projects.meta.links.length > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          as={Link}
                          href={
                            projects.meta.links[projects.meta.links.length - 2]
                              .url
                          }
                          isActive={
                            projects.meta.links[projects.meta.links.length - 2]
                              .active
                          }
                          preserveScroll
                          preserveState
                        >
                          {
                            projects.meta.links[projects.meta.links.length - 2]
                              .label
                          }
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Bouton suivant */}
                <PaginationItem>
                  {projects.links && projects.links.next ? (
                    <PaginationNext
                      as={Link}
                      href={projects.links.next}
                      preserveScroll
                      preserveState
                    />
                  ) : (
                    <PaginationNext disabled />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
