import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaPhone,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const UserMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // --------------------------------------------------
  // Filter & Pagination
  // --------------------------------------------------

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // --------------------------------------------------
  // Fetch bookings
  // --------------------------------------------------

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiCall("/api/bookings/my-bookings");

      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
    } catch (error) {
      console.log(error.message);

      toast.error(error.message || "Failed to load bookings.");

      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchBookings, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchBookings]);

  // --------------------------------------------------
  // Cancel booking
  // --------------------------------------------------

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);

      await apiCall(`/api/bookings/${bookingId}/cancel`, {
        method: "DELETE",
      });

      toast.success("Booking cancelled successfully.");

      await fetchBookings();

      setCurrentPage(1);
    } catch (error) {
      console.log(error.message);

      toast.error(error.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // --------------------------------------------------
  // Status badge
  // --------------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";

      case "assigned":
        return "badge-info";

      case "en_route":
        return "badge-primary";

      case "completed":
        return "badge-success";

      case "cancelled":
        return "badge-error";

      default:
        return "badge-ghost";
    }
  };

  // --------------------------------------------------
  // Format status
  // --------------------------------------------------

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // --------------------------------------------------
  // Filter bookings
  // --------------------------------------------------

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") {
      return bookings;
    }

    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const validCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, validCurrentPage]);

  // --------------------------------------------------
  // Handle status filter
  // --------------------------------------------------

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Handle page change
  // --------------------------------------------------

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-5">
      {/* =========================================
          HEADER
      ========================================== */}

      <div className="mb-6 mt-2 sm:mt-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge badge-primary badge-outline mb-2">
              Booking Management
            </div>

            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-1 text-sm text-gray-400 sm:text-base">
              View and manage your ambulance bookings.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          NO BOOKINGS
      ========================================== */}

      {bookings.length === 0 ? (
        <div className="card border border-base-200 bg-base-100 shadow-sm">
          <div className="card-body items-center px-5 py-14 text-center sm:py-16">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary">
              <FaAmbulance />
            </div>

            <h2 className="text-xl font-bold text-base-content sm:text-2xl">
              No Bookings Found
            </h2>

            <p className="mt-2 max-w-md text-sm text-base-content/60">
              You haven't made any ambulance bookings yet. Book an ambulance
              whenever you need emergency transportation.
            </p>

            <a
              href="/user/new-booking"
              className="btn btn-primary mt-5 w-full sm:w-auto"
            >
              <FaAmbulance />
              Book an Ambulance
            </a>
          </div>
        </div>
      ) : (
        <div className="card w-full overflow-hidden border border-base-200 bg-base-100 shadow-sm">
          {/* =========================================
              TABLE HEADER / FILTER
          ========================================== */}

          <div className="border-b border-base-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Booking History
                </h2>

                <p className="text-sm text-gray-400">
                  Your ambulance booking information
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="select select-bordered select-sm w-full sm:w-45"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="en_route">En Route</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="badge badge-primary badge-outline h-8 px-3">
                  {filteredBookings.length}{" "}
                  {filteredBookings.length === 1 ? "Booking" : "Bookings"}
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              DESKTOP TABLE
              Hidden below lg
          =================================================== */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="table w-full text-base-content">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/70 text-sm font-semibold text-base-content">
                  <th>#</th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Pickup</th>
                  <th>Dropoff</th>
                  <th>Ambulance</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Booking Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-12 text-center text-base-content/50"
                    >
                      No bookings found for this status.
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="border-b border-base-200 transition-colors hover:bg-base-200/50"
                    >
                      {/* Serial */}

                      <td>
                        <span className="font-semibold">
                          {(validCurrentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </span>
                      </td>

                      {/* Patient */}

                      <td>
                        <div className="min-w-32">
                          <div className="font-semibold">
                            {booking.patient_name || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}

                      <td>
                        <div className="flex items-center gap-2 whitespace-nowrap text-sm">
                          <FaPhone className="text-primary" />

                          {booking.patient_phone || "N/A"}
                        </div>
                      </td>

                      {/* Pickup */}

                      <td>
                        <div className="flex min-w-55 items-start gap-2">
                          <FaMapMarkerAlt className="mt-1 shrink-0 text-error" />

                          <span className="text-sm leading-5">
                            {booking.pickup_address || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Dropoff */}

                      <td>
                        <div className="flex min-w-55 items-start gap-2">
                          <FaMapMarkerAlt className="mt-1 shrink-0 text-success" />

                          <span className="text-sm leading-5">
                            {booking.dropoff_address || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Ambulance */}

                      <td>
                        {booking.ambulance_number ? (
                          <div className="min-w-37.5">
                            <div className="font-semibold">
                              {booking.ambulance_number}
                            </div>

                            <div className="mt-1 text-xs text-base-content/60">
                              {booking.ambulance_type || "Ambulance"}
                            </div>
                          </div>
                        ) : (
                          <span className="whitespace-nowrap text-sm text-base-content/50">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Driver */}

                      <td>
                        {booking.driver_name ? (
                          <div className="min-w-32.5">
                            <div className="font-semibold">
                              {booking.driver_name}
                            </div>

                            {booking.driver_phone && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-base-content/60">
                                <FaPhone className="text-[10px]" />

                                {booking.driver_phone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="whitespace-nowrap text-sm text-base-content/50">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Status */}

                      <td>
                        <span
                          className={`badge ${getStatusColor(
                            booking.status,
                          )} whitespace-nowrap font-medium`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </td>

                      {/* Booking Time */}

                      <td>
                        <div className="flex min-w-40 items-center gap-2 whitespace-nowrap text-sm">
                          <FaCalendarAlt className="text-primary" />

                          {booking.booking_time
                            ? new Date(booking.booking_time).toLocaleString()
                            : "N/A"}
                        </div>
                      </td>

                      {/* Action */}

                      <td>
                        {booking.status === "pending" ? (
                          <button
                            type="button"
                            className="btn btn-error btn-outline btn-sm"
                            title="Cancel Booking"
                            disabled={cancellingId === booking.id}
                            onClick={() => handleCancel(booking.id)}
                          >
                            {cancellingId === booking.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <FaTimesCircle />
                            )}

                            <span>Cancel</span>
                          </button>
                        ) : (
                          <span className="text-xs text-base-content/40">
                            —
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
              MOBILE / TABLET CARDS
              Visible below lg
          =================================================== */}

          <div className="block lg:hidden">
            {paginatedBookings.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-base-content/50 bg-body">
                No bookings found for this status.
              </div>
            ) : (
              <div className="space-y-4 p-3 sm:p-5">
                {paginatedBookings.map((booking, index) => {
                  const serial =
                    (validCurrentPage - 1) * ITEMS_PER_PAGE + index + 1;

                  return (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-base-300 shadow-sm bg-black"
                    >
                      {/* ==================================
                          CARD HEADER
                      =================================== */}

                      <div className="flex items-start justify-between gap-3 border-b border-base-200 p-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FaAmbulance />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-base-content/50">
                              Booking #{serial}
                            </p>

                            <h3 className="truncate font-bold text-base-content">
                              {booking.patient_name || "N/A"}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`badge ${getStatusColor(
                            booking.status,
                          )} shrink-0 whitespace-nowrap font-medium`}
                        >
                          {formatStatus(booking.status)}
                        </span>
                      </div>

                      {/* ==================================
                          CARD CONTENT
                      =================================== */}

                      <div className="space-y-4 p-4">
                        {/* Phone */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-primary">
                            <FaPhone />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Patient Phone
                            </p>

                            <p className="wrap-break-word text-sm font-medium text-base-content">
                              {booking.patient_phone || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Pickup */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-error">
                            <FaMapMarkerAlt />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Pickup Address
                            </p>

                            <p className="wrap-break-word text-sm leading-5 text-base-content">
                              {booking.pickup_address || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Dropoff */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-success">
                            <FaMapMarkerAlt />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Dropoff Address
                            </p>

                            <p className="wrap-break-word text-sm leading-5 text-base-content">
                              {booking.dropoff_address || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Ambulance */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-primary">
                            <FaAmbulance />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Ambulance
                            </p>

                            {booking.ambulance_number ? (
                              <>
                                <p className="wrap-break-word text-sm font-semibold text-base-content">
                                  {booking.ambulance_number}
                                </p>

                                <p className="mt-0.5 text-xs text-base-content/60">
                                  {booking.ambulance_type || "Ambulance"}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-base-content/50">
                                Not Assigned
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Driver */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-primary">
                            <FaUser />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Driver
                            </p>

                            {booking.driver_name ? (
                              <>
                                <p className="wrap-break-word text-sm font-semibold text-base-content">
                                  {booking.driver_name}
                                </p>

                                {booking.driver_phone && (
                                  <p className="mt-1 flex items-center gap-1 break-all text-xs text-base-content/60">
                                    <FaPhone className="shrink-0 text-[9px]" />

                                    {booking.driver_phone}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-base-content/50">
                                Not Assigned
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Booking Time */}

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-primary">
                            <FaCalendarAlt />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-base-content/50">
                              Booking Time
                            </p>

                            <p className="wrap-break-word text-sm text-base-content">
                              {booking.booking_time
                                ? new Date(
                                    booking.booking_time,
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ==================================
                          CARD FOOTER / ACTION
                      =================================== */}

                      {booking.status === "pending" && (
                        <div className="border-t border-base-200 p-4">
                          <button
                            type="button"
                            className="btn btn-error btn-outline w-full"
                            disabled={cancellingId === booking.id}
                            onClick={() => handleCancel(booking.id)}
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <FaTimesCircle />
                                Cancel Booking
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================
              PAGINATION
          ========================================== */}

          {totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-base-200 px-4 py-4 sm:px-6">
              {/* Result information */}

              <div className="text-center text-sm text-base-content/60 sm:text-left">
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {(validCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-base-content">
                  {Math.min(
                    validCurrentPage * ITEMS_PER_PAGE,
                    filteredBookings.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-base-content">
                  {filteredBookings.length}
                </span>{" "}
                bookings
              </div>

              {/* Pagination */}

              <div className="flex justify-center">
                <div className="join max-w-full">
                  {/* Previous */}

                  <button
                    type="button"
                    className="join-item btn btn-sm"
                    disabled={validCurrentPage === 1}
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                  >
                    «
                  </button>

                  {/* Page numbers */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`join-item btn btn-sm ${
                        validCurrentPage === page ? "btn-primary" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}

                  <button
                    type="button"
                    className="join-item btn btn-sm"
                    disabled={validCurrentPage === totalPages}
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMyBookings;
