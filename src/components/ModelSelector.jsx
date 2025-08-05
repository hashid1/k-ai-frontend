import React from 'react';
import { ChevronDown, Zap, Image, Mic } from 'lucide-react';
import { OPENAI_MODELS } from '../utils/openai';

const ModelSelector = ({ selectedModel, onModelChange, isOpen, onToggle }) => {
  const getModelIcon = (modelId) => {
    if (modelId.includes('dall-e')) return <Image size={16} />;
    if (modelId.includes('whisper')) return <Mic size={16} />;
    return <Zap size={16} />;
  };

  const selectedModelData = OPENAI_MODELS.find(m => m.id === selectedModel) || OPENAI_MODELS[1];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-colors text-sm"
      >
        {getModelIcon(selectedModel)}
        <span className="font-medium text-gray-700">{selectedModelData.name}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Select Model</div>
            {OPENAI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  onToggle();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedModel === model.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className={`p-1.5 rounded-md ${
                  selectedModel === model.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getModelIcon(model.id)}
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    selectedModel === model.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {model.name}
                  </div>
                  <div className="text-xs text-gray-500">{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;