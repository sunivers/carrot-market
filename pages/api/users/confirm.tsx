import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true }, // include를 이용해 foreign key로 연결된 관계 객체를 가져올 수 있음
  });

  if (!exists) return res.status(404).end();

  req.session.user = {
    id: exists.userId,
  };
  await req.session.save();

  res.json({ ok: true });
}

export default withApiSession(withHandler("POST", handler));
