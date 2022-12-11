import { NextApiRequest, NextApiResponse } from "next/types";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = "GET" | "POST" | "DELETE";

interface ConfigType {
  method: method | method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (
      req.method &&
      req.method !== method &&
      !method?.includes(req.method as any)
    ) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      res.status(401).json({ ok: false, error: "로그인 해주세요." });
    }
    try {
      return await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  };
}
