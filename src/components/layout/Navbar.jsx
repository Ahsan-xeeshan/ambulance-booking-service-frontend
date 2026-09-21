import { useContext } from "react";
import { Link } from "react-router";
import {
  FaAmbulance,
  FaBars,
  FaUser,
  FaKey,
  FaChevronDown,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { AuthContext } from "../../context";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  const userInitial = user?.full_name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-40 border-b border-blue-800/30 bg-gradient-to-r from-blue-700 via-blue-700 to-blue-800 text-white shadow-lg">
      <div className="mx-auto flex h-16 items-center justify-between px-3 sm:px-5 lg:px-6">
        {/* =====================================================
            LEFT SIDE
        ===================================================== */}
        <div className="flex min-w-0 items-center">
          {/* Mobile Sidebar Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl transition hover:bg-white/10 active:scale-95 md:hidden"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            {/* Logo Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md transition duration-200 group-hover:scale-105">
              <FaAmbulance className="text-xl text-blue-700" />
            </div>

            {/* Logo Text */}
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight sm:text-lg">
                অ্যাম্বুলেন্স বুকিং
              </h1>

              <p className="hidden text-[10px] font-medium tracking-wider text-blue-100 sm:block">
                EMERGENCY DISPATCH SYSTEM
              </p>
            </div>
          </Link>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}
        <div className="flex items-center">
          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            {/* Dropdown Button */}
            <button
              tabIndex={0}
              type="button"
              aria-label="Open user menu"
              className="group flex items-center gap-2 rounded-xl p-1.5 transition duration-200 hover:bg-white/10 focus:outline-none"
            >
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-white text-blue-700 shadow-md sm:h-11 sm:w-11">
                  <span className="text-base font-bold sm:text-lg">
                    {userInitial}
                  </span>
                </div>
              </div>

              {/* User Name & Role */}
              <div className="hidden max-w-36 text-left sm:block lg:max-w-48">
                <p className="truncate text-sm font-semibold leading-tight">
                  {user?.full_name || "User"}
                </p>

                <p className="mt-0.5 truncate text-xs capitalize text-blue-100">
                  {user?.role || "User"}
                </p>
              </div>

              {/* Chevron */}
              <FaChevronDown className="mr-1 text-[10px] text-blue-100 transition-transform duration-200 group-focus:rotate-180" />
            </button>

            {/* =================================================
                DROPDOWN MENU
            ================================================= */}
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[50] mt-3 w-[280px] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-0 text-base-content shadow-2xl"
            >
              {/* User Header */}
              <li className="pointer-events-none">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-white">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white text-blue-700 shadow-md">
                      <span className="text-xl font-bold">{userInitial}</span>
                    </div>

                    {/* User Details */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user?.full_name || "User"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-blue-100">
                        {user?.email || ""}
                      </p>

                      <span className="mt-1.5 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold capitalize text-white">
                        {user?.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>
              </li>

              {/* Menu Content */}
              <div className="p-2">
                {/* Profile */}
                <li>
                  <Link
                    to="/profile/me"
                    className="rounded-xl px-3 py-3 transition hover:bg-base-200"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <FaUser className="text-sm text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Profile</p>
                      <p className="text-xs text-base-content/50">
                        View your profile
                      </p>
                    </div>
                  </Link>
                </li>

                {/* Change Password */}
                <li>
                  <Link
                    to="/change-password"
                    className="rounded-xl px-3 py-3 transition hover:bg-base-200"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                      <FaKey className="text-sm text-warning" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Change Password</p>
                      <p className="text-xs text-base-content/50">
                        Update your password
                      </p>
                    </div>
                  </Link>
                </li>

                <div className="divider my-1" />

                {/* Logout */}
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl px-3 py-3 text-error transition hover:bg-error/10"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/10">
                      <FiLogOut className="text-base" />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold">Logout</p>
                      <p className="text-xs text-base-content/50">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
