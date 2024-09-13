import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

// Use the same 36-character random string as in create.ts
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "false";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }


  // Extract parameters from either query (GET) or body (POST)
  const Authority = req.method === "GET" ? req.query.Authority : req.body.Authority;
  const Status = req.method === "GET" ? req.query.Status : req.body.Status;
  let phoneNumber = req.method === "GET" ? req.query.phoneNumber : req.body.phoneNumber;

  // Format phoneNumber to remove leading '0' if present
  if (typeof phoneNumber === 'string' && phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.slice(1);
    console.log(phoneNumber);
  }

  if (!Authority || !Status || !phoneNumber) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Verify the payment with ZarinPal
    const verificationResponse = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: 1000, // The amount should match what was set in create.ts
        authority: Authority,
      }
    );

    if (verificationResponse.data.data.code === 100) {
      // Payment was successful
      // Calculate subscription end date (30 days from now)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const formattedEndDate = endDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      // Update user's subscription status in Supabase
      const { data, error } = await supabase
        .from("User")
        .update({
          subscription: true,
          subscription_end_date: formattedEndDate,
        })
        .eq("phone", phoneNumber);

      if (error) {
        console.error("Error updating subscription:", error);
        return res
          .status(500)
          .json({ error: "Failed to update subscription status" });
      }

      // If it's a GET request, redirect to the subscription page with a success status
      if (req.method === "GET") {
        return res.redirect(302, `/subscription?status=success`);
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and subscription updated",
      });
    } else {
      // Payment failed
      // If it's a GET request, redirect to the subscription page with a failed status
      if (req.method === "GET") {
        return res.redirect(302, `/subscription?status=failed`);
      }

      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    // If it's a GET request, redirect to the subscription page with an error status
    if (req.method === "GET") {
      return res.redirect(302, `/subscription?status=error`);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
