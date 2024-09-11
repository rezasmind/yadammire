import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MockPayment() {
  const router = useRouter();
  const { Authority, phoneNumber } = router.query;

  useEffect(() => {
    if (Authority && phoneNumber) {
      const timer = setTimeout(() => {
        router.push(`/api/payment/verify?Authority=${Authority}&Status=OK&phoneNumber=${phoneNumber}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [Authority, phoneNumber, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">پرداخت آزمایشی</h1>
      <p className="mb-4">در حال شبیه‌سازی پرداخت...</p>
      <p>لطفاً صبر کنید. به زودی به صفحه اصلی هدایت خواهید شد.</p>
    </div>
  );
}