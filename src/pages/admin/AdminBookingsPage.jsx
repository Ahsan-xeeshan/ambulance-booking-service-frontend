import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FaAmbulance,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaSyncAlt,
  FaUser,
  FaUserTie,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyBookings from "../../components/common/EmptyBookings";
import FormatDate from "../../components/common/FormatDate";

const AdminBookings = () => {
  // ==================================================
  // State
  // ==================================================

  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    total_pages: 1,
  });

  // ==================================================
  // Assign Modal
  // ==================================================

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState("");

  const [assigning, setAssigning] = useState(false);

  // ==================================================
  // Fetch Bookings
  // ==================================================

  const fetchBookings = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = new URLSearchParams();

        params.append("page", currentPage);
        params.append("limit", 8);

        if (status) {
          params.append("status", status);
        }

        if (search.trim()) {
          params.append("search", search.trim());
        }

        const data = await apiCall(`/api/admin/bookings?${params.toString()}`);

        setBookings(Array.isArray(data) ? data : data?.bookings || []);

        if (data?.pagination) {
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Bookings error:", error);

        toast.error(error?.message || "Bookings লোড করা যায়নি");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, search, status],
  );

  // ==================================================
  // Fetch Drivers
  // ==================================================

  const fetchDrivers = async () => {
    try {
      const data = await apiCall("/api/admin/drivers");

      setDrivers(Array.isArray(data) ? data : data?.drivers || []);
    } catch (error) {
      console.error("Drivers error:", error);

      toast.error(error?.message || "Drivers লোড করা যায়নি");
    }
  };

  // ==================================================
  // Fetch Ambulances
  // ==================================================

  const fetchAmbulances = async () => {
    try {
      const data = await apiCall("/api/admin/ambulances");

      setAmbulances(Array.isArray(data) ? data : data?.ambulances || []);
    } catch (error) {
      console.error("Ambulances error:", error);

      toast.error(error?.message || "Ambulances লোড করা যায়নি");
    }
  };

  // ==================================================
  // Open Assign Modal
  // ==================================================

  const handleAssign = async (booking) => {
    setSelectedBooking(booking);

    setSelectedDriver("");
    setSelectedAmbulance("");

    setShowAssignModal(true);

    await Promise.all([fetchDrivers(), fetchAmbulances()]);
  };

  // ==================================================
  // Close Assign Modal
  // ==================================================

  const closeAssignModal = () => {
    if (assigning) {
      return;
    }

    setShowAssignModal(false);
    setSelectedBooking(null);

    setSelectedDriver("");
    setSelectedAmbulance("");
  };

  // ==================================================
  // Confirm Assign
  // ==================================================

  const handleConfirmAssign = async () => {
    if (!selectedBooking) {
      toast.error("Booking নির্বাচন করুন");
      return;
    }

    if (!selectedDriver) {
      toast.error("Please select a driver");
      return;
    }

    if (!selectedAmbulance) {
      toast.error("Please select an ambulance");
      return;
    }

    try {
      setAssigning(true);

      const bookingId = selectedBooking.booking_id || selectedBooking.id;

      await apiCall(`/api/admin/bookings/${bookingId}/assign`, {
        method: "POST",
        body: JSON.stringify({
          driver_id: selectedDriver,
          ambulance_id: selectedAmbulance,
        }),
      });

      toast.success("Ambulance and driver assigned successfully");

      setShowAssignModal(false);
      setSelectedBooking(null);

      setSelectedDriver("");
      setSelectedAmbulance("");

      await fetchBookings(true);

      await Promise.all([fetchDrivers(), fetchAmbulances()]);
    } catch (error) {
      console.error("Assign booking error:", error);

      toast.error(error?.message || "Ambulance and driver assign করা যায়নি");
    } finally {
      setAssigning(false);
    }
  };

  // ==================================================
  // Search
  // ==================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // ==================================================
  // Status Filter
  // ==================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setCurrentPage(1);
  };

  // ==================================================
  // Pagination
  // ==================================================

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pagination.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ==================================================
  // Active Resources
  // ==================================================

  const availableAmbulances = useMemo(
    () => ambulances.filter((ambulance) => ambulance.status === "available"),
    [ambulances],
  );

  const activeDrivers = useMemo(
    () => drivers.filter((driver) => driver.is_active !== false),
    [drivers],
  );

  // ==================================================
  // Fetch on Search / Filter / Pagination
  // ==================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentPage, status, search, fetchBookings]);

  // ==================================================
  // Initial Resources
  // ==================================================

  useEffect(() => {
    const loadResources = async () => {
      await Promise.all([fetchDrivers(), fetchAmbulances()]);
    };

    loadResources();
  }, []);

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Bookings লোড হচ্ছে..." />
      </div>
    );
  }

  // ==================================================
  // Helpers
  // ==================================================

  const getBookingId = (booking) => booking.booking_id || booking.id;

  const getPatientName = (booking) =>
    booking.patient_name || booking.user_name || "N/A";

  // ==================================================
  // Mobile Booking Card
  // ==================================================

  const BookingCard = ({ booking }) => {
    const bookingId = getBookingId(booking);

    return (
      <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
        {/* Card Header */}

        <div className="flex items-start justify-between gap-3 border-b border-base-300 bg-base-200/40 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FaClipboardList />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-base-content/50">Booking ID</p>

              <p className="break-all font-bold" title={`#${bookingId}`}>
                #{bookingId}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Card Body */}

        <div className="space-y-4 p-4">
          {/* Patient */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaUser />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Patient</p>

              <p className="wrap-break-word font-semibold">
                {getPatientName(booking)}
              </p>
            </div>
          </div>

          {/* Phone */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaPhone />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Phone</p>

              {booking.patient_phone ? (
                <a
                  href={`tel:${booking.patient_phone}`}
                  className="wrap-break-word font-medium text-primary hover:underline"
                >
                  {booking.patient_phone}
                </a>
              ) : (
                <p className="font-medium">N/A</p>
              )}
            </div>
          </div>

          {/* Pickup */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
              <FaMapMarkerAlt />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Pickup Address</p>

              <p className="wrap-break-word text-sm leading-6">
                {booking.pickup_address || "N/A"}
              </p>
            </div>
          </div>

          {/* Dropoff */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error/10 text-error">
              <FaMapMarkerAlt />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Dropoff Address</p>

              <p className="wrap-break-word text-sm leading-6">
                {booking.dropoff_address || "N/A"}
              </p>
            </div>
          </div>

          {/* Ambulance */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FaAmbulance />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Ambulance</p>

              {booking.ambulance_id ? (
                <p className="wrap-break-word font-semibold">
                  {booking.ambulance_registration_number || "Assigned"}
                </p>
              ) : (
                <p className="text-sm text-base-content/40">Not assigned</p>
              )}
            </div>
          </div>

          {/* Date */}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
              <FaCalendarAlt />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-base-content/50">Booking Date</p>

              <p className="font-medium">
                {" "}
                <FormatDate date={booking.booking_time} />
              </p>

              {booking.booking_time && (
                <p className="text-xs text-base-content/50">
                  <FormatDate date={booking.booking_time} />
                </p>
              )}
            </div>
          </div>

          {/* Action */}

          {booking.status === "pending" ? (
            <button
              type="button"
              className="btn btn-primary mt-2 w-full gap-2"
              onClick={() => handleAssign(booking)}
            >
              <FaAmbulance />
              Assign Ambulance
            </button>
          ) : (
            <div className="rounded-lg bg-base-200 px-4 py-3 text-center text-xs text-base-content/40">
              No action available
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <FaClipboardList />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-primary">All Bookings</h1>

            <p className="text-sm text-gray-500">
              Manage ambulance booking requests
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-primary w-full gap-2 sm:w-auto"
          onClick={() => fetchBookings(true)}
          disabled={refreshing}
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ==================================================
          Summary
      ================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Total Bookings</div>

          <div className="stat-value text-primary">{pagination.total}</div>
        </div>

        {/* Available Ambulances */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Available Ambulances</div>

          <div className="stat-value text-success">
            {availableAmbulances.length}
          </div>
        </div>

        {/* Active Drivers */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Active Drivers</div>

          <div className="stat-value text-info">{activeDrivers.length}</div>
        </div>
      </div>

      {/* ==================================================
          Search & Filter
      ================================================== */}

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}

            <label className="input input-bordered flex w-full flex-1 items-center gap-2">
              <FaSearch className="shrink-0 text-base-content/40" />

              <input
                type="text"
                placeholder="Search patient, phone or address..."
                value={search}
                onChange={handleSearchChange}
                className="min-w-0 grow"
              />
            </label>

            {/* Status */}

            <select
              value={status}
              onChange={handleStatusChange}
              className="select select-bordered w-full md:w-56"
            >
              <option value="">All Status</option>

              <option value="pending">Pending</option>

              <option value="assigned">Assigned</option>

              <option value="en_route">En Route</option>

              <option value="completed">Completed</option>

              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================
          Table Summary
      ================================================== */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/60">
          Showing{" "}
          <span className="font-semibold text-base-content">
            {bookings.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-base-content">
            {pagination.total}
          </span>{" "}
          bookings
        </p>

        <p className="text-sm text-base-content/60">
          Page{" "}
          <span className="font-semibold text-base-content">
            {pagination.page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-base-content">
            {pagination.total_pages}
          </span>
        </p>
      </div>

      {/* ==================================================
          DESKTOP TABLE
      ================================================== */}

      <div className="hidden overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
        <table className="table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Status</th>
              <th>Ambulance</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-16 text-center">
                  <FaClipboardList className="mx-auto mb-4 text-4xl text-base-content/20" />

                  <h3 className="font-semibold">No bookings found</h3>

                  <p className="mt-1 text-sm text-base-content/50">
                    Try changing your search or status filter.
                  </p>
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id || booking.booking_id} className="hover">
                  {/* Booking */}

                  <td>
                    <div className="font-semibold">
                      #{getBookingId(booking)}
                    </div>
                  </td>

                  {/* Patient */}

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FaUser />
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold">
                          {getPatientName(booking)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}

                  <td>
                    {booking.patient_phone ? (
                      <a
                        href={`tel:${booking.patient_phone}`}
                        className="flex items-center gap-2 whitespace-nowrap hover:text-primary"
                      >
                        <FaPhone className="text-sm text-primary" />

                        <span>{booking.patient_phone}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <FaPhone className="text-sm text-primary" />

                        <span>N/A</span>
                      </div>
                    )}
                  </td>

                  {/* Pickup */}

                  <td>
                    <div
                      className="max-w-xs truncate"
                      title={booking.pickup_address || ""}
                    >
                      {booking.pickup_address || "N/A"}
                    </div>
                  </td>

                  {/* Dropoff */}

                  <td>
                    <div
                      className="max-w-xs truncate"
                      title={booking.dropoff_address || ""}
                    >
                      {booking.dropoff_address || "N/A"}
                    </div>
                  </td>

                  {/* Status */}

                  <td>
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Ambulance */}

                  <td>
                    {booking.ambulance_id ? (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <FaAmbulance className="text-primary" />

                        <span>{booking.ambulance_registration_number}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-base-content/40">
                        Not assigned
                      </span>
                    )}
                  </td>

                  {/* Date */}

                  <td>
                    <div className="whitespace-nowrap text-sm">
                      <FormatDate date={booking.booking_time} />
                    </div>

                    <div className="whitespace-nowrap text-xs text-base-content/50">
                      <FormatDate date={booking.booking_time} />
                    </div>
                  </td>

                  {/* Action */}

                  <td>
                    {booking.status === "pending" ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm gap-2"
                        onClick={() => handleAssign(booking)}
                      >
                        <FaAmbulance />
                        Assign
                      </button>
                    ) : (
                      <span className="text-xs text-base-content/40">
                        No action
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==================================================
          MOBILE CARDS
      ================================================== */}

      <div className="space-y-4 md:hidden">
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
            <EmptyBookings />
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id || booking.booking_id}
              booking={booking}
            />
          ))
        )}
      </div>

      {/* ==================================================
          Pagination
      ================================================== */}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center overflow-x-auto py-1">
          <div className="join">
            <button
              type="button"
              className="join-item btn btn-soft"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from(
              {
                length: pagination.total_pages,
              },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`join-item btn ${
                  currentPage === page
                    ? "btn-primary"
                    : "btn-outline btn-neutral"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="join-item btn btn-soft"
              onClick={handleNext}
              disabled={currentPage === pagination.total_pages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          ASSIGN MODAL
      ================================================== */}

      {showAssignModal && selectedBooking && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg p-4 sm:p-6">
            {/* Modal Header */}

            <div className="mb-6 flex items-center gap-3">
              <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
                <FaAmbulance className="text-xl" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-bold">Assign Ambulance</h3>

                <p className="break-all text-sm text-base-content/60">
                  Booking #{getBookingId(selectedBooking)}
                </p>
              </div>
            </div>

            {/* Booking Information */}

            <div className="mb-6 rounded-xl bg-base-200 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Patient */}

                <div className="min-w-0">
                  <div className="text-xs text-base-content/50">Patient</div>

                  <div className="wrap-break-word font-medium">
                    {getPatientName(selectedBooking)}
                  </div>
                </div>

                {/* Status */}

                <div>
                  <div className="mb-1 text-xs text-base-content/50">
                    Status
                  </div>

                  <StatusBadge status={selectedBooking.status} />
                </div>
              </div>
            </div>

            {/* Driver */}

            <div className="form-control mb-5">
              <label className="label">
                <span className="label-text font-semibold">Select Driver</span>
              </label>

              <div className="relative">
                <FaUserTie className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-base-content/50" />

                <select
                  className="select select-bordered w-full pl-10"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  disabled={assigning}
                >
                  <option value="">-- Select Driver --</option>

                  {activeDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.full_name || driver.name || driver.email}
                    </option>
                  ))}
                </select>
              </div>

              {activeDrivers.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    No active drivers available
                  </span>
                </label>
              )}
            </div>

            {/* Ambulance */}

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">
                  Select Ambulance
                </span>
              </label>

              <div className="relative">
                <FaAmbulance className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-base-content/50" />

                <select
                  className="select select-bordered w-full pl-10"
                  value={selectedAmbulance}
                  onChange={(e) => setSelectedAmbulance(e.target.value)}
                  disabled={assigning}
                >
                  <option value="">-- Select Ambulance --</option>

                  {availableAmbulances.map((ambulance) => (
                    <option key={ambulance.id} value={ambulance.id}>
                      {ambulance.registration_number}
                    </option>
                  ))}
                </select>
              </div>

              {availableAmbulances.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    No available ambulances
                  </span>
                </label>
              )}
            </div>

            {/* Actions */}

            <div className="modal-action flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                className="btn btn-ghost w-full sm:w-auto"
                onClick={closeAssignModal}
                disabled={assigning}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary w-full gap-2 sm:w-auto"
                onClick={handleConfirmAssign}
                disabled={assigning || !selectedDriver || !selectedAmbulance}
              >
                {assigning ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <FaAmbulance />
                    Assign Ambulance
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Click Outside */}

          <form
            method="dialog"
            className="modal-backdrop"
            onClick={closeAssignModal}
          >
            <button type="button">close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AdminBookings;
