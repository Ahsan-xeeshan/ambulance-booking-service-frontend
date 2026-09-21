import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { FaAmbulance } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { AuthContext } from "../../context";
import { apiCall } from "../../services/api";

const UserNewBooking = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_name: "",
    patient_phone: "",
    pickup_address: user?.address || "",
    dropoff_address: "",
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

    setLoading(true);

    try {
      await apiCall("/api/bookings", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Booking created successfully!");

      setFormData({
        patient_name: "",
        patient_phone: "",
        pickup_address: user?.address || "",
        dropoff_address: "",
      });

      navigate("/user/my-bookings");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* Header */}
      <div className="mb-6 mt-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge badge-primary badge-outline mb-2">
              Booking Ambulance
            </div>

            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              Book an Ambulance
            </h1>

            <p className="mt-1 text-sm text-gray-400 sm:text-base">
              Fill in the patient and pickup details to request an ambulance.
            </p>
          </div>
         
        </div>
      </div>

      {/* Booking Form */}
      <div className="card bg-white shadow-md">
        <div className="card-body">

          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl text-primary">
              <FaAmbulance />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-500">
                New Ambulance Booking
              </h2>

              <p className="text-sm text-gray-500">
                Enter the required information below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Patient Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Patient Name
                </span>
              </label>

              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Patient Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Patient Phone
                </span>
              </label>

              <input
                type="tel"
                name="patient_phone"
                value={formData.patient_phone}
                onChange={handleChange}
                placeholder="Enter patient phone number"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Pickup Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Pickup Address
                </span>
              </label>

              <textarea
                name="pickup_address"
                value={formData.pickup_address}
                onChange={handleChange}
                placeholder="Enter pickup address"
                className="textarea textarea-bordered w-full"
                rows="3"
                required
              />
            </div>

            {/* Dropoff Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Dropoff Address
                </span>
              </label>

              <textarea
                name="dropoff_address"
                value={formData.dropoff_address}
                onChange={handleChange}
                placeholder="Enter hospital or destination address"
                className="textarea textarea-bordered w-full"
                rows="3"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="btn btn-outline btn-secondary"
                onClick={() => navigate("/user/my-bookings")}
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
                    <span className="loading loading-spinner loading-sm"></span>
                    Booking...
                  </>
                ) : (
                  <>
                    <FaAmbulance />
                    Book Ambulance
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UserNewBooking;