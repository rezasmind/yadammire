import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, description, date, phone } = req.body;

  if (!title || !description || !date || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { data, error } = await supabase
      .from("Tasks")
      .insert([{ title, description, date, phone }]);

    if (error) {
      console.error("Error inserting task:", error);
      return res.status(500).json({ message: "Error creating task" });
    }

    res.status(200).json({ message: "Task created successfully", data });
  } catch (error) {
    console.error("Error in task creation handler:", error);
    res.status(500).json({ message: "Error creating task" });
  }
}