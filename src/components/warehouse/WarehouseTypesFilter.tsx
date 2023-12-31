import { useRouter } from "next/router";
import Link from "next/link";
import { IconFilter } from "@tabler/icons-react";
import React from "react";
import { api } from "@/utils/api";
import { useTranslations } from "next-intl";

const TypeSkeleton = () => (
  <div className="flex h-8 w-24 animate-pulse items-center justify-center rounded-full bg-gray-200" />
);

export const WarehouseTypesFilter = ({
  pathname,
  title = "title-filter",
  displayIcon = true,
}: {
  pathname: string;
  title?: "title-filter" | "title-warehouse";
  displayIcon?: boolean;
}) => {
  const t = useTranslations("components.warehouse.TypeFilter");

  const router = useRouter();
  const { locale } = router;
  const { type } = router.query;
  const typeId = Array.isArray(type) ? type[0] : type;

  const warehouseTypes = api.public.warehouseTypes.useQuery();

  return (
    <div className="h-fit max-w-xl rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 flex gap-1 text-2xl font-bold text-gray-600">
        {displayIcon && <IconFilter className="self-center" />}
        {t(title)}
      </h2>
      <div className="flex flex-wrap gap-2">
        {warehouseTypes.data?.map((type) => {
          const name =
            locale === "uk" ? type.nameUk : type.nameEn ?? type.nameUk;
          const isCurrentType = typeId === type.id;
          const { type: _, ...routerQuery } = router.query;
          const query = isCurrentType
            ? { ...routerQuery }
            : { ...routerQuery, type: type.id };
          return (
            <Link
              key={type.id}
              href={{
                pathname,
                query,
              }}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500 
                ${isCurrentType ? "bg-primary-600" : "bg-primary-400"}
              `}
            >
              {name}
            </Link>
          );
        })}
        {warehouseTypes.isLoading && (
          <>
            <TypeSkeleton />
            <TypeSkeleton />
            <TypeSkeleton />
            <TypeSkeleton />
            <TypeSkeleton />
          </>
        )}
      </div>
    </div>
  );
};
