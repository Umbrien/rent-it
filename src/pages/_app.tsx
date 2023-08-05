import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { MainLayout } from "@/components/MainLayout";
import { AuthProvider } from "@/hooks/AuthProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <Head>
        <title>rent-it</title>
        <meta name="description" content="Warehouse renting service" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
};

export default api.withTRPC(MyApp);
