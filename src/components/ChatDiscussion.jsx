import { useState } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';

const DUMMY_USERS = [
  { id: 1, name: 'Ali123', avatar: '😊', isCreator: true, role: 'admin', isBanned: false },
  { id: 2, name: 'sara_dev', avatar: '🙂', role: 'moderator', isBanned: false },
  { id: 3, name: 'new_coder', avatar: '😎', role: 'user', isBanned: false },
  { id: 4, name: 'learning_js', avatar: '🤓', role: 'user', isBanned: true },
];

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.png', '.zip'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatDiscussion = ({ forum }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: DUMMY_USERS[0],
      content: 'hey guys, im trying to learn react hooks but getting errors. can someone help? getting this error: Cannot read properties of undefined 😭',
      timestamp: '2024-03-11T10:00:00',
      isPinned: true,
      reactions: { '👍': ['user1'], '😢': ['user2'] },
      attachments: [],
      formatting: { bold: [], italic: [] },
      replies: [
        {
          id: 1,
          author: DUMMY_USERS[1],
          content: '@Ali123 show us your code maybe we can help! make sure youre calling hooks at the top level',
          timestamp: '2024-03-11T10:05:00',
          reactions: {},
          attachments: [],
          formatting: { bold: [], italic: [] },
        },
      ],
    },
    {
      id: 2,
      author: DUMMY_USERS[2],
      content: 'typescript is so confusing... why do we need types? javascript works fine without them right? @sara_dev what do u think?',
      timestamp: '2024-03-11T10:10:00',
      isPinned: false,
      reactions: {},
      attachments: [],
      formatting: { bold: [], italic: [] },
      replies: [],
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([DUMMY_USERS[3].id]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    const position = e.target.selectionStart;
    setNewMessage(text);
    setCursorPosition(position);

    const lastAtSymbol = text.lastIndexOf('@', position);
    if (lastAtSymbol !== -1) {
      const afterAtSymbol = text.slice(lastAtSymbol + 1, position);
      if (!afterAtSymbol.includes(' ')) {
        setMentionSearch(afterAtSymbol.toLowerCase());
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.some(type => file.name.toLowerCase().endsWith(type))) {
      alert('Sorry, only PDF, JPG, PNG, and ZIP files are allowed!');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File is too big! Maximum size is 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleMentionClick = (user) => {
    const textBeforeMention = newMessage.slice(0, newMessage.lastIndexOf('@'));
    const textAfterMention = newMessage.slice(cursorPosition);
    const newText = `${textBeforeMention}@${user.name} ${textAfterMention}`;
    setNewMessage(newText);
    setShowMentions(false);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLocked) {
      const message = {
        id: messages.length + 1,
        author: DUMMY_USERS[0],
        content: newMessage,
        timestamp: new Date().toISOString(),
        isPinned: false,
        reactions: {},
        replies: [],
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleReply = (messageId, replyText) => {
    if (!isLocked) {
      setMessages(messages.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: [
              ...(message.replies || []),
              {
                id: (message.replies?.length || 0) + 1,
                author: DUMMY_USERS[0],
                content: replyText,
                timestamp: new Date().toISOString(),
                reactions: {},
              },
            ],
          };
        }
        return message;
      }));
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter(message => message.id !== messageId));
  };

  const handlePinMessage = (messageId) => {
    setMessages(messages.map(message => ({
      ...message,
      isPinned: message.id === messageId ? !message.isPinned : message.isPinned
    })));
  };

  const handleEditMessage = (messageId, newContent) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          content: newContent,
          isEdited: true
        };
      }
      return message;
    }));
    setEditingMessage(null);
  };

  const handleReaction = (messageId, reaction, isReply = false, replyId = null) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        if (isReply && replyId !== null) {
          return {
            ...message,
            replies: message.replies.map(reply => {
              if (reply.id === replyId) {
                const currentReactions = reply.reactions[reaction] || [];
                const userId = DUMMY_USERS[0].id;
                return {
                  ...reply,
                  reactions: {
                    ...reply.reactions,
                    [reaction]: currentReactions.includes(userId)
                      ? currentReactions.filter(id => id !== userId)
                      : [...currentReactions, userId]
                  }
                };
              }
              return reply;
            })
          };
        }
        const currentReactions = message.reactions[reaction] || [];
        const userId = DUMMY_USERS[0].id;
        return {
          ...message,
          reactions: {
            ...message.reactions,
            [reaction]: currentReactions.includes(userId)
              ? currentReactions.filter(id => id !== userId)
              : [...currentReactions, userId]
          }
        };
      }
      return message;
    }));
  };

  const filteredUsers = DUMMY_USERS.filter(user =>
    user.name.toLowerCase().includes(mentionSearch)
  );

  const currentUser = DUMMY_USERS[0];
  const isCreator = currentUser.isCreator;
  const canModerate = currentUser.role === 'admin' || currentUser.role === 'moderator';

  const sortedMessages = [...messages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 font-[Poppins]">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{forum.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                {forum.category}
              </span>
              <span className="text-xs text-gray-500">
                {messages.length} messages • {forum.replyCount} replies
              </span>
              {isLocked && (
                <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                  🔒 Discussion locked
                </span>
              )}
            </div>
          </div>
          {(isCreator || canModerate) && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isLocked 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {isLocked ? '🔓 Unlock discussion' : '🔒 Lock discussion'}
              </button>
              <button
                onClick={() => document.getElementById('file-input').click()}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
              >
                📎 Add file
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sortedMessages.map(message => (
          <div key={message.id} className="p-3 sm:p-4">
            <ChatMessage
              message={message}
              onReply={(replyText) => handleReply(message.id, replyText)}
              onDelete={() => handleDeleteMessage(message.id)}
              onPin={() => handlePinMessage(message.id)}
              onEdit={(newContent) => handleEditMessage(message.id, newContent)}
              onReaction={(reaction) => handleReaction(message.id, reaction)}
              onReplyReaction={(reaction, replyId) => 
                handleReaction(message.id, reaction, true, replyId)
              }
              isCreator={isCreator}
              canModerate={canModerate}
              isLocked={isLocked}
              isEditing={editingMessage === message.id}
              setEditing={(isEditing) => 
                setEditingMessage(isEditing ? message.id : null)
              }
              availableReactions={REACTIONS}
              bannedUsers={bannedUsers}
            />
          </div>
        ))}
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-100">
        {isLocked ? (
          <div className="text-center py-3 text-xs sm:text-sm text-gray-500">
            This discussion is locked 🔒
          </div>
        ) : (
          <form onSubmit={handleNewMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Write your message... (use @ to mention someone)"
              className="w-full pl-3 pr-16 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept={ALLOWED_FILE_TYPES.join(',')}
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span>📎 {selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Send
            </button>

            {showMentions && filteredUsers.length > 0 && (
              <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleMentionClick(user)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">{user.avatar}</span>
                    <span>{user.name}</span>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

ChatDiscussion.propTypes = {
  forum: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    messageCount: PropTypes.number.isRequired,
    replyCount: PropTypes.number.isRequired,
    lastActivity: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatDiscussion; 