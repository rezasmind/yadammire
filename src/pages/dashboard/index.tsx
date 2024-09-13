/* eslint-disable */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Cog6ToothIcon,
  CalendarIcon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { format } from "date-fns-jalali";
import { Button, Modal, Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Notification from "src/pages/components/notification";
import moment from "moment-jalaali";
import "moment-timezone";
import { toGregorian } from "jalaali-js";
import { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  status: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("رایگان");
  const [showModal, setShowModal] = useState(false);
  const [taskDate, setTaskDate] = useState<DateObject | null>(
    new DateObject({ calendar: persian })
  );
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [ongoingTasks, setOngoingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSubscriptionSuccessModal, setShowSubscriptionSuccessModal] =
    useState(false);
  const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber");
    console.log("Stored Phone Number:", storedPhoneNumber);

    if (!storedPhoneNumber || storedPhoneNumber === "undefined") {
      console.log("No valid phone number found, redirecting to auth");
      router.push("/auth");
    } else {
      setPhoneNumber(storedPhoneNumber);
      fetchTasks(storedPhoneNumber);
      checkSubscriptionStatus(storedPhoneNumber);
      checkSubscription();
    }

    // Check if the subscription was just updated
    const { subscriptionUpdated } = router.query;
    if (subscriptionUpdated === "true") {
      setShowSubscriptionSuccessModal(true);
      // Remove the query parameter
      router.replace("/dashboard", undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    if (phoneNumber) {
      checkSubscription();
    }
  }, [phoneNumber]);

  const checkSubscription = async () => {
    try {
      // Remove the leading zero if present
      const formattedPhoneNumber = phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber;
      const response = await fetch(`/api/user/check-subscription?phoneNumber=${formattedPhoneNumber}`);
      const result = await response.json();
      setSubscriptionStatus(result.hasSubscription ? "اشتراک فعال" : "رایگان");
      setSubscriptionDaysLeft(result.daysLeft);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const checkSubscriptionStatus = async (phoneNumber: string) => {
    try {
      const response = await axios.get(
        `/api/user/subscription?phoneNumber=${phoneNumber}`
      );
      setSubscriptionStatus(
        response.data.hasSubscription ? "اشتراک فعال" : "رایگان"
      );
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  const fetchTasks = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      // Remove the leading zero if present
      const formattedPhoneNumber = phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber;
      
      const response = await axios.get(
        `/api/tasks/get-tasks?phoneNumber=${formattedPhoneNumber}`
      );
      console.log("API response:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        const allTasks = response.data;
        console.log("All tasks:", allTasks);
        const ongoing = allTasks.filter((task: Task) => !task.status);
        const done = allTasks.filter((task: Task) => task.status);
        console.log("Ongoing tasks:", ongoing);
        console.log("Done tasks:", done);
        setOngoingTasks(ongoing);
        setDoneTasks(done);
      } else {
        setOngoingTasks([]);
        setDoneTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "خطا در دریافت وظایف",
        description: "لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out");
    sessionStorage.removeItem("phoneNumber");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    router.push("/auth");
  };

  const convertPersianToEnglishNumbers = (str: string) => {
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return str.replace(/[۰-۹]/g, (d) => persianNumbers.indexOf(d).toString());
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumber = sessionStorage.getItem("phoneNumber");
    if (!phoneNumber) {
      toast({
        title: "خطا",
        description: "شماره تلفن یافت نشد. لطفا دوباره وارد شوید.",
        variant: "destructive",
      });
      return;
    }

    // Ensure taskDate is defined
    if (!taskDate) {
      toast({
        title: "خطا",
        description: "لطفا تاریخ را انتخاب کنید.",
        variant: "destructive",
      });
      return;
    }

    // Convert Persian date to Gregorian
    const persianDate = taskDate
      .format("YYYY/MM/DD HH:mm:ss")
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728));
    console.log("this is task date: ", taskDate.format("YYYY/MM/DD HH:mm:ss"));
    const [datePart, timePart] = persianDate.split(" ");
    const [pYear, pMonth, pDay] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    // Convert to Gregorian using jalaali-js
    const { gy, gm, gd } = toGregorian(pYear, pMonth, pDay);

    // Format the date as a string
    const formattedDateTime = `${gy}-${gm.toString().padStart(2, "0")}-${gd
      .toString()
      .padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    // Prepare the task data
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      date: formattedDateTime,
      phoneNumber: phoneNumber,
    };

    try {
      const response = await axios.post("/api/tasks/create-task", taskData);
      console.log("API response:", response.data);

      if (response.status === 200) {
        setShowModal(false);
        fetchTasks(phoneNumber); // Refresh the task list

        // Reset form fields
        setTaskTitle("");
        setTaskDescription("");
        setTaskDate(new DateObject({ calendar: persian }));

        // Show notification
        setNotificationMessage("یادآور با موفقیت تنظیم شد");
        setShowNotification(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setShowModal(false); // Close the task creation modal
        setTimeout(() => setShowSubscriptionModal(true), 300); // Show subscription modal after a short delay
      } else {
        console.error("Error creating task:", error);
        toast({
          title: "خطا در ایجاد وظیفه",
          description: "لطفا دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <header className="w-screen font-peyda bg-gray-100 px-2 sm:px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="relative">
            <Button
              onClick={() => setShowPopup(!showPopup)}
              className="bg-gray-200 text-gray-800 font-peyda py-2 px-2 sm:px-3 rounded-lg flex items-center hover:bg-gray-300 transition duration-300 shadow-sm text-xs sm:text-sm"
            >
              <Cog6ToothIcon className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-gray-600" />
              تنظیمات
            </Button>
            {showPopup && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                <div className="p-4">
                  <p className="mb-2 text-sm text-gray-600">
                    وضعیت اشتراک:{" "}
                    <span className="font-semibold text-gray-800">
                      {subscriptionStatus}
                    </span>
                  </p>
                  {subscriptionStatus === "اشتراک فعال" && subscriptionDaysLeft !== null && (
                    <p className="mb-2 text-sm text-gray-600">
                      روزهای باقی‌مانده: <span className="font-semibold text-gray-800">{subscriptionDaysLeft}</span>
                    </p>
                  )}
                  {subscriptionStatus === "رایگان" && (
                    <Button
                      onClick={() => router.push("/subscription")}
                      className="bg-primary font-peyda py-2 px-3 rounded-lg mb-3 w-full hover:bg-opacity-90 transition duration-300 text-sm"
                    >
                      خرید اشتراک
                    </Button>
                  )}
                  <p className="mb-3 text-sm text-gray-600">
                    شماره تلفن:{" "}
                    <span className="font-semibold text-gray-800">
                      {phoneNumber}
                    </span>
                  </p>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-500 text-white font-peyda py-2 px-3 rounded-lg w-full hover:bg-red-600 transition duration-300 text-sm"
                  >
                    خروج
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <img
              src="/Logo-Trans.png"
              alt="لوگو"
              width={60}
              height={60}
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="container mx-auto max-w-7xl font-peyda p-2 sm:p-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            داشبورد
          </h1>

          {isLoading ? (
            <p className="text-center">در حال بارگذاری وظایف...</p>
          ) : (
            <>
              {/* Ongoing Tasks Section */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  وظایف در حال انجام
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {ongoingTasks.length > 0 ? (
                    ongoingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200"
                      >
                        <h3 className="font-semibold text-sm sm:text-base mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                          {task.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-primary font-medium">
                            مهلت: {task.date}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      شما هیچ وظیفه در حال انجامی ندارید
                    </p>
                  )}
                </div>
              </section>

              {/* Done Tasks Section */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  وظایف انجام شده
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {doneTasks.length > 0 ? (
                    doneTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200"
                      >
                        <h3 className="font-medium text-sm sm:text-base text-gray-700 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          تکمیل شده در: {task.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      شما هیچ وظیفه انجام شده‌ای ندارید
                    </p>
                  )}
                </div>
              </section>

              {/* Create Task Button */}
              <Button
                onClick={() => setShowModal(true)}
                className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                ایجاد وظیفه
              </Button>

              {/* Create Task Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-center">
                      ایجاد وظیفه جدید
                    </h2>
                    <form onSubmit={handleCreateTask} className="space-y-4">
                      <div>
                        <label
                          htmlFor="taskTitle"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          عنوان وظیفه
                        </label>
                        <input
                          id="taskTitle"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="عنوان وظیفه را وارد کنید"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="taskDescription"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          توضیحات وظیفه
                        </label>
                        <textarea
                          id="taskDescription"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="توضیحات وظیفه را وارد کنید"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاریخ و زمان
                        </label>
                        <div className="relative">
                          <DatePicker
                            value={taskDate}
                            onChange={(date) => setTaskDate(date as DateObject)}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            plugins={[<TimePicker position="bottom" />]}
                            format="YYYY/MM/DD HH:mm:ss"
                            inputClass="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            containerClassName="w-full"
                          />
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 gap-4">
                        <Button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          لغو
                        </Button>
                        <Button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          ایجاد
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-peyda">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              محدودیت تعداد وظایف
            </h2>
            <p className="text-red-500 mb-4">
              شما به حداکثر تعداد وظایف مجاز (5 وظیفه) رسیده‌اید. برای ایجاد
              وظایف بیشتر، لطفا اشتراک تهیه کنید.
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              خرید اشتراک
            </button>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {showSubscriptionSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-peyda">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">تبریک!</h2>
            <p className="text-green-500 mb-4">
              اشتراک شما با موفقیت به نسخه حرفه‌ای ارتقا یافت.
            </p>
            <button
              onClick={() => setShowSubscriptionSuccessModal(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
