import { FaAmbulance, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";

const BookingCard = ({ booking, onAssign, getStatusColor }) => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              Booking #{booking.booking_id || booking.id}
            </h2>

            <p className="text-sm text-base-content/60">
              {booking.created_at
                ? new Date(booking.created_at).toLocaleString()
                : ""}
            </p>
          </div>

          <span
            className={`badge ${getStatusColor(booking.status)} badge-lg capitalize`}
          >
            {booking.status?.replaceAll("_", " ")}
          </span>
        </div>

        <div className="divider"></div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold mb-2">Patient Information</h3>

            <p className="flex items-center gap-2">
              <FaUser className="text-base-content/50" />
              {booking.patient_name || "N/A"}
            </p>

            <p className="flex items-center gap-2 mt-2">
              <FaPhone className="text-base-content/50" />
              {booking.patient_phone || "N/A"}
            </p>
          </div>

          {/* Ambulance */}
          {booking.ambulance && (
            <div>
              <h3 className="font-semibold mb-2">Ambulance</h3>

              <p className="flex items-center gap-2">
                <FaAmbulance className="text-base-content/50" />

                {booking.ambulance.registration_number}
              </p>

              {booking.ambulance.ambulance_type && (
                <p className="mt-1">
                  <span className="font-medium">Type:</span>{" "}
                  {booking.ambulance.ambulance_type}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-error" />
              Pickup
            </h3>

            <p className="text-base-content/70">
              {booking.pickup_address || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaMapMarkerAlt className="text-success" />
              Dropoff
            </h3>

            <p className="text-base-content/70">
              {booking.dropoff_address || "N/A"}
            </p>
          </div>
        </div>

        {/* Driver */}
        {booking.driver && (
          <div className="mt-5 p-4 bg-base-200 rounded-lg">
            <h3 className="font-semibold mb-2">Driver</h3>

            <p>
              <span className="font-medium">Name:</span>{" "}
              {booking.driver.full_name}
            </p>

            {booking.driver.phone && (
              <p className="mt-1">
                <span className="font-medium">Phone:</span>{" "}
                {booking.driver.phone}
              </p>
            )}
          </div>
        )}

        {/* Assign Button */}
        {booking.status === "pending" && (
          <div className="flex justify-end mt-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onAssign(booking)}
            >
              <FaAmbulance />
              Assign Ambulance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
