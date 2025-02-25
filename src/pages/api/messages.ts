import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Prisma Client ইম্পোর্ট করা

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // ✅ নতুন মেসেজ ডাটাবেসে সংরক্ষণ করা
    const { content, isUser } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    try {
      const newMessage = await prisma.chatMessage.create({
        data: { content, isUser },
      });

      return res.status(201).json(newMessage);
    } catch (error) {
      return res.status(500).json({ error: "Failed to save message" });
    }
  } 
  
  else if (req.method === "GET") {
    // ✅ পুরনো মেসেজ লোড করা
    try {
      const messages = await prisma.chatMessage.findMany({
        orderBy: { createdAt: "asc" }, // পুরনো থেকে নতুন পর্যন্ত সাজানো
      });

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
