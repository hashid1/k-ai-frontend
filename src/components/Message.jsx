import React from 'react';
import { User, Bot, Copy, Check, Zap, Image as ImageIcon, FileText, Search, ExternalLink } from 'lucide-react';
import CitationCard from './CitationCard';

const Message = ({ message, isUser, timestamp, model, isImage, hasFiles, isResearch, citations = [] }) => {
  const [copied, setCopied] = React.useState(false);
  const [showCitations, setShowCitations] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const getModelIcon = (modelId) => {
    if (!modelId) return null;
    if (modelId === 'Web Search') return <Search size={12} />;
    if (modelId.includes('dall-e')) return <ImageIcon size={12} />;
    return <Zap size={12} />;
  };

  const formatMessage = (text) => {
    // Handle image URLs for DALL-E responses
    if (isImage && text.startsWith('http')) {
      return (
        <div className="space-y-2">
          <img 
            src={text} 
            alt="Generated image" 
            className="max-w-full h-auto rounded-lg shadow-sm"
            style={{ maxHeight: '400px' }}
          />
          <p className="text-xs text-gray-500">Generated image</p>
        </div>
      );
    }

    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex gap-3 p-4 transition-all duration-300 hover:bg-gray-50/50 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`group relative inline-block max-w-full ${
          isUser ? 'ml-auto' : ''
        }`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm hover:shadow-md'
          }`}>
            {!isUser && model && (
              <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                {getModelIcon(model)}
                <span>{model}</span>
                {hasFiles && <FileText size={12} />}
                {isResearch && <Search size={12} />}
              </div>
            )}
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {formatMessage(message)}
            </div>
            
            {/* Citations Preview */}
            {!isUser && citations && citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setShowCitations(!showCitations)}
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink size={12} />
                  {citations.length} source{citations.length !== 1 ? 's' : ''} referenced
                </button>
                
                {showCitations && (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {citations.slice(0, 3).map((citation, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                        <div className="font-medium text-gray-800 mb-1">{citation.title}</div>
                        <div className="text-gray-600 mb-1">{citation.snippet}</div>
                        {citation.url && (
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink size={10} />
                            {citation.domain}
                          </a>
                        )}
                      </div>
                    ))}
                    {citations.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{citations.length - 3} more sources
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:bg-gray-50"
              title="Copy message"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-500" />}
            </button>
          )}
        </div>
        
        {timestamp && (
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;