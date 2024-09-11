import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  supabaseUrl = supabaseUrl || "https://example.supabase.co";
  supabaseKey = supabaseKey || "dummy_key";
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "Set" : "Not set");

const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeOTP(phoneNumber, otp) {
  try {
    console.log("Attempting to store OTP for:", phoneNumber);
    const { data, error } = await supabase
      .from("otps")
      .insert([{ phoneNumber, otp, createdAt: new Date().toISOString() }]);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("OTP stored successfully:", data);
    return data;
  } catch (error) {
    console.error("Error storing OTP:", error);
    if (error.message === "Failed to fetch") {
      console.error("Network error. Please check your internet connection and Supabase URL.");
    }
    throw error;
  }
}

export async function getOtp(phoneNumber) {
  try {
    const { data, error } = await supabase
      .from("otps")
      .select("otp, createdAt")
      .eq("phoneNumber", phoneNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("No OTP found for phone number:", phoneNumber);
        return null; // Return null instead of throwing an error
      }
      console.error("Failed to fetch OTP from Supabase:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return null; // Return null for any other errors
  }
}

export async function removeOtp(phoneNumber) {
  try {
    const { error } = await supabase
      .from("otps")
      .delete()
      .eq("phoneNumber", phoneNumber);

    if (error) {
      console.error("Failed to delete OTP from Supabase:", error);
      throw new Error("Failed to delete OTP");
    }

    console.log("OTP deleted successfully from Supabase");
  } catch (error) {
    console.error("Error deleting OTP:", error);
    throw error;
  }
}

export async function verifyOTP(phoneNumber, otp) {
  try {
    const storedOTP = await getOtp(phoneNumber);
    
    if (!storedOTP) {
      console.log("No OTP found for phone number:", phoneNumber);
      return false; // Instead of throwing an error, return false
    }

    const expirationTime = new Date(storedOTP.createdAt).getTime() + 300000; // 5 minutes expiration
    if (Date.now() > expirationTime) {
      await removeOtp(phoneNumber);
      console.log("OTP has expired for phone number:", phoneNumber);
      return false; // Instead of throwing an error, return false
    }

    const isValid = storedOTP.otp === otp;

    if (!isValid) {
      console.log("Invalid OTP entered for phone number:", phoneNumber);
      return false; // Instead of throwing an error, return false
    }

    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false; // Return false for any other errors
  }
}

export async function createUser(phoneNumber) {
  try {
    // First, check if the user already exists
    let { data: existingUser, error: fetchError } = await supabase
      .from("User")
      .select("*")
      .eq("phone", phoneNumber)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching user:", fetchError);
      throw fetchError;
    }

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }

    // If user doesn't exist, create a new one
    const { data, error } = await supabase
      .from("User")
      .insert([{ phone: phoneNumber }])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    if (!data) {
      throw new Error("User creation failed: No data returned");
    }

    console.log("User created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createUser function:", error);
    throw error;
  }
}
