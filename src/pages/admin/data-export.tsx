import { stringify } from "csv-stringify";
import { api } from "@/utils/api";
import { useTranslations } from "next-intl";

function downloadCSV({
  data,
  filenamePrefix,
}: {
  data: unknown[];
  filenamePrefix: string;
}) {
  stringify(data, { header: true }, (err, output) => {
    // current date in format: dd-mm-yyyy_hh:mm:ss
    const date = new Date().toLocaleString().replace(/, /g, "_");

    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${filenamePrefix}-${date}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

export default function DataExport() {
  const t = useTranslations("pages.Admin-Data-Export");

  const allData = api.admin.allUsersWarehousesRentals.useQuery();
  const handleDownloadUsers = () => {
    if (allData.data) {
      downloadCSV({ data: allData.data.users, filenamePrefix: "users" });
    }
  };
  const handleDownloadWarehouses = () => {
    if (allData.data) {
      downloadCSV({
        data: allData.data.warehouses,
        filenamePrefix: "warehouses",
      });
    }
  };
  const handleDownloadRentals = () => {
    if (allData.data) {
      downloadCSV({ data: allData.data.rentals, filenamePrefix: "rentals" });
    }
  };
  return (
    <main className="mx-auto my-16 max-w-3xl rounded-lg bg-white p-8 shadow-lg">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-semibold text-gray-800">
          {t("title")}
        </h1>
        <p className="mb-8 text-gray-600">{t("description")}</p>
        <button
          onClick={handleDownloadUsers}
          disabled={!allData.data}
          className="w-full rounded-full bg-blue-500 px-6 py-3 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:bg-gray-300"
        >
          {allData.data
            ? t("download-users", { count: allData.data.users.length })
            : t("loading")}
        </button>
        <button
          onClick={handleDownloadWarehouses}
          disabled={!allData.data}
          className="my-6 w-full rounded-full bg-blue-500 px-6 py-3 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:bg-gray-300"
        >
          {allData.data
            ? t("download-warehouses", {
                count: allData.data.warehouses.length,
              })
            : t("loading")}
        </button>
        <button
          onClick={handleDownloadRentals}
          disabled={!allData.data}
          className="w-full rounded-full bg-blue-500 px-6 py-3 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:bg-gray-300"
        >
          {allData.data
            ? t("download-rentals", { count: allData.data.rentals.length })
            : t("loading")}
        </button>
      </div>
    </main>
  );
}
