import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    // UPDATE
    if (req.method === "PUT") {
      const { title, body, category, priority, publishDate, image } = req.body;

      const updatedNotice = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image,
        },
      });

      return res.status(200).json(updatedNotice);
    }

    // DELETE
    if (req.method === "DELETE") {
      await prisma.notice.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Deleted successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
}