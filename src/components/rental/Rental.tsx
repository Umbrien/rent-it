import React from "react";
import type { User, Rental } from "@prisma/client";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { PriceSpan } from "@/components/NumberSpan";
import { prettyDate } from "@/utils/date";
import { api } from "@/utils/api";
import { Button } from "@/components/UI/Button";

interface RentalProps {
  id: Rental["id"];
  startDate: Rental["startDate"];
  endDate: Rental["endDate"];
  status: Rental["status"];
  dailyRate: Rental["dailyRate"];
  username: User["username"];
  refetch: () => Promise<unknown>;
}

export const RentalCard = ({
  id,
  startDate,
  endDate,
  status,
  dailyRate,
  username,
  refetch,
}: RentalProps) => {
  const mutation = api.authed.stopRental.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleCancel = () => {
    mutation.mutate(id);
  };

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-medium">{username}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p>{prettyDate(startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p>{prettyDate(endDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Daily Rate</p>
          <PriceSpan price={dailyRate} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-start gap-5">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <RentalStatusBadge status={status} />
        </div>
        {status === "ACTIVE" && (
          <Button label="Cancel" onClick={handleCancel} />
        )}
      </div>
    </div>
  );
};
