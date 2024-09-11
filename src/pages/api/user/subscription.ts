import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const { data, error } = await supabase
      .from("User")
      .select("subscription")
      .eq("phone", phoneNumber)
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json({ hasSubscription: data?.subscription || false });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ message: "Error fetching subscription status" });
  }
}