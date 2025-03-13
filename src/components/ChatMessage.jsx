import PropTypes from "prop-types";
import { useState, useEffect } from "react";

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

const ChatMessage = ({
  message,
  onReply,
  onDelete,
  onPin,
  onEdit,
  onReaction,
  onReplyReaction,
  onBanUser,
  onUnbanUser,
  isCreator,
  canModerate,
  isLocked,
  isEditing,
  setEditing,
  availableReactions,
  bannedUsers,
  currentUser, // Add this prop
}) => {
  // Add safety check at the beginning
  if (!message || !message.author) {
    console.error("Invalid message data:", message);
    return <div className="p-3 text-gray-400">Message unavailable</div>;
  }

  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(message.content || "");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Update editText when message changes
  useEffect(() => {
    if (message?.content) {
      setEditText(message.content);
    }
  }, [message?.content]);

  const handleInputChange = (e, isEdit = false) => {
    const text = e.target.value;
    const position = e.target.selectionStart;

    if (isEdit) {
      setEditText(text);
    } else {
      setReplyText(text);
    }

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

  const handleMentionClick = (user, isEdit = false) => {
    const text = isEdit ? editText : replyText;
    const textBeforeMention = text.slice(0, text.lastIndexOf("@"));
    const textAfterMention = text.slice(cursorPosition);
    const newText = `${textBeforeMention}@${user.name} ${textAfterMention}`;

    if (isEdit) {
      setEditText(newText);
    } else {
      setReplyText(newText);
    }

    setShowMentions(false);
  };

  const handleSaveEdit = () => {
    if (editText && editText.trim()) {
      onEdit(editText);
      setEditing(false);
    }
  };

  const filteredUsers = DUMMY_USERS.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const formatMessageWithMentions = (text) => {
    if (!text) return ""; // Safety check

    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-blue-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const formatText = (text) => {
    if (!text) return ""; // Safety check

    let formattedText = text;
    if (message.formatting?.bold) {
      message.formatting.bold.forEach((bold) => {
        formattedText = formattedText.replace(bold, `**${bold}**`);
      });
    }
    if (message.formatting?.italic) {
      message.formatting.italic.forEach((italic) => {
        formattedText = formattedText.replace(italic, `_${italic}_`);
      });
    }
    return formattedText;
  };

  const renderAttachment = (attachment) => {
    if (!attachment || !attachment.name) return null; // Safety check

    const isImage = [".jpg", ".png"].some((ext) =>
      attachment.name.toLowerCase().endsWith(ext)
    );
    return (
      <div
        key={attachment.name}
        className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2"
      >
        <span>{isImage ? "🖼️" : "📎"}</span>
        <span className="text-sm text-gray-600">{attachment.name}</span>
        <span className="text-xs text-gray-400">
          ({Math.round((attachment.size || 0) / 1024)}KB)
        </span>
      </div>
    );
  };

  // Use current user ID if available, otherwise fallback to dummy user
  const userId = currentUser?.id || DUMMY_USERS[0].id;

  // Safe check for bannedUsers
  const isBanned =
    Array.isArray(bannedUsers) &&
    message.author?.id !== undefined &&
    bannedUsers.includes(message.author.id);

  return (
    <div className={`relative ${isBanned ? "opacity-50" : ""}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <img
            src={
              message.author?.avatar ||
              "https://ui-avatars.com/api/?name=Unknown"
            }
            alt={message.author?.name || "Unknown"}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-start gap-2">
            <span className="font-medium text-sm">
              {message.author?.name || "Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp || Date.now()).toLocaleString()}
            </span>
            {message.isPinned && (
              <span className="text-xs text-yellow-600">📌 Pinned</span>
            )}
            {isBanned && (
              <span className="text-xs text-red-500 px-2 py-0.5 bg-red-50 rounded-full">
                banned user
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => handleInputChange(e, true)}
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-1 text-sm break-words">
                {formatMessageWithMentions(formatText(message.content || ""))}
              </div>

              {message.attachments?.map((file, index) => (
                <div key={index} className="mt-2 flex items-center gap-2">
                  <span className="text-sm">
                    {file.type && file.type.startsWith("image/") ? "🖼️" : "📎"}{" "}
                    {file.name || "File"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({Math.round((file.size || 0) / 1024)}KB)
                  </span>
                </div>
              ))}

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                >
                  😊 React{" "}
                  {Object.keys(message.reactions || {}).length > 0 &&
                    `(${Object.values(message.reactions || {}).reduce(
                      (sum, arr) => sum + (arr?.length || 0),
                      0
                    )})`}
                </button>

                {showReactions && (
                  <div className="absolute left-0 mt-1 p-1 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-wrap gap-1 z-10">
                    {(availableReactions || []).map((reaction) => (
                      <button
                        key={reaction}
                        onClick={() => {
                          onReaction(reaction);
                          setShowReactions(false);
                        }}
                        className={`px-2 py-0.5 text-sm rounded-full ${
                          message.reactions?.[reaction]?.includes(userId)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {reaction} {message.reactions?.[reaction]?.length || 0}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.replies?.map((reply) => (
                <div
                  key={reply?.id || Math.random()}
                  className="mt-3 pl-3 border-l-2 border-gray-100"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {reply?.author?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(
                        reply?.timestamp || Date.now()
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">{reply?.content || ""}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <button
                      onClick={() => setShowReactions(!showReactions)}
                      className="px-1.5 py-0.5 text-xs rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                    >
                      😊 React{" "}
                      {Object.keys(reply?.reactions || {}).length > 0 &&
                        `(${Object.values(reply?.reactions || {}).reduce(
                          (sum, arr) => sum + (arr?.length || 0),
                          0
                        )})`}
                    </button>

                    {showReactions && (
                      <div className="absolute left-0 mt-1 p-1 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-wrap gap-1 z-10">
                        {(availableReactions || []).map((reaction) => (
                          <button
                            key={reaction}
                            onClick={() => {
                              onReplyReaction(reaction, reply?.id);
                              setShowReactions(false);
                            }}
                            className={`px-1.5 py-0.5 text-xs rounded-full ${
                              reply?.reactions?.[reaction]?.includes(userId)
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {reaction}{" "}
                            {reply?.reactions?.[reaction]?.length || 0}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLocked && !isEditing && (
            <div className="mt-2">
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Reply
              </button>
            </div>
          )}

          {showReplyInput && !isLocked && (
            <div className="mt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => handleInputChange(e)}
                placeholder="Write your reply..."
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    if (replyText.trim()) {
                      onReply(replyText);
                      setReplyText("");
                      setShowReplyInput(false);
                    }
                  }}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {(isCreator || canModerate) && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-red-500 hover:text-red-700 rounded"
              title="Delete message"
            >
              🗑️
            </button>
            <button
              onClick={() => onPin(message.id)}
              className={`p-1 rounded ${
                message.isPinned
                  ? "text-yellow-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title={message.isPinned ? "Unpin message" : "Pin message"}
            >
              📌
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Edit message"
            >
              ✏️
            </button>
            <button
              onClick={() => setShowBanConfirm(true)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title={isBanned ? "Unban user" : "Ban user"}
            >
              {isBanned ? "🔓" : "🔒"}
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="absolute right-0 top-0 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs mb-2">Delete this message?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete(message.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              No
            </button>
          </div>
        </div>
      )}

      {showBanConfirm && message.author?.id && (
        <div className="absolute right-0 top-0 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs mb-2">
            {isBanned ? "Unban this user?" : "Ban this user?"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (message.author?.id) {
                  isBanned
                    ? onUnbanUser(message.author.id)
                    : onBanUser(message.author.id);
                }
                setShowBanConfirm(false);
              }}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={() => setShowBanConfirm(false)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      avatar: PropTypes.string,
      role: PropTypes.string,
    }),
    content: PropTypes.string,
    timestamp: PropTypes.string,
    isPinned: PropTypes.bool,
    isEdited: PropTypes.bool,
    reactions: PropTypes.object,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        size: PropTypes.number,
        type: PropTypes.string,
      })
    ),
    formatting: PropTypes.shape({
      bold: PropTypes.arrayOf(PropTypes.string),
      italic: PropTypes.arrayOf(PropTypes.string),
    }),
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        author: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          avatar: PropTypes.string,
          role: PropTypes.string,
        }),
        content: PropTypes.string,
        timestamp: PropTypes.string,
        reactions: PropTypes.object,
        attachments: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
          })
        ),
        formatting: PropTypes.shape({
          bold: PropTypes.arrayOf(PropTypes.string),
          italic: PropTypes.arrayOf(PropTypes.string),
        }),
      })
    ),
  }),
  onReply: PropTypes.func,
  onDelete: PropTypes.func,
  onPin: PropTypes.func,
  onEdit: PropTypes.func,
  onReaction: PropTypes.func,
  onReplyReaction: PropTypes.func,
  onBanUser: PropTypes.func,
  onUnbanUser: PropTypes.func,
  isCreator: PropTypes.bool,
  canModerate: PropTypes.bool,
  isLocked: PropTypes.bool,
  isEditing: PropTypes.bool,
  setEditing: PropTypes.func,
  availableReactions: PropTypes.arrayOf(PropTypes.string),
  bannedUsers: PropTypes.arrayOf(PropTypes.number),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
  }),
};

// Add these default props to handle missing or incomplete data
ChatMessage.defaultProps = {
  message: {
    id: 0,
    author: {
      id: 0,
      name: "Unknown",
      avatar: "https://ui-avatars.com/api/?name=Unknown",
      role: "user",
    },
    content: "",
    timestamp: new Date().toISOString(),
    isPinned: false,
    isEdited: false,
    reactions: {},
    attachments: [],
    replies: [],
  },
  onReply: () => {},
  onDelete: () => {},
  onPin: () => {},
  onEdit: () => {},
  onReaction: () => {},
  onReplyReaction: () => {},
  onBanUser: () => {},
  onUnbanUser: () => {},
  isCreator: false,
  canModerate: false,
  isLocked: false,
  isEditing: false,
  setEditing: () => {},
  availableReactions: [],
  bannedUsers: [],
  currentUser: {
    id: 0,
    name: "Current User",
    avatar: "https://ui-avatars.com/api/?name=Current+User",
    role: "user",
  },
};

export default ChatMessage;
