import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { DEFAULT_COORDS_RANGE } from "@libs/server/constants";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const parsedLatitude = parseFloat(latitude?.toString() || "0");
    const parsedLongitude = parseFloat(longitude?.toString() || "0");

    if (!parsedLatitude || !parsedLongitude) {
      res.status(400);
    }

    const posts = await client.post.findMany({
      where: {
        latitude: {
          gte: parsedLatitude - DEFAULT_COORDS_RANGE,
          lte: parsedLatitude + DEFAULT_COORDS_RANGE,
        },
        longitude: {
          gte: parsedLongitude - DEFAULT_COORDS_RANGE,
          lte: parsedLongitude + DEFAULT_COORDS_RANGE,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            interest: true,
            answers: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }

  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      post,
    });
  }
}

export default withApiSession(
  withHandler({ method: ["GET", "POST"], handler })
);
