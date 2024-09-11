import React from "react";
import Head from "next/head";
import Header from "@/pages/components/Header";
import Footer from "@/pages/components/Footer";

const Roadmap: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-peyda">
      <Head>
        <title>نقشه راه - یادم میره</title>
        <meta name="description" content="نقشه راه پلتفرم یادم میره" />
      </Head>

      <Header showLogo={true} />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">نقشه راه</h1>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>

          <div className="relative z-10">
            {/* Step 1 - Right side (Completed) */}
            <div className="mb-16 flex justify-end items-center">
              <div className="w-1/2 pr-8 text-right">
                <h2 className="text-2xl font-semibold mb-2 text-green-600">
                  ایجاد وبسایت و پلتفرم
                </h2>
                <p className="text-gray-600">
                  توسعه و راه‌اندازی پلتفرم اصلی برای مدیریت تسک‌ها و یادآوری‌ها
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full top-0">
                <div className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center border-4 border-white">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 2 - Left side */}
            <div className="mb-16 flex justify-start items-center">
              <div className="w-1/2 pl-8">
                <h2 className="text-2xl font-semibold mb-2">
                  ایجاد ربات و ارسال اعلان
                </h2>
                <p className="text-gray-600">
                  توسعه ربات هوشمند برای ارسال یادآوری‌ها از طریق پیام‌رسان‌های
                  مختلف
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center border-4 border-white">
                  <span className="text-white font-bold">۲</span>
                </div>
              </div>
            </div>

            {/* Step 3 - Right side */}
            <div className="mb-16 flex justify-end items-center">
              <div className="w-1/2 pr-8 text-right">
                <h2 className="text-2xl font-semibold mb-2">
                  یادآوری از طریق تماس تلفنی
                </h2>
                <p className="text-gray-600">
                  اضافه کردن قابلیت یادآوری از طریق تماس صوتی برای اطمینان بیشتر
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-full bottom-0">
                <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center border-4 border-white">
                  <span className="text-white font-bold">۳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;
