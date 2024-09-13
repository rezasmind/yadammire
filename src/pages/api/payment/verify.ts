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
  if (req.method === 'POST') {
    const { Authority, Status } = req.body;

    try {
      // Verify the payment with ZarinPal
      const verificationResponse = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: 100000, // The amount should match what was set in create.ts
        authority: Authority,
      });

      if (verificationResponse.data.data.code === 100) {
        // Payment was successful
        const phoneNumber = req.body.phoneNumber; // Ensure this is passed from the frontend

        // Calculate subscription end date (30 days from now)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Update user's subscription status in Supabase
        const { data, error } = await supabase
          .from('users')
          .update({ 
            subscription: true,
            subscription_end_date: formattedEndDate
          })
          .eq('phone_number', phoneNumber);

        if (error) {
          console.error('Error updating subscription:', error);
          return res.status(500).json({ error: 'Failed to update subscription status' });
        }

        return res.status(200).json({ success: true, message: 'Payment verified and subscription updated' });
      } else {
        // Payment failed
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Error in payment verification:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
