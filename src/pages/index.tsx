import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("pages.Index");
  return (
    <main className="flex min-h-[var(--h-antinav)] flex-col items-center justify-center bg-gradient-to-b from-primary-400 to-primary-700">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {t("title-rent")}{" "}
          <span className="text-primary-300">{t("title-your")}</span>{" "}
          {t("title-warehouse")}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/rent-your-warehouse"
          >
            <h3 className="text-2xl font-bold">{t("rent-your-warehouse")} →</h3>
            <div className="text-lg">
              {t("rent-your-warehouse-description-line-1")}
              <br />
              {t("rent-your-warehouse-description-line-2")}
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/warehouses-to-rent"
          >
            <h3 className="text-2xl font-bold">{t("warehouses-to-rent")} →</h3>
            <div className="text-lg">
              {t("warehouses-to-rent-description-line-1")}
              <br />
              {t("warehouses-to-rent-description-line-2")}
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
