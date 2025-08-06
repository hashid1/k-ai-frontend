import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import ApiKeyManager from './components/ApiKeyManager';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [apiKeys, setApiKeys, removeApiKeys] = useLocalStorage('ai-api-keys', {});
  const [isKeyManagerOpen, setIsKeyManagerOpen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Check if we have an API key on mount
    const timer = setTimeout(() => {
      if (!apiKeys || Object.keys(apiKeys).length === 0) {
        setIsKeyManagerOpen(true);
      }
      setIsAppReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [apiKeys]);

  const handleSaveKeys = (newKeys) => {
    setApiKeys(newKeys);
    setIsKeyManagerOpen(false);
  };

  const handleOpenKeyManager = () => {
    setIsKeyManagerOpen(true);
  };

  const handleCloseKeyManager = () => {
    if (apiKeys && Object.keys(apiKeys).length > 0) {
      setIsKeyManagerOpen(false);
    }
  };

  const handleClearKeys = () => {
    removeApiKeys();
    setIsKeyManagerOpen(true);
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
          apiKeys={apiKeys}
          onOpenKeyManager={handleOpenKeyManager}
          onClearKeys={handleClearKeys}
        />
      </div>

      <ApiKeyManager
        isOpen={isKeyManagerOpen}
        onSaveKeys={handleSaveKeys}
        onClose={handleCloseKeyManager}
        apiKeys={apiKeys}
      />
    </div>
  );
}

export default App;