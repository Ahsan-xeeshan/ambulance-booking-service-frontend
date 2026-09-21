const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <span
        className={`loading loading-spinner text-primary ${sizes[size]}`}
      ></span>

      {text && <p className="text-sm text-base-content/60">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
