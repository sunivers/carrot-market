import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandlers";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });

    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { name, email, phone },
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const alreadyExist = await client.user.findFirst({
        where: {
          email,
        },
      });
      if (alreadyExist) {
        return res.json({
          ok: false,
          error: "Email is already taken",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
    }

    if (phone && phone !== currentUser?.phone) {
      const alreadyExist = await client.user.findFirst({
        where: {
          phone,
        },
      });
      if (alreadyExist) {
        return res.json({
          ok: false,
          error: "Phone number is already in use",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
    }

    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
      },
    });

    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({ method: ["GET", "POST"], handler })
);
