import { useEffect, useMemo, useState } from "react";

import {
  FaAmbulance,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FormatDate from "../../components/common/FormatDate";

const ITEMS_PER_PAGE = 7;

const DriverCompletedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  /* =========================================================
     FETCH COMPLETED TRIPS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    apiCall("/api/driver/completed-trips")
      .then((data) => {
        if (!cancelled) {
          const completedTrips = Array.isArray(data)
            ? data
            : Array.isArray(data?.bookings)
              ? data.bookings
              : [];

          setTrips(completedTrips);
        }
      })
      .catch((error) => {
        console.error("Completed trips error:", error);

        if (!cancelled) {
          toast.error(error?.message || "Completed trips could not be loaded");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return trips;
    }

    return trips.filter((trip) => {
      const patientName = trip.patient_name || "";

      const patientPhone = trip.patient_phone || "";

      const ambulanceNumber =
        trip.ambulance?.registration_number || trip.ambulance_number || "";

      const bookingId = trip.id?.toString() || "";

      const pickupAddress = trip.pickup_address || "";

      const dropoffAddress = trip.dropoff_address || "";

      const bookingTime = trip.booking_time ? (
        <FormatDate date={trip.booking_time} />
      ) : (
        ""
      );

      const completedTime = trip.completed_time ? (
        <FormatDate date={trip.completed_time} />
      ) : (
        ""
      );

      return (
        patientName.toLowerCase().includes(query) ||
        patientPhone.toLowerCase().includes(query) ||
        ambulanceNumber.toLowerCase().includes(query) ||
        bookingId.toLowerCase().includes(query) ||
        pickupAddress.toLowerCase().includes(query) ||
        dropoffAddress.toLowerCase().includes(query) ||
        bookingTime.toLowerCase().includes(query) ||
        completedTime.toLowerCase().includes(query)
      );
    });
  }, [trips, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalTrips = filteredTrips.length;

  const totalPages = Math.ceil(totalTrips / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentTrips = filteredTrips.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <LoadingSpinner size="lg" text="Completed trips loading..." />
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="w-full space-y-5 p-3 sm:p-4 md:space-y-6 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-success/10 p-3 text-success">
          <FaCheckCircle className="text-xl" />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            Completed Trips
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Your completed ambulance trips
          </p>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="stats w-full border border-base-300 bg-base-100 shadow-sm">
        <div className="stat px-4 py-4 sm:px-6">
          <div className="stat-title text-xs sm:text-sm">
            Total Completed Trips
          </div>

          <div className="stat-value text-3xl text-success sm:text-4xl">
            {trips.length}
          </div>

          <div className="stat-desc text-xs sm:text-sm">
            {search
              ? `${totalTrips} matching trip${totalTrips !== 1 ? "s" : ""}`
              : totalTrips > 0
                ? `Showing ${startIndex + 1}-${Math.min(
                    endIndex,
                    totalTrips,
                  )} of ${totalTrips}`
                : "No completed trips"}
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm sm:p-4">
        <div className="form-control">
          <label className="mb-2 text-sm font-medium">
            Search Completed Trips
          </label>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-base-content/40 sm:left-4" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search patient, phone, ambulance..."
              className="input input-bordered w-full pl-10 pr-11 text-sm sm:pl-11"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-circle btn-ghost btn-sm absolute right-1.5 top-1/2 -translate-y-1/2 sm:right-2"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-base-content/50">
            Search by patient name, phone, ambulance number, booking ID, address
            or date.
          </p>
        </div>
      </div>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      {totalTrips === 0 ? (
        search ? (
          <NoSearchResults search={search} onClear={clearSearch} />
        ) : (
          <EmptyState />
        )
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* HEAD */}

                <thead>
                  <tr className="bg-base-200">
                    <th>#</th>
                    <th>Booking</th>
                    <th>Patient</th>
                    <th>Pickup</th>
                    <th>Drop-off</th>
                    <th>Ambulance</th>
                    <th>Booking Time</th>
                    <th>Completed</th>
                    <th>Status</th>
                  </tr>
                </thead>

                {/* BODY */}

                <tbody>
                  {currentTrips.map((trip, index) => (
                    <CompletedTripRow
                      key={trip.id}
                      trip={trip}
                      index={startIndex + index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="space-y-4 md:hidden">
            {currentTrips.map((trip, index) => (
              <CompletedTripCard
                key={trip.id}
                trip={trip}
                index={startIndex + index}
              />
            ))}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalTrips={totalTrips}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
        </>
      )}
    </div>
  );
};

/* =========================================================
   MOBILE COMPLETED TRIP CARD
========================================================= */

const CompletedTripCard = ({ trip, index }) => {
  const ambulanceNumber =
    trip.ambulance?.registration_number || trip.ambulance_number || "N/A";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      {/* =====================================================
          CARD HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 px-3 py-3 sm:px-4">
        {/* BOOKING */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-base-content/50">
              #{index + 1}
            </span>

            <span className="text-base-content/30">•</span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-base-content/50">
              Booking
            </span>
          </div>

          <h2 className="mt-0.5 truncate text-sm font-bold sm:text-base">
            #{trip.id || "N/A"}
          </h2>
        </div>

        {/* STATUS */}

        <div className="shrink-0">
          <StatusBadge status="completed" />
        </div>
      </div>

      {/* =====================================================
          CARD BODY
      ===================================================== */}

      <div className="space-y-4 p-3 sm:p-4">
        {/* ===================================================
            PATIENT
        =================================================== */}

        <MobileInfoRow
          icon={<FaCheckCircle />}
          label="Patient"
          iconClass="text-success"
        >
          <p className="wrap-break-word font-semibold">
            {trip.patient_name || "N/A"}
          </p>

          {trip.patient_phone ? (
            <a
              href={`tel:${trip.patient_phone}`}
              className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs text-primary hover:underline sm:text-sm"
            >
              <FaPhone className="shrink-0 text-[10px]" />

              <span className="break-all">{trip.patient_phone}</span>
            </a>
          ) : (
            <p className="mt-1 text-xs text-base-content/40">
              Phone not available
            </p>
          )}
        </MobileInfoRow>

        {/* ===================================================
            PICKUP
        =================================================== */}

        <MobileInfoRow
          icon={<FaMapMarkerAlt />}
          label="Pickup Address"
          iconClass="text-success"
        >
          {trip.pickup_address || "Address not available"}
        </MobileInfoRow>

        {/* ===================================================
            DROP-OFF
        =================================================== */}

        <MobileInfoRow
          icon={<FaMapMarkerAlt />}
          label="Drop-off Address"
          iconClass="text-error"
        >
          {trip.dropoff_address || "Address not available"}
        </MobileInfoRow>

        {/* ===================================================
            AMBULANCE
        =================================================== */}

        <MobileInfoRow icon={<FaAmbulance />} label="Ambulance">
          <p className="wrap-break-word font-semibold">{ambulanceNumber}</p>

          {trip.ambulance_type && (
            <p className="mt-0.5 text-xs text-base-content/50">
              {trip.ambulance_type}
            </p>
          )}
        </MobileInfoRow>

        {/* ===================================================
            BOOKING TIME
        =================================================== */}

        <MobileInfoRow icon={<FaCalendarAlt />} label="Booking Time">
          <FormatDate date={trip.booking_time} />
        </MobileInfoRow>

        {/* ===================================================
            COMPLETED TIME
        =================================================== */}

        <MobileInfoRow
          icon={<FaCheckCircle />}
          label="Completed Time"
          iconClass="text-success"
        >
          {trip.completed_time ? (
            <FormatDate date={trip.completed_time} />
          ) : (
            "N/A"
          )}
        </MobileInfoRow>
      </div>
    </div>
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
      {/* ICON */}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 ${iconClass}`}
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-base-content/50">{label}</p>

        <div className="mt-0.5 wrap-break-word text-sm leading-5">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DESKTOP TABLE ROW
========================================================= */

const CompletedTripRow = ({ trip, index }) => {
  return (
    <tr>
      {/* SERIAL */}

      <td>
        <span className="font-medium text-base-content/60">{index + 1}</span>
      </td>

      {/* BOOKING */}

      <td>
        <div>
          <p className="font-semibold">#{trip.id}</p>

          <p className="text-xs text-base-content/50">Booking</p>
        </div>
      </td>

      {/* PATIENT */}

      <td>
        <div className="min-w-37.5">
          <p className="font-medium">{trip.patient_name || "N/A"}</p>

          {trip.patient_phone && (
            <a
              href={`tel:${trip.patient_phone}`}
              className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <FaPhone />

              {trip.patient_phone}
            </a>
          )}
        </div>
      </td>

      {/* PICKUP */}

      <td>
        <div className="max-w-55">
          <p className="truncate text-sm" title={trip.pickup_address}>
            {trip.pickup_address || "N/A"}
          </p>
        </div>
      </td>

      {/* DROP-OFF */}

      <td>
        <div className="max-w-55">
          <p className="truncate text-sm" title={trip.dropoff_address}>
            {trip.dropoff_address || "N/A"}
          </p>
        </div>
      </td>

      {/* AMBULANCE */}

      <td>
        <div className="flex min-w-35 items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <FaAmbulance />
          </div>

          <span className="font-medium">
            {trip.ambulance?.registration_number ||
              trip.ambulance_number ||
              "N/A"}
          </span>
        </div>
      </td>

      {/* BOOKING TIME */}

      <td>
        <div className="min-w-37.5">
          <p className="text-sm">
            {" "}
            <FormatDate date={trip.booking_time} />
          </p>
        </div>
      </td>

      {/* COMPLETED TIME */}

      <td>
        <div className="min-w-37.5">
          {trip.completed_time ? (
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-success" />

              <span className="text-sm">
                {" "}
                <FormatDate date={trip.completed_time} />
              </span>
            </div>
          ) : (
            <span className="text-base-content/40">N/A</span>
          )}
        </div>
      </td>

      {/* STATUS */}

      <td>
        <StatusBadge status="completed" />
      </td>
    </tr>
  );
};

/* =========================================================
   PAGINATION
========================================================= */

const Pagination = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalTrips,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-3 sm:gap-4 sm:p-4 md:flex-row md:items-center md:justify-between">
      {/* SHOWING */}

      <div className="text-center text-xs text-base-content/60 sm:text-sm md:text-left">
        Showing{" "}
        <span className="font-semibold text-base-content">
          {startIndex + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-base-content">
          {Math.min(endIndex, totalTrips)}
        </span>{" "}
        of <span className="font-semibold text-base-content">{totalTrips}</span>{" "}
        trips
      </div>

      {/* PAGINATION */}

      <div className="flex justify-center">
        <div className="join">
          <button
            type="button"
            className="btn btn-outline btn-sm join-item sm:btn-md"
            onClick={onPrevious}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />

            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm join-item no-animation sm:btn-md"
          >
            {currentPage} / {totalPages}
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm join-item sm:btn-md"
            onClick={onNext}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Next</span>

            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = () => {
  return (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center sm:py-16">
      <FaCheckCircle className="mx-auto mb-4 text-4xl text-base-content/20" />

      <h3 className="font-semibold">No completed trips</h3>

      <p className="mt-1 text-sm text-base-content/50">
        Your completed trips will appear here.
      </p>
    </div>
  );
};

/* =========================================================
   NO SEARCH RESULTS
========================================================= */

const NoSearchResults = ({ search, onClear }) => {
  return (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center sm:py-16">
      <FaSearch className="mx-auto mb-4 text-4xl text-base-content/20" />

      <h3 className="font-semibold">No matching trips found</h3>

      <p className="mt-1 text-sm text-base-content/50">
        No completed trip matches{" "}
        <span className="font-medium text-base-content">"{search}"</span>
      </p>

      <button
        type="button"
        onClick={onClear}
        className="btn btn-primary btn-sm mt-4"
      >
        Clear Search
      </button>
    </div>
  );
};

export default DriverCompletedTrips;
