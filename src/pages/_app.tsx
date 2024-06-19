import "@/styles/globals.css";
import Head from "next/head";

import type { AppProps } from "next/app";
import Header from "./components/Header";
import Footer from "./components/Footer";
import logo from "../../public/Logo-Trans.png";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="overflow-clip flex flex-col justify-center items-center">
      <Head>
        <title>یادم میره</title>
        <link rel="icon" href="/public/Logo-Trans.png" sizes="any" />

        <meta
          name="description"
          content="با پلتفرم یادم میره شما تسک هاتون دیگه یادتون نمیره! بهترین سرویس برای کسایی که ADHD دارن."
        />
        <meta property="og:title" content="یادم میره" />
        <meta
          property="og:description"
          content="با پلتفرم یادم میره شما تسک هاتون دیگه یادتون نمیره! بهترین سرویس برای کسایی که ADHD دارن."
        />
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
