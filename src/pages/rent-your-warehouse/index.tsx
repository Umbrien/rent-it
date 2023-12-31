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
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function WarehousesToRent() {
  const t = useTranslations("pages.Rent-Your-Warehouse");

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
        <WarehouseTypesFilter pathname="/rent-your-warehouse" />
      </div>

      <div className="p-4 sm:order-2 sm:w-3/4">
        <div className="flex items-baseline gap-3">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-700">
            {t("your-warehouses")}
          </h2>
          <Link
            href="/rent-your-warehouse/new"
            className="text-lg font-semibold text-gray-600 hover:text-gray-900"
          >
            {t("add-new-warehouse")}
          </Link>
        </div>
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
