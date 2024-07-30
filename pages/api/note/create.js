// pages/api/notes/create.js
import prisma from "@/app/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description } = req.body;

    try {
      const note = await prisma.note.create({
        data: {
          title,
          description,
        },
      });

      return res.status(200).json({ note });
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
