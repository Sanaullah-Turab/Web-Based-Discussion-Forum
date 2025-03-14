// In your ForumDetail.jsx or similar component
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { forumAPI } from "../services/forum";
import ChatDiscussion from "./ChatDiscussion";

const ForumDetail = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch forum
  useEffect(() => {
    const fetchForum = async () => {
      setLoading(true);
      try {
        // Ensure forumId is a number
        const id = Number(forumId);
        console.log(`ForumDetail: Fetching forum with ID ${id}`);

        const forumData = await forumAPI.getForum(id);
        console.log("Forum data received:", forumData);

        if (forumData && forumData.id) {
          setForum(forumData);
          setError(null);
        } else {
          throw new Error("Forum data is invalid");
        }
      } catch (err) {
        console.error(`Error fetching forum ${forumId}:`, err);
        setError(
          `Forum ID ${forumId} not found. It might have been deleted or never existed.`
        );
      } finally {
        setLoading(false);
      }
    };

    if (forumId) {
      fetchForum();
    }
  }, [forumId]);

  // Handle "view all forums" button click
  const handleViewAllForums = () => {
    navigate("/forum-navigator");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading forum...</p>
        </div>
      </div>
    );
  }

  if (error || !forum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error || "Forum not found"}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/forums")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Forums List
          </button>

          <button
            onClick={handleViewAllForums}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View All Available Forums
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-lg font-semibold mb-2">
            Why am I seeing this error?
          </h2>
          <p>
            You're trying to access a forum that doesn't exist in the database.
            This could happen if:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>The forum was deleted</li>
            <li>Your database was reset, removing this forum</li>
            <li>You're using a hardcoded forum ID that never existed</li>
          </ul>
          <p className="mt-2">
            Use the "View All Available Forums" button to see which forums
            actually exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/forums")}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Forums
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{forum.name}</h1>
            <p className="text-gray-600 mb-4">{forum.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              {forum.created_by && (
                <span className="text-sm text-gray-500">
                  Created by {forum.created_by.name || "Unknown"}
                </span>
              )}
              {forum.created_at && (
                <span className="text-sm text-gray-500">
                  {new Date(forum.created_at).toLocaleDateString()}
                </span>
              )}
              {forum.category_detail && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {forum.category_detail.name}
                </span>
              )}
              {forum.is_locked && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Locked
                </span>
              )}
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded text-blue-800 text-sm">
            Forum ID: {forum.id}
          </div>
        </div>
      </div>

      {/* Pass the forum data to ChatDiscussion */}
      <ChatDiscussion forum={forum} />
    </div>
  );
};

export default ForumDetail;
