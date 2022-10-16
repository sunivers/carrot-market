import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandlers";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, phone } = req.body;
  const payload = email ? { email } : { phone: +phone };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });
  console.log(user);
  res.status(200).end();
}

// NextJS에서 api를 실행시키려면 반드시 함수를 반환해야함 (withHandler 내부 구현을 보면 function을 반환하고 있음)
export default withHandler("POST", handler);
