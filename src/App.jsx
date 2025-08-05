import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import KeyModal from './components/KeyModal';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [apiKey, setApiKey, removeApiKey] = useLocalStorage('openai-api-key', '');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Check if we have an API key on mount
    const timer = setTimeout(() => {
      if (!apiKey) {
        setIsKeyModalOpen(true);
      }
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [apiKey]);

  const handleSaveKey = (newKey) => {
    setApiKey(newKey);
    setIsKeyModalOpen(false);
  };

  const handleOpenKeyModal = () => {
    setIsKeyModalOpen(true);
  };

  const handleCloseKeyModal = () => {
    if (apiKey) {
      setIsKeyModalOpen(false);
    }
  };

  const handleClearKey = () => {
    removeApiKey();
    setIsKeyModalOpen(true);
  };

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">K</span>
          </div>
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading KoorioX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-screen flex flex-col">
        <ChatBox
          apiKey={apiKey}
          onOpenKeyModal={handleOpenKeyModal}
          onClearKey={handleClearKey}
        />
      </div>

      <KeyModal
        isOpen={isKeyModalOpen}
        onSave={handleSaveKey}
        onClose={handleCloseKeyModal}
        existingKey={apiKey}
      />
    </div>
  );
}

export default App;