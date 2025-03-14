// src/components/ForumNavigator.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forumAPI } from "../services/forum";

const ForumNavigator = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newForum, setNewForum] = useState({
    name: "Test Forum",
    description: "A test forum for demonstration",
    is_locked: false,
  });
  const navigate = useNavigate();

  // Fetch all forums when component loads
  useEffect(() => {
    const fetchForums = async () => {
      try {
        setLoading(true);
        const forumsData = await forumAPI.getForums({});
        console.log("Available forums:", forumsData);

        if (Array.isArray(forumsData)) {
          setForums(forumsData);
        } else if (forumsData.results && Array.isArray(forumsData.results)) {
          setForums(forumsData.results);
        } else {
          setForums([]);
        }
      } catch (err) {
        console.error("Error fetching forums:", err);
        setError("Could not load forums. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, []);

  // Handle input changes for forum creation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewForum({
      ...newForum,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Create a new forum
  const handleCreateForum = async (e) => {
    e.preventDefault();

    try {
      console.log("Creating new forum with data:", newForum);
      const createdForum = await forumAPI.createForum(newForum);
      console.log("Created forum:", createdForum);

      // Add to list
      setForums([createdForum, ...forums]);

      // Show success message
      alert(`Successfully created forum with ID: ${createdForum.id}`);
    } catch (err) {
      console.error("Error creating forum:", err);
      alert(`Failed to create forum: ${err.message}`);
    }
  };

  // Navigate to a specific forum
  const goToForum = (forumId) => {
    navigate(`/forums/${forumId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum Navigator</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      )}

      {/* Create forum form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Forum</h2>
        <form onSubmit={handleCreateForum}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Forum Name</label>
            <input
              type="text"
              name="name"
              value={newForum.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={newForum.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_locked"
                checked={newForum.is_locked}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Lock Forum</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Forum
          </button>
        </form>
      </div>

      {/* Available forums */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Forums</h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        ) : forums.length === 0 ? (
          <p className="text-gray-500">
            No forums available. Create one using the form above.
          </p>
        ) : (
          <ul className="space-y-4">
            {forums.map((forum) => (
              <li
                key={forum.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium text-blue-600">
                      {forum.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{forum.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      ID: {forum.id} | Created:{" "}
                      {new Date(forum.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => goToForum(forum.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go to Forum
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Debugging info */}
      <div className="mt-8 bg-yellow-50 p-4 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Debugging Information</h3>
        <p className="mb-2">
          If you're trying to access forum ID 6 but getting errors, it's because
          that forum ID doesn't exist in your database.
        </p>
        <p>
          The forums that exist in your database are listed above. Use one of
          those IDs instead.
        </p>
      </div>
    </div>
  );
};

export default ForumNavigator;
