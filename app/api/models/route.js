import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getAvailableModels, pullModel } from '@/app/lib/ollama';

// Get all models
export async function GET() {
  try {
    // Get models from database
    const dbModels = await prisma.model.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(dbModels);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// Pull a model
export async function POST(request) {
  try {
    const { modelName } = await request.json();
    
    if (!modelName) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      );
    }
    
    // Start pulling the model (this is async and will take time)
    pullModel(modelName).catch(error => {
      console.error('Error pulling model:', error);
    });
    
    // Create or update the model in the database
    const model = await prisma.model.upsert({
      where: { name: modelName },
      update: { isActive: true },
      create: {
        name: modelName,
        isActive: true
      }
    });
    
    return NextResponse.json({
      message: `Started pulling model: ${modelName}`,
      model
    });
  } catch (error) {
    console.error('Error pulling model:', error);
    return NextResponse.json(
      { error: 'Failed to pull model' },
      { status: 500 }
    );
  }
} 