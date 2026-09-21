import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaAmbulance,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { apiCall } from "../../services/api";

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const data = await apiCall("/api/dashboard/stats");

        if (!cancelled) {
          setStats(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.log(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="mb-6 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge badge-primary badge-outline mb-2 mt-2">
              User Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl text-gray-500">
              Welcome back!
            </h1>

            <p className="mt-1 text-sm  sm:text-base text-gray-500">
              Here's an overview of your ambulance bookings.
            </p>
          </div>

          <div className="hidden rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary sm:block ">
            Emergency Ambulance Service
          </div>
        </div>
      </div>

      {/* =========================
          STATISTICS
      ========================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-5">
        {/* Total Bookings */}
        <div className="card border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="card-body p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Total Bookings
                </p>

                <h2 className="mt-2 text-3xl font-bold text-base-content">
                  {stats?.total_bookings || 0}
                </h2>

                <p className="mt-1 text-xs text-base-content/50">
                  All your ambulance bookings
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                <FaAmbulance />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="card border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="card-body p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Pending Bookings
                </p>

                <h2 className="mt-2 text-3xl font-bold text-warning">
                  {stats?.pending_bookings || 0}
                </h2>

                <p className="mt-1 text-xs text-base-content/50">
                  Waiting for assignment
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-2xl text-warning">
                <FaClock />
              </div>
            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="card border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="card-body p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">
                  Completed Bookings
                </p>

                <h2 className="mt-2 text-3xl font-bold text-success">
                  {stats?.completed_bookings || 0}
                </h2>

                <p className="mt-1 text-xs text-base-content/50">
                  Successfully completed
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-2xl text-success">
                <FaCheckCircle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          QUICK ACTIONS
      ========================== */}
      <div className="mt-8 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold sm:text-2xl text-purple-400">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Quickly access your ambulance services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-5">
          {/* Book Ambulance */}
          <Link
            to="/user/new-booking"
            className="group card border border-primary/20 bg-primary text-primary-content shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="card-body p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-content/15 text-xl">
                    <FaAmbulance />
                  </div>

                  <h3 className="text-lg font-bold">Book an Ambulance</h3>

                  <p className="mt-1 text-sm opacity-80">
                    Request an ambulance for your emergency.
                  </p>
                </div>

                <FaArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* My Bookings */}
          <Link
            to="/user/my-bookings"
            className="group card border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
          >
            <div className="card-body p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-xl text-primary">
                    <FaClock />
                  </div>

                  <h3 className="text-lg font-bold">My Bookings</h3>

                  <p className="mt-1 text-sm text-base-content/60">
                    View and track your ambulance bookings.
                  </p>
                </div>

                <FaArrowRight className="text-xl text-base-content/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
