import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";

// Handle the different HTTP methods
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid or missing userId" });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { Notes: true },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ notes: user.Notes });
      } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    case "POST":
      const { title, description, userId: postUserId } = req.body;

      if (!title || !description || !postUserId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const newNote = await prisma.note.create({
          data: {
            title,
            description,
            userId: postUserId,
          },
        });

        return res.status(201).json(newNote);
      } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
