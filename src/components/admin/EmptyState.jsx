import { FaClipboardList } from "react-icons/fa";

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-xl border border-dashed border-base-300 bg-base-100 py-10 text-center">
      <FaClipboardList className="mx-auto mb-3 text-3xl text-base-content/20" />

      <p className="text-sm text-base-content/50">{text}</p>
    </div>
  );
};

export default EmptyState;
