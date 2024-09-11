import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/jwt";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const email = verifyToken(token);
    const { data, error } = await supabase
      .from("user_items")
      .select("*")
      .eq("user_email", email);

    if (error) throw error;

    res.status(200).json({ items: data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user items" });
  }
}
