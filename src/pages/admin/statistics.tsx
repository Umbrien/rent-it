import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import colors from "tailwindcss/colors";
import { api } from "@/utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const dataset1Colors = {
  backgroundColor: [
    colors.violet["200"],
    colors.violet["300"],
    colors.violet["400"],
  ],
  hoverBackgroundColor: [
    colors.violet["500"],
    colors.violet["600"],
    colors.violet["700"],
  ],
};

const dataset2Colors = {
  backgroundColor: [colors.sky["200"], colors.sky["300"], colors.sky["400"]],
  hoverBackgroundColor: [
    colors.sky["500"],
    colors.sky["600"],
    colors.sky["700"],
  ],
};

const PieSkeleton = () => (
  <div className="h-72 w-72 animate-pulse rounded-full bg-gray-200 md:h-96 md:w-96" />
);

export default function Home() {
  const statistics = api.admin.statistics.useQuery();
  if (statistics.data) {
    console.log(statistics.data);
  }

  return (
    <main className="flex min-h-[var(--h-antinav)] w-full flex-1 flex-col items-center justify-center bg-gray-50 px-20 text-center">
      <h1 className="mb-12 rounded-md bg-white p-6 text-6xl font-bold shadow-md">
        Rent-it{" "}
        <span className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
          statistics
        </span>
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Warehouses</h2>
          <div className="w-72 md:w-96">
            {statistics.data ? (
              <Pie
                data={{
                  labels: statistics.data.warehouses.statuses,
                  datasets: [
                    {
                      data: statistics.data.warehouses.data,
                      ...dataset1Colors,
                    },
                  ],
                }}
                options={{
                  animation: {
                    duration: 1500,
                  },
                }}
              />
            ) : (
              <PieSkeleton />
            )}
          </div>
          <div className="mt-2 text-center">
            <p>Status chart</p>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Rentals</h2>
          <div className="w-72 md:w-96">
            {statistics.data ? (
              <Pie
                data={{
                  labels: statistics.data.rentals.statuses,
                  datasets: [
                    {
                      data: statistics.data.rentals.data,
                      ...dataset2Colors,
                    },
                  ],
                }}
                options={{
                  animation: {
                    duration: 1500,
                  },
                }}
              />
            ) : (
              <PieSkeleton />
            )}
          </div>
          <div className="mt-2 text-center">
            <p>Status chart</p>
          </div>
        </div>
      </div>
    </main>
  );
}
