// AI Provider configurations and API calls
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  DEEPSEEK: 'deepseek',
  IDEOGRAM: 'ideogram',
  MIDJOURNEY: 'midjourney'
};

export const AI_MODELS = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: AI_PROVIDERS.OPENAI,
    type: 'text',
    description: 'Most capable OpenAI model',
    icon: 'zap',
    color: 'green'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: AI_PROVIDERS.OPENAI,
    type: 'text',
    description: 'Fast and efficient',
    icon: 'zap',
    color: 'green'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: AI_PROVIDERS.OPENAI,
    type: 'text',
    description: 'High performance',
    icon: 'zap',
    color: 'green'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: AI_PROVIDERS.OPENAI,
    type: 'text',
    description: 'Fast and reliable',
    icon: 'zap',
    color: 'green'
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: AI_PROVIDERS.OPENAI,
    type: 'image',
    description: 'Advanced image generation',
    icon: 'image',
    color: 'green'
  },
  {
    id: 'dall-e-2',
    name: 'DALL-E 2',
    provider: AI_PROVIDERS.OPENAI,
    type: 'image',
    description: 'Image generation',
    icon: 'image',
    color: 'green'
  },

  // Anthropic Claude Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: AI_PROVIDERS.ANTHROPIC,
    type: 'text',
    description: 'Most intelligent Claude model',
    icon: 'brain',
    color: 'orange'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: AI_PROVIDERS.ANTHROPIC,
    type: 'text',
    description: 'Fast and lightweight',
    icon: 'brain',
    color: 'orange'
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: AI_PROVIDERS.ANTHROPIC,
    type: 'text',
    description: 'Most powerful Claude model',
    icon: 'brain',
    color: 'orange'
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: AI_PROVIDERS.ANTHROPIC,
    type: 'text',
    description: 'Balanced performance',
    icon: 'brain',
    color: 'orange'
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: AI_PROVIDERS.ANTHROPIC,
    type: 'text',
    description: 'Fast and efficient',
    icon: 'brain',
    color: 'orange'
  },

  // Google Gemini Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: AI_PROVIDERS.GOOGLE,
    type: 'text',
    description: 'Advanced multimodal model',
    icon: 'sparkles',
    color: 'blue'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: AI_PROVIDERS.GOOGLE,
    type: 'text',
    description: 'Fast and versatile',
    icon: 'sparkles',
    color: 'blue'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: AI_PROVIDERS.GOOGLE,
    type: 'text',
    description: 'Powerful text generation',
    icon: 'sparkles',
    color: 'blue'
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: AI_PROVIDERS.GOOGLE,
    type: 'multimodal',
    description: 'Text and image understanding',
    icon: 'eye',
    color: 'blue'
  },

  // DeepSeek Models
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: AI_PROVIDERS.DEEPSEEK,
    type: 'text',
    description: 'Advanced reasoning model',
    icon: 'cpu',
    color: 'purple'
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: AI_PROVIDERS.DEEPSEEK,
    type: 'text',
    description: 'Specialized for coding',
    icon: 'code',
    color: 'purple'
  },

  // Image Generation Models
  {
    id: 'ideogram-v2',
    name: 'Ideogram V2',
    provider: AI_PROVIDERS.IDEOGRAM,
    type: 'image',
    description: 'High-quality image generation',
    icon: 'palette',
    color: 'pink'
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney V6',
    provider: AI_PROVIDERS.MIDJOURNEY,
    type: 'image',
    description: 'Artistic image generation',
    icon: 'paintbrush',
    color: 'indigo'
  }
];

// API calling functions for each provider
export const callOpenAI = async (messages, apiKey, model = 'gpt-4o-mini', options = {}) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    // Handle image generation models
    if (model === 'dall-e-3' || model === 'dall-e-2') {
      return await generateOpenAIImage(messages[messages.length - 1].content, apiKey, model);
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
      throw new Error(errorData.error?.message || `OpenAI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

export const callAnthropic = async (messages, apiKey, model = 'claude-3-5-sonnet-20241022', options = {}) => {
  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        messages: messages,
        ...options
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Anthropic API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    throw error;
  }
};

export const callGoogle = async (messages, apiKey, model = 'gemini-1.5-pro', options = {}) => {
  if (!apiKey) {
    throw new Error('Google API key is required');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Google API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    throw error;
  }
};

export const callDeepSeek = async (messages, apiKey, model = 'deepseek-chat', options = {}) => {
  if (!apiKey) {
    throw new Error('DeepSeek API key is required');
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
      throw new Error(errorData.error?.message || `DeepSeek API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

export const generateOpenAIImage = async (prompt, apiKey, model = 'dall-e-3') => {
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

export const generateIdeogramImage = async (prompt, apiKey) => {
  // Note: This is a placeholder - Ideogram API details would need to be confirmed
  try {
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: 'ASPECT_1_1',
        model: 'V_2',
      }),
    });

    if (!response.ok) {
      throw new Error(`Ideogram API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    throw error;
  }
};

// Main AI calling function that routes to the appropriate provider
export const callAI = async (messages, apiKeys, model, options = {}) => {
  const modelConfig = AI_MODELS.find(m => m.id === model);
  if (!modelConfig) {
    throw new Error(`Model ${model} not found`);
  }

  const provider = modelConfig.provider;
  const apiKey = apiKeys[provider];

  if (!apiKey) {
    throw new Error(`API key for ${provider} is required`);
  }

  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      return await callOpenAI(messages, apiKey, model, options);
    case AI_PROVIDERS.ANTHROPIC:
      return await callAnthropic(messages, apiKey, model, options);
    case AI_PROVIDERS.GOOGLE:
      return await callGoogle(messages, apiKey, model, options);
    case AI_PROVIDERS.DEEPSEEK:
      return await callDeepSeek(messages, apiKey, model, options);
    case AI_PROVIDERS.IDEOGRAM:
      if (modelConfig.type === 'image') {
        return await generateIdeogramImage(messages[messages.length - 1].content, apiKey);
      }
      break;
    case AI_PROVIDERS.MIDJOURNEY:
      // Midjourney would require Discord bot integration or third-party service
      throw new Error('Midjourney integration requires special setup');
    default:
      throw new Error(`Provider ${provider} not implemented`);
  }
};

export const getProviderName = (provider) => {
  const names = {
    [AI_PROVIDERS.OPENAI]: 'OpenAI',
    [AI_PROVIDERS.ANTHROPIC]: 'Anthropic',
    [AI_PROVIDERS.GOOGLE]: 'Google',
    [AI_PROVIDERS.DEEPSEEK]: 'DeepSeek',
    [AI_PROVIDERS.IDEOGRAM]: 'Ideogram',
    [AI_PROVIDERS.MIDJOURNEY]: 'Midjourney'
  };
  return names[provider] || provider;
};

export const validateApiKey = (apiKey, provider) => {
  if (!apiKey) return `${getProviderName(provider)} API key is required`;
  if (typeof apiKey !== 'string') return 'API key must be a string';
  
  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      if (!apiKey.startsWith('sk-')) return 'OpenAI API key should start with "sk-"';
      break;
    case AI_PROVIDERS.ANTHROPIC:
      if (!apiKey.startsWith('sk-ant-')) return 'Anthropic API key should start with "sk-ant-"';
      break;
    case AI_PROVIDERS.GOOGLE:
      if (apiKey.length < 30) return 'Google API key appears to be too short';
      break;
    case AI_PROVIDERS.DEEPSEEK:
      if (!apiKey.startsWith('sk-')) return 'DeepSeek API key should start with "sk-"';
      break;
  }
  
  return null;
};