import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Remove the leading zero if present
  if (typeof phoneNumber === 'string' && phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.slice(1);
  }

  try {
    const { data: user, error } = await supabase
      .from("User")
      .select("subscription_end_date, subscription")
      .eq("phone", phoneNumber)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = moment().startOf('day');
    const endDate = moment(user.subscription_end_date, "YYYY/MM/DD").startOf('day');
    const daysLeft = endDate.diff(now, "days");

    let hasSubscription = daysLeft >= 0 && user.subscription;

    if (!hasSubscription && user.subscription) {
      // Update user's subscription status to false
      const { error: updateError } = await supabase
        .from("User")
        .update({ subscription: false })
        .eq("phone", phoneNumber);

      if (updateError) {
        console.error("Error updating subscription status:", updateError);
      }
    }

    res.status(200).json({ hasSubscription, daysLeft: Math.max(0, daysLeft) });
  } catch (error) {
    console.error("Error checking subscription:", error);
    res.status(500).json({ message: "Error checking subscription" });
  }
}
