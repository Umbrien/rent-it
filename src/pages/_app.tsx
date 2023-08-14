import { useMemo } from "react";
import { type AppType, type AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { MainLayout } from "@/components/MainLayout";
import { AuthProvider } from "@/hooks/AuthProvider";
import Ukrainian from "@/messages/uk.json";
import English from "@/messages/en.json";

const now = new Date();

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  const { locale } = useRouter();

  const messages = useMemo(() => {
    switch (locale) {
      case "uk":
        return Ukrainian;
      case "en":
        return English;
    }
  }, [locale]);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Europe/Kiev"
      now={now}
    >
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
    </NextIntlClientProvider>
  );
};

export default api.withTRPC(MyApp);
