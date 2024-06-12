import React from "react";
import { Button, Input } from "@nextui-org/react";
import logo from "../../../public/Logo-Trans.png"
import Image from "next/image"

const Auth = () => {
  return (
    <>
      <div className="main w-screen h-screen flex justify-center items-center bg-[#ececec] " dir="rtl">
        <div className="form py-16 px-24 border-2 border-[#fff] border-opacity-50 bg-[#fff] rounded-lg flex items-center justify-center font-peyda flex-col gap-4">
        <Image src={logo} alt="logo" width={70} />
          <h1 className="font-semibold text-xl mb-12">ورود به پنل</h1>

          <input
            type="email"
            placeholder="09119993232"
            dir="rtl"
            className="max-w-xs bg-opacity-20 rounded-2xl bg-primary text-black border-2 border-primary border-opacity-60 py-2 px-4 text-left"
          />

          <Button className="text-sm bg-primary rounded-2xl">
            ارسال کد
          </Button>
        </div>
      </div>
    </>
  );
};

export default Auth;
