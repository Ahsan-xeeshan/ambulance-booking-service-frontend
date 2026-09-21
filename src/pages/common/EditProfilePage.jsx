import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaShieldAlt,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";

import { apiCall } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    address: "",
  });

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadUserProfile = async () => {
      try {
        const data = await apiCall("/api/user");

        if (cancelled) return;

        setFormData({
          username: data.username || "",
          email: data.email || "",
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load profile:", error);

          toast.error(
            error?.message || "Profile information could not be loaded",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUserProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setSaving(true);

      const response = await apiCall("/api/edituser", {
        method: "PUT",
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim() || null,
        }),
      });

      toast.success(response?.message || "Profile updated successfully");

      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FaEdit className="text-primary" />

                <h1 className="text-2xl font-bold sm:text-3xl text-primary">
                  Edit Profile
                </h1>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            PROFILE PREVIEW
        =================================================== */}

        <div className="card mb-6 overflow-hidden border border-base-300 bg-base-100 shadow-lg">
          {/* Header */}
          <div className="h-24 bg-primary sm:h-28" />

          <div className="card-body relative pt-0">
            <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="w-24 rounded-full bg-base-100 p-1 shadow-xl sm:w-28">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-content">
                    <span className="text-3xl font-bold">
                      {formData.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 pb-1 text-center sm:text-left">
                <h2 className="text-xl font-bold sm:text-2xl">
                  {formData.full_name || "Your Name"}
                </h2>

                <p className="text-sm text-base-content/60">
                  @{formData.username || "username"}
                </p>
              </div>

              <div className="pb-1">
                <div className="badge badge-primary gap-2 px-3 py-3">
                  <FaShieldAlt />
                  Account
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM CARD
        =================================================== */}

        <div className="card border border-base-300 bg-base-100 shadow-lg">
          <div className="card-body p-5 sm:p-8">
            {/* Form Header */}

            <div className="mb-2">
              <h2 className="text-xl font-bold">Personal Information</h2>

              <p className="mt-1 text-sm text-base-content/60">
                Keep your information up to date so we can contact you when
                necessary.
              </p>
            </div>

            <div className="divider" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* =================================================
                  NAME + USERNAME
              ================================================= */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Full Name */}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Full Name</legend>

                  <label className="input input-bordered input-primary flex w-full items-center gap-3">
                    <FaUser className="text-base-content/40" />

                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="grow"
                    />
                  </label>

                  <p className="label text-xs text-base-content/50">
                    Your full name
                  </p>
                </fieldset>

                {/* Username */}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Username</legend>

                  <label className="input input-bordered flex w-full items-center gap-3">
                    <span className="text-base-content/40">@</span>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className="grow"
                    />
                  </label>

                  <p className="label text-xs text-base-content/50">
                    Your unique username
                  </p>
                </fieldset>
              </div>

              {/* =================================================
                  EMAIL + PHONE
              ================================================= */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Email */}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email Address</legend>

                  <label className="input input-bordered flex w-full items-center gap-3">
                    <FaEnvelope className="text-base-content/40" />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="grow"
                    />
                  </label>

                  <p className="label text-xs text-base-content/50">
                    Your registered email address
                  </p>
                </fieldset>

                {/* Phone */}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone Number</legend>

                  <label className="input input-bordered flex w-full items-center gap-3">
                    <FaPhone className="text-base-content/40" />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="grow"
                    />
                  </label>

                  <p className="label text-xs text-base-content/50">
                    We may contact you using this number
                  </p>
                </fieldset>
              </div>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Address</legend>

                <label className="textarea textarea-bordered focus-within:textarea-primary flex w-full items-start gap-3">
                  <FaMapMarkerAlt className="mt-1.5 shrink-0 text-base-content/40" />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="grow resize-none"
                    rows={4}
                  />
                </label>

                <p className="label text-xs text-base-content/50">
                  Your registered pickup address
                </p>
              </fieldset>

              {/* =================================================
                  SECURITY NOTICE
              ================================================= */}

              <div className="alert alert-info">
                <FaShieldAlt className="text-lg" />

                <div>
                  <h3 className="font-semibold">
                    Keep your information accurate
                  </h3>

                  <p className="text-sm">
                    Your address and phone number may be used when arranging
                    ambulance services.
                  </p>
                </div>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="divider" />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link to="/profile/me" className="btn btn-outline btn-error">
                  Back
                </Link>

                <button
                  type="submit"
                  className="btn btn-primary min-w-40"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===================================================
            FOOTER NOTE
        =================================================== */}

        <div className="mt-4 text-center">
          <p className="text-xs text-base-content/50">
            Changes will be saved to your ambulance dispatch account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
