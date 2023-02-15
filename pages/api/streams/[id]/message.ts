import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
    body: { message },
  } = req;
  if (!id) {
    return res.status(400).end();
  }

  const newMessage = await client.message.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      stream: {
        connect: {
          id: Number(id),
        },
      },
    },
  });

  res.json({
    ok: true,
    message: newMessage,
  });
}

export default withApiSession(withHandler({ method: "POST", handler }));
