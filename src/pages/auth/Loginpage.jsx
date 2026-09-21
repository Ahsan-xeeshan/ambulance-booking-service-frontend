import { useContext, useState } from "react";

import { FaAmbulance, FaUser, FaLock, FaArrowRight } from "react-icons/fa";

import { toast } from "react-hot-toast";

import { AuthContext } from "../../context";
import { apiCall } from "../../services/api";
import { Link } from "react-router";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // BACKGROUND IMAGE
  // Replace this URL with your preferred ambulance image.
  // =========================================================
  const backgroundImage =
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=2000&q=85";

  // =========================================================
  // LOGIN
  // =========================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      toast.error("ইউজারনেম এবং পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    try {
      // OAuth2 form data
      const formData = new URLSearchParams();

      formData.append("username", username.trim());
      formData.append("password", password);

      // Login
      const data = await apiCall("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      // Validate token
      if (!data?.access_token) {
        throw new Error("Access token পাওয়া যায়নি");
      }

      // Save token
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type || "bearer");

      // Logged-in user
      const loggedInUser = data?.user;

      if (!loggedInUser) {
        throw new Error("User information পাওয়া যায়নি");
      }

      // Save user
      setUser(loggedInUser);

      toast.success("লগইন সফল!");

      // Driver first login
      if (
        loggedInUser.role === "driver" &&
        loggedInUser.must_change_password === true
      ) {
        window.location.href = "/change-password";
        return;
      }

      // Normal login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");

      toast.error(error?.message || "লগইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      />

      {/* =====================================================
          DARK BLUE OVERLAY
      ===================================================== */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/75 to-blue-950/90" />

      {/* =====================================================
          DECORATIVE LIGHT
      ===================================================== */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* =================================================
              LEFT SIDE - BRANDING
          ================================================= */}
          <div className="hidden flex-col justify-center p-10 text-white lg:flex xl:p-14">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                <FaAmbulance className="text-3xl text-blue-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">অ্যাম্বুলেন্স বুকিং</h1>

                <p className="mt-1 text-xs font-medium tracking-widest text-blue-100">
                  EMERGENCY DISPATCH SYSTEM
                </p>
              </div>
            </div>

            {/* Heading */}
            <h2 className="max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
              দ্রুত সেবা,
              <span className="block text-cyan-300">সঠিক সময়ে</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-100 xl:text-base">
              জরুরি মুহূর্তে আপনার প্রয়োজনীয় অ্যাম্বুলেন্স দ্রুত এবং সহজে বুক
              করুন।
            </p>

            {/* Feature Cards */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <FaAmbulance />
                </div>

                <div>
                  <p className="text-sm font-semibold">দ্রুত অ্যাম্বুলেন্স</p>

                  <p className="text-xs text-blue-100">
                    আপনার প্রয়োজন অনুযায়ী
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold">২৪/৭ জরুরি সেবা</p>

                  <p className="text-xs text-blue-100">সবসময় প্রস্তুত</p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE - LOGIN
          ================================================= */}
          <div className="flex items-center justify-center bg-base-100/95 p-6 sm:p-10 lg:bg-base-100/90">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-7 text-center lg:hidden">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg">
                  <FaAmbulance className="text-2xl" />
                </div>

                <h1 className="text-xl font-bold text-base-content">
                  অ্যাম্বুলেন্স বুকিং
                </h1>

                <p className="mt-1 text-[10px] font-semibold tracking-widest text-base-content/50">
                  EMERGENCY DISPATCH SYSTEM
                </p>
              </div>

              {/* Heading */}
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
                  স্বাগতম!
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
                  আপনার অ্যাকাউন্টে লগইন করুন
                </p>
              </div>

              {/* =================================================
                  LOGIN FORM
              ================================================= */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Username */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">ইউজারনেম</span>
                  </label>

                  <label className="input input-bordered flex h-12 items-center gap-3 rounded-xl focus-within:outline-2 focus-within:outline-primary">
                    <FaUser className="text-base-content/40" />

                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="আপনার ইউজারনেম"
                      autoComplete="username"
                      disabled={loading}
                      className="grow"
                      required
                    />
                  </label>
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">পাসওয়ার্ড</span>
                  </label>

                  <label className="input input-bordered flex h-12 items-center gap-3 rounded-xl focus-within:outline-2 focus-within:outline-primary">
                    <FaLock className="text-base-content/40" />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="আপনার পাসওয়ার্ড"
                      autoComplete="current-password"
                      disabled={loading}
                      className="grow"
                      required
                    />
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary h-12 min-h-12 w-full rounded-xl text-base font-bold shadow-lg transition-all hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      লগইন করছি...
                    </>
                  ) : (
                    <>
                      লগইন
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="divider my-6 text-xs text-base-content/40">
                অথবা
              </div>

              {/* Signup */}
              <div className="text-center">
                <p className="text-sm text-base-content/60">
                  নতুন ব্যবহারকারী?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-primary hover:underline"
                  >
                    সাইনআপ করুন
                  </Link>
                </p>
              </div>

              {/* Security Message */}
              <div className="mt-7 rounded-xl bg-primary/5 p-3 text-center">
                <p className="text-xs text-base-content/50">
                  🔒 আপনার অ্যাকাউন্টের তথ্য নিরাপদে সংরক্ষিত হয়
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
