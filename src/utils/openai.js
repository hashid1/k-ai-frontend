// Legacy OpenAI functions for backward compatibility

export const transcribeAudio = async (audioBlob, apiKey) => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Transcription failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    throw error;
  }
};

export const analyzeDocument = async (fileContent, fileName, apiKey, model = 'gpt-4o') => {
  try {
    // Import the new AI calling function
    const { callAI } = await import('./aiProviders');
    
    const messages = [
      {
        role: 'user',
        content: `Please analyze this document (${fileName}):\n\n${fileContent}`
      }
    ];

    // Create apiKeys object for the new system
    const apiKeys = { openai: apiKey };
    return await callAI(messages, apiKeys, model);
  } catch (error) {
    throw error;
  }
};

// Re-export validation function from new system
export { validateApiKey } from './aiProviders';