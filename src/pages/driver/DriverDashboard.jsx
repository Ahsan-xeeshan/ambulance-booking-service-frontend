import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaAmbulance,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FormatDate from "../../components/common/FormatDate";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DRIVER TRIPS
  // =========================================================

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiCall("/api/driver/assigned-bookings");

      setTrips(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.bookings)
            ? data.bookings
            : [],
      );
    } catch (error) {
      console.error("Driver dashboard error:", error);

      toast.error(error?.message || "Trip information could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTrips();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchTrips]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Driver dashboard loading..." />
      </div>
    );
  }

  // =========================================================
  // STATISTICS
  // =========================================================

  const activeTrips = trips.filter(
    (trip) => trip.status === "assigned" || trip.status === "en_route",
  );

  const assignedTrips = trips.filter((trip) => trip.status === "assigned");

  const enRouteTrips = trips.filter((trip) => trip.status === "en_route");

  const completedTrips = trips.filter((trip) => trip.status === "completed");

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          Driver Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your assigned ambulance trips
        </p>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <StatCard
          title="Active Trips"
          value={activeTrips.length}
          icon={<FaClipboardList />}
          className="text-primary"
        />

        <StatCard
          title="Assigned"
          value={assignedTrips.length}
          icon={<FaClock />}
          className="text-warning"
        />

        <StatCard
          title="En Route"
          value={enRouteTrips.length}
          icon={<FaAmbulance />}
          className="text-info"
        />

        <StatCard
          title="Completed"
          value={completedTrips.length}
          icon={<FaCheckCircle />}
          className="text-success"
        />
      </div>

      {/* =====================================================
          ASSIGNED TRIPS
      ===================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Assigned Trips
          </h2>

          <p className="text-sm text-gray-500">
            Your currently assigned ambulance trips
          </p>
        </div>

        {activeTrips.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              <AssignedTripsTable trips={activeTrips} />
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              <AssignedTripsMobile trips={activeTrips} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ title, value, icon, className = "" }) => {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-base-content/60 md:text-sm">
              {title}
            </p>

            <p className="mt-1 text-2xl font-bold md:mt-2">{value}</p>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-200 text-lg md:h-12 md:w-12 md:text-xl ${className}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DESKTOP TABLE
========================================================= */

const AssignedTripsTable = ({ trips }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Phone</th>
            <th>Pickup Address</th>
            <th>Drop-off Address</th>
            <th>Ambulance</th>
            <th>Booking Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip, index) => (
            <tr key={trip.id || trip.booking_id}>
              {/* SERIAL */}
              <td className="font-medium">{index + 1}</td>

              {/* PATIENT */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FaUser />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold">
                      {trip.patient_name || "N/A"}
                    </p>

                    <p className="text-xs text-base-content/50">
                      Booking #{trip.booking_id || trip.id || "N/A"}
                    </p>
                  </div>
                </div>
              </td>

              {/* PHONE */}
              <td>
                {trip.patient_phone ? (
                  <a
                    href={`tel:${trip.patient_phone}`}
                    className="flex items-center gap-2 whitespace-nowrap text-primary hover:underline"
                  >
                    <FaPhone className="text-xs" />
                    {trip.patient_phone}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              {/* PICKUP */}
              <td>
                <div className="flex min-w-55 items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-success" />

                  <span className="text-sm">
                    {trip.pickup_address || "N/A"}
                  </span>
                </div>
              </td>

              {/* DROP-OFF */}
              <td>
                <div className="flex min-w-55 items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-error" />

                  <span className="text-sm">
                    {trip.dropoff_address || "N/A"}
                  </span>
                </div>
              </td>

              {/* AMBULANCE */}
              <td>
                {trip.ambulance_number ? (
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <FaAmbulance className="text-primary" />

                    <div>
                      <p className="font-medium">{trip.ambulance_number}</p>

                      {trip.ambulance_type && (
                        <p className="text-xs text-base-content/50">
                          {trip.ambulance_type}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>

              {/* BOOKING TIME */}
              <td className="whitespace-nowrap">
                <FormatDate date={trip.booking_time} />
              </td>

              {/* STATUS */}
              <td>
                <Link to="/driver/trips">
                  <StatusBadge status={trip.status} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* =========================================================
   MOBILE TRIP CARDS
========================================================= */

const AssignedTripsMobile = ({ trips }) => {
  return (
    <>
      {trips.map((trip) => (
        <div
          key={trip.id || trip.booking_id}
          className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
        >
          {/* =================================================
              CARD HEADER
          ================================================= */}

          <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FaUser />
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {trip.patient_name || "N/A"}
                </p>

                <p className="mt-0.5 truncate text-xs text-base-content/50">
                  Booking #{trip.booking_id || trip.id || "N/A"}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <StatusBadge status={trip.status} />
            </div>
          </div>

          {/* =================================================
              CARD BODY
          ================================================= */}

          <div className="space-y-4 p-4">
            {/* PHONE */}
            <MobileInfoRow icon={<FaPhone />} label="Patient Phone">
              {trip.patient_phone ? (
                <a
                  href={`tel:${trip.patient_phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {trip.patient_phone}
                </a>
              ) : (
                "N/A"
              )}
            </MobileInfoRow>

            {/* PICKUP */}
            <MobileInfoRow
              icon={<FaMapMarkerAlt />}
              iconClass="text-success"
              label="Pickup Address"
            >
              {trip.pickup_address || "N/A"}
            </MobileInfoRow>

            {/* DROP-OFF */}
            <MobileInfoRow
              icon={<FaMapMarkerAlt />}
              iconClass="text-error"
              label="Drop-off Address"
            >
              {trip.dropoff_address || "N/A"}
            </MobileInfoRow>

            {/* AMBULANCE */}
            <MobileInfoRow icon={<FaAmbulance />} label="Ambulance">
              {trip.ambulance_number ? (
                <div>
                  <p className="font-medium">{trip.ambulance_number}</p>

                  {trip.ambulance_type && (
                    <p className="text-xs text-base-content/50">
                      {trip.ambulance_type}
                    </p>
                  )}
                </div>
              ) : (
                "N/A"
              )}
            </MobileInfoRow>

            {/* BOOKING TIME */}
            <MobileInfoRow icon={<FaClock />} label="Booking Time">
              <FormatDate date={trip.booking_time} />
            </MobileInfoRow>
          </div>

          {/* =================================================
              CARD FOOTER
          ================================================= */}

          <div className="border-t border-base-200 p-3">
            <Link to="/driver/trips" className="btn btn-primary btn-sm w-full">
              View Trip Details
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

/* =========================================================
   MOBILE INFO ROW
========================================================= */

const MobileInfoRow = ({
  icon,
  label,
  children,
  iconClass = "text-primary",
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-base-content/50">{label}</p>

        <div className="mt-0.5 wrap-break-word text-sm">{children}</div>
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = () => {
  return (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 py-16 text-center">
      <FaAmbulance className="mx-auto mb-4 text-4xl text-base-content/20" />

      <h3 className="font-semibold">No active trips</h3>

      <p className="mt-1 px-4 text-sm text-base-content/50">
        You don't have any assigned trips right now.
      </p>

      <Link to="/driver/completed" className="btn btn-primary btn-sm mt-5">
        View Trip History
      </Link>
    </div>
  );
};

export default DriverDashboard;
