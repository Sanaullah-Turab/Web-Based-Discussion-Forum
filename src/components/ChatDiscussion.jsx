import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";
import { useParams, useNavigate } from "react-router-dom";

// Import the API services
import { messageAPI, forumAPI } from "../services/forum";

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

const ChatDiscussion = ({ forum: forumProp }) => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(forumProp);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isLocked, setIsLocked] = useState(forumProp?.is_locked || false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMap, setUserMap] = useState({});
  const messagesEndRef = useRef(null);

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

  // First, get the current user
  useEffect(() => {
    const getUserFromLocalStorage = () => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          setCurrentUser(parsedUser);
          console.log("Current user set from localStorage:", parsedUser);
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
        }
      }
    };

    getUserFromLocalStorage();
  }, []);

  // Second, fetch the forum if needed
  useEffect(() => {
    const fetchForum = async () => {
      // If we have a valid forum prop, use it
      if (forumProp && forumProp.id) {
        setForum(forumProp);
        setIsLocked(forumProp.is_locked || false);
        return;
      }

      // If we have a forumId from URL but no forum prop, fetch it
      if (forumId) {
        try {
          console.log(`Fetching forum with ID: ${forumId}`);
          const fetchedForum = await forumAPI.getForum(Number(forumId));
          console.log("Fetched forum:", fetchedForum);
          setForum(fetchedForum);
          setIsLocked(fetchedForum.is_locked || false);
        } catch (err) {
          console.error(`Error fetching forum ${forumId}:`, err);
          alert("Forum not found. You will be redirected to the forums list.");
          navigate("/forums");
        }
      }
    };

    fetchForum();
  }, [forumProp, forumId, navigate]);

  // Third, fetch messages when forum is available
  useEffect(() => {
    const fetchMessages = async () => {
      if (!forum || !forum.id) {
        console.error("Cannot fetch messages: Forum information is missing");
        return;
      }

      setLoadingMessages(true);
      try {
        // IMPORTANT: Use the correct API parameter name
        console.log(`Fetching messages for forum: ${forum.id}`);
        const response = await messageAPI.getMessages({
          forum_id: forum.id,
        });

        console.log("API response for messages:", response);

        let fetchedMessages = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          fetchedMessages = response;
        } else if (response.results && Array.isArray(response.results)) {
          fetchedMessages = response.results;
        } else {
          console.error(
            "Unexpected API response format for messages:",
            response
          );
          fetchedMessages = [];
        }

        console.log("Processed messages:", fetchedMessages);

        // Process messages into the format expected by the UI
        const processedMessages = [];
        const newUserMap = {}; // Start with a fresh user map instead of spreading the existing one

        // First pass: organize messages by ID for quick lookup and build user map
        const messagesById = {};
        const userFetchPromises = [];

        fetchedMessages.forEach((msg) => {
          // Get user details
          const userId = msg.user || msg.author?.id;

          if (userId) {
            // If we have user_detail in the message, use it
            if (msg.user_detail) {
              newUserMap[userId] = {
                id: userId,
                name: msg.user_detail.name || `User ${userId}`,
                avatar:
                  msg.user_detail.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    msg.user_detail.name || `User ${userId}`
                  )}`,
                role: msg.user_detail.role || "user",
              };
            }
            // Otherwise, try to fetch user details if we don't already have them
            else if (!newUserMap[userId]) {
              // Add a promise to fetch this user's details
              userFetchPromises.push(
                messageAPI.getUserDetails(userId).then((userDetail) => {
                  if (userDetail) {
                    newUserMap[userId] = userDetail;
                  }
                })
              );
            }
          }

          // Create message object (rest of your code...)
        });

        // Wait for all user fetch operations to complete
        if (userFetchPromises.length > 0) {
          try {
            await Promise.all(userFetchPromises);
            console.log("All user details fetched:", newUserMap);
          } catch (err) {
            console.error("Error fetching user details:", err);
          }
        }

        // Now continue with message processing using the enhanced userMap

        // First pass: organize messages by ID for quick lookup and build user map
        fetchedMessages.forEach((msg) => {
          // Extract user details correctly from the API response
          const userId = msg.user || msg.author?.id;

          // Only add to userMap if we have user_detail information
          if (userId && msg.user_detail) {
            newUserMap[userId] = {
              id: userId,
              name: msg.user_detail.name || `User ${userId}`,
              avatar:
                msg.user_detail.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  msg.user_detail.name || `User ${userId}`
                )}`,
              role: msg.user_detail.role || "user",
            };
          }

          // Create message object
          const messageObj = {
            id: msg.id,
            author: msg.user_detail
              ? {
                  id: userId,
                  name: msg.user_detail.name || `User ${userId}`,
                  avatar:
                    msg.user_detail.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      msg.user_detail.name || `User ${userId}`
                    )}`,
                  role: msg.user_detail.role || "user",
                }
              : {
                  id: userId,
                  name: `User ${userId}`,
                  avatar: `https://ui-avatars.com/api/?name=User+${userId}`,
                  role: "user",
                },
            content: msg.content,
            timestamp: msg.created_at,
            isPinned: msg.is_pinned || false,
            isEdited: msg.updated_at && msg.updated_at !== msg.created_at,
            reactions: msg.reactions || {},
            replies: [],
            attachments: msg.attachments || [],
            parent: msg.parent || null,
          };

          messagesById[msg.id] = messageObj;
        });

        // Second pass: organize into parent-child relationships
        fetchedMessages.forEach((msg) => {
          if (msg.parent) {
            // This is a reply
            if (messagesById[msg.parent]) {
              messagesById[msg.parent].replies.push(messagesById[msg.id]);
            }
          } else {
            // This is a top-level message
            processedMessages.push(messagesById[msg.id]);
          }
        });

        console.log("Structured messages:", processedMessages);

        // Sort messages by time (newest first)
        processedMessages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Update state
        setMessages(processedMessages);
        setUserMap(newUserMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoadingMessages(false);
        setLoading(false);
      }
    };

    if (forum && forum.id) {
      fetchMessages();
    }
  }, [forum]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      // IMPORTANT: Check that we have a valid forum with ID
      if (!forum || !forum.id) {
        alert("Cannot post message: Forum information is missing or invalid.");
        return;
      }

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

        // Prepare the data for the API
        const messageData = {
          content: newMessage,
          forum: forum.id, // Use the forum ID from state
          parent: null,
        };

        console.log("Sending message data to API:", messageData);

        // Send to backend API
        const createdMessage = await messageAPI.createMessage(messageData);
        console.log("API response for created message:", createdMessage);

        // Get author details
        const authorId =
          createdMessage.user || createdMessage.author?.id || currentUser?.id;

        // Use createdMessage.user_detail if available, otherwise use current user info
        const authorDetails = createdMessage.user_detail
          ? {
              id: authorId,
              name: createdMessage.user_detail.name || `User ${authorId}`,
              avatar:
                createdMessage.user_detail.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  createdMessage.user_detail.name || `User ${authorId}`
                )}`,
              role: createdMessage.user_detail.role || "user",
            }
          : currentUser || {
              id: authorId,
              name: `User ${authorId}`,
              avatar: `https://ui-avatars.com/api/?name=User+${authorId}`,
              role: "user",
            };

        // Replace the temporary message with the real one from API
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? {
                  id: createdMessage.id,
                  author: authorDetails,
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
        if (
          authorId &&
          authorDetails.name &&
          authorDetails.name !== `User ${authorId}`
        ) {
          setUserMap((prevMap) => ({
            ...prevMap,
            [authorId]: authorDetails,
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

      // Get author details from the API response
      const authorId =
        createdReply.user || createdReply.author?.id || currentUser?.id;

      // Use createdReply.user_detail if available, otherwise use current user info
      const authorDetails = createdReply.user_detail
        ? {
            id: authorId,
            name: createdReply.user_detail.name || `User ${authorId}`,
            avatar:
              createdReply.user_detail.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                createdReply.user_detail.name || `User ${authorId}`
              )}`,
            role: createdReply.user_detail.role || "user",
          }
        : currentUser || {
            id: authorId,
            name: `User ${authorId}`,
            avatar: `https://ui-avatars.com/api/?name=User+${authorId}`,
            role: "user",
          };

      // Format the reply data
      const formattedReply = {
        id: createdReply.id,
        author: authorDetails,
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

      // Add this user to the userMap for future reference if it has a proper name
      if (
        authorId &&
        authorDetails.name &&
        authorDetails.name !== `User ${authorId}`
      ) {
        setUserMap((prevMap) => ({
          ...prevMap,
          [authorId]: authorDetails,
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

  if (loading && !forum) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Loading discussion...</p>
      </div>
    );
  }

  if (error && !forum) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button
          onClick={() => navigate("/forums")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded block mx-auto"
        >
          Back to Forums
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 font-[Poppins]">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {forum?.name || forum?.title || "Discussion Forum"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                {forum?.category?.name ||
                  forum?.category_detail?.name ||
                  "General"}
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
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {loadingMessages ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Loading messages...</p>
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
        <div ref={messagesEndRef} />
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
              disabled={!newMessage.trim()}
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
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.object,
    category_detail: PropTypes.object,
    creator_id: PropTypes.number,
    is_locked: PropTypes.bool,
  }),
};

export default ChatDiscussion;
