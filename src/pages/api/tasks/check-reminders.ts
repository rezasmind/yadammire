import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { checkAndSendReminders } from "../../../services/taskReminderService";

const AVANAK_TOKEN = process.env.AVANAK_TOKEN;
const AVANAK_MESSAGE_ID = process.env.AVANAK_MESSAGE_ID;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const now = new Date();
    const { data: tasks, error } = await supabase
      .from("Tasks")
      .select("*")
      .lte("date", now.toISOString())
      .eq("status", false);

    if (error) throw error;

    for (const task of tasks) {
      console.log(task);
      if (task.reminder_type === 0 || task.reminder_type === 2) {
        // Send SMS reminder (existing logic)
        await sendSmsReminder(task);
      }

      if (task.reminder_type === 1 || task.reminder_type === 2) {
        // Send call reminder
        await sendCallReminder(`0${task.phone}`);
      }

      // Update task status
      await supabase.from("Tasks").update({ status: true }).eq("id", task.id);
    }

    res
      .status(200)
      .json({ message: "Reminders checked and sent successfully" });
  } catch (error) {
    console.error("Error checking reminders:", error);
    res.status(500).json({ message: "Error checking reminders" });
  }
}

async function sendSmsReminder(task: any) {
  // Existing SMS sending logic
  await checkAndSendReminders();
}

async function sendCallReminder(phoneNumber: string) {
  try {
    const response = await axios.get(
      "https://portal.avanak.ir/rest/QuickSend",
      {
        params: {
          Token: AVANAK_TOKEN,
          MessageID: AVANAK_MESSAGE_ID,
          Number: phoneNumber,
          Vote: false,
          ServerID: 0,
        },
      }
    );

    if (response.status === 200) {
      console.log(response)
      console.log("Call reminder sent successfully");
    } else {
      throw new Error("Failed to send call reminder");
    }
  } catch (error) {
    console.error("Error sending call reminder:", error);
  }
}
