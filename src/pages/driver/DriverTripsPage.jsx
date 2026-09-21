
import { useCallback, useEffect, useState } from "react";

import {
  FaAmbulance,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaPlay,
  FaUser,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FormatDate from "../../components/common/FormatDate";

const DriverTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =========================================================
  // FETCH DRIVER TRIPS
  // =========================================================

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiCall("/api/driver/assigned-bookings");

      const allTrips = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
          ? data.bookings
          : [];

      const activeTrips = allTrips.filter(
        (trip) =>
          trip.status === "assigned" || trip.status === "en_route",
      );

      setTrips(activeTrips);
    } catch (error) {
      console.error("Trips error:", error);

      toast.error(
        error?.message || "Trips could not be loaded",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // LOAD TRIPS
  // =========================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTrips();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchTrips]);

  // =========================================================
  // UPDATE TRIP STATUS
  // =========================================================

  const updateTripStatus = async (tripId, newStatus) => {
    try {
      setUpdatingId(tripId);

      await apiCall(
        `/api/driver/bookings/${tripId}/update-status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      toast.success(
        newStatus === "en_route"
          ? "Trip started successfully"
          : "Trip completed successfully",
      );

      await fetchTrips();
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error?.message || "Could not update trip status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <LoadingSpinner
          size="lg"
          text="Trips loading..."
        />
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="w-full space-y-5 p-3 sm:p-4 md:space-y-6 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          My Trips
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          Manage your assigned ambulance trips
        </p>
      </div>

      {/* =====================================================
          TRIPS
      ===================================================== */}

      {trips.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              updating={updatingId === trip.id}
              onStart={() =>
                updateTripStatus(trip.id, "en_route")
              }
              onComplete={() =>
                updateTripStatus(trip.id, "completed")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =========================================================
// TRIP CARD
// =========================================================

const TripCard = ({
  trip,
  updating,
  onStart,
  onComplete,
}) => {
  const ambulanceNumber =
    trip.ambulance?.registration_number ||
    trip.ambulance_number ||
    "N/A";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* =====================================================
          CARD HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 px-3 py-3 sm:px-4">
        {/* BOOKING */}

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/50">
            Booking ID
          </p>

          <h2 className="mt-0.5 truncate text-sm font-bold sm:text-base">
            #{trip.id || "N/A"}
          </h2>

          <p className="mt-1 text-[11px] text-base-content/50 sm:text-xs">
             <FormatDate date={trip.booking_time} />
          </p>
        </div>

        {/* STATUS */}

        <div className="shrink-0">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      {/* =====================================================
          CARD BODY
      ===================================================== */}

      <div className="space-y-4 p-3 sm:p-4 md:p-5">
        {/* ===================================================
            PATIENT
        =================================================== */}

        <div className="flex items-start gap-3">
          <InfoIcon>
            <FaUser />
          </InfoIcon>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-base-content/50">
              Patient
            </p>

            <p className="mt-0.5 wrap-break-word text-sm font-semibold sm:text-base">
              {trip.patient_name || "N/A"}
            </p>

            {trip.patient_phone ? (
              <a
                href={`tel:${trip.patient_phone}`}
                className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-primary hover:underline sm:text-sm"
              >
                <FaPhone className="shrink-0 text-[10px] sm:text-xs" />

                <span className="break-all">
                  {trip.patient_phone}
                </span>
              </a>
            ) : (
              <p className="mt-1 text-xs text-base-content/40">
                Phone not available
              </p>
            )}
          </div>
        </div>

        {/* ===================================================
            PICKUP
        =================================================== */}

        <AddressRow
          type="pickup"
          title="Pickup Address"
          address={trip.pickup_address}
        />

        {/* ===================================================
            DROP-OFF
        =================================================== */}

        <AddressRow
          type="dropoff"
          title="Drop-off Address"
          address={trip.dropoff_address}
        />

        {/* ===================================================
            AMBULANCE
        =================================================== */}

        <div className="flex items-start gap-3 rounded-lg bg-base-200/70 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FaAmbulance />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-base-content/50">
              Ambulance
            </p>

            <p className="mt-0.5 wrap-break-word text-sm font-semibold">
              {ambulanceNumber}
            </p>

            {trip.ambulance_type && (
              <p className="mt-0.5 text-xs text-base-content/50">
                {trip.ambulance_type}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          ACTION
      ===================================================== */}

      <div className="border-t border-base-200 p-3 sm:p-4">
        <TripAction
          trip={trip}
          updating={updating}
          onStart={onStart}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

// =========================================================
// INFO ICON
// =========================================================

const InfoIcon = ({ children }) => {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm text-primary">
      {children}
    </div>
  );
};

// =========================================================
// ADDRESS ROW
// =========================================================

const AddressRow = ({
  title,
  address,
  type,
}) => {
  const isPickup = type === "pickup";

  return (
    <div className="flex items-start gap-3">
      {/* ICON */}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isPickup
            ? "bg-success/10 text-success"
            : "bg-error/10 text-error"
        }`}
      >
        <FaMapMarkerAlt />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-base-content/50">
          {title}
        </p>

        <p className="mt-0.5 wrap-break-word text-sm font-medium leading-5">
          {address || "Address not available"}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// TRIP ACTION
// =========================================================

const TripAction = ({
  trip,
  updating,
  onStart,
  onComplete,
}) => {
  // =======================================================
  // ASSIGNED
  // =======================================================

  if (trip.status === "assigned") {
    return (
      <button
        type="button"
        className="btn btn-primary min-h-11 w-full gap-2 text-sm"
        onClick={onStart}
        disabled={updating}
      >
        {updating ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <FaPlay />
        )}

        {updating
          ? "Starting Trip..."
          : "Start Trip"}
      </button>
    );
  }

  // =======================================================
  // EN ROUTE
  // =======================================================

  if (trip.status === "en_route") {
    return (
      <button
        type="button"
        className="btn btn-success min-h-11 w-full gap-2 text-sm"
        onClick={onComplete}
        disabled={updating}
      >
        {updating ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <FaCheckCircle />
        )}

        {updating
          ? "Completing Trip..."
          : "Complete Trip"}
      </button>
    );
  }

  return null;
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = () => {
  return (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center sm:py-16">
      <FaClock className="mx-auto mb-4 text-4xl text-base-content/20" />

      <h3 className="font-semibold">
        No active trips
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-base-content/50">
        You don't have any assigned trips right now.
      </p>
    </div>
  );
};


export default DriverTripsPage;
