// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { farazSendPattern, farazSMS } from "@aspianet/faraz-sms";
import { farazSendSMS } from "@aspianet/faraz-sms";

farazSMS.init("7zE-Ce-Woc8HFY_bJn8FK-DkU8kNzW1xbd-E97Hl7Zo=");

const handler = async (req: NextApiRequest, res: any) => {
  try {
    await farazSendPattern("5z7d6ybd1h8wpmu", "90000145", "9116801800", {
      code: "22432",
    });
  } catch (err: any) {
    console.log(JSON.stringify(err));
  }
};

export default handler;
