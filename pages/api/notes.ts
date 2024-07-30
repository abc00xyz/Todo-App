// pages/api/notes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    try {
      const notes = await prisma.note.findMany({
        where: { userId: userId.toString() },
      });

      return res.status(200).json({ notes });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
