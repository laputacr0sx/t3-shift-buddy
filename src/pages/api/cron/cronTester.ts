import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Cron Tester is running!");
  res.status(200).end("Hello Cron!");
}
