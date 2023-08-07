import { useRouter } from "next/router";
import Link from "next/link";
import { IconFilter } from "@tabler/icons-react";
import React from "react";
import { api } from "@/utils/api";

const TypeSkeleton = () => (
  <div className="flex h-8 w-24 animate-pulse items-center justify-center rounded-full bg-gray-200" />
);

export const WarehouseTypesFilter = () => {
  const router = useRouter();
  const { type } = router.query;
  const typeId = Array.isArray(type) ? type[0] : type;

  const warehouseTypes = api.public.warehouseTypes.useQuery();

  return (
    <div className="h-fit rounded-lg bg-white p-4 shadow-md sm:order-1 sm:w-1/4">
      <h2 className="mb-4 flex gap-1 text-2xl font-bold text-gray-600">
        <IconFilter className="self-center" />
        Filter by type
      </h2>
      <div className="flex flex-wrap gap-2">
        {warehouseTypes.data?.map((type) => {
          console.log(type);
          const isCurrentType = typeId === type.id;
          const { type: _, ...routerQuery } = router.query;
          const query = isCurrentType
            ? { ...routerQuery }
            : { ...routerQuery, type: type.id };
          return (
            <Link
              key={type.id}
              href={{
                pathname: "/warehouses-to-rent",
                query,
              }}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500 
                ${isCurrentType ? "bg-primary-600" : "bg-primary-400"}
              `}
            >
              {type.nameUk}
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
