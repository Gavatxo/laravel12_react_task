import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { toast, Toaster } from "react-hot-toast";

import { Pencil, Trash2 } from "lucide-react";

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

import { Head, Link, router } from "@inertiajs/react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { use, useEffect } from "react";

export default function Index({ users, queryParams = null, flash }) {
  useEffect(() => {
    if (flash && flash.success) {
      toast.success(flash.success);
    }
  }, [flash]);
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    const params = { ...queryParams };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    router.get(route("user.index"), params, {
      preserveState: true,
      preserveScroll: true,
      only: ["users"],
    });
  };

  const onKeyPress = (e, name) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("user.index"), queryParams, {
      preserveState: true,
      preserveScroll: true,
      only: ["users"],
    });
  };

  const renderSortIndicator = (field) => {
    if (queryParams.sort_field !== field) return null;

    return (
      <span className="ml-1 inline-block">
        {queryParams.sort_direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const deleteUser = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    router.delete(route("user.destroy", user.id));
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Users
          </h2>
          <Link
            href={route("user.create")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
          >
            Create User
          </Link>
        </div>
      }
    >
      <Head title="Users" />
      <Toaster position="top-center" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead onClick={(e) => sortChanged("id")}>Id</TableHead>
                    <TableHead
                      onClick={(e) => sortChanged("name")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Nom {renderSortIndicator("name")}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={(e) => sortChanged("email")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Email {renderSortIndicator("email")}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={(e) => sortChanged("created_at")}
                      className="cursor-pointer text-nowrap"
                    >
                      <div className="flex items-center">
                        Created At {renderSortIndicator("created_at")}
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>{" "}
                    {/* Ajout de l'en-tête pour les actions */}
                  </TableRow>
                </TableHeader>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead></TableHead> {/* Cellule vide pour l'ID */}
                    <TableHead>
                      <Input
                        placeholder="Search by name"
                        className="w-full"
                        onBlur={(e) =>
                          searchFieldChanged("name", e.target.value)
                        }
                        onKeyPress={(e) => {
                          onKeyPress(e, "name");
                        }}
                        defaultValue={queryParams.name}
                      />
                    </TableHead>
                    <TableHead>
                      <Input
                        placeholder="Search by email"
                        className="w-full"
                        onBlur={(e) =>
                          searchFieldChanged("email", e.target.value)
                        }
                        onKeyPress={(e) => {
                          onKeyPress(e, "email");
                        }}
                        defaultValue={queryParams.email}
                      />
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data &&
                    users.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell className="font-medium text-nowrap hover:underline">
                          <Link href={route("user.show", user.id)}>
                            {user.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600 text-nowrap">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-gray-600 text-nowrap">
                          {user.created_at}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-3 justify-end">
                            <Link
                              href={route("user.edit", user.id)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              onClick={(e) => deleteUser(user)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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
                  {users.links && users.links.prev ? (
                    <PaginationPrevious
                      as={Link}
                      href={users.links.prev}
                      preserveScroll
                      preserveState
                    />
                  ) : (
                    <PaginationPrevious disabled />
                  )}
                </PaginationItem>

                {/* Pages numérotées avec limitation */}
                {users.meta && users.meta.links && (
                  <>
                    {/* Première page toujours affichée */}
                    {users.meta.links.length > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          as={Link}
                          href={users.meta.links[1].url}
                          isActive={users.meta.links[1].active}
                          preserveScroll
                          preserveState
                        >
                          {users.meta.links[1].label}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis si la page actuelle est loin du début */}
                    {users.meta.current_page > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Pages autour de la page actuelle (page courante et une de chaque côté) */}
                    {users.meta.links
                      .filter(
                        (link) =>
                          !isNaN(parseInt(link.label)) &&
                          Math.abs(
                            parseInt(link.label) - users.meta.current_page
                          ) <= 1 &&
                          parseInt(link.label) > 1 &&
                          parseInt(link.label) < users.meta.last_page
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
                    {users.meta.current_page < users.meta.last_page - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Dernière page toujours affichée */}
                    {users.meta.links.length > 3 && (
                      <PaginationItem>
                        <PaginationLink
                          as={Link}
                          href={
                            users.meta.links[users.meta.links.length - 2].url
                          }
                          isActive={
                            users.meta.links[users.meta.links.length - 2].active
                          }
                          preserveScroll
                          preserveState
                        >
                          {users.meta.links[users.meta.links.length - 2].label}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Bouton suivant */}
                <PaginationItem>
                  {users.links && users.links.next ? (
                    <PaginationNext
                      as={Link}
                      href={users.links.next}
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
