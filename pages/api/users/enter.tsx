import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body.email);
  res.status(200).end();
}
