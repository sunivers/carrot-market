import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";

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
  console.log(exists);
  req.session.user = {
    id: exists?.userId,
  };
  await req.session.save();
  if (!exists) res.status(404).end();
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password:
    "i4ui2u3id8fu2i0fji039r22389udis39sjodjo39odoir0923moeru3oj0w9r23idj83pdoede9si03jdos9ef0s",
});
