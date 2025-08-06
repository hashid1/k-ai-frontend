import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, AlertCircle, Check, Settings, Plus, Trash2 } from 'lucide-react';
import { AI_PROVIDERS, getProviderName, validateApiKey } from '../utils/aiProviders';

const ApiKeyManager = ({ isOpen, onClose, apiKeys, onSaveKeys }) => {
  const [keys, setKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(AI_PROVIDERS.OPENAI);

  useEffect(() => {
    if (isOpen) {
      setKeys(apiKeys || {});
      setErrors({});
    }
  }, [apiKeys, isOpen]);

  const handleKeyChange = (provider, value) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
    if (errors[provider]) {
      setErrors(prev => ({ ...prev, [provider]: '' }));
    }
  };

  const toggleShowKey = (provider) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const validateKey = (provider, key) => {
    return validateApiKey(key, provider);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    // Validate all keys
    const newErrors = {};
    Object.entries(keys).forEach(([provider, key]) => {
      if (key) {
        const error = validateKey(provider, key);
        if (error) {
          newErrors[provider] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Test keys with simple requests (optional)
      await onSaveKeys(keys);
      onClose();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const removeKey = (provider) => {
    setKeys(prev => {
      const newKeys = { ...prev };
      delete newKeys[provider];
      return newKeys;
    });
  };

  const providerConfigs = [
    {
      id: AI_PROVIDERS.OPENAI,
      name: 'OpenAI',
      description: 'GPT models and DALL-E image generation',
      color: 'green',
      helpUrl: 'https://platform.openai.com/api-keys',
      placeholder: 'sk-...'
    },
    {
      id: AI_PROVIDERS.ANTHROPIC,
      name: 'Anthropic',
      description: 'Claude models for advanced reasoning',
      color: 'orange',
      helpUrl: 'https://console.anthropic.com/settings/keys',
      placeholder: 'sk-ant-...'
    },
    {
      id: AI_PROVIDERS.GOOGLE,
      name: 'Google',
      description: 'Gemini models for multimodal AI',
      color: 'blue',
      helpUrl: 'https://makersuite.google.com/app/apikey',
      placeholder: 'AIza...'
    },
    {
      id: AI_PROVIDERS.DEEPSEEK,
      name: 'DeepSeek',
      description: 'Advanced reasoning and coding models',
      color: 'purple',
      helpUrl: 'https://platform.deepseek.com/api_keys',
      placeholder: 'sk-...'
    },
    {
      id: AI_PROVIDERS.IDEOGRAM,
      name: 'Ideogram',
      description: 'High-quality image generation',
      color: 'pink',
      helpUrl: 'https://ideogram.ai/api',
      placeholder: 'idg-...'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">API Key Management</h2>
                <p className="text-sm text-gray-500">Configure your AI provider API keys</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-96">
          {/* Provider Tabs */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">AI Providers</h3>
              <div className="space-y-1">
                {providerConfigs.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveTab(provider.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === provider.id
                        ? 'bg-blue-100 border border-blue-200 text-blue-900'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      keys[provider.id] ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-gray-500">{provider.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Configuration */}
          <div className="flex-1 p-6 overflow-y-auto">
            {providerConfigs.map((provider) => (
              <div
                key={provider.id}
                className={`${activeTab === provider.id ? 'block' : 'hidden'}`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {provider.name} API Key
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showKeys[provider.id] ? 'text' : 'password'}
                          value={keys[provider.id] || ''}
                          onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                          placeholder={provider.placeholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowKey(provider.id)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showKeys[provider.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors[provider.id] && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                          <AlertCircle size={16} />
                          {errors[provider.id]}
                        </div>
                      )}
                      {keys[provider.id] && !errors[provider.id] && (
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                          <Check size={16} />
                          API key format looks correct
                        </div>
                      )}
                    </div>

                    {keys[provider.id] && (
                      <button
                        onClick={() => removeKey(provider.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm transition-colors"
                      >
                        <Trash2 size={16} />
                        Remove API Key
                      </button>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-medium text-blue-800 mb-2">How to get your {provider.name} API key:</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. Visit <a href={provider.helpUrl} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">{provider.helpUrl}</a></li>
                        <li>2. Sign in to your {provider.name} account</li>
                        <li>3. Create a new API key</li>
                        <li>4. Copy and paste the key here</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {errors.general && (
          <div className="mx-6 mb-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{errors.general}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Keys'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;