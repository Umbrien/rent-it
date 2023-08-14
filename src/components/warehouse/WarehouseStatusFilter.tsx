import { useRouter } from "next/router";
import { IconFilter } from "@tabler/icons-react";
import React from "react";
import { WarehouseStatus } from "@prisma/client";
import { mapParamToEnum } from "@/utils";
import { WarehouseStatusBadgeLink } from "@/components/warehouse/WarehouseStatusBadge";
import { useTranslations } from "next-intl";

export const WarehouseStatusFilter = () => {
  const t = useTranslations("components.warehouse.StatusFilter");

  const router = useRouter();
  const { status } = router.query;
  const mappedStatus = mapParamToEnum(status, WarehouseStatus);

  return (
    <div className="h-fit rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 flex gap-1 text-2xl font-bold text-gray-600">
        <IconFilter className="self-center" />
        {t("title")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {Object.keys(WarehouseStatus).map((statusKey) => {
          const mappedStatusKey = statusKey as keyof typeof WarehouseStatus;
          const isCurrentType = mappedStatus === mappedStatusKey;
          const { status: _, ...routerQuery } = router.query;
          const query = isCurrentType
            ? { ...routerQuery }
            : { ...routerQuery, status: mappedStatusKey };
          return (
            <WarehouseStatusBadgeLink
              key={"filter-status-badge-" + mappedStatusKey}
              status={mappedStatusKey}
              href={{
                pathname: "/rent-your-warehouse",
                query,
              }}
              isCurrent={isCurrentType}
            />
          );
        })}
      </div>
    </div>
  );
};
