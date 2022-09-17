import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await client.user.create({
    data: {
      name: "psy",
      email: "hi",
    },
  });

  res.json({
    ok: true,
    data: user,
  });
}
