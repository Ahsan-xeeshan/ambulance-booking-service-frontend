const SectionHeader = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default SectionHeader;
