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

export default function WarehousePage() {
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
        <h2 className="mb-6 text-2xl font-bold text-gray-700">
          Rental checkout
        </h2>
        {warehouse.isLoading && <WarehouseCardLoading />}
        {warehouse.data && (
          <WarehouseCard
            id={warehouse.data.id}
            nameUk={warehouse.data.nameUk}
            nameEn={warehouse.data.nameEn}
            typeUk={warehouse.data.warehouseType.nameUk}
            typeEn={warehouse.data.warehouseType.nameEn}
            addressUk={warehouse.data.addressUk}
            dailyRate={warehouse.data.dailyRate}
            ownerName={warehouse.data.owner.username}
            ownerEmail={warehouse.data.owner.email}
            displayDetailsBtn={false}
          />
        )}
        <div className="mt-4">
          <p className="text-gray-600">
            For how many days do you want to rent this warehouse?
          </p>
        </div>
        <AuthInput
          id="days"
          value={days}
          onChange={handleDaysChange}
          type="number"
          placeholder="Days"
          className="mt-2 border-2 border-primary-400 p-2"
        />
        {warehouse.data && (
          <div className="mt-4">
            <p className="text-gray-600">Total Price</p>
            <span>
              {days} days * {warehouse.data.dailyRate} ={" "}
            </span>
            <PriceSpan
              className="text-2xl font-bold"
              price={rentalPrice}
            ></PriceSpan>
          </div>
        )}
        {(user?.balance ?? 0) < rentalPrice && (
          <p className="mt-4 text-red-600">Insufficient balance!</p>
        )}
        <button
          onClick={onSubmit}
          disabled={(user?.balance ?? 0) < rentalPrice}
          className="mt-6 rounded bg-primary-500 px-4 py-2 font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Rent It
        </button>
        {rentSuccess && (
          <p className="mt-4 text-green-600">Rental successful!</p>
        )}
        {mutateError && <p className="mt-4 text-red-600">{mutateError}</p>}
      </div>
    </div>
  );
}
