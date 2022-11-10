import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true }, // include를 이용해 foreign key로 연결된 관계 객체를 가져올 수 있음
  });

  if (!foundToken) return res.status(404).end();

  // 세션 저장
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();

  // 토큰 삭제
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  res.json({ ok: true });
}

export default withApiSession(withHandler("POST", handler));
