export const OPENAI_MODELS = [
  { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Most capable model' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'capable model' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and reliable' },
  { id: 'dall-e-3', name: 'DALL-E 3', description: 'Image generation' },
  { id: 'dall-e-2', name: 'DALL-E 2', description: 'Image generation' }
];


// export const OPENAI_MODELS = [
//   { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Compact version of GPT-4.1' },
//   { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: 'Smaller version of GPT-4.1' },
//   { id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', description: 'Preview of GPT-4.5' },
//   { id: 'gpt-4o-audio-preview', name: 'GPT-4o Audio Preview', description: 'Audio-focused GPT-4o' },
//   { id: 'gpt-4o-realtime-preview', name: 'GPT-4o Realtime Preview', description: 'Realtime GPT-4o' },
//   { id: 'gpt-4o-mini-audio-preview', name: 'GPT-4o Mini Audio Preview', description: 'Audio-focused GPT-4o Mini' },
//   { id: 'gpt-4o-mini-realtime-preview', name: 'GPT-4o Mini Realtime Preview', description: 'Realtime GPT-4o Mini' },
//   { id: 'o1', name: 'O1', description: 'General-purpose model O1' },
//   { id: 'o1-pro', name: 'O1 Pro', description: 'Professional version of O1' },
//   { id: 'o3', name: 'O3', description: 'General-purpose model O3' },
//   { id: 'o3-pro', name: 'O3 Pro', description: 'Professional version of O3' },
//   { id: 'o3-deep-research', name: 'O3 Deep Research', description: 'Research-focused O3' },
//   { id: 'o4-mini', name: 'O4 Mini', description: 'Compact version of O4' },
//   { id: 'o4-mini-deep-research', name: 'O4 Mini Deep Research', description: 'Research-focused O4 Mini' },
//   { id: 'o3-mini', name: 'O3 Mini', description: 'Compact version of O3' },
//   { id: 'o1-mini', name: 'O1 Mini', description: 'Compact version of O1' },
//   // { id: 'codex-mini-latest', name: 'Codex Mini Latest', description: 'Latest Codex Mini' },
//   // { id: 'gpt-4o-mini-search-preview', name: 'GPT-4o Mini Search Preview', description: 'Search-focused GPT-4o Mini' },
//   // { id: 'gpt-4o-search-preview', name: 'GPT-4o Search Preview', description: 'Search-focused GPT-4o' },
//   // { id: 'computer-use-preview', name: 'Computer Use Preview', description: 'Preview for computer use' },
//   // { id: 'gpt-image-1', name: 'GPT Image 1', description: 'Image generation model' },
//   // { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', description: 'Text-to-speech GPT-4o Mini' },
//   // { id: 'gpt-4o-transcribe', name: 'GPT-4o Transcribe', description: 'Transcription-focused GPT-4o' },
//   // { id: 'gpt-4o-mini-transcribe', name: 'GPT-4o Mini Transcribe', description: 'Transcription-focused GPT-4o Mini' },
//   // { id: 'whisper', name: 'Whisper', description: 'Transcription model' },
//   // { id: 'tts', name: 'TTS', description: 'Text-to-speech model' },
//   // { id: 'tts-hd', name: 'TTS HD', description: 'High-definition text-to-speech' },
//   // { id: 'text-embedding-3-small', name: 'Text Embedding 3 Small', description: 'Small embedding model' },
//   // { id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', description: 'Large embedding model' },
//   // { id: 'text-embedding-ada-002', name: 'Text Embedding Ada 002', description: 'Ada embedding model' },
//   // { id: 'omni-moderation-latest', name: 'Omni Moderation Latest', description: 'Latest moderation model' },
//   // { id: 'text-moderation-latest', name: 'Text Moderation Latest', description: 'Latest text moderation model' },
//   // { id: 'chatgpt-4o-latest', name: 'ChatGPT-4o Latest', description: 'Latest ChatGPT-4o' },
//   // { id: 'gpt-4-0125-preview', name: 'GPT-4 0125 Preview', description: 'Preview of GPT-4 0125' },
//   // { id: 'gpt-4-1106-preview', name: 'GPT-4 1106 Preview', description: 'Preview of GPT-4 1106' },
//   // { id: 'gpt-4-1106-vision-preview', name: 'GPT-4 1106 Vision Preview', description: 'Vision-focused GPT-4 1106' },
//   // { id: 'gpt-4-0613', name: 'GPT-4 0613', description: 'Version 0613 of GPT-4' },
//   // { id: 'gpt-4-0314', name: 'GPT-4 0314', description: 'Version 0314 of GPT-4' },
//   // { id: 'gpt-4-32k', name: 'GPT-4 32k', description: '32k token version of GPT-4' },
//   // { id: 'gpt-3.5-turbo-0125', name: 'GPT-3.5 Turbo 0125', description: 'Version 0125 of GPT-3.5 Turbo' },
//   // { id: 'gpt-3.5-turbo-1106', name: 'GPT-3.5 Turbo 1106', description: 'Version 1106 of GPT-3.5 Turbo' },
//   // { id: 'gpt-3.5-turbo-0613', name: 'GPT-3.5 Turbo 0613', description: 'Version 0613 of GPT-3.5 Turbo' },
//   // { id: 'gpt-3.5-0301', name: 'GPT-3.5 0301', description: 'Version 0301 of GPT-3.5' },
//   // { id: 'gpt-3.5-turbo-instruct', name: 'GPT-3.5 Turbo Instruct', description: 'Instruction-tuned GPT-3.5 Turbo' },
//   // { id: 'gpt-3.5-turbo-16k-0613', name: 'GPT-3.5 Turbo 16k 0613', description: '16k token version of GPT-3.5 Turbo' },
//   // { id: 'davinci-002', name: 'Davinci 002', description: 'Davinci model version 002' },
//   // { id: 'babbage-002', name: 'Babbage 002', description: 'Babbage model version 002' }
// ]

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