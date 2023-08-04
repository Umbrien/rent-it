import Link from "next/link";
import { api } from "@/utils/api";
import { headerHeight } from "@/components/MainLayout";

export default function Home() {
  const { data } = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <main
      className={`flex min-h-[calc(100vh-${headerHeight})] flex-col items-center justify-center bg-gradient-to-b from-primary-400 to-primary-700`}
    >
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Rent <span className="text-primary-300">your</span> Warehouse
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/rent-your-warehouse"
          >
            <h3 className="text-2xl font-bold">Rent your warehouse →</h3>
            <div className="text-lg">
              Rent your warehouse <br /> and start earning money.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/warehouses-to-rent"
          >
            <h3 className="text-2xl font-bold">Warehouses to rent →</h3>
            <div className="text-lg">
              Find a warehouse to rent <br /> and start saving money.
            </div>
          </Link>
        </div>
        <p className="text-2xl text-white">
          {data?.greeting ?? "Loading tRPC query..."}
        </p>
      </div>
    </main>
  );
}
