import React from "react";
import type { User, Rental } from "@prisma/client";
import { RentalStatusBadge } from "@/components/rental/RentalStatusBadge";
import { PriceSpan } from "@/components/NumberSpan";
import { api } from "@/utils/api";
import { Button } from "@/components/UI/Button";
import { useTranslations, useFormatter } from "next-intl";

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
  const t = useTranslations("components.rental.RentalCard");
  const format = useFormatter();
  const formatter = (date: Date) =>
    format.dateTime(date, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
          <p className="text-sm text-gray-500">{t("start-date")}</p>
          <p>{formatter(startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("end-date")}</p>
          <p>{formatter(endDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("daily-rate")}</p>
          <PriceSpan price={dailyRate} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-start gap-5">
        <div>
          <p className="text-sm text-gray-500">{t("status")}</p>
          <RentalStatusBadge status={status} />
        </div>
        {status === "ACTIVE" && (
          <Button label={t("cancel")} onClick={handleCancel} />
        )}
      </div>
    </div>
  );
};
