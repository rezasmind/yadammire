import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const { data: tasks, error } = await supabase
      .from("Tasks")
      .select("*")
      .eq("phone", phoneNumber)
      .order("date", { ascending: true });

    if (error) throw error;

    const ongoingTasks = tasks.filter((task) => !task.smsSent);
    const doneTasks = tasks.filter((task) => task.smsSent);

    res.status(200).json({ ongoingTasks, doneTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
}