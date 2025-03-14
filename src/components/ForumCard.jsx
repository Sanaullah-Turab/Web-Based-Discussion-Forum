import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { forumMembershipAPI } from "../services/forum";

const ForumCard = ({ forum, onDelete, currentUser }) => {
  const [isMember, setIsMember] = useState(false);
  const [membershipId, setMembershipId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format dates
  const createdDate = new Date(
    forum.created_at || new Date()
  ).toLocaleDateString();
  const lastActivityDate = new Date(
    forum.updated_at || forum.created_at || new Date()
  );

  const timeAgo = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastActivityDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  // Check if user is a forum member
  useEffect(() => {
    const checkMembership = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const memberships = await forumMembershipAPI.getMemberships({
          user_id: currentUser.id,
          forum_id: forum.id,
        });

        if (memberships && memberships.length > 0) {
          setIsMember(true);
          setMembershipId(memberships[0].id);
        }
      } catch (error) {
        console.error("Error checking forum membership:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && forum.id) {
      checkMembership();
    }
  }, [currentUser, forum.id]);

  const handleToggleMembership = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("You must be logged in to join a forum");
      return;
    }

    try {
      setLoading(true);

      if (isMember && membershipId) {
        // Leave the forum
        await forumMembershipAPI.leaveForum(membershipId);
        setIsMember(false);
        setMembershipId(null);
      } else {
        // Join the forum
        const result = await forumMembershipAPI.joinForum(forum.id);
        setIsMember(true);
        setMembershipId(result.id);
      }
    } catch (error) {
      console.error("Error toggling forum membership:", error);
      alert(
        `Failed to ${isMember ? "leave" : "join"} forum. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete(forum.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Link
            to={`/forums/${forum.id}`}
            className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-1 flex-1"
          >
            {forum.name}
          </Link>
          <div className="flex space-x-2">
            {!loading && currentUser && (
              <button
                onClick={handleToggleMembership}
                className={`text-sm px-3 py-1 rounded-full ${
                  isMember
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                }`}
              >
                {isMember ? "Joined" : "Join"}
              </button>
            )}
            {currentUser &&
              (currentUser.id === forum.created_by?.id ||
                currentUser.role === "admin") && (
                <button
                  onClick={handleDelete}
                  className="text-sm px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                >
                  Delete
                </button>
              )}
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{forum.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {forum.category_detail && (
            <span className="px-2 py-1 bg-blue-50 text-xs font-medium text-blue-700 rounded-full">
              {forum.category_detail.name}
            </span>
          )}
          {forum.is_locked && (
            <span className="px-2 py-1 bg-red-50 text-xs font-medium text-red-700 rounded-full flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Locked
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4">
            <span>{forum.messages_count || 0} messages</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs">Created {createdDate}</span>
            <span className="text-xs">Last activity {timeAgo()}</span>
          </div>
        </div>

        <div className="mt-4">
          <Link
            to={`/forums/${forum.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Join Discussion
          </Link>
        </div>
      </div>
    </div>
  );
};

ForumCard.propTypes = {
  forum: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    is_locked: PropTypes.bool,
    messages_count: PropTypes.number,
    category_detail: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    created_by: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func,
  currentUser: PropTypes.object,
};

export default ForumCard;
