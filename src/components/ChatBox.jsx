import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Settings, Trash2, AlertCircle, Paperclip, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Message from './Message';
import ModelSelector from './ModelSelector';
import FileUpload from './FileUpload';
import VoiceChat from './VoiceChat';
import ResearchPanel from './ResearchPanel';
import CitationCard from './CitationCard';
import { callOpenAI, transcribeAudio, analyzeDocument } from '../utils/openai';
import { performWebSearch, getResearchPrompt, formatResearchResponse } from '../utils/research';

const ChatBox = ({ apiKey, onOpenKeyModal, onClearKey }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [researchMode, setResearchMode] = useState('comprehensive');
  const [isResearching, setIsResearching] = useState(false);
  const [citations, setCitations] = useState([]);
  const [showCitations, setShowCitations] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleFileUpload = (fileData) => {
    setUploadedFiles(prev => [...prev, fileData]);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleVoiceTranscription = async (audioBlob) => {
    setIsUploading(true);
    try {
      const transcription = await transcribeAudio(audioBlob, apiKey);
      setInput(prev => prev + (prev ? ' ' : '') + transcription);
    } catch (error) {
      setError('Voice transcription failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleWebSearch = async (query, sources) => {
    setIsResearching(true);
    setError('');

    try {
      const searchResults = await performWebSearch(query, sources, apiKey);
      setCitations(searchResults.citations);
      
      // Add search results as a message
      const searchMessage = {
        id: Date.now(),
        text: searchResults.summary,
        isUser: false,
        timestamp: Date.now(),
        model: 'Web Search',
        isResearch: true,
        citations: searchResults.citations
      };
      
      setMessages(prev => [...prev, searchMessage]);
      setShowCitations(true);
    } catch (error) {
      setError('Web search failed: ' + error.message);
    } finally {
      setIsResearching(false);
    }
  };

  const processFiles = async () => {
    const processedContent = [];
    
    for (const file of uploadedFiles) {
      if (file.type.startsWith('image/')) {
        processedContent.push(`[Image: ${file.name}]`);
      } else {
        try {
          const analysis = await analyzeDocument(file.content, file.name, apiKey, selectedModel);
          processedContent.push(`[Document Analysis for ${file.name}]: ${analysis}`);
        } catch (error) {
          processedContent.push(`[Error analyzing ${file.name}]: ${error.message}`);
        }
      }
    }
    
    return processedContent.join('\n\n');
  };

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    let messageContent = input.trim();
    let isResearchQuery = false;
    
    // Check if research mode is active and enhance the prompt
    if (researchMode && researchMode !== 'comprehensive') {
      messageContent = getResearchPrompt(researchMode, messageContent);
      isResearchQuery = true;
    }
    
    const hasFiles = uploadedFiles.length > 0;
    
    // Process files if any
    if (hasFiles) {
      setIsUploading(true);
      try {
        const fileContent = await processFiles();
        messageContent = messageContent ? `${messageContent}\n\n${fileContent}` : fileContent;
      } catch (error) {
        setError('Error processing files: ' + error.message);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    setInput('');
    setUploadedFiles([]);
    setError('');

    const newMessages = [
      ...messages,
      { 
        id: Date.now(), 
        text: messageContent, 
        isUser: true, 
        timestamp: Date.now(),
        model: selectedModel,
        hasFiles: hasFiles,
        isResearch: isResearchQuery
      }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      let response;
      if (selectedModel.includes('dall-e')) {
        // For image generation, use the last user message as prompt
        response = await callOpenAI([{ role: 'user', content: input.trim() }], apiKey, selectedModel);
        // Response will be an image URL for DALL-E models
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            text: response, 
            isUser: false, 
            timestamp: Date.now(),
            model: selectedModel,
            isImage: true
          }
        ]);
      } else {
        response = await callOpenAI(conversationHistory, apiKey, selectedModel);
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            text: formatResearchResponse(response, isResearchQuery ? citations : []), 
            isUser: false, 
            timestamp: Date.now(),
            model: selectedModel,
            isResearch: isResearchQuery,
            citations: isResearchQuery ? citations : []
          }
        ]);
      }
    } catch (error) {
      setError(error.message);
      console.error('OpenAI API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
    setUploadedFiles([]);
    inputRef.current?.focus();
  };

  const retryLastMessage = () => {
    if (messages.length === 0) return;
    
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToKeep);
    setError('');

    const lastUserMessage = messages[lastUserMessageIndex];
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const conversationHistory = messagesToKeep.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));

        const response = await callOpenAI(conversationHistory, apiKey, lastUserMessage.model || selectedModel);
        
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now(), 
            text: response, 
            isUser: false, 
            timestamp: Date.now(),
            model: lastUserMessage.model || selectedModel
          }
        ]);
      } catch (error) {
        setError(error.message);
        console.error('OpenAI API Error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">KoorioX</h1>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            isOpen={isModelSelectorOpen}
            onToggle={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
          />
          <button
            onClick={() => setShowResearchPanel(!showResearchPanel)}
            className={`p-2 rounded-lg transition-colors ${
              showResearchPanel || researchMode !== 'comprehensive'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Research Tools"
          >
            <Search size={18} />
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={onOpenKeyModal}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="API Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-y-auto px-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">K</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to KoorioX</h2>
              <p className="text-gray-600 mb-6">Your enhanced AI assistant with voice, files, and multiple models!</p>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-3 bg-white/60 border border-gray-200 rounded-xl text-left">
                  <div className="font-medium text-gray-800">🎤 Voice Chat:</div>
                  <div className="text-gray-600 mt-1">Record voice messages</div>
                </div>
                <div className="p-3 bg-white/60 border border-gray-200 rounded-xl text-left">
                  <div className="font-medium text-gray-800">📁 File Upload:</div>
                  <div className="text-gray-600 mt-1">Analyze documents and images</div>
                </div>
                <div className="p-3 bg-white/60 border border-gray-200 rounded-xl text-left">
                  <div className="font-medium text-gray-800">🎨 Image Generation:</div>
                  <div className="text-gray-600 mt-1">Create images with DALL-E</div>
                </div>
                <div className="p-3 bg-white/60 border border-gray-200 rounded-xl text-left">
                  <div className="font-medium text-gray-800">🔍 Deep Research:</div>
                  <div className="text-gray-600 mt-1">Web search and analysis tools</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                model={message.model}
                isImage={message.isImage}
                hasFiles={message.hasFiles}
                isResearch={message.isResearch}
                citations={message.citations}
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
        
        {/* Research Panel */}
        {showResearchPanel && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <ResearchPanel
                onResearchModeChange={setResearchMode}
                researchMode={researchMode}
                onWebSearch={handleWebSearch}
                isResearching={isResearching}
              />
              
              {/* Citations */}
              {citations.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowCitations(!showCitations)}
                    className="flex items-center justify-between w-full p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">
                      Sources & Citations ({citations.length})
                    </span>
                    {showCitations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showCitations && (
                    <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
                      {citations.map((citation, index) => (
                        <CitationCard key={index} citation={citation} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* File Upload Area */}
      {showFileUpload && (
        <div className="mx-4 mb-2">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
              isUploading={isUploading}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={retryLastMessage}
                className="text-xs text-red-600 hover:text-red-800 underline mt-1 flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`p-3 rounded-full transition-colors ${
                  showFileUpload || uploadedFiles.length > 0
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Upload files"
              >
                <Paperclip size={18} />
              </button>
              
              <VoiceChat
                onTranscription={handleVoiceTranscription}
                isProcessing={isUploading || isLoading}
                isResearching={isResearching}
              />
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || isUploading}
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading || isUploading}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isLoading || isUploading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line • Upload files • Use voice input • Deep research tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;