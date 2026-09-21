import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSyncAlt,
  FaUserTie,
  FaPhone,
  FaIdCard,
  FaAmbulance,
  FaRoute,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import CreateDriverModal from "../../components/admin/CreateDriverModal";
import FormatDate from "../../components/common/FormatDate";

// =========================================================
// DRIVER TRIP STATUS BADGE
// =========================================================

const DriverTripStatus = ({ driver }) => {
  if (!driver.on_trip) {
    return (
      <span className="badge badge-success gap-1">
        <FaCheckCircle />
        Available
      </span>
    );
  }

  if (driver.trip_status === "assigned") {
    return (
      <span className="badge badge-info gap-1">
        <FaAmbulance />
        Assigned
      </span>
    );
  }

  if (driver.trip_status === "en_route") {
    return (
      <span className="badge badge-warning gap-1">
        <FaRoute />
        En Route
      </span>
    );
  }

  return <span className="badge badge-ghost">Unknown</span>;
};

// =========================================================
// ACCOUNT STATUS BADGE
// =========================================================

const AccountStatus = ({ isActive }) => {
  const active = isActive === true || isActive === 1;

  return active ? (
    <span className="badge badge-success badge-outline">Active</span>
  ) : (
    <span className="badge badge-error badge-outline">Inactive</span>
  );
};

// =========================================================
// BOOKING STATUS BADGE
// =========================================================

const BookingStatusBadge = ({ status }) => {
  switch (status) {
    case "pending":
      return <span className="badge badge-warning">Pending</span>;

    case "assigned":
      return <span className="badge badge-info">Assigned</span>;

    case "en_route":
      return <span className="badge badge-primary">En Route</span>;

    case "completed":
      return <span className="badge badge-success">Completed</span>;

    case "cancelled":
      return <span className="badge badge-error">Cancelled</span>;

    default:
      return <span className="badge badge-ghost">{status || "N/A"}</span>;
  }
};

// =========================================================
// ADMIN DRIVERS
// =========================================================

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Booking details modal
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);

  // all | available | assigned | en_route
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================================================
  // FETCH DRIVERS
  // =========================================================

  const fetchDrivers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await apiCall("/api/admin/drivers");

      setDrivers(Array.isArray(data) ? data : data?.drivers || []);
    } catch (error) {
      console.error("Drivers error:", error);

      toast.error(error?.message || "Drivers লোড করা যায়নি");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // FETCH SINGLE BOOKING
  // =========================================================

  const handleBookingClick = async (bookingId) => {
    if (!bookingId) {
      toast.error("Booking ID পাওয়া যায়নি");
      return;
    }

    try {
      setBookingLoading(true);
      setSelectedBooking(null);
      setShowBookingModal(true);

      const data = await apiCall(`/api/admin/bookings/${bookingId}`);

      setSelectedBooking(data);
    } catch (error) {
      console.error("Booking details error:", error);

      toast.error(error?.message || "Booking details লোড করা যায়নি");

      setShowBookingModal(false);
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================================================
  // CLOSE BOOKING MODAL
  // =========================================================

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDrivers();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // =========================================================
  // DRIVER CREATED
  // =========================================================

 const handleCreated = async (newDriver) => {
  setShowCreateModal(false);

  // Immediately add the newly created driver to the table
  if (newDriver && newDriver.id) {
    setDrivers((prev) => {
      const exists = prev.some((driver) => driver.id === newDriver.id);

      if (exists) {
        return prev;
      }

      return [newDriver, ...prev];
    });
  }

  // Sync with backend
  await fetchDrivers(true);
};
  // =========================================================
  // DRIVER FILTER
  // =========================================================

  const filteredDrivers = useMemo(() => {
    if (statusFilter === "all") {
      return drivers;
    }

    if (statusFilter === "available") {
      return drivers.filter((driver) => driver.on_trip === false);
    }

    if (statusFilter === "assigned") {
      return drivers.filter((driver) => driver.trip_status === "assigned");
    }

    if (statusFilter === "en_route") {
      return drivers.filter((driver) => driver.trip_status === "en_route");
    }

    return drivers;
  }, [drivers, statusFilter]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalDrivers = drivers.length;

  const activeDrivers = drivers.filter(
    (driver) => driver.is_active === true || driver.is_active === 1,
  ).length;

  const availableDrivers = drivers.filter(
    (driver) => driver.on_trip === false,
  ).length;

  const assignedDrivers = drivers.filter(
    (driver) => driver.trip_status === "assigned",
  ).length;

  const enRouteDrivers = drivers.filter(
    (driver) => driver.trip_status === "en_route",
  ).length;

  // =========================================================
  // FORMAT LICENSE EXPIRY
  // =========================================================

  const formatLicenseExpiry = (date) => {
    if (!date) {
      return null;
    }

    try {
      return new Date(date).toLocaleDateString("en-GB").replaceAll("/", "-");
    } catch {
      return null;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Drivers লোড হচ্ছে..." />
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full space-y-6 overflow-hidden p-4 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}

        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-secondary/10 p-3 text-secondary">
            <FaUserTie className="text-xl" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-primary">Drivers</h1>

            <p className="text-sm text-gray-500">
              Manage ambulance drivers and their trips
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {/* Refresh */}

          <button
            type="button"
            className="btn btn-outline w-full gap-2 sm:w-auto"
            onClick={() => fetchDrivers(true)}
            disabled={refreshing}
          >
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Add Driver */}

          <button
            type="button"
            className="btn btn-primary w-full gap-2 sm:w-auto"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus />
            Add Driver
          </button>
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {/* Total */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Total Drivers</div>

          <div className="stat-value text-primary">{totalDrivers}</div>
        </div>

        {/* Active */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Active</div>

          <div className="stat-value text-success">{activeDrivers}</div>
        </div>

        {/* Available */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Available</div>

          <div className="stat-value text-success">{availableDrivers}</div>
        </div>

        {/* Assigned */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Assigned</div>

          <div className="stat-value text-info">{assignedDrivers}</div>
        </div>

        {/* En Route */}

        <div className="stat col-span-2 rounded-xl border border-base-300 bg-base-100 shadow-sm lg:col-span-1">
          <div className="stat-title">En Route</div>

          <div className="stat-value text-warning">{enRouteDrivers}</div>
        </div>
      </div>

      {/* =====================================================
          FILTER
      ====================================================== */}

      <div className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Information */}

        <div className="min-w-0">
          <h2 className="font-semibold">Driver List</h2>

          <p className="text-sm text-base-content/60">
            Showing{" "}
            <span className="font-medium text-base-content">
              {filteredDrivers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-base-content">
              {drivers.length}
            </span>{" "}
            drivers
          </p>
        </div>

        {/* Filter Buttons */}

        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
          {/* All */}

          <button
            type="button"
            className={`btn flex-1 sm:flex-none ${
              statusFilter === "all" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>

          {/* Available */}

          <button
            type="button"
            className={`btn flex-1 sm:flex-none ${
              statusFilter === "available" ? "btn-success" : "btn-outline"
            }`}
            onClick={() => setStatusFilter("available")}
          >
            Available
          </button>

          {/* Assigned */}

          <button
            type="button"
            className={`btn flex-1 sm:flex-none ${
              statusFilter === "assigned" ? "btn-info" : "btn-outline"
            }`}
            onClick={() => setStatusFilter("assigned")}
          >
            Assigned
          </button>

          {/* En Route */}

          <button
            type="button"
            className={`btn flex-1 sm:flex-none ${
              statusFilter === "en_route" ? "btn-warning" : "btn-outline"
            }`}
            onClick={() => setStatusFilter("en_route")}
          >
            En Route
          </button>
        </div>
      </div>

      {/* =====================================================
          NO DATA
      ====================================================== */}

      {filteredDrivers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-4 py-16 text-center">
          <FaUserTie className="mx-auto mb-4 text-4xl text-base-content/20" />

          <h3 className="font-semibold">No drivers found</h3>

          <p className="mt-1 text-sm text-base-content/50">
            No drivers match the selected filter.
          </p>

          {statusFilter !== "all" && (
            <button
              type="button"
              className="btn btn-outline mt-5"
              onClick={() => setStatusFilter("all")}
            >
              Show All Drivers
            </button>
          )}
        </div>
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
            <table className="table">
              {/* Table Head */}

              <thead>
                <tr>
                  <th>#</th>
                  <th>Driver</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Trip Status</th>
                  <th>Booking</th>
                  <th>Account</th>
                </tr>
              </thead>

              {/* Table Body */}

              <tbody>
                {filteredDrivers.map((driver, index) => (
                  <tr key={driver.id} className="hover">
                    {/* Number */}

                    <td>
                      <span className="font-medium">{index + 1}</span>
                    </td>

                    {/* Driver */}

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                          <FaUserTie className="text-lg" />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold">
                            {driver.full_name || "N/A"}
                          </div>

                          <div className="max-w-52 truncate text-xs text-base-content/50">
                            {driver.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}

                    <td>
                      {driver.phone ? (
                        <a
                          href={`tel:${driver.phone}`}
                          className="flex items-center gap-2 hover:text-primary"
                        >
                          <FaPhone className="text-xs text-primary" />

                          {driver.phone}
                        </a>
                      ) : (
                        <span className="text-base-content/40">N/A</span>
                      )}
                    </td>

                    {/* License */}

                    <td>
                      <div className="flex items-center gap-2">
                        <FaIdCard className="shrink-0 text-primary" />

                        <div className="min-w-0">
                          <div className="font-medium">
                            {driver.license_number || "N/A"}
                          </div>

                          {driver.license_expiry && (
                            <div className="text-xs text-base-content/50">
                              Exp: {formatLicenseExpiry(driver.license_expiry)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trip Status */}

                    <td>
                      <DriverTripStatus driver={driver} />
                    </td>

                    {/* Booking */}

                    <td>
                      {driver.on_trip ? (
                        <div className="flex items-center gap-2">
                          <FaAmbulance className="shrink-0 text-primary" />

                          <button
                            type="button"
                            className="link link-primary max-w-32 truncate font-medium"
                            onClick={() =>
                              handleBookingClick(driver.booking_id)
                            }
                          >
                            {driver.booking_id}
                          </button>
                        </div>
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </td>

                    {/* Account */}

                    <td>
                      <AccountStatus isActive={driver.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE CARDS
          ================================================== */}

          <div className="space-y-4 md:hidden">
            {filteredDrivers.map((driver, index) => (
              <div
                key={driver.id}
                className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
              >
                {/* =========================================
                      CARD HEADER
                  ========================================== */}

                <div className="flex items-start justify-between gap-3 border-b border-base-300 p-4">
                  {/* Driver */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <FaUserTie className="text-lg" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="wrap-break-word font-bold">
                        {driver.full_name || "N/A"}
                      </h3>

                      <p className="mt-0.5 break-all text-xs text-base-content/50">
                        {driver.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Account */}

                  <div className="shrink-0">
                    <AccountStatus isActive={driver.is_active} />
                  </div>
                </div>

                {/* =========================================
                      CARD BODY
                  ========================================== */}

                <div className="space-y-4 p-4">
                  {/* Phone */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-primary">
                      <FaPhone />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">Phone</p>

                      {driver.phone ? (
                        <a
                          href={`tel:${driver.phone}`}
                          className="mt-1 inline-flex max-w-full items-center gap-2 break-all font-medium text-primary hover:underline"
                        >
                          {driver.phone}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-base-content/40">N/A</p>
                      )}
                    </div>
                  </div>

                  {/* License */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-primary">
                      <FaIdCard />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">
                        License Number
                      </p>

                      <p className="mt-1 wrap-break-word font-medium">
                        {driver.license_number || "N/A"}
                      </p>

                      {driver.license_expiry && (
                        <p className="mt-1 text-xs text-base-content/50">
                          Expiry: {formatLicenseExpiry(driver.license_expiry)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trip Status */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-primary">
                      <FaRoute />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs text-base-content/50">
                        Trip Status
                      </p>

                      <DriverTripStatus driver={driver} />
                    </div>
                  </div>

                  {/* Booking */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-primary">
                      <FaAmbulance />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">
                        Current Booking
                      </p>

                      {driver.on_trip && driver.booking_id ? (
                        <button
                          type="button"
                          className="mt-1 block max-w-full break-all text-left font-semibold text-primary hover:underline"
                          onClick={() => handleBookingClick(driver.booking_id)}
                        >
                          {driver.booking_id}
                        </button>
                      ) : (
                        <p className="mt-1 text-sm text-base-content/40">
                          No Active Booking
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Account Status */}

                  <div className="flex items-center justify-between border-t border-base-300 pt-4">
                    <span className="text-sm text-base-content/50">
                      Account Status
                    </span>

                    <AccountStatus isActive={driver.is_active} />
                  </div>
                </div>

                {/* =========================================
                      CARD FOOTER
                  ========================================== */}

                <div className="border-t border-base-300 bg-base-200/30 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-base-content/50">
                    <span>Driver #{index + 1}</span>

                    {driver.on_trip && driver.trip_status && (
                      <span className="capitalize">
                        {driver.trip_status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =====================================================
          CREATE DRIVER MODAL
      ====================================================== */}

      <CreateDriverModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />

      {/* =====================================================
          BOOKING DETAILS MODAL
      ====================================================== */}

      {showBookingModal && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-start justify-between gap-3 border-b border-base-300 pb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-bold">Booking Details</h3>

                {selectedBooking?.id && (
                  <p className="mt-1 break-all text-xs text-base-content/50">
                    Booking ID: {selectedBooking.id}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost shrink-0"
                onClick={closeBookingModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* =================================================
                LOADING
            ================================================== */}

            {bookingLoading ? (
              <div className="flex min-h-60 items-center justify-center">
                <LoadingSpinner size="lg" text="Booking details লোড হচ্ছে..." />
              </div>
            ) : selectedBooking ? (
              <div className="mt-6 space-y-6">
                {/* =============================================
                    STATUS + BOOKING TIME
                ============================================== */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Status */}

                  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-base-content/50">
                      <FaCheckCircle />
                      Status
                    </div>

                    <BookingStatusBadge status={selectedBooking.status} />
                  </div>

                  {/* Booking Time */}

                  <div className="rounded-xl border border-base-300 bg-base-100 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-base-content/50">
                      <FaCalendarAlt />
                      Booking Time
                    </div>

                    <p className="wrap-break-word font-medium">
                      <FormatDate date={selectedBooking.booking_time} />
                    </p>
                  </div>
                </div>

                {/* =============================================
                    PATIENT INFORMATION
                ============================================== */}

                <div>
                  <h4 className="mb-3 text-lg font-semibold">
                    Patient Information
                  </h4>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-base-300 p-4 md:grid-cols-2">
                    {/* Name */}

                    <div className="min-w-0">
                      <p className="text-xs text-base-content/50">
                        Patient Name
                      </p>

                      <p className="mt-1 wrap-break-word font-medium">
                        {selectedBooking.patient_name || "N/A"}
                      </p>
                    </div>

                    {/* Phone */}

                    <div className="min-w-0">
                      <p className="text-xs text-base-content/50">Phone</p>

                      {selectedBooking.patient_phone ? (
                        <a
                          href={`tel:${selectedBooking.patient_phone}`}
                          className="mt-1 flex max-w-full items-center gap-2 break-all font-medium text-primary hover:underline"
                        >
                          <FaPhone className="shrink-0 text-xs" />

                          {selectedBooking.patient_phone}
                        </a>
                      ) : (
                        <p className="mt-1 font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* =============================================
                    TRIP INFORMATION
                ============================================== */}

                <div>
                  <h4 className="mb-3 text-lg font-semibold">
                    Trip Information
                  </h4>

                  <div className="space-y-4 rounded-xl border border-base-300 p-4">
                    {/* Pickup */}

                    <div className="flex min-w-0 gap-3">
                      <div className="mt-1 shrink-0 text-success">
                        <FaMapMarkerAlt />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-base-content/50">
                          Pickup Address
                        </p>

                        <p className="mt-1 wrap-break-word font-medium">
                          {selectedBooking.pickup_address || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="divider my-0" />

                    {/* Dropoff */}

                    <div className="flex min-w-0 gap-3">
                      <div className="mt-1 shrink-0 text-error">
                        <FaMapMarkerAlt />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-base-content/50">
                          Dropoff Address
                        </p>

                        <p className="mt-1 wrap-break-word font-medium">
                          {selectedBooking.dropoff_address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =============================================
                    DRIVER + AMBULANCE
                ============================================== */}

                <div>
                  <h4 className="mb-3 text-lg font-semibold">
                    Assignment Information
                  </h4>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-base-300 p-4 md:grid-cols-2">
                    {/* Driver */}

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <FaUserTie />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-base-content/50">Driver</p>

                        <p className="wrap-break-word font-medium">
                          {selectedBooking.driver_name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Ambulance */}

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FaAmbulance />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-base-content/50">
                          Ambulance
                        </p>

                        <p className="wrap-break-word font-medium">
                          {selectedBooking.ambulance_registration_number ||
                            "N/A"}
                        </p>

                        {selectedBooking.ambulance_type && (
                          <p className="mt-0.5 wrap-break-word text-xs text-base-content/50">
                            {selectedBooking.ambulance_type}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =============================================
                    ASSIGNED TIME
                ============================================== */}

                {selectedBooking.assigned_at && (
                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-xs text-base-content/50">Assigned At</p>

                    <p className="mt-1 wrap-break-word font-medium">
                      <FormatDate date={selectedBooking.assigned_at} />
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-base-content/50">
                  Booking details পাওয়া যায়নি।
                </p>
              </div>
            )}

            {/* =================================================
                MODAL FOOTER
            ================================================== */}

            <div className="modal-action">
              <button
                type="button"
                className="btn w-full sm:w-auto"
                onClick={closeBookingModal}
              >
                Close
              </button>
            </div>
          </div>

          {/* =================================================
              BACKDROP
          ================================================== */}

          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={closeBookingModal}>
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AdminDrivers;
