import {
  FaFileAlt,
  FaCar,
  FaUsers,
  FaPlus,
  FaClipboardList,
  FaHistory,
  FaTimes,
  FaAmbulance,
} from "react-icons/fa";

import { MdOutlineDashboard } from "react-icons/md";
import { NavLink } from "react-router";

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const getMenuItems = () => {
    const commonItems = [
      {
        icon: MdOutlineDashboard,
        label: "ড্যাশবোর্ড",
        path: "/dashboard",
      },
    ];

    if (userRole === "admin") {
      return [
        ...commonItems,
        {
          icon: FaFileAlt,
          label: "বুকিং ম্যানেজ",
          path: "/admin/bookings",
        },
        {
          icon: FaCar,
          label: "অ্যাম্বুলেন্স",
          path: "/admin/ambulances",
        },
        {
          icon: FaUsers,
          label: "ড্রাইভার",
          path: "/admin/drivers",
        },
      ];
    }

    if (userRole === "user") {
      return [
        ...commonItems,
        {
          icon: FaPlus,
          label: "নতুন বুকিং",
          path: "/user/new-booking",
        },
        {
          icon: FaClipboardList,
          label: "আমার বুকিং",
          path: "/user/my-bookings",
        },
      ];
    }

    if (userRole === "driver") {
      return [
        ...commonItems,
        {
          icon: FaClipboardList,
          label: "আসাইন্ড ট্রিপ",
          path: "/driver/trips",
        },
        {
          icon: FaHistory,
          label: "সম্পন্ন ট্রিপ",
          path: "/driver/completed",
        },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-base-300 bg-base-100 shadow-xl transition-transform duration-300 ease-in-out md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* =================================================
            MOBILE CLOSE BUTTON
        ================================================= */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          className="btn btn-circle btn-ghost absolute right-3 top-3 text-base-content/60 hover:bg-base-200 hover:text-error md:hidden"
        >
          <FaTimes />
        </button>

        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}
        <div className="border-b border-base-300 px-5 py-6 md:hidden">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
              <FaAmbulance className="text-xl" />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-base-content">
                অ্যাম্বুলেন্স বুকিং
              </h2>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                Dispatch System
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            MENU
        ================================================= */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {/* Section Title */}
          <div className="mb-3 px-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
              মেনু
            </p>
          </div>

          <ul className="menu w-full gap-1 p-0">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Only close sidebar on mobile
                      if (window.innerWidth < 768) {
                        toggleSidebar();
                      }
                    }}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-content shadow-md"
                          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon */}
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-white/15"
                              : "bg-base-200 group-hover:bg-base-300"
                          }`}
                        >
                          <Icon className="text-lg" />
                        </span>

                        {/* Label */}
                        <span className="flex-1">{item.label}</span>

                        {/* Active Indicator */}
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-primary-content" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}
        <div className="border-t border-base-300 p-4">
          <div className="rounded-xl bg-base-200 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-base-content">
                  সিস্টেম সক্রিয়
                </p>

                <p className="truncate text-[10px] text-base-content/50">
                  Emergency Dispatch
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
