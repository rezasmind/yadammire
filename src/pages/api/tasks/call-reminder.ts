import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const AVANAK_TOKEN = process.env.AVANAK_TOKEN;
const AVANAK_MESSAGE_ID = process.env.AVANAK_MESSAGE_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

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
      return res
        .status(200)
        .json({ message: "Call reminder sent successfully" });
    } else {
      throw new Error("Failed to send call reminder");
    }
  } catch (error) {
    console.error("Error sending call reminder:", error);
    return res.status(500).json({ message: "Failed to send call reminder" });
  }
}
