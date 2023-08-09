import React from "react";
import { WarehouseTypesFilter } from "@/components/warehouse/WarehouseTypesFilter";
import {
  WarehouseCard,
  WarehouseCardLoading,
  WarehouseCardNotFound,
} from "@/components/warehouse/WarehouseCard";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { WarehouseStatus } from "@prisma/client";
import { mapParamToEnum } from "@/utils";
import { WarehouseStatusFilter } from "@/components/warehouse/WarehouseStatusFilter";

export default function WarehousesToRent() {
  const router = useRouter();
  const { type, status } = router.query;
  const typeId = Array.isArray(type) ? type[0] : type;

  const mappedStatus = mapParamToEnum(status, WarehouseStatus);

  const yourWarehouses = api.authed.yourWarehouses.useQuery({
    typeId,
    status: mappedStatus,
  });
  return (
    <main className="flex min-h-[var(--h-antinav)] flex-col bg-gray-50 py-12 sm:flex-row sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:order-1 sm:w-1/4">
        <WarehouseStatusFilter />
        <WarehouseTypesFilter />
      </div>

      <div className="p-4 sm:order-2 sm:w-3/4">
        <h2 className="mb-4 text-3xl font-extrabold text-gray-700">
          Your warehouses
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {yourWarehouses.data?.map(
            ({
              id,
              nameUk,
              nameEn,
              status,
              addressUk,
              dailyRate,
              warehouseType,
            }) => (
              <WarehouseCard
                key={"warehouse-card-" + id}
                typeUk={warehouseType.nameUk}
                typeEn={warehouseType.nameEn}
                detailsRoute={`/rent-your-warehouse/${id}`}
                {...{ nameUk, nameEn, status, addressUk, dailyRate }}
              />
            )
          )}
          {yourWarehouses.data?.length === 0 && <WarehouseCardNotFound />}
          {yourWarehouses.isLoading && (
            <>
              <WarehouseCardLoading />
              <WarehouseCardLoading />
              <WarehouseCardLoading />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
