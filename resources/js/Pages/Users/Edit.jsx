import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function Edit({ user }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object for update
    const submitData = new FormData();
    submitData.append("_method", "PUT");

    // Add basic user data
    if (formData.name) submitData.append("name", formData.name);
    if (formData.email) submitData.append("email", formData.email);

    // Only include password if it was entered
    if (formData.password) {
      submitData.append("password", formData.password);
      submitData.append(
        "password_confirmation",
        formData.password_confirmation
      );
    }

    router.post(route("user.update", user.id), submitData, {
      forceFormData: true,
      onSuccess: () => {
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
            Edit User
            <div className="text-base font-normal text-gray-500">
              {user?.name}
            </div>
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
      <Head title="Edit User" />
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

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Leave password fields empty if you don't want to change the
                  password.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="New password"
                        className={
                          errors.password ? "border-red-500 pr-10" : "pr-10"
                        }
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
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
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
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Link
                  href={route("user.index")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Update User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
