import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { toJalaali } from "jalaali-js";

// Use non-public environment variables for server-side code
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Add this line to get the base URL of your application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Received request body:", req.body);

  const { title, description, date, phoneNumber } = req.body;

  // Validate input
  const errors = [];
  if (!title) errors.push("Title is required");
  if (!description) errors.push("Description is required");
  if (!date) errors.push("Date is required");
  if (!phoneNumber) errors.push("Phone number is required");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    console.log("Received date string:", date);

    // Parse the date string
    const [datePart, timePart] = date.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);

    // Create a new Date object
    const taskDate = new Date(year, month - 1, day, hour, minute, second);

    // Check if the date is valid
    if (isNaN(taskDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    console.log("Parsed task date:", taskDate.toISOString());

    // Convert to Persian date for verification (optional)
    const { jy, jm, jd } = toJalaali(taskDate.getFullYear(), taskDate.getMonth() + 1, taskDate.getDate());
    const persianDate = `${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")} ${taskDate.getHours().toString().padStart(2, "0")}:${taskDate.getMinutes().toString().padStart(2, "0")}:${taskDate.getSeconds().toString().padStart(2, "0")}`;
    console.log("Converted to Persian date:", persianDate);

    // Ensure the task date is in the future
    if (taskDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Task date must be in the future" });
    }

    // Check user subscription status
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("subscription")
      .eq("phone", phoneNumber)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    const hasSubscription = userData?.subscription || false;

    // If user doesn't have a subscription, check task limit
    if (!hasSubscription) {
      const { count, error: countError } = await supabase
        .from("Tasks")
        .select("*", { count: "exact", head: true })
        .eq("phone", phoneNumber);

      if (countError) {
        console.error("Error counting tasks:", countError);
        return res.status(500).json({ message: "Error counting tasks" });
      }

      if (count && count >= 5) {
        return res.status(403).json({ message: "Task limit reached for free users" });
      }
    }

    const { data, error } = await supabase
      .from("Tasks")
      .insert([
        {
          title,
          description,
          date: taskDate.toISOString(),
          phone: phoneNumber,
          status: false,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({
          message: "Error inserting task into database",
          error: error.message,
        });
    }

    if (!data || data.length === 0) {
      return res
        .status(500)
        .json({ message: "Task was not inserted properly" });
    }

    // Schedule the reminder
    try {
      const reminderResponse = await axios.post(
        `${BASE_URL}/api/tasks/reminding`,
        {
          taskId: data[0].id,
          title,
          phoneNumber,
          reminderTime: taskDate.toISOString(),
        }
      );

      console.log("Reminder scheduling response:", reminderResponse.data);
    } catch (reminderError) {
      console.error("Error scheduling reminder:", reminderError);
      // Don't throw here, we still want to return the created task
    }

    res.status(200).json({ message: "Task created successfully", data, hasSubscription });
  } catch (error: unknown) {
    console.error(
      "Error creating task:",
      error instanceof Error ? error.message : String(error)
    );
    res
      .status(500)
      .json({
        message: "Error creating task",
        error: error instanceof Error ? error.message : String(error),
      });
  }
}
