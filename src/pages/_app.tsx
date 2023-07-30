import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { MainLayout } from "@/components/MainLayout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>rent-it</title>
        <meta name="description" content="Warehouse renting service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
};

export default api.withTRPC(MyApp);
