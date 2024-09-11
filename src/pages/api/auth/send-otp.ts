import { NextApiRequest, NextApiResponse } from "next";
import { generateOTP } from "@/utils/otp";
import { storeOTP } from "@/utils/otpStore";
import axios from 'axios';

// Load environment variables
const SMS_API_URL = process.env.SMS_API_URL || 'http://ippanel.com/api/select';
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const SMS_FROM_NUMBER = process.env.SMS_FROM_NUMBER;
const SMS_PATTERN_CODE = process.env.SMS_PATTERN_CODE;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    console.log('Generating OTP for:', phoneNumber);
    const otp = generateOTP();
    console.log('OTP generated:', otp);
    
    console.log('Attempting to store OTP');
    await storeOTP(phoneNumber, otp);
    console.log('OTP stored successfully');

    // Send SMS using the pattern
    const smsResponse = await axios.post(SMS_API_URL, {
      op: "pattern",
      user: SMS_USERNAME,
      pass: SMS_PASSWORD,
      fromNum: SMS_FROM_NUMBER,
      toNum: phoneNumber,
      patternCode: SMS_PATTERN_CODE,
      inputData: [
        { code: otp }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("SMS sending result:", smsResponse.data);

    if (smsResponse.status === 200) {
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      throw new Error("Failed to send SMS");
    }
  } catch (error: unknown) {
    console.error("Error in send-otp handler:", error);
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error stack:", error.stack);
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error, null, 2);
    }
    res.status(500).json({
      message: "Error sending OTP",
      error: errorMessage,
    });
  }
}
