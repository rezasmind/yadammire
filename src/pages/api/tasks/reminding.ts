import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import moment from 'moment-jalaali';
import 'moment-timezone';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const SMS_API_URL = process.env.SMS_API_URL || 'http://ippanel.com/api/select';
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const SMS_FROM_NUMBER = process.env.SMS_FROM_NUMBER;
const SMS_PATTERN_CODE = '2z3m7hoi9aqugau';

const MAX_TIMEOUT = 2147483647; // Maximum value for setTimeout (about 24.8 days)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskId, title, phoneNumber, reminderTime } = req.body;

  if (!taskId || !title || !phoneNumber || !reminderTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const now = moment().tz('Asia/Tehran');
    const reminderDate = moment(reminderTime).tz('Asia/Tehran');
    let delay = reminderDate.diff(now);

    if (delay <= 0) {
      return res.status(400).json({ message: "Reminder time is in the past" });
    }

    console.log(`Scheduling reminder for ${reminderDate.format()} (in ${delay}ms)`);

    // Function to send SMS and update task status
    const sendReminderAndUpdateTask = async () => {
      try {
        // Send SMS using the pattern
        const smsResponse = await axios.post(SMS_API_URL, {
          op: "pattern",
          user: SMS_USERNAME,
          pass: SMS_PASSWORD,
          fromNum: SMS_FROM_NUMBER,
          toNum: phoneNumber,
          patternCode: SMS_PATTERN_CODE,
          inputData: [
            { title: title }
          ]
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("SMS sending result:", smsResponse.data);

        // Update the task in Supabase to mark the reminder as sent
        const { error } = await supabase
          .from('Tasks')
          .update({ reminder_sent: true })
          .eq('id', taskId);

        if (error) {
          console.error("Error updating task:", error);
        }
      } catch (error) {
        console.error("Error sending reminder SMS:", error);
      }
    };

    // If delay is greater than MAX_TIMEOUT, we need to set multiple timeouts
    if (delay > MAX_TIMEOUT) {
      const setNextTimeout = () => {
        if (delay <= 0) {
          sendReminderAndUpdateTask();
        } else {
          const nextDelay = Math.min(delay, MAX_TIMEOUT);
          setTimeout(() => {
            delay -= nextDelay;
            setNextTimeout();
          }, nextDelay);
        }
      };

      setNextTimeout();
    } else {
      setTimeout(sendReminderAndUpdateTask, delay);
    }

    res.status(200).json({ message: "Reminder scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    res.status(500).json({ message: "Error scheduling reminder" });
  }
}