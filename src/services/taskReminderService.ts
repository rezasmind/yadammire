import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const SMS_API_URL = process.env.SMS_API_URL as string;
const SMS_USERNAME = process.env.SMS_USERNAME as string;
const SMS_PASSWORD = process.env.SMS_PASSWORD as string;
const SMS_FROM_NUMBER = process.env.SMS_FROM_NUMBER as string;
const SMS_PATTERN_CODE = "2z3m7hoi9aqugau";

async function sendSms(phoneNumber: string, title: string) {
  try {
    const smsResponse = await axios.post(
      SMS_API_URL,
      {
        op: "pattern",
        user: SMS_USERNAME,
        pass: SMS_PASSWORD,
        fromNum: "3000505",
        toNum: phoneNumber,
        patternCode: SMS_PATTERN_CODE,
        inputData: [{ title: title }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SMS sent successfully:", smsResponse.data);
    return smsResponse.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

export async function checkAndSendReminders() {
  const now = new Date();

  try {
    const { data: tasks, error } = await supabase
      .from("Tasks")
      .select("id, title, phone, date")
      .eq("sms_sent", false)
      .lte("date", now.toISOString());

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    for (const task of tasks) {
      try {
        await sendSms(task.phone, task.title);

        const { error: updateError } = await supabase
          .from("Tasks")
          .update({ sms_sent: true, status: true, reminder_sent: true })
          .eq("id", task.id);

        if (updateError) {
          console.error("Error updating SMS sent status:", updateError);
        }
      } catch (smsError) {
        console.error("Error sending SMS for task:", task.id, smsError);
      }
    }
  } catch (error) {
    console.error("Error in checkAndSendReminders:", error);
  }
}
