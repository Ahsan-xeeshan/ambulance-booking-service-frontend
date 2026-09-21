import { useEffect, useMemo, useState } from "react";
import {
  FaAmbulance,
  FaPlus,
  FaFilter,
  FaPhone,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import CreateAmbulanceModal from "../../components/admin/CreateAmbulanceModal";

// =========================================================
// STATUS BADGE
// =========================================================

const AmbulanceStatusBadge = ({ status }) => {
  if (status === "available") {
    return <span className="badge badge-success">Available</span>;
  }

  if (status === "busy") {
    return <span className="badge badge-warning">Busy</span>;
  }

  if (status === "maintenance") {
    return <span className="badge badge-error">Maintenance</span>;
  }

  return <span className="badge badge-ghost">{status || "Unknown"}</span>;
};

// =========================================================
// ADMIN AMBULANCES
// =========================================================

const AdminAmbulances = () => {
  const [ambulances, setAmbulances] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // ---------------------------------------------------------
  // Filter
  // ---------------------------------------------------------

  const [statusFilter, setStatusFilter] = useState("all");

  // ---------------------------------------------------------
  // Fetch ambulances
  // ---------------------------------------------------------

  const fetchAmbulances = async () => {
    try {
      const data = await apiCall("/api/admin/ambulances");

      setAmbulances(Array.isArray(data) ? data : data?.ambulances || []);
    } catch (error) {
      console.error("Ambulances error:", error);

      toast.error(error?.message || "Ambulances লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Initial fetch
  // ---------------------------------------------------------

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAmbulances();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // ---------------------------------------------------------
  // Created
  // ---------------------------------------------------------

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchAmbulances();
  };

  // ---------------------------------------------------------
  // Filtered ambulances
  // ---------------------------------------------------------

  const filteredAmbulances = useMemo(() => {
    if (statusFilter === "all") {
      return ambulances;
    }

    return ambulances.filter((ambulance) => ambulance.status === statusFilter);
  }, [ambulances, statusFilter]);

  // ---------------------------------------------------------
  // Stats
  // ---------------------------------------------------------

  const availableCount = ambulances.filter(
    (ambulance) => ambulance.status === "available",
  ).length;

  const busyCount = ambulances.filter(
    (ambulance) => ambulance.status === "busy",
  ).length;

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Ambulances লোড হচ্ছে..." />
      </div>
    );
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="w-full space-y-6 overflow-hidden p-4 md:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}

        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
            <FaAmbulance className="text-xl" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-primary">Ambulances</h1>

            <p className="text-sm text-gray-500">Manage your ambulance fleet</p>
          </div>
        </div>

        {/* Add Ambulance */}

        <button
          type="button"
          className="btn btn-primary w-full gap-2 sm:w-auto"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus />
          Add Ambulance
        </button>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Total Ambulances</div>

          <div className="stat-value text-primary">{ambulances.length}</div>
        </div>

        {/* Available */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Available</div>

          <div className="stat-value text-success">{availableCount}</div>
        </div>

        {/* Busy */}

        <div className="stat rounded-xl border border-base-300 bg-base-100 shadow-sm">
          <div className="stat-title">Busy</div>

          <div className="stat-value text-warning">{busyCount}</div>
        </div>
      </div>

      {/* =====================================================
          FILTER
      ====================================================== */}

      <div className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Filter title */}

        <div className="flex items-center gap-2">
          <FaFilter className="text-primary" />

          <span className="font-semibold">Filter by Status</span>
        </div>

        {/* Select */}

        <select
          className="select select-bordered w-full sm:w-52"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Ambulances</option>

          <option value="available">Available</option>

          <option value="busy">Busy</option>

          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {filteredAmbulances.length === 0 ? (
        <div className="rounded-xl border border-dashed border-base-300 bg-base-100 px-4 py-16 text-center">
          <FaAmbulance className="mx-auto mb-4 text-4xl text-base-content/20" />

          <h3 className="font-semibold">No ambulances found</h3>

          <p className="mt-1 text-sm text-base-content/50">
            {statusFilter === "all"
              ? "Add your first ambulance to the system."
              : `No ${statusFilter} ambulances found.`}
          </p>

          {statusFilter === "all" && (
            <button
              type="button"
              className="btn btn-primary mt-5 w-full sm:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus />
              Add Ambulance
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
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ambulance</th>
                  <th>Registration Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Present Driver</th>
                </tr>
              </thead>

              <tbody>
                {filteredAmbulances.map((ambulance, index) => (
                  <tr key={ambulance.id} className="hover">
                    {/* Number */}

                    <td>{index + 1}</td>

                    {/* Ambulance */}

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                          <FaAmbulance />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold">
                            Ambulance #{ambulance.id}
                          </div>

                          {ambulance.model && (
                            <div className="text-xs text-base-content/50">
                              {ambulance.model}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Registration */}

                    <td>
                      <span className="font-medium">
                        {ambulance.registration_number || "N/A"}
                      </span>
                    </td>

                    {/* Type */}

                    <td>{ambulance.ambulance_type || "N/A"}</td>

                    {/* Status */}

                    <td>
                      <AmbulanceStatusBadge status={ambulance.status} />
                    </td>

                    {/* Driver */}

                    <td>
                      {ambulance.current_driver_id ? (
                        <div>
                          <div className="font-medium">
                            {ambulance.current_driver_name || "Unknown Driver"}
                          </div>

                          {ambulance.current_driver_phone && (
                            <a
                              href={`tel:${ambulance.current_driver_phone}`}
                              className="text-xs text-base-content/50 hover:text-primary"
                            >
                              {ambulance.current_driver_phone}
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-base-content/40">
                          Not Assigned
                        </span>
                      )}
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
            {filteredAmbulances.map((ambulance, index) => (
              <div
                key={ambulance.id}
                className="w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
              >
                {/* -----------------------------------------
                      CARD HEADER
                  ------------------------------------------ */}

                <div className="flex items-start justify-between gap-3 border-b border-base-300 p-4">
                  {/* Ambulance info */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FaAmbulance className="text-lg" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold">Ambulance #{ambulance.id}</h3>

                      {ambulance.model && (
                        <p className="wrap-break-word text-xs text-base-content/50">
                          {ambulance.model}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}

                  <div className="shrink-0">
                    <AmbulanceStatusBadge status={ambulance.status} />
                  </div>
                </div>

                {/* -----------------------------------------
                      CARD BODY
                  ------------------------------------------ */}

                <div className="space-y-4 p-4">
                  {/* Registration */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-sm">
                      #
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">
                        Registration Number
                      </p>

                      <p className="wrap-break-word font-semibold">
                        {ambulance.registration_number || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Ambulance Type */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/70">
                      <FaAmbulance />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">
                        Ambulance Type
                      </p>

                      <p className="wrap-break-word font-medium">
                        {ambulance.ambulance_type || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Driver */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/70">
                      <FaUserTie />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-base-content/50">
                        Present Driver
                      </p>

                      {ambulance.current_driver_id ? (
                        <>
                          <p className="wrap-break-word font-semibold">
                            {ambulance.current_driver_name || "Unknown Driver"}
                          </p>

                          {ambulance.current_driver_phone && (
                            <a
                              href={`tel:${ambulance.current_driver_phone}`}
                              className="mt-1 inline-flex max-w-full items-center gap-2 break-all text-sm text-primary"
                            >
                              <FaPhone className="shrink-0 text-xs" />

                              <span>{ambulance.current_driver_phone}</span>
                            </a>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-base-content/40">
                          Not Assigned
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}

                  <div className="flex items-center justify-between border-t border-base-300 pt-4">
                    <span className="text-sm text-base-content/50">
                      Current Status
                    </span>

                    <AmbulanceStatusBadge status={ambulance.status} />
                  </div>
                </div>

                {/* -----------------------------------------
                      CARD FOOTER
                  ------------------------------------------ */}

                <div className="border-t border-base-300 bg-base-200/30 px-4 py-3">
                  <div className="text-xs text-base-content/50">
                    Ambulance #{index + 1} of {filteredAmbulances.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =====================================================
          SHOWING COUNT
      ====================================================== */}

      {filteredAmbulances.length > 0 && (
        <div className="text-sm text-base-content/60">
          Showing{" "}
          <span className="font-semibold text-base-content">
            {filteredAmbulances.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-base-content">
            {ambulances.length}
          </span>{" "}
          ambulances
        </div>
      )}

      {/* =====================================================
          CREATE AMBULANCE MODAL
      ====================================================== */}

      <CreateAmbulanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default AdminAmbulances;
