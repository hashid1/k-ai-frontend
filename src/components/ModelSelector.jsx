import React from 'react';
import { ChevronDown, Zap, Image, Mic, Brain, Sparkles, Cpu, Code, Palette, Paintbrush, Eye } from 'lucide-react';
import { AI_MODELS, getProviderName } from '../utils/aiProviders';

const ModelSelector = ({ selectedModel, onModelChange, isOpen, onToggle }) => {
  const getModelIcon = (iconType) => {
    const icons = {
      zap: <Zap size={16} />,
      image: <Image size={16} />,
      mic: <Mic size={16} />,
      brain: <Brain size={16} />,
      sparkles: <Sparkles size={16} />,
      cpu: <Cpu size={16} />,
      code: <Code size={16} />,
      palette: <Palette size={16} />,
      paintbrush: <Paintbrush size={16} />,
      eye: <Eye size={16} />
    };
    return icons[iconType] || <Zap size={16} />;
  };

  const getProviderColor = (color) => {
    const colors = {
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      pink: 'text-pink-600 bg-pink-50',
      indigo: 'text-indigo-600 bg-indigo-50'
    };
    return colors[color] || 'text-gray-600 bg-gray-50';
  };

  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[1];

  // Group models by provider
  const groupedModels = AI_MODELS.reduce((groups, model) => {
    const provider = model.provider;
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(model);
    return groups;
  }, {});

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-colors text-sm"
      >
        <div className={`p-1 rounded ${getProviderColor(selectedModelData.color)}`}>
          {getModelIcon(selectedModelData.icon)}
        </div>
        <span className="font-medium text-gray-700">{selectedModelData.name}</span>
        <span className="text-xs text-gray-500">({getProviderName(selectedModelData.provider)})</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Select AI Model</div>
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="mb-3">
                <div className="text-xs font-medium text-gray-600 px-3 py-1 bg-gray-50 rounded-md mb-1">
                  {getProviderName(provider)}
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      onToggle();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors mb-1 ${
                      selectedModel === model.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${
                      selectedModel === model.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : getProviderColor(model.color)
                    }`}>
                      {getModelIcon(model.icon)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        selectedModel === model.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                        model.type === 'image' ? 'bg-pink-100 text-pink-700' :
                        model.type === 'multimodal' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {model.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;