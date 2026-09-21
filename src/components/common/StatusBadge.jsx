const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "badge-warning",
    },
    assigned: {
      label: "Assigned",
      className: "badge-info",
    },
    en_route: {
      label: "En Route",
      className: "badge-primary",
    },
    completed: {
      label: "Completed",
      className: "badge-success",
    },
    cancelled: {
      label: "Cancelled",
      className: "badge-error",
    },
    available: {
      label: "Available",
      className: "badge-success",
    },
    busy: {
      label: "Busy",
      className: "badge-warning",
    },
    maintenance: {
      label: "Maintenance",
      className: "badge-error",
    },
  };

  const config = statusConfig[status] || {
    label: status || "Unknown",
    className: "badge-ghost",
  };

  return (
    <span className={`badge ${config.className} capitalize`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
