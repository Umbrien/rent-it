import type { Warehouse } from "@prisma/client";
import Link from "next/link";
import type { Url } from "next/dist/shared/lib/router/router";

export const WarehouseStatusBadge = ({
  status,
}: {
  status?: Warehouse["status"];
}) => {
  return (
    <span
      className={`flex h-fit items-center rounded-full border px-2 py-1 text-xs font-semibold ${
        status === "AVAILABLE"
          ? "border-green-500 text-green-500"
          : status === "RENTED"
          ? "border-gray-500 text-gray-500"
          : "border-red-500 text-red-500"
      }`}
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
  return (
    <Link
      href={href}
      className={`flex h-fit items-center rounded-full border px-2 py-1 text-xs font-semibold transition ${
        status === "AVAILABLE"
          ? `border-green-500 ${
              isCurrent ? "bg-green-100 text-green-600" : "text-green-500"
            } hover:bg-green-200 hover:text-green-700`
          : status === "RENTED"
          ? `border-gray-500 ${
              isCurrent ? "bg-gray-100 text-gray-600" : "text-gray-500"
            } hover:bg-gray-200 hover:text-gray-700`
          : `border-red-500 ${
              isCurrent ? "bg-red-100 text-red-600" : "text-red-500"
            } hover:bg-red-200 hover:text-red-700`
      }`}
    >
      {status}
    </Link>
  );
};
