import Link from "next/link";
import {
  IconChartPie,
  IconDownload,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function AdminPage() {
  const t = useTranslations("pages.Admin");
  return (
    <main className="mx-auto max-w-3xl flex-1 p-8">
      <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-gray-500">{t("description")}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/statistics"
          className="flex flex-col justify-between rounded bg-indigo-500 p-4 text-white shadow-lg transition hover:bg-opacity-90"
        >
          <div className="mb-2">
            <h3 className="mb-2 text-xl font-medium">{t("statistics")}</h3>
            <p className="text-gray-100">{t("statistics-description")}</p>
          </div>
          <IconChartPie
            size={28}
            stroke={2}
            className="transition hover:-rotate-12"
          />
        </Link>
        <Link
          href="/admin/data-export"
          className="flex flex-col justify-between rounded bg-purple-500 p-4 text-white shadow-lg transition hover:bg-opacity-90"
        >
          <div className="mb-2">
            <h3 className="mb-2 text-xl font-medium">{t("data-export")}</h3>
            <p className="text-gray-100">{t("data-export-description")}</p>
          </div>
          <IconDownload
            size={28}
            stroke={2}
            className="transition hover:-rotate-12"
          />
        </Link>
        <Link
          href="/admin/warehouse-types"
          className="flex flex-col justify-between rounded bg-pink-500 p-4 text-white shadow-lg transition hover:bg-opacity-90"
        >
          <div className="mb-2">
            <h3 className="mb-2 text-xl font-medium">{t("warehouses")}</h3>
            <p className="text-gray-100">{t("warehouses-description")}</p>
          </div>
          <IconBuildingWarehouse
            size={28}
            stroke={2}
            className="transition hover:-rotate-12"
          />
        </Link>
      </div>
    </main>
  );
}
