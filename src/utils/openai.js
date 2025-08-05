export const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and reliable' },
  { id: 'dall-e-3', name: 'DALL-E 3', description: 'Image generation' },
  { id: 'dall-e-2', name: 'DALL-E 2', description: 'Image generation' }
];

export const callOpenAI = async (messages, apiKey, model = 'gpt-4o-mini', options = {}) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (!messages || messages.length === 0) {
    throw new Error('Messages are required');
  }

  try {
    // Handle image generation models
    if (model === 'dall-e-3' || model === 'dall-e-2') {
      return await generateImage(messages[messages.length - 1].content, apiKey, model);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        ...options
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error(errorData.error?.message || 'Bad request. Please check your input.');
      } else {
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response received from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const generateImage = async (prompt, apiKey, model = 'dall-e-3') => {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: model === 'dall-e-3' ? '1024x1024' : '512x512',
        quality: model === 'dall-e-3' ? 'standard' : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Image generation failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    throw error;
  }
};

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
    const messages = [
      {
        role: 'user',
        content: `Please analyze this document (${fileName}):\n\n${fileContent}`
      }
    ];

    return await callOpenAI(messages, apiKey, model);
  } catch (error) {
    throw error;
  }
};

export const validateApiKey = (apiKey) => {
  if (!apiKey) return 'API key is required';
  if (typeof apiKey !== 'string') return 'API key must be a string';
  if (!apiKey.startsWith('sk-')) return 'API key should start with "sk-"';
  if (apiKey.length < 40) return 'API key appears to be too short';
  return null;
};