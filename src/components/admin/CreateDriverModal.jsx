import { useState } from "react";
import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

const DriverForm = ({ isOpen, onClose, onSuccess, driver = null }) => {
  const [formData, setFormData] = useState(() =>
    driver
      ? {
          username: driver.username || "",
          email: driver.email || "",
          full_name: driver.full_name || "",
          phone: driver.phone || "",
          license_number: driver.license_number || "",
          license_expiry: driver.license_expiry
            ? driver.license_expiry.split("T")[0]
            : "",
        }
      : {
          username: "",
          email: "",
          full_name: "",
          phone: "",
          license_number: "",
          license_expiry: "",
        },
  );

  const [loading, setLoading] = useState(false);

  // -----------------------------------------------------
  // Handle input change
  // -----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------------------
  // Submit
  // -----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------
    if (!formData.username.trim()) {
      toast.error("Username দিন");
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error("Driver name দিন");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email দিন");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number দিন");
      return;
    }

    if (!formData.license_number.trim()) {
      toast.error("License number দিন");
      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // Prepare payload
      // -------------------------------------------------

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        license_number: formData.license_number.trim(),

        license_expiry: formData.license_expiry
          ? `${formData.license_expiry}T00:00:00`
          : null,
      };

      // -------------------------------------------------
      // URL + Method
      // -------------------------------------------------

      const url = driver
        ? `/api/admin/drivers/${driver.id}`
        : "/api/admin/drivers";

      const method = driver ? "PUT" : "POST";

      // -------------------------------------------------
      // API call
      // -------------------------------------------------

      const response = await apiCall(url, {
        method,
        body: JSON.stringify(payload),
      });

      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      toast.success(
        driver
          ? "Driver successfully updated!"
          : "Driver successfully created!",
      );

      // If backend returns temporary password
      if (!driver && response?.temporary_password) {
        toast.success(`Temporary password: ${response.temporary_password}`, {
          duration: 6000,
        });
      }

      onSuccess?.(response);
      onClose();
    } catch (error) {
      console.error("Driver save error:", error);

      toast.error(error?.message || "Driver save করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // Don't render when closed
  // -----------------------------------------------------

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-base-100 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {driver ? "Edit Driver" : "Create Driver"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Userame */}
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Driver username"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Driver full name"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="driver@example.com"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* License Number */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              License Number
            </label>

            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              placeholder="Driver license number"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* License Expiry */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              License Expiry
            </label>

            <input
              type="date"
              name="license_expiry"
              value={formData.license_expiry}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          {/* Temporary Password Notice */}
          {!driver && (
            <div className="rounded-lg bg-base-200 p-3 text-sm">
              <p className="font-medium">Temporary password</p>

              <p className="mt-1 opacity-70">
                The driver will receive the temporary password
                <span className="font-semibold"> driver123</span> and should
                change it after login.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : driver
                  ? "Update Driver"
                  : "Create Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateDriverModal = ({ isOpen, onClose, onCreated, driver = null }) => (
  <DriverForm
    isOpen={isOpen}
    onClose={onClose}
    onSuccess={onCreated}
    driver={driver}
    key={`${isOpen}-${driver?.id ?? "new"}`}
  />
);

export default CreateDriverModal;
