import React from 'react';
import { ExternalLink, Calendar, User, BookOpen } from 'lucide-react';

const CitationCard = ({ citation, index }) => {
  const getSourceIcon = (type) => {
    switch (type) {
      case 'academic': return <BookOpen size={14} />;
      case 'news': return <Calendar size={14} />;
      case 'web': return <ExternalLink size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };

  const getSourceColor = (type) => {
    switch (type) {
      case 'academic': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'news': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'web': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getSourceColor(citation.type)}`}>
            {getSourceIcon(citation.type)}
            <span className="capitalize">{citation.type}</span>
          </div>
        </div>
        {citation.date && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={12} />
            {citation.date}
          </div>
        )}
      </div>

      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{citation.title}</h4>
      
      {citation.snippet && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{citation.snippet}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {citation.author && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{citation.author}</span>
            </div>
          )}
          {citation.domain && (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{citation.domain}</span>
          )}
        </div>
        
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink size={12} />
            View Source
          </a>
        )}
      </div>
    </div>
  );
};

export default CitationCard;