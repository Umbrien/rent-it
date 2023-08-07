import React from "react";
import { WarehouseTypesFilter } from "@/components/warehouse/WarehouseTypesFilter";
import {
  WarehouseCard,
  WarehouseCardLoading,
} from "@/components/warehouse/WarehouseCard";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function WarehousesToRent() {
  const router = useRouter();
  const { type } = router.query;
  const typeId = Array.isArray(type) ? type[0] : type;

  const availableWarehouses = api.public.availableWarehouses.useQuery({
    typeId,
  });
  return (
    <main className="flex min-h-[var(--h-antinav)] flex-col bg-gray-50 py-12 sm:flex-row sm:px-6 lg:px-8">
      <WarehouseTypesFilter />

      <div className="p-4 sm:order-2 sm:w-3/4">
        <h2 className="mb-4 text-3xl font-extrabold text-gray-700">
          Available Warehouses
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {availableWarehouses.data?.map(
            ({ id, nameUk, nameEn, addressUk, dailyRate, warehouseType }) => (
              <WarehouseCard
                key={"warehouse-card-" + id}
                typeUk={warehouseType.nameUk}
                typeEn={warehouseType.nameEn}
                {...{ id, nameUk, nameEn, addressUk, dailyRate }}
              />
            )
          )}
          {availableWarehouses.isLoading && (
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
