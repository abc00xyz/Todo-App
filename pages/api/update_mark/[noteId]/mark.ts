// /pages/api/update_mark/[noteId]/mark.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { noteId } = req.query;
    const { marked } = req.body;

    if (!noteId) {
      return res.status(400).json({ error: "Missing noteId" });
    }

    if (typeof marked !== "boolean") {
      return res.status(400).json({ error: "Invalid marked value" });
    }

    try {
      const updatedNote = await prisma.note.update({
        where: { id: noteId.toString() },
        data: { marked },
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
