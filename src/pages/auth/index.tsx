import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import logo from "../../../public/Logo-Trans.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { z } from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "کد یک بار مصرف ارسال باید ۶ رقمی باشد",
  }),
});
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }
  const [showNumber, setShowNumber] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  console.log(error);

  const handleNumberChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    // حذف کاراکترهای غیر از عدد
    const numericValue = value.replace(/\D/g, "").slice(0, 11);
    setNumber(numericValue);

    // اعتبارسنجی شماره تلفن
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

  const sendOtp: () => void = async () => {
    await axios
      .post(
        "http://localhost:3001/send-otp",
        {
          phoneNumber: number,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": true,
          },
        }
      )
      .then(() => {
        setShowNumber(!showNumber);
        setShowOtp(!showOtp);
      })
      .catch(() => {
        setError("ارسال کد با خطا مواجه شد");
      });
  };

  const render = () => {
    if (showNumber) {
      return (
        <>
          <div className="form py-16 px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
            <h1 className="font-bold text-xl ">👋 خوش اومدید</h1>
            <h1 className="font-semubold text-md mb-12">
              {" "}
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
                  console.log(showNumber);
                }
              }}
              disabled={!!error} // دکمه را غیرفعال می‌کند اگر خطا وجود دارد
            >
              ارسال کد
            </Button>
          </div>
        </>
      );
    }
    if (showOtp) {
      return (
        <>
          <div className="form py-16 px-24 border shadow-md border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
            <h1 className="font-bold text-xl ">تلفنتو چک کن 📱</h1>
            <h1 className="font-semubold text-md mb-12">
              {" "}
              کد یک بار مصرف ارسال شده را وارد کنید
            </h1>

            <Form {...form} >
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

                <Button className="text-sm bg-primary rounded-xl">
                  ارسال کد
                </Button>
              </form>
            </Form>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div
        className="main w-screen h-screen flex flex-row-reverse justify-center items-center "
        dir="rtl"
      >
        <div className="left w-1/2 h-screen bg-primary flex justify-center items-center">
          <Image src={logo} alt="" width={200} />
        </div>

        <div className="right w-1/2 h-screen bg-white flex flex-col justify-center items-center">
          {render()}
        </div>
      </div>
    </>
  );
};

export default Auth;
