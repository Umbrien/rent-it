export const Button = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm
            hover:bg-primary-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {label}
    </button>
  );
};
