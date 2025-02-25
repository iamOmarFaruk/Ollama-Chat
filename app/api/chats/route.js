import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// Get all chats
export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        model: true
      }
    });
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// Create a new chat
export async function POST(request) {
  try {
    const { title, modelId } = await request.json();
    
    // Check if model exists
    const model = await prisma.model.findUnique({
      where: { id: modelId }
    });
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    // Create a new chat
    const chat = await prisma.chat.create({
      data: {
        title: title || 'New Chat',
        modelId
      }
    });
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}

// Delete a chat
export async function DELETE(request) {
  try {
    const { chatId } = await request.json();
    
    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    // Delete the chat
    await prisma.chat.delete({
      where: { id: chatId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
} 