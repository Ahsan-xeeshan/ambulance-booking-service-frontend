import { FaAmbulance, FaTimes } from "react-icons/fa";

const AssignBookingModal = ({
  booking,
  ambulances,
  drivers,
  assignData,
  setAssignData,
  onAssign,
  onClose,
}) => {
  if (!booking) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAssignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">

          <div className="flex items-center gap-3">
            <FaAmbulance className="text-2xl text-primary" />

            <h2 className="text-xl font-bold">
              Assign Booking
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}
        <div className="p-5">

          <div className="mb-5 p-4 bg-gray-50 rounded-lg">
            <p>
              <span className="font-semibold">
                Booking:
              </span>{" "}
              #{booking.booking_id}
            </p>

            <p className="mt-1">
              <span className="font-semibold">
                Patient:
              </span>{" "}
              {booking.patient_name}
            </p>
          </div>

          {/* Ambulance */}
          <div className="form-control mb-4">

            <label className="label">
              <span className="label-text font-semibold">
                Select Ambulance
              </span>
            </label>

            <select
              name="ambulance_id"
              value={assignData.ambulance_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">
                Select an ambulance
              </option>

              {ambulances
                .filter((ambulance) => ambulance.is_available)
                .map((ambulance) => (
                  <option
                    key={ambulance.id}
                    value={ambulance.id}
                  >
                    {ambulance.registration_number} -{" "}
                    {ambulance.ambulance_type}
                  </option>
                ))}
            </select>

          </div>

          {/* Driver */}
          <div className="form-control">

            <label className="label">
              <span className="label-text font-semibold">
                Select Driver
              </span>
            </label>

            <select
              name="driver_id"
              value={assignData.driver_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">
                Select a driver
              </option>

              {drivers
                .filter((driver) => driver.is_available)
                .map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.full_name} -{" "}
                    {driver.phone}
                  </option>
                ))}
            </select>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t">

          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAssign}
            disabled={
              !assignData.ambulance_id ||
              !assignData.driver_id
            }
          >
            <FaAmbulance />

            Assign
          </button>

        </div>

      </div>
    </div>
  );
};

export default AssignBookingModal;