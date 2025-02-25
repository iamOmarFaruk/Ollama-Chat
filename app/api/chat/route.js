import { NextResponse } from 'next/server';
import { generateChatCompletion } from '@/app/lib/ollama';
import prisma from '@/app/lib/db';

export async function POST(request) {
  try {
    const { chatId, message, modelId } = await request.json();
    
    // Get the model
    const model = await prisma.model.findUnique({
      where: { id: modelId }
    });
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    let chat;
    
    // If chatId is provided, find the existing chat
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true }
      });
      
      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }
    } else {
      // Create a new chat
      chat = await prisma.chat.create({
        data: {
          title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
          modelId: model.id,
        },
        include: { messages: true }
      });
    }
    
    // Add user message to the database
    const userMessage = await prisma.message.create({
      data: {
        content: message,
        role: 'user',
        chatId: chat.id
      }
    });
    
    // Prepare messages for Ollama API
    const messages = [
      ...chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];
    
    // Generate response from Ollama
    const response = await generateChatCompletion({
      model: model.name,
      messages,
      stream: false
    });
    
    const assistantResponse = response.data.message.content;
    
    // Save assistant response to database
    const assistantMessage = await prisma.message.create({
      data: {
        content: assistantResponse,
        role: 'assistant',
        chatId: chat.id
      }
    });
    
    // Update chat title if it's a new chat
    if (chat.messages.length === 0) {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
        }
      });
    }
    
    return NextResponse.json({
      chatId: chat.id,
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 