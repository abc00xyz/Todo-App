import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { id } = req.query;
    const { title, description } = req.body;

    if (!id || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const updatedNote = await prisma.note.update({
        where: { id: id.toString() },
        data: {
          title,
          description,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({ note: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
