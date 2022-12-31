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
  } = req;
  if (!id) {
    res.status(400).end();
  }

  const existedFavorite = await client.favorite.findFirst({
    where: {
      productId: Number(id),
      userId: user?.id,
    },
  });

  if (existedFavorite) {
    await client.favorite.delete({
      where: {
        id: existedFavorite?.id,
      },
    });
  } else {
    await client.favorite.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(withHandler({ method: "POST", handler }));
