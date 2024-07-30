import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const deletedNote = await prisma.note.delete({
        where: { id: id as string },
      });

      res
        .status(200)
        .json({ message: "Note deleted successfully", note: deletedNote });
    } catch (error) {
      console.error("Error deleting note:", (error as Error).message);
      res.status(500).json({ error: "Failed to delete note" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
