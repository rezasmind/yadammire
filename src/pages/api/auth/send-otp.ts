import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { generateOTP } from "@/utils/otp";
import { storeOTP } from "@/utils/otpStore";

const SMS_API_URL = process.env.SMS_API_URL || "http://ippanel.com/api/select";
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const SMS_FROM_NUMBER = process.env.SMS_FROM_NUMBER;
const SMS_PATTERN_CODE = process.env.SMS_PATTERN_CODE;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Check for existing OTPs with the same phone number
    const { data: existingOtps, error: fetchError } = await supabase
      .from("otps")
      .select("*")
      .eq("phoneNumber", phoneNumber);

    if (fetchError) {
      throw fetchError;
    }

    // If existing OTPs found, delete them
    if (existingOtps && existingOtps.length > 0) {
      const { error: deleteError } = await supabase
        .from("otps")
        .delete()
        .eq("phoneNumber", phoneNumber);

      if (deleteError) {
        throw deleteError;
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert new OTP into the database
    const { error: insertError } = await supabase.from("otps").insert([
      {
        phoneNumber: phoneNumber,
        otp: otp,
        createdAt: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    // Send SMS with OTP
    await sendSms(phoneNumber, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in send-otp:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
}

async function sendSms(phoneNumber: string, otp: string) {
  const smsResponse = await axios.post(
    SMS_API_URL,
    {
      op: "pattern",
      user: SMS_USERNAME,
      pass: SMS_PASSWORD,
      fromNum: SMS_FROM_NUMBER,
      toNum: phoneNumber,
      patternCode: SMS_PATTERN_CODE,
      inputData: [{ code: otp }],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
