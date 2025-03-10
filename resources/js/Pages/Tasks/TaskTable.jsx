import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskTable({ tasks, projectId, queryParams = null }) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    const params = { ...queryParams };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    router.get(route("project.show", projectId), params, {
      preserveState: true,
      preserveScroll: true,
      only: ["tasks"],
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

    router.get(route("project.show", projectId), queryParams, {
      preserveState: true,
      preserveScroll: true,
      only: ["tasks"],
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead
                onClick={() => sortChanged("id")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  ID {renderSortIndicator("id")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => sortChanged("title")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Title {renderSortIndicator("title")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => sortChanged("status")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Status {renderSortIndicator("status")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => sortChanged("due_date")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Due Date {renderSortIndicator("due_date")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => sortChanged("assigned_to")}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Assigned To {renderSortIndicator("assigned_to")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>
                <Input
                  placeholder="Task title..."
                  className="w-full"
                  onBlur={(e) => searchFieldChanged("title", e.target.value)}
                  onKeyPress={(e) => onKeyPress(e, "title")}
                  defaultValue={queryParams.title}
                />
              </TableHead>
              <TableHead className="text-nowrap py-2">
                <Select
                  className="w-full"
                  onValueChange={(value) => searchFieldChanged("status", value)}
                  defaultValue={queryParams.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.data && tasks.data.length > 0 ? (
              tasks.data.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="text-nowrap">{task.due_date}</TableCell>
                  <TableCell className="text-nowrap">
                    {task.assigned_to ? task.assigned_to.name : "Unassigned"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={route("task.edit", task.id)}
                      className="text-blue-500 hover:underline mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </Link>
                    <Link
                      href={route("task.destroy", task.id)}
                      className="text-red-500 hover:underline mr-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No tasks found for this project
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {tasks.meta && tasks.meta.links && tasks.meta.links.length > 3 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {/* Bouton précédent */}
            <PaginationItem>
              {tasks.links && tasks.links.prev ? (
                <PaginationPrevious
                  as={Link}
                  href={tasks.links.prev}
                  preserveScroll
                  preserveState
                />
              ) : (
                <PaginationPrevious disabled />
              )}
            </PaginationItem>

            {/* Pages numérotées avec limitation */}
            {tasks.meta && tasks.meta.links && (
              <>
                {/* Première page toujours affichée */}
                {tasks.meta.links.length > 3 && (
                  <PaginationItem>
                    <PaginationLink
                      as={Link}
                      href={tasks.meta.links[1].url}
                      isActive={tasks.meta.links[1].active}
                      preserveScroll
                      preserveState
                    >
                      {tasks.meta.links[1].label}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis si la page actuelle est loin du début */}
                {tasks.meta.current_page > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Pages autour de la page actuelle */}
                {tasks.meta.links
                  .filter(
                    (link) =>
                      !isNaN(parseInt(link.label)) &&
                      Math.abs(
                        parseInt(link.label) - tasks.meta.current_page
                      ) <= 1 &&
                      parseInt(link.label) > 1 &&
                      parseInt(link.label) < tasks.meta.last_page
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
                {tasks.meta.current_page < tasks.meta.last_page - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Dernière page toujours affichée */}
                {tasks.meta.links.length > 3 && (
                  <PaginationItem>
                    <PaginationLink
                      as={Link}
                      href={tasks.meta.links[tasks.meta.links.length - 2].url}
                      isActive={
                        tasks.meta.links[tasks.meta.links.length - 2].active
                      }
                      preserveScroll
                      preserveState
                    >
                      {tasks.meta.links[tasks.meta.links.length - 2].label}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </>
            )}

            {/* Bouton suivant */}
            <PaginationItem>
              {tasks.links && tasks.links.next ? (
                <PaginationNext
                  as={Link}
                  href={tasks.links.next}
                  preserveScroll
                  preserveState
                />
              ) : (
                <PaginationNext disabled />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
