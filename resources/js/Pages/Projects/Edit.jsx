import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, ImageIcon, X } from "lucide-react";

export default function Create({ project }) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description,
    due_date: project?.due_date,
    status: project?.status,
    image: project?.image_path,
    image_path: project?.image_path,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(project?.image_path || null);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({
      ...prev,
      due_date: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object for file upload
    const submitData = new FormData();

    submitData.append("_method", "PUT");

    // Gérer chaque champ individuellement pour éviter d'ajouter image incorrectement
    if (formData.name) submitData.append("name", formData.name);
    if (formData.description !== null)
      submitData.append("description", formData.description);
    if (formData.status) submitData.append("status", formData.status);

    // Traitement spécial pour la date
    if (formData.due_date) {
      if (formData.due_date instanceof Date) {
        submitData.append("due_date", format(formData.due_date, "yyyy-MM-dd"));
      } else {
        submitData.append("due_date", formData.due_date);
      }
    }

    // Traitement spécial pour l'image
    if (formData.image instanceof File) {
      // Si c'est un objet File (nouvelle image), l'ajouter au FormData
      submitData.append("image", formData.image);
    }
    // Si l'image a été supprimée, vous pouvez ajouter un indicateur
    else if (formData.image === null && project.image_path) {
      submitData.append("remove_image", true);
    }
    // NE PAS ajouter le champ image si ce n'est pas un fichier

    router.post(route("project.update", project.id), submitData, {
      forceFormData: true,
      onSuccess: () => {
        router.visit(route("project.index"));
      },
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Edit Project
            <h2 className="font-weight-normal text-gray-500">
              {project?.name}
            </h2>
          </h2>
          <Link
            href={route("project.index")}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      }
    >
      <Head title="Edit Project" />
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  className={errors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={
                          imagePreview || "/images/default-project-image.png"
                        }
                        alt="Preview"
                        className="object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-5"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Select Image
                    </Button>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="due_date">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="due_date"
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !formData.due_date && "text-gray-400"
                        } ${errors.due_date ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.due_date ? (
                          format(formData.due_date, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.due_date}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.due_date && (
                    <p className="text-sm text-red-500">{errors.due_date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className={errors.status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    router.get(route("project.index"));
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Validate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
