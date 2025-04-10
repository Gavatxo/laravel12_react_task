import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Eye, EyeOff, X } from "lucide-react";

export default function Create() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    // role: "user", // Vous pouvez avoir différents rôles comme 'admin', 'user', etc.
    // image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });

    router.post(route("user.store"), submitData, {
      forceFormData: true,
      onSuccess: () => {
        // Redirect to users list on success
        router.visit(route("user.index"));
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
            New User
          </h2>
          <Link
            href={route("user.index")}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      }
    >
      <Head title="Create User" />
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter user's full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={
                        errors.password_confirmation
                          ? "border-red-500 pr-10"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="role">
                  User Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger
                    id="role"
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-full"
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
                      className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
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
              </div> */}

              <div className="flex justify-end space-x-3 pt-4">
                <Link
                  href={route("user.index")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
