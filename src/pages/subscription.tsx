import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from "@nextui-org/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import logo from "../../public/Logo-Trans.png";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const plan: Plan = {
  id: 'pro',
  name: 'اشتراک حرفه‌ای',
  price: 23000,
  features: ['ایجاد نامحدود وظیفه'],
};

export default function Subscription() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    } else {
      router.push("/auth");
    }

    // Check for payment status
    const { status } = router.query;
    if (status) {
      setPaymentStatus(status as string);
    }
  }, [router]);

  const handlePayment = async () => {
    try {
      const response = await axios.post('/api/payment/create', { 
        planId: plan.id,
        phoneNumber: phoneNumber
      });
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        console.error('Error response:', response.data);
        alert('خطا در ایجاد لینک پرداخت: ' + (response.data.message || 'خطای ناشناخته'));
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        alert('خطا در ایجاد لینک پرداخت: ' + (error.response.data.message || 'خطای ناشناخته'));
      } else {
        alert('خطا در ایجاد لینک پرداخت: خطای ناشناخته');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("phoneNumber");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <div className="flex flex-col min-h-screen font-peyda" dir="rtl">
      <header className="w-screen bg-gray-100 px-2 sm:px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="relative">
            <Button
              onClick={() => setShowPopup(!showPopup)}
              className="bg-gray-200 text-gray-800 py-2 px-2 sm:px-3 rounded-lg flex items-center hover:bg-gray-300 transition duration-300 shadow-sm text-xs sm:text-sm"
            >
              <Cog6ToothIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-gray-600" />
              تنظیمات
            </Button>
            {showPopup && (
              <div className="absolute right-0 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                <div className="p-3">
                  <p className="mb-2 text-xs text-gray-600">
                    شماره تلفن:{" "}
                    <span className="font-semibold text-gray-800">
                      {phoneNumber}
                    </span>
                  </p>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg w-full hover:bg-red-600 transition duration-300 text-xs sm:text-sm"
                  >
                    خروج
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Image
              src={logo}
              alt="لوگو"
              width={40}
              height={40}
              className="cursor-pointer sm:w-[60px] sm:h-[60px]"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        {paymentStatus && (
          <div className={`mb-4 p-4 rounded-lg ${paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {paymentStatus === 'failed' ? 'پرداخت ناموفق بود. لطفا دوباره تلاش کنید.' : 'خطایی رخ داد. لطفا دوباره تلاش کنید.'}
          </div>
        )}

        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-3xl font-extrabold text-black text-center mb-6">طرح اشتراک</h2>
                  <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.price.toLocaleString()} تومان</p>
                    <ul className="list-disc list-inside mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <Button
                  onClick={handlePayment}
                  className="w-full bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition duration-300"
                >
                  پرداخت و فعال‌سازی اشتراک
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full mt-4 bg-gray-200 text-gray-800 rounded-md py-2 hover:bg-gray-300 transition duration-300"
                >
                  بازگشت به داشبورد
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}