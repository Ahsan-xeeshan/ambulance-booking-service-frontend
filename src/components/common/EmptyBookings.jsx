import { FaClipboardList } from "react-icons/fa";

const EmptyBookings = () => (
  <div className="px-4 py-16 text-center">
    <FaClipboardList className="mx-auto mb-4 text-4xl text-base-content/20" />

    <h3 className="font-semibold">No bookings found</h3>

    <p className="mt-1 text-sm text-base-content/50">
      Try changing your search or status filter.
    </p>
  </div>
);

export default EmptyBookings;
