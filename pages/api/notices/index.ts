import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET ALL NOTICES
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [
          {
            priority: "desc",
          },
          {
            publishDate: "desc",
          },
        ],
      });

      return res.status(200).json(notices);
    }

    // CREATE NOTICE
    if (req.method === "POST") {
      const {
        title,
        body,
        category,
        priority,
        publishDate,
        image,
      } = req.body;

      // SERVER SIDE VALIDATION
      if (
        !title ||
        !body ||
        !category ||
        !priority ||
        !publishDate
      ) {
        return res.status(400).json({
          message: "All required fields must be provided",
        });
      }

      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || "",
        },
      });

      return res.status(201).json(notice);
    }

    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}