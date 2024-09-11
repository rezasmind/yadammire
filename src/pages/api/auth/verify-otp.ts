import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET as string;

// Function to generate a JWT token
const generateToken = (userId: string, phoneNumber: string) => {
  return jwt.sign({ userId, phoneNumber }, JWT_SECRET, { expiresIn: '1d' });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: "Phone number and OTP are required" });
  }

  try {
    const { data: otpData, error } = await supabase
      .from("otps")
      .select("*")
      .eq("phoneNumber", phoneNumber)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Error retrieving OTP" });
    }

    if (!otpData) {
      console.log("No OTP found for phone number:", phoneNumber);
      return res.status(404).json({ message: "OTP not found" });
    }

    const { otp: storedOtp, createdAt } = otpData;

    // Check if the OTP is valid
    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Remove OTP from the database after successful verification
    const { error: deleteError } = await supabase
      .from("otps")
      .delete()
      .eq("phoneNumber", phoneNumber);

    if (deleteError) {
      console.error("Error deleting OTP:", deleteError);
    }

    // Generate a unique userId (you might want to use a more robust method)
    const userId = `user_${Date.now()}`;

    // Generate JWT token
    const token = generateToken(userId, phoneNumber);

    res.status(200).json({ 
      message: "OTP verified successfully",
      userId,
      token,
      phoneNumber
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
}