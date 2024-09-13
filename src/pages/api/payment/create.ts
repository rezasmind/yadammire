import { NextApiRequest, NextApiResponse } from "next";
import ZarinpalCheckout from "zarinpal-checkout";

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const CALLBACK_URL = `https://yadammire.ir/api/payment/verify`;

const zarinpal = ZarinpalCheckout.create(
  ZARINPAL_MERCHANT_ID,
  false
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phoneNumber } = req.body;
  

  const amount = 1000; // 23,000 Tomans

  try {
    const response = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: `${CALLBACK_URL}?phoneNumber=${phoneNumber}`,
      Description: "Subscription plan: Professional",
    });

    if (response.status === 100) {
      res.status(200).json({ paymentUrl: response.url });
    } else {
      res
        .status(400)
        .json({ message: "Error creating payment", error: response });
    }
  } catch (error) {
    console.error("ZarinPal API error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
}
