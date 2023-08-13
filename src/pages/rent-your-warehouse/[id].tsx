import React from "react";
import { useRouter } from "next/router";
import { WarehouseCardLoading } from "@/components/warehouse/WarehouseCard";
import { api } from "@/utils/api";
import { AuthInput } from "@/components/auth/Input";
import { WarehouseTypesFilter } from "@/components/warehouse/WarehouseTypesFilter";
import { RentalCard } from "@/components/rental/Rental";
import type { WarehouseStatus } from "@prisma/client";
import { Alert } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button";
import { WarehouseStatusBadge } from "@/components/warehouse/WarehouseStatusBadge";

export default function WarehousePage() {
  const router = useRouter();
  const { id } = router.query;
  const warehouseId = Array.isArray(id) ? id[0] : id;
  if (!warehouseId) return <div>Not found</div>;

  const warehouse = api.public.warehouse.useQuery(warehouseId);
  const rentals = api.authed.warehouseRentals.useQuery(warehouseId);
  const lastRental = rentals.data?.slice(-1)[0];

  const updateWarehouseStatus = api.authed.updateWarehouseStatus.useMutation({
    onSuccess: async () => {
      await warehouse.refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleUpdateWarehouseStatus = async (
    status: Exclude<WarehouseStatus, "RENTED">
  ) => {
    await updateWarehouseStatus.mutateAsync({
      warehouseId,
      status,
    });
  };

  const deleteWarehouse = api.authed.deleteWarehouse.useMutation({
    onSuccess: async () => {
      await router.push("/rent-your-warehouse");
    },
  });

  const handleDeleteWarehouse = async () => {
    await deleteWarehouse.mutateAsync(warehouseId);
  };

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

              <Button label="Update" />
            </div>
          </>
        )}

        <hr className="my-6 border-gray-200" />

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-700">Rentals</h2>
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

        <hr className="my-6 border-gray-200" />

        <div>
          <h2 className="mb-6 flex items-center gap-4 text-2xl font-bold text-gray-700">
            Warehouse status{" "}
            {warehouse.data && (
              <WarehouseStatusBadge status={warehouse.data?.status} />
            )}
          </h2>
          {rentals.isLoading && <div>Loading...</div>}
          {(lastRental?.status === "ACTIVE" ||
            warehouse.data?.status === "RENTED") && (
            <Alert
              message="You can't change the status of the warehouse while it is rented."
              color="yellow"
            />
          )}
          {warehouse.data?.status === "AVAILABLE" && (
            <Button
              label="Make unavailable"
              onClick={() => void handleUpdateWarehouseStatus("UNAVAILABLE")}
            />
          )}
          {warehouse.data?.status === "UNAVAILABLE" && (
            <Button
              label="Make available"
              onClick={() => void handleUpdateWarehouseStatus("AVAILABLE")}
            />
          )}
        </div>
        <hr className="my-6 border-gray-200" />

        <div>
          <h2 className="mb-6 flex items-center gap-4 text-2xl font-bold text-gray-700">
            Delete warehouse
          </h2>
          {(lastRental?.status === "ACTIVE" ||
            warehouse.data?.status === "RENTED") && (
            <Alert
              message="You can't delete the warehouse while it is rented."
              color="yellow"
            />
          )}
          <Alert
            message="Deleting the warehouse will also delete all the rentals associated with it."
            color="red"
          />
          <Button label="Delete" onClick={() => void handleDeleteWarehouse()} />
        </div>
      </div>
    </div>
  );
}
