import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiCall } from "../../services/api";

const CreateAmbulanceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    registration_number: "",
    ambulance_type: "Basic",
    status: "available",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registration_number.trim()) {
      toast.error("Registration number দিন");
      return;
    }

    if (!formData.ambulance_type) {
      toast.error("Ambulance type নির্বাচন করুন");
      return;
    }

    try {
      setLoading(true);

      const data = await apiCall("/api/admin/ambulances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Ambulance created:", data);

      toast.success("Ambulance successfully created!");

      setFormData({
        registration_number: "",
        ambulance_type: "Basic",
        status: "available",
      });

      onSuccess?.(data);
      onClose();
    } catch (error) {
      console.error("Create ambulance error:", error);

      toast.error(error?.message || "Ambulance তৈরি করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-base-100 p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Ambulance</h2>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            onClickCapture={() => {}}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Registration Number</span>
            </label>

            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="ঢাকা-মেট্রো-১২-৩৪৫৬"
              className="input input-bordered w-full"
              disabled={loading}
              required
            />
          </div>

          {/* Ambulance Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ambulance Type</span>
            </label>

            <select
              name="ambulance_type"
              value={formData.ambulance_type}
              onChange={handleChange}
              className="select select-bordered w-full"
              disabled={loading}
              required
            >
              <option value="Basic">Basic</option>

              <option value="Advanced">Advanced</option>

              <option value="ICU">ICU</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full"
              disabled={loading}
            >
              <option value="available">Available</option>

              <option value="busy">Busy</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
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
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Create Ambulance"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAmbulanceModal;
