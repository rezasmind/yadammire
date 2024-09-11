import { NextApiRequest, NextApiResponse } from "next";
import ZarinpalCheckout from "zarinpal-checkout";
import { createClient } from "@supabase/supabase-js";

// Use the same 36-character random string as in create.ts
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const zarinpal = ZarinpalCheckout.create(
  "36727d44-19c1-4097-ab74-d91546e01fa4",
  false
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { Authority, Status, phoneNumber } = req.query;

  if (Status !== "OK") {
    return res.redirect("/subscription?status=failed");
  }

  try {
    const response = await zarinpal.PaymentVerification({
      Amount: 1000,
      Authority: Authority as string,
    });

    if (response.status === 100) {
      // Payment was successful
      // Update user's subscription status in the database
      const { error } = await supabase
        .from("User")
        .update({ subscription: true })
        .eq("phone", phoneNumber);

      if (error) {
        console.error("Error updating subscription status:", error);
        return res.redirect("/subscription?status=error");
      }

      return res.redirect("/dashboard?status=success&subscriptionUpdated=true");
    } else {
      return res.redirect("/subscription?status=failed");
    }
  } catch (error) {
    console.error("ZarinPal verification error:", error);
    return res.redirect("/subscription?status=error");
  }
}
