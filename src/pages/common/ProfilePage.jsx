import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdBadge,
  FaCheckCircle,
  FaTimesCircle,
  FaAmbulance,
  FaRoute,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

import { apiCall } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router";
import FormatDate from "../../components/common/FormatDate";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const data = await apiCall("/api/user");

      setUser(data);
    } catch (error) {
      console.error("Failed to load user profile:", error);

      toast.error(error?.message || "প্রোফাইল তথ্য লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUserProfile();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>প্রোফাইল তথ্য পাওয়া যায়নি।</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}
      <div className="card border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body p-5 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg sm:h-28 sm:w-28">
                <span className="text-4xl font-bold">
                  {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {user.full_name}
              </h1>

              <p className="mt-1 text-base-content/60">@{user.username}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="badge badge-primary gap-2">
                  <FaIdBadge />
                  {user.role}
                </span>

                {user.is_active ? (
                  <span className="badge badge-success gap-2">
                    <FaCheckCircle />
                    Active
                  </span>
                ) : (
                  <span className="badge badge-error gap-2">
                    <FaTimesCircle />
                    Inactive
                  </span>
                )}
              </div>
            </div>
            <Link to="/profile/edit" className="btn btn-outline btn-secondary">
              <FaEdit />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}
      <div className="mt-6">
        <div className="mb-3">
          <h2 className="text-xl font-bold">Personal Information</h2>

          <p className="text-sm text-base-content/60">
            Your registered account information
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Full Name */}
          <ProfileInfo
            icon={<FaUser />}
            label="Full Name"
            value={user.full_name}
          />

          {/* Username */}
          <ProfileInfo
            icon={<FaIdBadge />}
            label="Username"
            value={user.username}
          />

          {/* Email */}
          <ProfileInfo icon={<FaEnvelope />} label="Email" value={user.email} />

          {/* Phone */}
          <ProfileInfo icon={<FaPhone />} label="Phone" value={user.phone} />

          {/* Address */}
          <div className="card border border-base-300 bg-base-100 shadow-sm md:col-span-2">
            <div className="card-body p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FaMapMarkerAlt />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-base-content/60">Address</p>

                  <p className="mt-1 wrap-break-word font-medium">
                    {user.address || "Address not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}
      <div className="mt-8">
        <div className="mb-3">
          <h2 className="text-xl font-bold">Account Information</h2>

          <p className="text-sm text-base-content/60">
            Your account status and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Role */}
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FaIdBadge />
                </div>

                <div>
                  <p className="text-sm text-base-content/60">Account Role</p>

                  <p className="mt-1 font-semibold capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 text-success">
                  {user.is_active ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>

                <div>
                  <p className="text-sm text-base-content/60">Account Status</p>

                  <p className="mt-1 font-semibold">
                    {user.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DRIVER INFORMATION
      ===================================================== */}
      {user.role === "driver" && <DriverInformation user={user} />}
    </div>
  );
};

/* =========================================================
   PROFILE INFO COMPONENT
========================================================= */

const ProfileInfo = ({ icon, label, value }) => {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm text-base-content/60">{label}</p>

            <p className="mt-1 wrap-break-word font-semibold">
              {value || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DRIVER INFORMATION
========================================================= */

const DriverInformation = ({ user }) => {
  const trip = user.assigned_trip;
  const ambulance = user.assigned_ambulance;

  return (
    <div className="mt-8">
      <div className="mb-3">
        <h2 className="text-xl font-bold">Driver Information</h2>

        <p className="text-sm text-base-content/60">
          Your current ambulance assignment
        </p>
      </div>

      {!user.is_assigned ? (
        <div className="alert">
          <FaRoute />

          <div>
            <h3 className="font-semibold">No Active Trip</h3>

            <p className="text-sm">
              You currently don't have an assigned trip.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* =================================================
              ASSIGNED TRIP
          ================================================= */}
          {trip && (
            <div className="card border border-base-300 bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaRoute />
                  </div>

                  <div>
                    <h3 className="font-bold">Active Trip</h3>

                    <p className="text-sm text-base-content/60">
                      Booking #{trip.id}
                    </p>
                  </div>
                </div>

                <div className="divider my-2" />

                <div className="space-y-4">
                  <InfoRow label="Patient Name" value={trip.patient_name} />

                  <InfoRow label="Patient Phone" value={trip.patient_phone} />

                  <InfoRow label="Pickup Address" value={trip.pickup_address} />

                  <InfoRow
                    label="Dropoff Address"
                    value={trip.dropoff_address}
                  />

                  <InfoRow label="Trip Status" value={trip.status} />

                  <InfoRow
                    label="Booking Time"
                    value={<FormatDate date={trip.booking_time} />}
                  />

                  <InfoRow
                    label="Assigned Time"
                    value={<FormatDate date={trip.assigned_time} />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              ASSIGNED AMBULANCE
          ================================================= */}
          {ambulance && (
            <div className="card border border-base-300 bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FaAmbulance />
                  </div>

                  <div>
                    <h3 className="font-bold">Assigned Ambulance</h3>

                    <p className="text-sm text-base-content/60">
                      Current ambulance
                    </p>
                  </div>
                </div>

                <div className="divider my-2" />

                <div className="space-y-4">
                  <InfoRow
                    label="Registration Number"
                    value={ambulance.registration_number}
                  />

                  <InfoRow
                    label="Ambulance Type"
                    value={ambulance.ambulance_type}
                  />

                  <InfoRow label="Status" value={ambulance.status} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm text-base-content/60">{label}</p>

      <p className="mt-1 wrap-break-word font-medium">{value || "Not available"}</p>
    </div>
  );
};

export default ProfilePage;
