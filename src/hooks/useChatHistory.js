import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useLocalStorage('chat-history', []);
  const [currentChatId, setCurrentChatId] = useState(null);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    return newChatId;
  };

  const saveChat = (chatId, messages, title = null) => {
    if (!chatId || messages.length === 0) return;

    setChatHistory(prev => {
      const existingChatIndex = prev.findIndex(chat => chat.id === chatId);
      const chatTitle = title || generateChatTitle(messages);
      
      const updatedChat = {
        id: chatId,
        title: chatTitle,
        messages: messages,
        createdAt: existingChatIndex >= 0 ? prev[existingChatIndex].createdAt : Date.now(),
        updatedAt: Date.now()
      };

      if (existingChatIndex >= 0) {
        const newHistory = [...prev];
        newHistory[existingChatIndex] = updatedChat;
        return newHistory;
      } else {
        return [updatedChat, ...prev];
      }
    });
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    setCurrentChatId(chatId);
    return chat ? chat.messages : [];
  };

  const deleteChat = (chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const clearAllHistory = () => {
    setChatHistory([]);
    setCurrentChatId(null);
  };

  const generateChatTitle = (messages) => {
    const firstUserMessage = messages.find(msg => msg.isUser);
    if (firstUserMessage) {
      const text = firstUserMessage.text.trim();
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return 'New Chat';
  };

  const getCurrentChat = () => {
    if (!currentChatId) return null;
    return chatHistory.find(chat => chat.id === currentChatId);
  };

  return {
    chatHistory,
    currentChatId,
    createNewChat,
    saveChat,
    loadChat,
    deleteChat,
    clearAllHistory,
    getCurrentChat,
    setCurrentChatId
  };
};