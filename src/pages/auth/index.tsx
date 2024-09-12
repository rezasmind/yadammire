/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
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
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import OtpInput from "react-otp-input";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "لطفا کد ۶ رقمی را وارد کنید",
  }).max(6, {
    message: "کد باید دقیقا ۶ رقم باشد",
  }),
});

const Auth = () => {
  const router = useRouter();
  const [showNumber, setShowNumber] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  console.log(otp);

  const phoneForm = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Check if phoneNumber and token exist in sessionStorage
    const phoneNumber = sessionStorage.getItem("phoneNumber");
    const token = sessionStorage.getItem("token");

    if (phoneNumber && token) {
      // Redirect to dashboard if both exist
      router.push("/dashboard");
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
      setError("شماره باید با ۰۹ روع شود");
    } else if (phone.length !== 11) {
      setError("شماره باید ۱۱ رقم باشد");
    } else {
      setError("");
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        "/api/auth/send-otp",
        { phoneNumber: number },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setShowNumber(false);
        setShowOtp(true);
        toast({
          title: "کد تایید ارسال شد",
          description: "لطفا کد ارسال شده ر وارد کنید",
        });
      }
    } catch (error: unknown) {
      console.error(
        "Error sending OTP:",
        error instanceof Error ? error.message : String(error)
      );
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
        "/api/auth/verify-otp",
        { phoneNumber: number, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const { token, phoneNumber, userId, subscriptionStatus } =
          response.data;
        // Store token, phone number, userId, and subscriptionStatus in session storage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("phoneNumber", phoneNumber);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem(
          "subscriptionStatus",
          subscriptionStatus.toString()
        );
        toast({
          title: "ورود موفق",
          description: "به زودی به صفحه اصلی منتقل می‌شوید",
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error(
        "Error verifying OTP:",
        error instanceof Error ? error.message : String(error)
      );
      toast({
        title: "خطا در تایید کد",
        description: "کد وارد شده صحیح نیست",
        variant: "destructive",
      });
    }
  };

  const handleSuccessfulVerification = (data: {
    userId: string;
    token: string;
    phoneNumber: string;
  }) => {
    sessionStorage.setItem("userId", data.userId);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("phoneNumber", data.phoneNumber);
    router.push("/dashboard");
  };

  const handlePhoneSubmit = async (data: { phoneNumber: string }) => {
    if (!error) {
      try {
        await sendOtp();
        setShowNumber(false);
        setShowOtp(true);
        setOtp(""); // Reset the OTP state
        otpForm.reset(); // Reset the form state
      } catch (error) {
        console.error("Error in handlePhoneSubmit:", error);
      }
    }
  };

  const handleOtpSubmit = (data: z.infer<typeof FormSchema>) => {
    verifyOtp(data.otp);
  };

  const render = () => {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        {showNumber ? (
          <div className="form py-8 md:py-16 px-4 md:px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
            <h1 className="font-bold text-xl ">👋 خوش اومدید</h1>
            <h1 className="font-semubold text-md mb-12">
              برای ورود شماره تلفن همراه خودتون رو وارد کنید
            </h1>

            <Form {...phoneForm}>
              <form
                onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
                className="w-full flex flex-col items-center gap-4"
              >
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="09119993232"
                          dir="rtl"
                          {...field}
                          value={number}
                          onChange={(e) => {
                            handleNumberChange(e);
                            field.onChange(e);
                          }}
                          className="max-w-xs bg-opacity-20 rounded-xl bg-primary text-black border-2 border-primary border-opacity-60 py-2 px-4 text-left"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="text-sm bg-primary rounded-xl"
                  disabled={!!error}
                >
                  ارسال کد
                </Button>
              </form>
            </Form>
          </div>
        ) : showOtp ? (
          <div className="form py-8 md:py-16 px-4 md:px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
            <h1 className="font-bold text-xl ">تلفنتو چک کن 📱</h1>
            <h1 className="font-semubold text-md mb-12">
              کد یک بار مصرف ارسال شده را وارد کنید
            </h1>

            <form
              onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
              className="w-full flex flex-col justify-center space-y-6"
            >
              <OtpInput
                value={otp}
                onChange={(value: string) => {
                  setOtp(value);
                  otpForm.setValue('otp', value, { shouldValidate: true });
                }}
                numInputs={6}
                renderSeparator={<span className="w-2"></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle="w-12 h-12 text-center text-2xl border-2 border-primary rounded-md"
                containerStyle="flex flex-row-reverse justify-center"
                inputType="tel"
                shouldAutoFocus={true}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-red-500 text-sm text-center">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
              <Button type="submit" className="text-sm bg-primary rounded-xl">
                تایید کد
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="w-screen">
      <div
        className="main w-full h-screen flex flex-col-reverse md:flex-row-reverse justify-center items-center"
        dir="rtl"
      >
        <div className="left w-full md:w-1/2 h-[20vh] md:h-screen bg-primary flex justify-center items-center">
          <img
            src={`/Logo-Trans.png`}
            alt="Logo"
            width={200}
            height={200}
            className="max-w-full h-auto"
          />
        </div>

        <div className="right w-full md:w-1/2 h-[80vh] md:h-screen bg-white flex flex-col justify-center items-center p-4">
          {render()}
        </div>
      </div>
    </div>
  );
};

export default Auth;
