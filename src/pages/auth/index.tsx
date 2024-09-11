import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import logo from "../../../public/Logo-Trans.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { z } from "zod";
import { useRouter } from 'next/router';
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "کد یک بار مصرف باید ۶ رقمی باشد",
  }),
});

const Auth = () => {
  const router = useRouter();
  const [showNumber, setShowNumber] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if phoneNumber and token exist in sessionStorage
    const phoneNumber = sessionStorage.getItem('phoneNumber');
    const token = sessionStorage.getItem('token');

    if (phoneNumber && token) {
      // Redirect to dashboard if both exist
      router.push('/dashboard');
    }
  }, [router]);

  const handleNumberChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "").slice(0, 11);
    setNumber(numericValue);
    validatePhoneNumber(numericValue);
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone.startsWith("09")) {
      setError("شماره باید با ۰۹ شروع شود");
    } else if (phone.length !== 11) {
      setError("شماره باید ۱۱ رقم باشد");
    } else {
      setError("");
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        '/api/auth/send-otp',
        { phoneNumber: number },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setShowNumber(false);
        setShowOtp(true);
        toast({
          title: "کد تایید ارسال شد",
          description: "لطفا کد ارسال شده را وارد کنید",
        });
      }
    } catch (error: unknown) {
      console.error('Error sending OTP:', error instanceof Error ? error.message : String(error));
      setError("ارسال کد با خطا مواجه شد");
      toast({
        title: "خطا در ارسال کد",
        description: "لطفا دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      const response = await axios.post(
        '/api/auth/verify-otp',
        { phoneNumber: number, otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const { token, phoneNumber, userId } = response.data;
        // Store token, phone number, and userId in session storage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('phoneNumber', phoneNumber);
        sessionStorage.setItem('userId', userId);
        toast({
          title: "ورود موفق",
          description: "به زودی به صفحه اصلی منتقل می‌شوید",
        });
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error instanceof Error ? error.message : String(error));
      toast({
        title: "خطا در تایید کد",
        description: "کد وارد شده صحیح نیست",
        variant: "destructive",
      });
    }
  };

  const handleSuccessfulVerification = (data: { userId: string; token: string; phoneNumber: string }) => {
    sessionStorage.setItem("userId", data.userId);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("phoneNumber", data.phoneNumber);
    router.push("/dashboard");
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    verifyOtp(data.pin);
  }

  const render = () => {
    if (showNumber) {
      return (
        <div className="form py-16 px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
          <h1 className="font-bold text-xl ">👋 خوش اومدید</h1>
          <h1 className="font-semubold text-md mb-12">
            برای ورود شماره تلفن همراه خودتون رو وارد کنید
          </h1>

          <Input
            type="tel"
            placeholder="09119993232"
            dir="rtl"
            value={number}
            onChange={handleNumberChange}
            className="max-w-xs bg-opacity-20 rounded-xl bg-primary text-black border-2 border-primary border-opacity-60 py-2 px-4 text-left"
          />
          {error && <p className="text-red-500">{error}</p>}

          <Button
            className="text-sm bg-primary rounded-xl"
            onClick={(e) => {
              e.preventDefault();
              if (!error) {
                sendOtp();
              }
            }}
            disabled={!!error}
          >
            ارسال کد
          </Button>
        </div>
      );
    }
    if (showOtp) {
      return (
        <div className="form py-16 px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
          <h1 className="font-bold text-xl ">تلفنتو چک کن 📱</h1>
          <h1 className="font-semubold text-md mb-12">
            کد یک بار مصرف ارسال شده را وارد کنید
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col justify-center space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormControl>
                      <InputOTP maxLength={6} {...field} className="flex items-center justify-center">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="text-sm bg-primary rounded-xl">
                تایید کد
              </Button>
            </form>
          </Form>
        </div>
      );
    }
  };

  return (
    <div
      className="main w-screen h-screen flex flex-row-reverse justify-center items-center"
      dir="rtl"
    >
      <div className="left w-1/2 h-screen bg-primary flex justify-center items-center">
        <Image src={logo} alt="" width={200} />
      </div>

      <div className="right w-1/2 h-screen bg-white flex flex-col justify-center items-center">
        {render()}
      </div>
    </div>
  );
};

export default Auth;
