import axios from 'axios';

// Default Ollama API URL
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';

// Check if Ollama is running
export async function checkOllamaStatus() {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    return { running: true, models: response.data.models || [] };
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    return { running: false, models: [] };
  }
}

// Get available models
export async function getAvailableModels() {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    return response.data.models || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

// Generate chat completion
export async function generateChatCompletion({ model, messages, stream = true }) {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/chat`,
      {
        model,
        messages,
        stream,
        options: {
          temperature: 0.7,
        },
      },
      {
        responseType: stream ? 'stream' : 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}

// Pull a model
export async function pullModel(modelName) {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/pull`,
      {
        name: modelName,
      },
      {
        responseType: 'stream',
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error pulling model:', error);
    throw error;
  }
} 