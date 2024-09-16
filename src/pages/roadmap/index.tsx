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

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">نقشه راه</h1>

        <div className="roadmaps mb-12">
          <div className="space-y-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4 text-primary text-center">
                نقشه راه توسعه پلتفرم یادم میره
              </h3>
              <ul className="list-none space-y-3">
                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  تولید محتوا آموزشی در حوزه اختلال حواس پرتی و ADHD
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  اضافه کردن تست ADHD{" "}
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  اضافه کردن دوره درمان ADHD{" "}
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  اضافه کردن تودو لیست
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  یادآوری برای اعضای خانواده
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  یادآوری دوره ای{" "}
                </li>

                <li className="text-lg flex items-center gap-2">
                  <input type="checkbox" className="mr-2" />
                  موسیقی برای کنترل ADHD حین کار{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;
