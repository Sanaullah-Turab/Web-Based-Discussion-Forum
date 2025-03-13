import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

// Import the API services we created
import { messageAPI, forumAPI } from "../services/discussionApi";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];
const ALLOWED_FILE_TYPES = [".pdf", ".jpg", ".png", ".zip"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatDiscussion = ({ forum }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLocked, setIsLocked] = useState(forum.is_locked || false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch messages when the component mounts or forum changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Get messages for this forum
        const messagesData = await messageAPI.getMessages({
          forum_id: forum.id,
        });
        setMessages(messagesData);
        setError(null);

        // Get current user from localStorage
        const userJson = localStorage.getItem("user");
        if (userJson) {
          setCurrentUser(JSON.parse(userJson));
        } else {
          // Fallback to dummy user if not found in localStorage
          setCurrentUser({
            id: 1,
            name: "Demo User",
            avatar: "https://ui-avatars.com/api/?name=Demo+User",
            role: "user",
          });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [forum.id]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    const position = e.target.selectionStart;
    setNewMessage(text);
    setCursorPosition(position);

    // Basic @mention detection
    const lastAtSymbol = text.lastIndexOf("@", position);
    if (lastAtSymbol !== -1) {
      const afterAtSymbol = text.slice(lastAtSymbol + 1, position);
      if (!afterAtSymbol.includes(" ")) {
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

    if (
      !ALLOWED_FILE_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
    ) {
      alert("Sorry, only PDF, JPG, PNG, and ZIP files are allowed!");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File is too big! Maximum size is 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleMentionClick = (user) => {
    const textBeforeMention = newMessage.slice(0, newMessage.lastIndexOf("@"));
    const textAfterMention = newMessage.slice(cursorPosition);
    const newText = `${textBeforeMention}@${user.name} ${textAfterMention}`;
    setNewMessage(newText);
    setShowMentions(false);
  };

  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLocked) {
      try {
        // Make sure to include the current user as the author
        const newMsg = {
          id: Date.now(), // Use timestamp as temporary ID
          author: currentUser || {
            id: 0,
            name: "Unknown",
            avatar: "https://ui-avatars.com/api/?name=Unknown",
            role: "user",
          },
          content: newMessage,
          timestamp: new Date().toISOString(),
          isPinned: false,
          isEdited: false,
          reactions: {},
          replies: [],
          attachments: selectedFile
            ? [
                {
                  name: selectedFile.name,
                  size: selectedFile.size,
                  type: selectedFile.type,
                },
              ]
            : [],
        };

        setMessages([newMsg, ...messages]);
        setNewMessage("");
        setSelectedFile(null);
      } catch (err) {
        console.error("Error creating message:", err);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const handleReply = async (messageId, replyText) => {
    if (!isLocked) {
      try {
        // Create a reply (which is just a message with a parent_id)
        const replyData = {
          content: replyText,
          forum: forum.id,
          parent: messageId,
        };

        const createdReply = await messageAPI.createMessage(replyData);

        // Update the local state
        setMessages(
          messages.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                replies: [...(message.replies || []), createdReply],
              };
            }
            return message;
          })
        );
      } catch (err) {
        console.error("Error creating reply:", err);
        alert("Failed to send reply. Please try again.");
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageAPI.deleteMessage(messageId);
      setMessages(messages.filter((message) => message.id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      // Update message on the backend
      const updateData = {
        content: newContent,
      };

      await messageAPI.updateMessage(messageId, updateData);

      // Update local state
      setMessages(
        messages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              content: newContent,
              isEdited: true,
            };
          }
          return message;
        })
      );

      setEditingMessage(null);
    } catch (err) {
      console.error("Error editing message:", err);
      alert("Failed to edit message. Please try again.");
    }
  };

  // Add this function after your existing handler functions

  const handleReaction = async (
    messageId,
    reaction,
    isReply = false,
    replyId = null
  ) => {
    try {
      if (isReply && replyId !== null) {
        // Handle reaction to a reply
        setMessages(
          messages.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                replies: (message.replies || []).map((reply) => {
                  if (reply.id === replyId) {
                    const currentReactions = reply.reactions?.[reaction] || [];
                    const userId = currentUser?.id;

                    // Toggle the reaction
                    return {
                      ...reply,
                      reactions: {
                        ...(reply.reactions || {}),
                        [reaction]: currentReactions.includes(userId)
                          ? currentReactions.filter((id) => id !== userId)
                          : [...currentReactions, userId],
                      },
                    };
                  }
                  return reply;
                }),
              };
            }
            return message;
          })
        );
      } else {
        // Handle reaction to a main message
        setMessages(
          messages.map((message) => {
            if (message.id === messageId) {
              const currentReactions = message.reactions?.[reaction] || [];
              const userId = currentUser?.id;

              // Toggle the reaction
              return {
                ...message,
                reactions: {
                  ...(message.reactions || {}),
                  [reaction]: currentReactions.includes(userId)
                    ? currentReactions.filter((id) => id !== userId)
                    : [...currentReactions, userId],
                },
              };
            }
            return message;
          })
        );
      }
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  // Add this function after your existing handler functions

  const handlePinMessage = async (messageId) => {
    try {
      // Find the message to pin/unpin
      const messageToUpdate = messages.find((m) => m.id === messageId);

      if (!messageToUpdate) {
        console.error(`Message with ID ${messageId} not found`);
        return;
      }

      // Toggle the isPinned status
      const updatedData = {
        is_pinned: !messageToUpdate.isPinned,
      };

      // Update in backend (if API is available)
      // await messageAPI.updateMessage(messageId, updatedData);

      // Update local state
      setMessages(
        messages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              isPinned: !message.isPinned,
            };
          }
          return message;
        })
      );
    } catch (err) {
      console.error("Error pinning message:", err);
      alert("Failed to pin message. Please try again.");
    }
  };

  // Handle toggling the forum lock status
  const handleToggleLock = async () => {
    try {
      // Use the forumAPI to update the forum
      const updatedForum = await forumAPI.updateForum(forum.id, {
        is_locked: !isLocked,
      });

      // Update local state based on the response
      setIsLocked(updatedForum.is_locked);
    } catch (err) {
      console.error("Error toggling forum lock:", err);
      alert("Failed to update forum status.");
    }
  };

  const handleBanUser = (userId) => {
    setBannedUsers([...bannedUsers, userId]);
    // If you have a backend API for banning users, you can call it here
    console.log(`User ${userId} has been banned`);
  };

  const handleUnbanUser = (userId) => {
    setBannedUsers(bannedUsers.filter((id) => id !== userId));
    // If you have a backend API for unbanning users, you can call it here
    console.log(`User ${userId} has been unbanned`);
  };

  const isCreator = currentUser && forum.creator_id === currentUser.id;
  const canModerate =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "moderator");

  const sortedMessages = [...messages].sort((a, b) => {
    // Sort by creation time, newest first
    return (
      new Date(b.created_at || b.timestamp) -
      new Date(a.created_at || a.timestamp)
    );
  });

  if (loading) {
    return <div className="p-4 text-center">Loading discussion...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 font-[Poppins]">
      {/* Header section */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {forum.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                {forum.category?.name || "General"}
              </span>
              <span className="text-xs text-gray-500">
                {messages.length} messages
              </span>
              {isLocked && (
                <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                  🔒 Discussion locked
                </span>
              )}
            </div>
          </div>

          {/* Control buttons for moderators and creators */}
          {(isCreator || canModerate) && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleToggleLock}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isLocked
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                {isLocked ? "🔓 Unlock discussion" : "🔒 Lock discussion"}
              </button>
              <button
                onClick={() => document.getElementById("file-input").click()}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
              >
                📎 Add file
              </button>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(",")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Messages list - you can add this if needed */}
      <div className="divide-y divide-gray-100">
        {sortedMessages.map((message) => (
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
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
              isCreator={isCreator}
              canModerate={canModerate}
              isLocked={isLocked}
              isEditing={editingMessage === message.id}
              setEditing={(isEditing) =>
                setEditingMessage(isEditing ? message.id : null)
              }
              availableReactions={REACTIONS}
              bannedUsers={bannedUsers}
              currentUser={currentUser}
            />
          </div>
        ))}

        {messages.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No messages yet. Be the first to post!
          </div>
        )}
      </div>

      {/* Message input form */}
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
              placeholder="Write your message..."
              className="w-full pl-3 pr-16 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Send
            </button>

            {/* Mentions dropdown */}
            {showMentions && (
              <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                {users
                  .filter((user) =>
                    user.name
                      .toLowerCase()
                      .includes(mentionSearch.toLowerCase())
                  )
                  .map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleMentionClick(user)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{user.name}</span>
                    </button>
                  ))}
                {users.filter((user) =>
                  user.name.toLowerCase().includes(mentionSearch.toLowerCase())
                ).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No users found
                  </div>
                )}
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
    category: PropTypes.object,
    creator_id: PropTypes.number,
    is_locked: PropTypes.bool,
  }).isRequired,
};

export default ChatDiscussion;
