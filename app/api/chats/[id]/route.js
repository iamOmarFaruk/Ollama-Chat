import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// Get chat by ID with messages
export async function GET(request, context) {
  try {
    // First await the params object itself
    const params = await context.params;
    const chatId = params.id;
    
    // Find the chat with messages
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        model: true
      }
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
      { status: 500 }
    );
  }
}

// Update chat title
export async function PATCH(request, context) {
  try {
    // First await the params object itself
    const params = await context.params;
    const chatId = params.id;
    const { title } = await request.json();
    
    // Find the chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    // Update the chat title
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title }
    });
    
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: 'Failed to update chat' },
      { status: 500 }
    );
  }
}

// Delete chat
export async function DELETE(request, context) {
  try {
    // First await the params object itself
    const params = await context.params;
    const chatId = params.id;
    
    // Delete associated messages first to avoid foreign key constraints
    await prisma.message.deleteMany({
      where: { chatId }
    });
    
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