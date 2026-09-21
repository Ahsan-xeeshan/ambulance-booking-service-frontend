import { useCallback, useEffect, useState } from "react";

import {
  FaAmbulance,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaUserTie,
  FaSyncAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/admin/EmptyState";
import StatCard from "../../components/admin/StatCard";
import SectionHeader from "../../components/common/SectionHeader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const fetchDashboardData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [statsData, bookingsData, ambulancesData, driversData] =
        await Promise.all([
          apiCall("/api/dashboard/stats"),
          apiCall("/api/admin/bookings"),
          apiCall("/api/admin/ambulances"),
          apiCall("/api/admin/drivers"),
        ]);

      setStats(statsData || {});

      setBookings(
        Array.isArray(bookingsData)
          ? bookingsData
          : bookingsData?.bookings || [],
      );

      setAmbulances(
        Array.isArray(ambulancesData)
          ? ambulancesData
          : ambulancesData?.ambulances || [],
      );

      setDrivers(
        Array.isArray(driversData) ? driversData : driversData?.drivers || [],
      );
    } catch (error) {
      console.error("Dashboard error:", error);

      toast.error(error?.message || "ড্যাশবোর্ডের তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchDashboardData]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "badge-warning",
      assigned: "badge-info",
      en_route: "badge-primary",
      completed: "badge-success",
      cancelled: "badge-error",
      available: "badge-success",
      busy: "badge-warning",
      maintenance: "badge-error",
      active: "badge-success",
      inactive: "badge-error",
    };

    return statusMap[status?.toLowerCase()] || "badge-neutral";
  };

  // =========================================================
  // FORMAT STATUS
  // =========================================================

  const formatStatus = (status) => {
    if (!status) return "N/A";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <LoadingSpinner size="lg" text="ড্যাশবোর্ড লোড হচ্ছে..." />
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="w-full space-y-6 p-3 sm:p-4 md:space-y-8 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Emergency Ambulance Dispatch System
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-outline btn-primary w-full gap-2 sm:w-auto"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Overview</h2>

          <p className="text-sm text-gray-500">
            Current system statistics
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Bookings"
            value={stats?.total_bookings ?? 0}
            icon={<FaClipboardList />}
            className="text-primary"
          />

          <StatCard
            title="Pending"
            value={stats?.pending_bookings ?? 0}
            icon={<FaClock />}
            className="text-warning"
          />

          <StatCard
            title="Completed"
            value={stats?.completed_bookings ?? 0}
            icon={<FaCheckCircle />}
            className="text-success"
          />

          <StatCard
            title="Ambulances"
            value={stats?.total_ambulances ?? 0}
            icon={<FaAmbulance />}
            className="text-info"
          />

          <StatCard
            title="Available"
            value={stats?.available_ambulances ?? 0}
            icon={<FaAmbulance />}
            className="text-success"
          />

          <StatCard
            title="Drivers"
            value={stats?.total_drivers ?? 0}
            icon={<FaUserTie />}
            className="text-secondary"
          />
        </div>
      </section>

      {/* =====================================================
          RECENT BOOKINGS
      ===================================================== */}

      <section>
        <SectionHeader
          title="Recent Bookings"
          description="Latest ambulance booking requests"
        />

        {bookings.length === 0 ? (
          <EmptyState text="কোনো booking পাওয়া যায়নি" />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200">
                      <th>#</th>
                      <th>Patient</th>
                      <th>Phone</th>
                      <th>Pickup Address</th>
                      <th>Dropoff Address</th>
                      <th>Ambulance</th>
                      <th>Status</th>
                      <th>Booking Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.slice(0, 10).map((booking, index) => (
                      <BookingTableRow
                        key={booking.id}
                        booking={booking}
                        index={index}
                        getStatusBadge={getStatusBadge}
                        formatStatus={formatStatus}
                        formatDate={formatDate}
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
              {bookings.slice(0, 10).map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={index}
                  getStatusBadge={getStatusBadge}
                  formatStatus={formatStatus}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          AMBULANCES
      ===================================================== */}

      <section>
        <SectionHeader
          title="Ambulances"
          description="Ambulance availability and status"
        />

        {ambulances.length === 0 ? (
          <EmptyState text="কোনো ambulance পাওয়া যায়নি" />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200">
                      <th>#</th>
                      <th>Registration No.</th>
                      <th>Type</th>
                      <th>Driver</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ambulances.slice(0, 10).map((ambulance, index) => (
                      <AmbulanceTableRow
                        key={ambulance.id}
                        ambulance={ambulance}
                        index={index}
                        getStatusBadge={getStatusBadge}
                        formatStatus={formatStatus}
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
              {ambulances.slice(0, 10).map((ambulance, index) => (
                <AmbulanceCard
                  key={ambulance.id}
                  ambulance={ambulance}
                  index={index}
                  getStatusBadge={getStatusBadge}
                  formatStatus={formatStatus}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          DRIVERS
      ===================================================== */}

      <section>
        <SectionHeader
          title="Drivers"
          description="Registered ambulance drivers"
        />

        {drivers.length === 0 ? (
          <EmptyState text="কোনো driver পাওয়া যায়নি" />
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200">
                      <th>#</th>
                      <th>Driver</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>License No.</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {drivers.slice(0, 10).map((driver, index) => (
                      <DriverTableRow
                        key={driver.id}
                        driver={driver}
                        index={index}
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
              {drivers.slice(0, 10).map((driver, index) => (
                <DriverCard key={driver.id} driver={driver} index={index} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};



/* =========================================================
   BOOKING TABLE ROW
========================================================= */

const BookingTableRow = ({
  booking,
  index,
  getStatusBadge,
  formatStatus,
  formatDate,
}) => {
  return (
    <tr className="hover">
      <td>{index + 1}</td>

      <td>
        <div className="font-semibold">
          {booking.patient_name || booking.user_name || "N/A"}
        </div>
      </td>

      <td>{booking.patient_phone || booking.phone || "N/A"}</td>

      <td className="max-w-xs">
        <div className="truncate" title={booking.pickup_address}>
          {booking.pickup_address || "N/A"}
        </div>
      </td>

      <td className="max-w-xs">
        <div className="truncate" title={booking.dropoff_address}>
          {booking.dropoff_address || "N/A"}
        </div>
      </td>

      <td>
        {booking.ambulance_registration ||
          booking.registration_number ||
          "Not Assigned"}
      </td>

      <td>
        <span className={`badge ${getStatusBadge(booking.status)}`}>
          {formatStatus(booking.status)}
        </span>
      </td>

      <td className="whitespace-nowrap">
        {formatDate(booking.booking_time || booking.created_at)}
      </td>
    </tr>
  );
};

/* =========================================================
   BOOKING MOBILE CARD
========================================================= */

const BookingCard = ({
  booking,
  index,
  getStatusBadge,
  formatStatus,
  formatDate,
}) => {
  const ambulance =
    booking.ambulance_registration ||
    booking.registration_number ||
    "Not Assigned";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-base-content/50">
            Booking #{index + 1}
          </p>

          <h3 className="mt-0.5 truncate text-sm font-bold sm:text-base">
            #{booking.id || "N/A"}
          </h3>
        </div>

        <span className={`badge shrink-0 ${getStatusBadge(booking.status)}`}>
          {formatStatus(booking.status)}
        </span>
      </div>

      {/* BODY */}

      <div className="space-y-4 p-3 sm:p-4">
        {/* PATIENT */}

        <AdminMobileInfo icon={<FaUserTie />} label="Patient">
          <p className="font-semibold">
            {booking.patient_name || booking.user_name || "N/A"}
          </p>
        </AdminMobileInfo>

        {/* PHONE */}

        <AdminMobileInfo icon={<FaPhone />} label="Phone">
          {booking.patient_phone || booking.phone ? (
            <a
              href={`tel:${booking.patient_phone || booking.phone}`}
              className="text-primary hover:underline"
            >
              {booking.patient_phone || booking.phone}
            </a>
          ) : (
            "N/A"
          )}
        </AdminMobileInfo>

        {/* PICKUP */}

        <AdminMobileInfo
          icon={<FaMapMarkerAlt />}
          label="Pickup Address"
          iconClass="text-success"
        >
          {booking.pickup_address || "N/A"}
        </AdminMobileInfo>

        {/* DROPOFF */}

        <AdminMobileInfo
          icon={<FaMapMarkerAlt />}
          label="Drop-off Address"
          iconClass="text-error"
        >
          {booking.dropoff_address || "N/A"}
        </AdminMobileInfo>

        {/* AMBULANCE */}

        <AdminMobileInfo icon={<FaAmbulance />} label="Ambulance">
          <span className="font-semibold">{ambulance}</span>
        </AdminMobileInfo>

        {/* BOOKING TIME */}

        <AdminMobileInfo icon={<FaCalendarAlt />} label="Booking Time">
          {formatDate(booking.booking_time || booking.created_at)}
        </AdminMobileInfo>
      </div>
    </div>
  );
};

/* =========================================================
   AMBULANCE TABLE ROW
========================================================= */

const AmbulanceTableRow = ({
  ambulance,
  index,
  getStatusBadge,
  formatStatus,
}) => {
  return (
    <tr className="hover">
      <td>{index + 1}</td>

      <td>
        <div className="font-semibold">
          {ambulance.registration_number || "N/A"}
        </div>
      </td>

      <td>{ambulance.ambulance_type || ambulance.type || "N/A"}</td>

      <td>{ambulance.driver_name || "Not Assigned"}</td>

      <td>
        <span className={`badge ${getStatusBadge(ambulance.status)}`}>
          {formatStatus(ambulance.status)}
        </span>
      </td>
    </tr>
  );
};

/* =========================================================
   AMBULANCE MOBILE CARD
========================================================= */

const AmbulanceCard = ({ ambulance, index, getStatusBadge, formatStatus }) => {
  const registration = ambulance.registration_number || "N/A";

  const type = ambulance.ambulance_type || ambulance.type || "N/A";

  const driver = ambulance.driver_name || "Not Assigned";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FaAmbulance />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-base-content/50">
              Ambulance #{index + 1}
            </p>

            <h3 className="truncate text-sm font-bold sm:text-base">
              {registration}
            </h3>
          </div>
        </div>

        <span className={`badge shrink-0 ${getStatusBadge(ambulance.status)}`}>
          {formatStatus(ambulance.status)}
        </span>
      </div>

      {/* BODY */}

      <div className="space-y-4 p-3 sm:p-4">
        <AdminMobileInfo icon={<FaAmbulance />} label="Registration Number">
          <span className="font-semibold">{registration}</span>
        </AdminMobileInfo>

        <AdminMobileInfo icon={<FaClipboardList />} label="Ambulance Type">
          {type}
        </AdminMobileInfo>

        <AdminMobileInfo icon={<FaUserTie />} label="Driver">
          {driver}
        </AdminMobileInfo>
      </div>
    </div>
  );
};

/* =========================================================
   DRIVER TABLE ROW
========================================================= */

const DriverTableRow = ({ driver, index }) => {
  return (
    <tr className="hover">
      <td>{index + 1}</td>

      <td>
        <div className="font-semibold">
          {driver.full_name || driver.name || "N/A"}
        </div>
      </td>

      <td>{driver.email || "N/A"}</td>

      <td>{driver.phone || "N/A"}</td>

      <td>{driver.license_number || driver.license_no || "N/A"}</td>

      <td>
        <span
          className={`badge ${
            driver.is_active ? "badge-success" : "badge-error"
          }`}
        >
          {driver.is_active ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  );
};

/* =========================================================
   DRIVER MOBILE CARD
========================================================= */

const DriverCard = ({ driver, index }) => {
  const name = driver.full_name || driver.name || "N/A";

  const license = driver.license_number || driver.license_no || "N/A";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3 border-b border-base-200 bg-base-200/40 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FaUserTie />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] text-base-content/50">
              Driver #{index + 1}
            </p>

            <h3 className="truncate text-sm font-bold sm:text-base">{name}</h3>
          </div>
        </div>

        <span
          className={`badge shrink-0 ${
            driver.is_active ? "badge-success" : "badge-error"
          }`}
        >
          {driver.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* BODY */}

      <div className="space-y-4 p-3 sm:p-4">
        {/* NAME */}

        <AdminMobileInfo icon={<FaUserTie />} label="Driver Name">
          <span className="font-semibold">{name}</span>
        </AdminMobileInfo>

        {/* EMAIL */}

        <AdminMobileInfo icon={<FaEnvelope />} label="Email">
          <span className="break-all">{driver.email || "N/A"}</span>
        </AdminMobileInfo>

        {/* PHONE */}

        <AdminMobileInfo icon={<FaPhone />} label="Phone">
          {driver.phone ? (
            <a
              href={`tel:${driver.phone}`}
              className="text-primary hover:underline"
            >
              {driver.phone}
            </a>
          ) : (
            "N/A"
          )}
        </AdminMobileInfo>

        {/* LICENSE */}

        <AdminMobileInfo icon={<FaIdCard />} label="License Number">
          <span className="wrap-break-word">{license}</span>
        </AdminMobileInfo>
      </div>
    </div>
  );
};

/* =========================================================
   MOBILE INFO
========================================================= */

const AdminMobileInfo = ({
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

        <div className="mt-0.5 wrap-break-word text-sm leading-5">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
