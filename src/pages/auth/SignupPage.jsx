import { useState } from "react";
import {
  FaAmbulance,
  FaUser,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaArrowRight,
  FaSignInAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router";

import { apiCall } from "../../services/api";

// =========================================================
// BACKGROUND IMAGE
// Replace this URL with any ambulance image you prefer
// =========================================================
const backgroundImage =
  "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=2000&q=85";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await apiCall("/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      toast.success("সাইনআপ সফল!");

      setFormData({
        username: "",
        email: "",
        full_name: "",
        phone: "",
        password: "",
        address: "",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    } catch (error) {
      toast.error(error.message || "সাইনআপ ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Blue gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/80 via-blue-900/40 to-slate-950/90" />

      {/* Decorative blur circles */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-2">
              {/* =================================================
                  LEFT BRANDING SECTION
              ================================================== */}
              <div className="relative hidden min-h-180 flex-col justify-between p-10 text-white lg:flex xl:p-14">
                {/* Background glow */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-700/30 via-blue-900/10 to-transparent" />

                <div className="relative z-10">
                  {/* Logo */}
                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-md">
                      <FaAmbulance className="text-3xl text-cyan-300" />
                    </div>

                    <div>
                      <h1 className="text-2xl font-bold">অ্যাম্বুলেন্স</h1>
                      <p className="text-sm text-blue-100">
                        Emergency Dispatch System
                      </p>
                    </div>
                  </div>

                  {/* Heading */}
                  <div className="max-w-lg">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                      দ্রুত ও নির্ভরযোগ্য সেবা
                    </div>

                    <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
                      আপনার জরুরি
                      <span className="block text-cyan-300">
                        অ্যাম্বুলেন্স সেবা
                      </span>
                      এখন আরও সহজ।
                    </h2>

                    <p className="mt-6 max-w-md text-base leading-7 text-blue-100/80">
                      একটি অ্যাকাউন্ট তৈরি করুন এবং দ্রুত অ্যাম্বুলেন্স বুকিং ও
                      জরুরি পরিবহন সেবা গ্রহণ করুন।
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-10 space-y-4">
                    <Feature
                      number="01"
                      title="সহজ রেজিস্ট্রেশন"
                      description="মাত্র কয়েকটি তথ্য দিয়ে অ্যাকাউন্ট তৈরি করুন"
                    />

                    <Feature
                      number="02"
                      title="দ্রুত অ্যাম্বুলেন্স বুকিং"
                      description="জরুরি প্রয়োজনে সহজেই অ্যাম্বুলেন্স বুক করুন"
                    />

                    <Feature
                      number="03"
                      title="নিরাপদ ও নির্ভরযোগ্য"
                      description="আপনার তথ্য নিরাপদভাবে সংরক্ষণ করা হয়"
                    />
                  </div>
                </div>

                {/* Bottom text */}
                <div className="relative z-10 mt-10 flex items-center gap-2 text-sm text-blue-200/60">
                  <span className="h-px w-10 bg-blue-300/30" />
                  Emergency Ambulance Dispatch System
                </div>
              </div>

              {/* =================================================
                  RIGHT SIGNUP SECTION
              ================================================== */}
              <div className="bg-base-100/95 p-6 sm:p-8 md:p-10 xl:p-12">
                {/* Mobile logo */}
                <div className="mb-7 flex items-center justify-center gap-3 lg:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg">
                    <FaAmbulance className="text-2xl" />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold">অ্যাম্বুলেন্স</h1>
                    <p className="text-xs opacity-60">
                      Emergency Dispatch System
                    </p>
                  </div>
                </div>

                {/* Header */}
                <div className="mb-7">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1 w-8 rounded-full bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Create Account
                    </span>
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    অ্যাকাউন্ট তৈরি করুন
                  </h2>

                  <p className="mt-2 text-sm opacity-60">
                    আপনার তথ্য দিয়ে একটি নতুন অ্যাকাউন্ট তৈরি করুন।
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Username + Full Name */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Username */}
                    <InputField
                      icon={<FaUser />}
                      label="ইউজারনেম"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="ইউজারনেম"
                      required
                    />

                    {/* Full Name */}
                    <InputField
                      icon={<FaUserCircle />}
                      label="পূর্ণ নাম"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="আপনার নাম"
                      required
                    />
                  </div>

                  {/* Email */}
                  <InputField
                    icon={<FaEnvelope />}
                    label="ইমেইল"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />

                  {/* Phone */}
                  <InputField
                    icon={<FaPhone />}
                    label="ফোন নম্বর"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    required
                  />

                  {/* Address */}
                  <InputField
                    icon={<FaMapMarkerAlt />}
                    label="ঠিকানা"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="আপনার বর্তমান ঠিকানা"
                    required
                  />

                  {/* Password */}
                  <InputField
                    icon={<FaLock />}
                    label="পাসওয়ার্ড"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="একটি শক্তিশালী পাসওয়ার্ড দিন"
                    required
                  />

                  {/* Password hint */}
                  <div className="flex items-start gap-2 rounded-xl bg-base-200/70 px-4 py-3 text-xs opacity-70">
                    <FaLock className="mt-0.5 shrink-0" />
                    <span>
                      আপনার অ্যাকাউন্ট নিরাপদ রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার
                      করুন।
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary mt-2 h-13 w-full rounded-xl text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        সাইনআপ করছি...
                      </>
                    ) : (
                      <>
                        অ্যাকাউন্ট তৈরি করুন
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="divider my-6 text-xs opacity-40">অথবা</div>

                {/* Login */}
                <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4 text-center">
                  <p className="text-sm opacity-70">
                    ইতিমধ্যে আপনার অ্যাকাউন্ট আছে?
                  </p>

                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm mt-2 gap-2 text-primary hover:bg-primary/10"
                  >
                    <FaSignInAlt />
                    লগইন করুন
                  </Link>
                </div>

                {/* Security */}
                <div className="mt-6 text-center text-xs opacity-40">
                  🔒 আপনার ব্যক্তিগত তথ্য নিরাপদ থাকবে
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-white/40">
            © {new Date().getFullYear()} Emergency Ambulance Dispatch System
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   REUSABLE INPUT COMPONENT
========================================================= */
const InputField = ({
  icon,
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="form-control">
      <label className="mb-2 text-sm font-semibold">{label}</label>

      <label className="input input-bordered flex h-12 w-full items-center gap-3 rounded-xl bg-base-100 transition-all focus-within:border-primary focus-within:outline-2 focus-within:outline-primary/20">
        <span className="text-sm text-primary">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="grow bg-transparent text-sm"
          required={required}
        />
      </label>
    </div>
  );
};

/* =========================================================
   FEATURE COMPONENT
========================================================= */
const Feature = ({ number, title, description }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-xs font-bold text-cyan-300 backdrop-blur-md">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>

        <p className="mt-1 text-sm text-blue-100/60">{description}</p>
      </div>
    </div>
  );
};

export default SignupPage;
