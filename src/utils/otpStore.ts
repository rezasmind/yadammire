import { supabase } from "@/lib/supabase"; // Adjust according to your Supabase setup

export async function storeOTP(phoneNumber: string, otp: string) {
  const expirationTime = new Date(Date.now() + 300000); // 5 minutes from now

  const { data, error } = await supabase
    .from("otps") // Ensure this matches your Supabase table name
    .upsert({
      phone_number: phoneNumber,
      otp,
      expires_at: expirationTime,
    });

  if (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Failed to store OTP");
  }

  return data;
}