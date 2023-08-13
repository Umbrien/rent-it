import React from "react";
import { useRouter } from "next/router";
import { WarehouseCardLoading } from "@/components/warehouse/WarehouseCard";
import { api } from "@/utils/api";
import { AuthInput } from "@/components/auth/Input";
import { WarehouseTypesFilter } from "@/components/warehouse/WarehouseTypesFilter";
import { RentalCard } from "@/components/rental/Rental";

export default function WarehousePage() {
  const router = useRouter();
  const { id } = router.query;
  const warehouseId = Array.isArray(id) ? id[0] : id;

  const warehouse = api.public.warehouse.useQuery(warehouseId ?? "");
  const rentals = api.authed.warehouseRentals.useQuery(warehouseId ?? "");

  return (
    <div className="flex min-h-[var(--h-antinav)] flex-col bg-gray-50 py-12 sm:flex-row sm:px-6 lg:px-8">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-700">
          Warehouse details
        </h2>
        {warehouse.isLoading && <WarehouseCardLoading />}
        {warehouse.data && (
          <>
            <div className="flex w-fit flex-col gap-2">
              <AuthInput
                id="name-en"
                placeholder="Name in Ukrainian"
                value={warehouse.data.nameUk}
              />
              <AuthInput
                id="name-uk"
                placeholder="Name in English"
                value={warehouse.data.nameEn ?? ""}
              />
              <AuthInput
                id="address-uk"
                placeholder="Address in Ukrainian"
                value={warehouse.data.addressUk}
              />
              <AuthInput
                id="daily-rate"
                placeholder="Daily Rate"
                value={warehouse.data.dailyRate}
                type="number"
              />

              <WarehouseTypesFilter
                pathname={`/rent-your-warehouse/${id as string}`}
                title="Warehouse type"
                displayIcon={false}
              />

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm
            hover:bg-primary-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </>
        )}

        <hr className="my-6 border-gray-200" />

        <div>
          <h2>Rentals</h2>
          {rentals.isLoading && <div>Loading...</div>}
          {rentals.data?.map((rental) => (
            <RentalCard
              key={"rental-" + rental.id}
              id={rental.id}
              startDate={rental.startDate}
              endDate={rental.endDate}
              status={rental.status}
              dailyRate={rental.dailyRate}
              username={rental.user.username}
              refetch={rentals.refetch}
            />
          ))}
          {rentals.data?.length === 0 && <div>No rentals</div>}
        </div>
      </div>
    </div>
  );
}
