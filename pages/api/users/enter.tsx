import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/server/client";
import withHandler from "../../../libs/server/withHandlers";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  res.status(200).end();
}

// NextJS에서 api를 실행시키려면 반드시 함수를 반환해야함 (withHandler 내부 구현을 보면 function을 반환하고 있음)
export default withHandler("POST", handler);
