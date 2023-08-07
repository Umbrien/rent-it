import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { Warehouse, WarehouseType, User } from "@prisma/client";
import {
  IconBuildingWarehouse,
  IconMap,
  IconUser,
  IconAt,
} from "@tabler/icons-react";
import { PriceSpan } from "@/components/NumberSpan";
import { transliterate as tr } from "transliteration";

export const WarehouseCard = ({
  id,
  nameUk,
  nameEn,
  typeUk,
  typeEn,
  addressUk,
  dailyRate,
  ownerName,
  ownerEmail,
  displayDetailsBtn = true,
}: {
  id: Warehouse["id"];
  nameUk: Warehouse["nameUk"];
  nameEn: Warehouse["nameEn"];
  typeUk: WarehouseType["nameUk"];
  typeEn: WarehouseType["nameEn"];
  addressUk: Warehouse["addressUk"];
  dailyRate: Warehouse["dailyRate"];
  ownerName?: User["username"];
  ownerEmail?: User["email"];
  displayDetailsBtn?: boolean;
}) => {
  const router = useRouter();
  const { locale } = router;
  const name = locale === "uk" ? nameUk : nameEn ?? nameUk;
  const type = locale === "uk" ? typeUk : typeEn ?? typeUk;
  const address = locale === "uk" ? addressUk : tr(addressUk);

  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
      <div>
        <h3 className="mb-2 text-2xl font-semibold text-gray-800">{name}</h3>
        <p className="mb-2 flex gap-1 text-sm leading-snug text-gray-600">
          <IconBuildingWarehouse size={16} className="self-center" />
          {type}
        </p>
        <p className="mb-4 text-2xl font-bold text-primary-500">
          <PriceSpan price={dailyRate} />
          <span className="text-sm text-primary-300"> / day</span>
        </p>
        <p className="flex gap-1 text-sm text-gray-600">
          <IconMap size={16} className="self-center" /> {address}
        </p>
        {ownerName && (
          <p className="text-md mt-3 flex gap-1 text-gray-600">
            <IconUser size={24} className="self-center" /> {ownerName}
          </p>
        )}
        {ownerEmail && (
          <p className="text-md flex gap-1 text-gray-600">
            <IconAt size={24} className="self-center" /> {ownerEmail}
          </p>
        )}
      </div>
      {displayDetailsBtn && (
        <div className="mt-2">
          <Link
            href={`/warehouses-to-rent/${id}`}
            className="inline-block transform rounded-lg bg-primary-500 px-6 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-primary-600"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export const WarehouseCardLoading = () => {
  return (
    <div className="flex animate-pulse flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
      <div>
        <div className="mb-2 h-7 rounded bg-gray-200"></div>
        <div className="mb-2 h-5 rounded bg-gray-200"></div>
        <div className="mb-4 h-10 rounded bg-gray-200"></div>
        <div className="flex h-5 gap-1 rounded bg-gray-200"></div>
      </div>
      <div className="mt-2">
        <div className="inline-block transform rounded-lg bg-gray-200 px-6 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-300">
          View Details
        </div>
      </div>
    </div>
  );
};
