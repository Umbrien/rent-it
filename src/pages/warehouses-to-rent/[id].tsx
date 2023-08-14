import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  WarehouseCard,
  WarehouseCardLoading,
} from "@/components/warehouse/WarehouseCard";
import { PriceSpan } from "@/components/NumberSpan";
import { api } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { AuthInput } from "@/components/auth/Input";
import { useTranslations } from "next-intl";

export default function WarehousePage() {
  const t = useTranslations("pages.Warehouses-To-Rent-ID");

  const router = useRouter();
  const { id } = router.query;
  const warehouseId = Array.isArray(id) ? id[0] : id;

  const warehouse = api.public.warehouse.useQuery(warehouseId ?? "");

  const { user, login } = useAuth();
  const [rentSuccess, setRentSuccess] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);

  const [days, setDays] = useState(1);
  const rentalPrice = (warehouse.data?.dailyRate ?? 0) * days;

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const parsedValue = parseInt(value);
    setDays(parsedValue);
  };

  const mutation = api.authed.rentWarehouse.useMutation({
    onSuccess: ({ user }) => {
      login(user);
      setRentSuccess(true);
    },
    onError: (error) => {
      setMutateError(error.message);
    },
    onMutate: () => {
      setMutateError(null);
      setRentSuccess(false);
    },
  });

  const onSubmit = () => {
    mutation.mutate({
      warehouseId: warehouse.data?.id ?? "",
      days,
    });
  };

  return (
    <div className="flex min-h-[var(--h-antinav)] flex-col bg-gray-50 py-12 sm:flex-row sm:px-6 lg:px-8">
      <div className="sm:order-2 sm:w-3/4">
        <h2 className="mb-6 text-2xl font-bold text-gray-700">{t("title")}</h2>
        {warehouse.isLoading && <WarehouseCardLoading />}
        {warehouse.data && (
          <WarehouseCard
            nameUk={warehouse.data.nameUk}
            nameEn={warehouse.data.nameEn}
            typeUk={warehouse.data.warehouseType.nameUk}
            typeEn={warehouse.data.warehouseType.nameEn}
            addressUk={warehouse.data.addressUk}
            dailyRate={warehouse.data.dailyRate}
            ownerName={warehouse.data.owner.username}
            ownerEmail={warehouse.data.owner.email}
          />
        )}
        <div className="mt-4">
          <p className="text-gray-600">{t("how-many-days")}</p>
        </div>
        <AuthInput
          id="days"
          value={days}
          onChange={handleDaysChange}
          type="number"
          placeholder={t("days")}
          className="mt-2 border-2 border-primary-400 p-2"
        />
        {warehouse.data && (
          <div className="mt-4">
            <p className="text-gray-600">{t("total")}</p>
            <span>
              {days} {t("days", { days })} * {warehouse.data.dailyRate} ={" "}
            </span>
            <PriceSpan
              className="text-2xl font-bold"
              price={rentalPrice}
            ></PriceSpan>
          </div>
        )}
        {(user?.balance ?? 0) < rentalPrice && (
          <p className="mt-4 text-red-600">{t("insufficient-balance")}</p>
        )}
        <button
          onClick={onSubmit}
          disabled={(user?.balance ?? 0) < rentalPrice}
          className="mt-6 rounded bg-primary-500 px-4 py-2 font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {t("rent-it")}
        </button>
        {rentSuccess && (
          <p className="mt-4 text-green-600">{t("rental-successful")}</p>
        )}
        {mutateError && <p className="mt-4 text-red-600">{mutateError}</p>}
      </div>
    </div>
  );
}
