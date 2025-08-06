import React, { useState } from 'react';
import { 
  History, 
  MessageSquare, 
  Trash2, 
  Search, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreVertical,
  Edit3,
  Check,
  X
} from 'lucide-react';

const ChatHistory = ({ 
  chatHistory, 
  currentChatId, 
  onLoadChat, 
  onDeleteChat, 
  onNewChat,
  onClearAllHistory,
  isOpen,
  onToggle 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const groupedHistory = groupChatsByDate(filteredHistory);

  const handleEditStart = (chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = () => {
    // This would need to be implemented in the parent component
    // For now, we'll just close the edit mode
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Chat History"
      >
        <History size={18} />
      </button>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-800">Chat History</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-3"
        >
          <Plus size={16} />
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </p>
            <p className="text-xs mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a conversation to see it here'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(groupedHistory).map(([dateGroup, chats]) => (
              <div key={dateGroup} className="mb-4">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <Calendar size={12} />
                  {dateGroup}
                </div>
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                        currentChatId === chat.id
                          ? 'bg-blue-100 border border-blue-200'
                          : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200'
                      }`}
                      onClick={() => onLoadChat(chat.id)}
                    >
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleEditSave();
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSave();
                            }}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCancel();
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {chat.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(chat.updatedAt)} • {chat.messages.length} messages
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(chat);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Rename chat"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(chat.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete chat"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Preview of last message */}
                          {chat.messages.length > 0 && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                              {chat.messages[chat.messages.length - 1].text.substring(0, 100)}...
                            </p>
                          )}
                        </>
                      )}

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === chat.id && (
                        <div className="absolute inset-0 bg-white border border-red-200 rounded-lg p-3 z-10">
                          <p className="text-sm text-gray-800 mb-3">Delete this chat?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                                setShowDeleteConfirm(null);
                              }}
                              className="flex-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(null);
                              }}
                              className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {chatHistory.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onClearAllHistory}
            className="w-full flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <Trash2 size={16} />
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
};

const groupChatsByDate = (chats) => {
  const groups = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt);
    const chatDateOnly = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate());
    
    let groupKey;
    if (chatDateOnly.getTime() === today.getTime()) {
      groupKey = 'Today';
    } else if (chatDateOnly.getTime() === yesterday.getTime()) {
      groupKey = 'Yesterday';
    } else if (chatDate > weekAgo) {
      groupKey = 'This Week';
    } else {
      groupKey = chatDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(chat);
  });

  return groups;
};

export default ChatHistory;