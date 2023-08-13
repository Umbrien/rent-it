import Link from "next/link";
import {
  IconChartPie,
  IconDownload,
  IconBuildingWarehouse,
} from "@tabler/icons-react";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 p-8">
      <h1 className="mb-4 text-3xl font-bold">Admin dashboard</h1>
      <p className="mb-8 text-gray-500">
        Manage analytics, data exports, and more
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/admin/statistics"
          className="flex flex-col justify-between rounded bg-indigo-500 p-4 text-white shadow-lg transition hover:bg-opacity-90"
        >
          <div className="mb-2">
            <h3 className="mb-2 text-xl font-medium">Statistics</h3>
            <p className="text-gray-100">View site analytics</p>
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
            <h3 className="mb-2 text-xl font-medium">Data Export</h3>
            <p className="text-gray-100">Download CSV exports of site data</p>
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
            <h3 className="mb-2 text-xl font-medium">Warehouses</h3>
            <p className="text-gray-100">Manage warehouse types</p>
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
