import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });
  if (!post) {
    res.status(400).end();
  }

  const newAnswer = await client.answer.create({
    data: {
      answer,
      post: {
        connect: {
          id: post?.id,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
    select: {
      answer: true,
      id: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(withHandler({ method: ["POST"], handler }));
