import { useContext, useState } from "react";
import { FaLock, FaKey } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

import { AuthContext } from "../../context";
import { apiCall } from "../../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  // -----------------------------------------------------
  // Handle input change
  // -----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------------------
  // Submit
  // -----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Current password
    if (!formData.current_password) {
      toast.error("বর্তমান পাসওয়ার্ড দিন");
      return;
    }

    // New password
    if (!formData.new_password) {
      toast.error("নতুন পাসওয়ার্ড দিন");
      return;
    }

    // Minimum password length
    if (formData.new_password.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    // Confirm password
    if (!formData.confirm_password) {
      toast.error("Confirm password দিন");
      return;
    }

    // Password match
    if (formData.new_password !== formData.confirm_password) {
      toast.error("নতুন পাসওয়ার্ড এবং Confirm password মিলছে না");
      return;
    }

    // Same password check
    if (formData.current_password === formData.new_password) {
      toast.error(
        "নতুন পাসওয়ার্ড অবশ্যই বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে",
      );
      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // API request
      // -------------------------------------------------

      const response = await apiCall("/api/passwordchange", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: formData.current_password,

          new_password: formData.new_password,
        }),
      });

      // -------------------------------------------------
      // Update AuthContext
      // -------------------------------------------------

      if (user) {
        setUser({
          ...user,
          must_change_password: false,
        });
      }

      toast.success(response?.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");

      // -------------------------------------------------
      // Go to dashboard
      // -------------------------------------------------

      navigate("/dashboard");
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(error?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <FaLock className="text-3xl text-blue-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>

          {user?.must_change_password && (
            <p className="mt-2 text-sm text-gray-500">
              প্রথম লগইনের নিরাপত্তার জন্য আপনার পাসওয়ার্ড পরিবর্তন করুন।
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>

            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Current password"
                className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="New password"
                className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">কমপক্ষে ৬ অক্ষর</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Password পরিবর্তন হচ্ছে..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
