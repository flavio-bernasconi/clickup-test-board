import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(404);
  }

  const session = await getServerSession(req, res, authOptions as any);

  if (!session || !(session as any)?.accessToken) {
    return res.status(401);
  }

  const id = req.query.id as string;
  try {
    const resp = await fetch(`https://api.clickup.com/api/v2/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: (session as any)?.accessToken,
      },
      body: JSON.stringify(req.body),
    });

    return res.status(200).json({ ok: resp });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
