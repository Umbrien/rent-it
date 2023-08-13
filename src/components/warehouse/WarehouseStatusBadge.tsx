import type { Warehouse } from "@prisma/client";
import Link from "next/link";
import type { Url } from "next/dist/shared/lib/router/router";
import type colors from "tailwindcss/colors";

function getStatusColor(status: Warehouse["status"]): keyof typeof colors {
  switch (status) {
    case "AVAILABLE":
      return "green";
    case "RENTED":
      return "gray";
    case "UNAVAILABLE":
      return "red";
  }
}

export const WarehouseStatusBadge = ({
  status,
}: {
  status: Warehouse["status"];
}) => {
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

export const WarehouseStatusBadgeLink = ({
  status,
  href,
  isCurrent = false,
}: {
  status: Warehouse["status"];
  href: Url;
  isCurrent: boolean;
}) => {
  const statusColor = getStatusColor(status);

  return (
    <Link
      href={href}
      className={`flex h-fit w-fit items-center rounded-full border px-2 py-1 text-xs font-semibold transition
      border-${statusColor}-500
      ${isCurrent ? `bg-${statusColor}-100` : `text-${statusColor}-500`}
      hover:bg-${statusColor}-200 hover:text-${statusColor}-700
      `}
    >
      {status}
    </Link>
  );
};
