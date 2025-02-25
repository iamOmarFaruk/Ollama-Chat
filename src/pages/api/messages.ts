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
  
  else if (req.method === "DELETE") {
    // ✅ মেসেজ মুছে ফেলা
    const { id } = req.query;
    
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Valid message ID is required" });
    }
    
    try {
      const deletedMessage = await prisma.chatMessage.delete({
        where: { id },
      });
      
      return res.status(200).json(deletedMessage);
    } catch (error) {
      return res.status(404).json({ error: "Message not found or already deleted" });
    }
  }
  
  else if (req.method === "PUT") {
    // ✅ মেসেজ আপডেট করা
    const { id } = req.query;
    const { content } = req.body;
    
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Valid message ID is required" });
    }
    
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }
    
    try {
      const updatedMessage = await prisma.chatMessage.update({
        where: { id },
        data: { content },
      });
      
      return res.status(200).json(updatedMessage);
    } catch (error) {
      return res.status(404).json({ error: "Message not found" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
