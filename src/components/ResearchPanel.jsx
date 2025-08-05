import React, { useState } from 'react';
import { Search, Globe, BookOpen, TrendingUp, Users, Lightbulb, FileText, ExternalLink } from 'lucide-react';

const ResearchPanel = ({ onResearchModeChange, researchMode, onWebSearch, isResearching }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSources, setSearchSources] = useState(['web', 'academic', 'news']);

  const researchModes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Research',
      icon: <BookOpen size={16} />,
      description: 'In-depth analysis with multiple perspectives',
      color: 'blue'
    },
    {
      id: 'academic',
      name: 'Academic Research',
      icon: <FileText size={16} />,
      description: 'Scholarly sources and peer-reviewed content',
      color: 'purple'
    },
    {
      id: 'market',
      name: 'Market Analysis',
      icon: <TrendingUp size={16} />,
      description: 'Business insights and market trends',
      color: 'green'
    },
    {
      id: 'competitive',
      name: 'Competitive Intelligence',
      icon: <Users size={16} />,
      description: 'Competitor analysis and industry comparison',
      color: 'orange'
    },
    {
      id: 'trend',
      name: 'Trend Analysis',
      icon: <Lightbulb size={16} />,
      description: 'Latest trends and emerging patterns',
      color: 'pink'
    }
  ];

  const searchSourceOptions = [
    { id: 'web', name: 'Web Search', icon: <Globe size={14} /> },
    { id: 'academic', name: 'Academic Papers', icon: <BookOpen size={14} /> },
    { id: 'news', name: 'News Articles', icon: <FileText size={14} /> }
  ];

  const handleWebSearch = () => {
    if (searchQuery.trim()) {
      onWebSearch(searchQuery, searchSources);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleWebSearch();
    }
  };

  const getColorClasses = (color, isSelected = false) => {
    const colors = {
      blue: isSelected ? 'bg-blue-100 border-blue-300 text-blue-800' : 'hover:bg-blue-50 hover:border-blue-200',
      purple: isSelected ? 'bg-purple-100 border-purple-300 text-purple-800' : 'hover:bg-purple-50 hover:border-purple-200',
      green: isSelected ? 'bg-green-100 border-green-300 text-green-800' : 'hover:bg-green-50 hover:border-green-200',
      orange: isSelected ? 'bg-orange-100 border-orange-300 text-orange-800' : 'hover:bg-orange-50 hover:border-orange-200',
      pink: isSelected ? 'bg-pink-100 border-pink-300 text-pink-800' : 'hover:bg-pink-50 hover:border-pink-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-800">Deep Research Tools</h3>
      </div>

      {/* Web Search */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search the web for real-time information..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isResearching}
          />
          <button
            onClick={handleWebSearch}
            disabled={!searchQuery.trim() || isResearching}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {isResearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Search
          </button>
        </div>

        {/* Search Sources */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Sources:</span>
          {searchSourceOptions.map((source) => (
            <button
              key={source.id}
              onClick={() => {
                setSearchSources(prev => 
                  prev.includes(source.id) 
                    ? prev.filter(s => s !== source.id)
                    : [...prev, source.id]
                );
              }}
              className={`flex items-center gap-1 px-2 py-1 text-xs border rounded-md transition-colors ${
                searchSources.includes(source.id)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {source.icon}
              {source.name}
            </button>
          ))}
        </div>
      </div>

      {/* Research Modes */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Research Modes</h4>
        <div className="grid grid-cols-1 gap-2">
          {researchModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onResearchModeChange(mode.id)}
              className={`flex items-start gap-3 p-3 border rounded-lg transition-all text-left ${
                researchMode === mode.id
                  ? getColorClasses(mode.color, true)
                  : `border-gray-200 ${getColorClasses(mode.color)}`
              }`}
            >
              <div className={`p-1.5 rounded-md ${
                researchMode === mode.id
                  ? 'bg-white/50'
                  : 'bg-gray-100'
              }`}>
                {mode.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{mode.name}</div>
                <div className="text-xs text-gray-600 mt-1">{mode.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Research Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Research Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use specific keywords for better search results</li>
          <li>• Combine multiple research modes for comprehensive analysis</li>
          <li>• Upload relevant documents to enhance context</li>
          <li>• Ask follow-up questions to dive deeper into topics</li>
        </ul>
      </div>
    </div>
  );
};

export default ResearchPanel;