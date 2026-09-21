/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ title, value, icon, className = "text-primary" }) => {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">{title}</p>

            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-xl ${className}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;