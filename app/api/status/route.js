import { NextResponse } from 'next/server';
import { checkOllamaStatus } from '@/app/lib/ollama';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    // Check if Ollama is running
    const ollamaStatus = await checkOllamaStatus();
    
    // Get models from database
    const dbModels = await prisma.model.findMany();
    
    // If Ollama is running, sync models with database
    if (ollamaStatus.running && ollamaStatus.models.length > 0) {
      // Update database with available models
      for (const model of ollamaStatus.models) {
        await prisma.model.upsert({
          where: { name: model.name },
          update: { isActive: true },
          create: { 
            name: model.name,
            isActive: true
          }
        });
      }
      
      // Mark models not available in Ollama as inactive
      const availableModelNames = ollamaStatus.models.map(m => m.name);
      await prisma.model.updateMany({
        where: {
          name: { notIn: availableModelNames }
        },
        data: { isActive: false }
      });
      
      // Get updated models from database
      const updatedModels = await prisma.model.findMany();
      
      return NextResponse.json({
        running: true,
        models: updatedModels,
        ollamaModels: ollamaStatus.models
      });
    }
    
    return NextResponse.json({
      running: ollamaStatus.running,
      models: dbModels,
      ollamaModels: ollamaStatus.models
    });
  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json(
      { error: 'Failed to check Ollama status' },
      { status: 500 }
    );
  }
} 