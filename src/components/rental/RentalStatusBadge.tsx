import type { Rental } from "@prisma/client";
import type colors from "tailwindcss/colors";

function getStatusColor(status: Rental["status"]): keyof typeof colors {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "COMPLETED":
      return "gray";
    case "CANCELLED":
      return "red";
  }
}

export const RentalStatusBadge = ({ status }: { status: Rental["status"] }) => {
  const statusColor = getStatusColor(status);
  return (
    <span
      className={`flex h-fit w-fit items-center rounded-full border px-2 py-1 text-xs font-semibold
        border-${statusColor}-500 text-${statusColor}-500
      `}
    >
      {status}
    </span>
  );
};
