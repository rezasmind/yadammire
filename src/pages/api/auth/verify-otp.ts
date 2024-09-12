import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Ensure these environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey || !JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a JWT token
const generateToken = (userId: string, phoneNumber: string) => {
  return jwt.sign({ userId, phoneNumber }, JWT_SECRET, { expiresIn: "1d" });
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
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from("otps")
      .select("*")
      .eq("phoneNumber", phoneNumber)
      .single();

    if (otpError) {
      console.error("Supabase error:", otpError);
      return res.status(500).json({ message: "Error retrieving OTP" });
    }

    if (!otpData) {
      console.log("No OTP found for phone number:", phoneNumber);
      return res.status(404).json({ message: "OTP not found" });
    }

    const { otp: storedOtp } = otpData;

    // Check if the OTP is valid
    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Remove OTP from the database after successful verification
    await supabase.from("otps").delete().eq("phoneNumber", phoneNumber);

    // Check if user exists
    let { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("phone", phoneNumber)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error checking user:", userError);
      return res.status(500).json({ message: "Error checking user" });
    }

    let userId: string;

    if (!userData) {
      // User doesn't exist, create a new user
      const { data: newUser, error: createError } = await supabase
        .from("User")
        .insert([{ phone: phoneNumber, subscription: false }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return res.status(500).json({ message: "Error creating user" });
      }

      if (!newUser) {
        console.error("Error: User data not found after creation");
        return res.status(500).json({ message: "Error retrieving user data" });
      }

      userId = newUser.id;
      userData = newUser;
    } else {
      userId = userData.id;
    }

    // Generate JWT token
    const token = generateToken(userId, phoneNumber);

    res.status(200).json({
      message: "OTP verified successfully",
      userId,
      token,
      phoneNumber,
      subscriptionStatus: userData.subscriptionStatus,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
}
