import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

// Import the API services
import { messageAPI, forumAPI } from "../services/discussionApi";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];
const ALLOWED_FILE_TYPES = [".pdf", ".jpg", ".png", ".zip"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DUMMY_USERS = [
  {
    id: 1,
    name: "Ali123",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "admin",
  },
  {
    id: 2,
    name: "sara_dev",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "moderator",
  },
  {
    id: 3,
    name: "new_coder",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "user",
  },
  {
    id: 4,
    name: "learning_js",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "user",
  },
];

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
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMap, setUserMap] = useState({});

  // Helper function to get user details from ID
  const getUserDetails = (userId, usersMap = {}) => {
    // If we have the user in our map, return it
    if (usersMap[userId]) {
      return usersMap[userId];
    }

    // Check if we can find the user in DUMMY_USERS (for testing)
    const dummyUser = DUMMY_USERS.find((user) => user.id === userId);
    if (dummyUser) {
      return dummyUser;
    }

    // If it's the current user
    if (currentUser && currentUser.id === userId) {
      return currentUser;
    }

    // For now, return a default with the correct ID
    return {
      id: userId,
      name: `User ${userId}`, // Better than "Unknown"
      avatar: `https://ui-avatars.com/api/?name=User+${userId}`,
      role: "user",
    };
  };

  // Fetch messages when the component mounts or forum changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setLoadingMessages(true);
      try {
        // Initialize user data
        setUsers(DUMMY_USERS);

        // Get current user from localStorage
        const userJson = localStorage.getItem("user");
        let currentUserData;
        if (userJson) {
          currentUserData = JSON.parse(userJson);
          setCurrentUser(currentUserData);
        } else {
          // For testing, set a dummy current user
          currentUserData = DUMMY_USERS[0];
          setCurrentUser(currentUserData);
        }

        // Create a map of users for quick lookup
        const newUserMap = {};

        // Add current user to the map
        if (currentUserData) {
          newUserMap[currentUserData.id] = {
            id: currentUserData.id,
            name: currentUserData.name,
            avatar: currentUserData.avatar,
            role: currentUserData.role,
          };
        }

        // Add dummy users to the map
        DUMMY_USERS.forEach((user) => {
          newUserMap[user.id] = user;
        });

        setUserMap(newUserMap);

        // Fetch messages from API
        try {
          console.log("Fetching messages for forum:", forum.id);
          const fetchedMessages = await messageAPI.getMessages({
            forum_id: forum.id,
          });

          console.log("Fetched messages:", fetchedMessages);

          // Format messages with proper user details
          const formattedMessages = fetchedMessages.map((msg) => {
            // Extract user info from the message or userMap
            const authorId = msg.user || msg.author?.id;
            const authorDetails = getUserDetails(authorId, newUserMap);

            return {
              id: msg.id,
              author: {
                id: authorDetails.id,
                name:
                  authorDetails.name ||
                  msg.author?.username ||
                  "User " + authorId,
                avatar:
                  authorDetails.avatar ||
                  msg.author?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authorDetails.name ||
                      msg.author?.username ||
                      "User " + authorId
                  )}`,
                role: authorDetails.role || msg.author?.role || "user",
              },
              content: msg.content || "",
              timestamp: msg.created_at || new Date().toISOString(),
              isPinned: Boolean(msg.is_pinned),
              isEdited: Boolean(msg.is_edited),
              reactions: msg.reactions || {},
              replies: Array.isArray(msg.replies)
                ? msg.replies.map((reply) => {
                    const replyAuthorId = reply.user || reply.author?.id;
                    const replyAuthorDetails = getUserDetails(
                      replyAuthorId,
                      newUserMap
                    );

                    return {
                      id: reply.id,
                      author: {
                        id: replyAuthorDetails.id,
                        name:
                          replyAuthorDetails.name ||
                          reply.author?.username ||
                          "User " + replyAuthorId,
                        avatar:
                          replyAuthorDetails.avatar ||
                          reply.author?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            replyAuthorDetails.name ||
                              reply.author?.username ||
                              "User " + replyAuthorId
                          )}`,
                        role:
                          replyAuthorDetails.role ||
                          reply.author?.role ||
                          "user",
                      },
                      content: reply.content || "",
                      timestamp: reply.created_at || new Date().toISOString(),
                      reactions: reply.reactions || {},
                    };
                  })
                : [],
              attachments: Array.isArray(msg.attachments)
                ? msg.attachments
                : [],
            };
          });

          setMessages(formattedMessages);
        } catch (apiError) {
          console.error("API error:", apiError);

          // Use dummy data as fallback
          const dummyMessages = [
            {
              id: 1,
              author: DUMMY_USERS[0],
              content: "Welcome to the discussion forum!",
              timestamp: new Date().toISOString(),
              isPinned: false,
              isEdited: false,
              reactions: {},
              replies: [],
              attachments: [],
            },
          ];

          setMessages(dummyMessages);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
        setMessages([]);
      } finally {
        setLoading(false);
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [forum.id]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    const position = e.target.selectionStart;
    setNewMessage(text);
    setCursorPosition(position);

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

  const handleMentionClick = (user) => {
    const textBeforeMention = newMessage.slice(0, newMessage.lastIndexOf("@"));
    const textAfterMention = newMessage.slice(cursorPosition);
    const newText = `${textBeforeMention}@${user.name} ${textAfterMention}`;
    setNewMessage(newText);
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

  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLocked) {
      try {
        // Show optimistic UI update
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
          id: tempId,
          author: currentUser || {
            id: 0,
            name: "You",
            avatar: "https://ui-avatars.com/api/?name=You",
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

        // Add temporary message for instant feedback
        setMessages((prevMessages) => [tempMessage, ...prevMessages]);

        // Clear the form
        setNewMessage("");
        setSelectedFile(null);

        // Prepare the data for the API - use the format expected by backend
        const messageData = {
          content: newMessage,
          forum: forum.id, // Use forum instead of forum_id based on API docs
          parent: null, // Adding this as it's expected by the API
        };

        console.log("Sending message data to API:", messageData);

        // Send to backend API
        const createdMessage = await messageAPI.createMessage(messageData);
        console.log("API response:", createdMessage);

        // Get author details - the API might return user ID instead of full author object
        const authorId =
          createdMessage.user || createdMessage.author?.id || currentUser?.id;
        const authorDetails = getUserDetails(authorId, userMap);

        // Replace the temporary message with the real one from API
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? {
                  id: createdMessage.id,
                  author: {
                    id: authorId,
                    name: authorDetails.name,
                    avatar: authorDetails.avatar,
                    role: authorDetails.role || "user",
                  },
                  content: createdMessage.content || newMessage,
                  timestamp:
                    createdMessage.created_at || new Date().toISOString(),
                  isPinned: Boolean(createdMessage.is_pinned),
                  isEdited: Boolean(createdMessage.is_edited),
                  reactions: createdMessage.reactions || {},
                  replies: createdMessage.replies || [],
                  attachments: createdMessage.attachments || [],
                }
              : msg
          )
        );

        // Add this user to the userMap for future reference
        if (authorId) {
          setUserMap((prevMap) => ({
            ...prevMap,
            [authorId]: {
              id: authorId,
              name: authorDetails.name,
              avatar: authorDetails.avatar,
              role: authorDetails.role,
            },
          }));
        }
      } catch (err) {
        console.error("Error creating message:", err);
        alert("Failed to send message. Please try again.");

        // Remove the optimistic message if API call failed
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => !String(msg.id).startsWith("temp-"))
        );
      }
    }
  };

  const handleReply = async (messageId, replyText) => {
    if (!replyText.trim() || isLocked) return;

    try {
      // Prepare reply data based on API requirements
      const replyData = {
        content: replyText,
        parent: messageId, // Use parent instead of parent_message based on API structure
        forum: forum.id,
      };

      console.log("Sending reply data to API:", replyData);

      // Send to API
      const createdReply = await messageAPI.createMessage(replyData);

      // Get author details - the API might return user ID instead of full author object
      const authorId =
        createdReply.user || createdReply.author?.id || currentUser?.id;
      const authorDetails = getUserDetails(authorId, userMap);

      // Format the reply data
      const formattedReply = {
        id: createdReply.id,
        author: {
          id: authorId,
          name: authorDetails.name,
          avatar: authorDetails.avatar,
          role: authorDetails.role || "user",
        },
        content: createdReply.content,
        timestamp: createdReply.created_at || new Date().toISOString(),
        reactions: {},
      };

      // Update local state
      setMessages(
        messages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              replies: [...(message.replies || []), formattedReply],
            };
          }
          return message;
        })
      );

      // Add this user to the userMap for future reference
      if (authorId) {
        setUserMap((prevMap) => ({
          ...prevMap,
          [authorId]: {
            id: authorId,
            name: authorDetails.name,
            avatar: authorDetails.avatar,
            role: authorDetails.role,
          },
        }));
      }
    } catch (err) {
      console.error("Error creating reply:", err);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // Call API to delete message
      await messageAPI.deleteMessage(messageId);

      // Update local state
      setMessages(messages.filter((message) => message.id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

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

      // Call API
      await messageAPI.updateMessage(messageId, updatedData);

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

  const handleReaction = async (
    messageId,
    reaction,
    isReply = false,
    replyId = null
  ) => {
    try {
      // Call API to add or remove reaction
      const reactionData = {
        message_id: messageId,
        reaction_type: reaction,
      };

      if (isReply) {
        reactionData.reply_id = replyId;
      }

      // This endpoint doesn't exist in your API yet, so just update local state
      // await messageAPI.toggleReaction(reactionData);

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

  const handleToggleLock = async () => {
    try {
      // Update the forum lock status in the backend
      const updateData = {
        is_locked: !isLocked,
      };

      await forumAPI.updateForum(forum.id, updateData);

      // Update local state
      setIsLocked(!isLocked);
    } catch (err) {
      console.error("Error toggling forum lock:", err);
      alert("Failed to update forum status.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  // Compute isCreator and canModerate
  const isCreator = currentUser && forum.creator_id === currentUser.id;
  const canModerate =
    currentUser && ["admin", "moderator"].includes(currentUser.role);

  // Sort messages: pinned first, then by timestamp
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  if (loading) {
    return <div className="p-4 text-center">Loading discussion...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 font-[Poppins]">
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

      {/* Messages list */}
      <div className="divide-y divide-gray-100">
        {loadingMessages ? (
          <div className="p-6 text-center text-gray-500">
            Loading messages...
          </div>
        ) : sortedMessages.length > 0 ? (
          sortedMessages.map((message) => (
            <div key={message.id} className="p-3 sm:p-4">
              <ChatMessage
                message={message}
                onReply={(replyText) => handleReply(message.id, replyText)}
                onDelete={() => handleDeleteMessage(message.id)}
                onPin={() => handlePinMessage(message.id)}
                onEdit={(newContent) =>
                  handleEditMessage(message.id, newContent)
                }
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
          ))
        ) : (
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

            {/* Show selected file */}
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

            {/* Mentions dropdown */}
            {showMentions && filteredUsers.length > 0 && (
              <div className="absolute left-0 right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                {filteredUsers.map((user) => (
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
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.object,
    creator_id: PropTypes.number,
    is_locked: PropTypes.bool,
  }).isRequired,
};

ChatDiscussion.defaultProps = {
  forum: {
    id: 1,
    title: "Discussion Forum",
    category: { name: "General" },
    creator_id: 1,
    is_locked: false,
  },
};

export default ChatDiscussion;
