import { useState, useEffect } from "react";
import { forumAPI, categoryAPI } from "../services/forum";
import ForumCard from "./ForumCard";
import { Link } from "react-router-dom";

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    name: "",
    description: "",
    category: null,
    tags: [],
    is_locked: false,
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  // Fetch forums and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories first
        try {
          const categoriesData = await categoryAPI.getCategories();
          setCategories(categoriesData);
        } catch (categoryErr) {
          console.error("Error fetching categories:", categoryErr);
          // Set some default categories for testing
          setCategories([
            { id: 1, name: "Programming" },
            { id: 2, name: "Web Development" },
            { id: 3, name: "Mobile Development" },
          ]);
        }

        // Prepare filters for forums
        const filters = {
          page,
          page_size: 10,
        };

        if (selectedCategory) {
          filters.category_id = selectedCategory;
        }

        // Fetch forums
        const forumsData = await forumAPI.getForums(filters);
        console.log("Forums data:", forumsData);

        // Handle both paginated and non-paginated responses
        if (forumsData.results && Array.isArray(forumsData.results)) {
          setForums(forumsData.results);

          // Calculate total pages if count is available
          if (forumsData.count) {
            setTotalPages(Math.ceil(forumsData.count / 10));
          }
        } else if (Array.isArray(forumsData)) {
          setForums(forumsData);

          // Estimate total pages based on array length
          setTotalPages(Math.ceil(forumsData.length / 10));
        } else {
          // If the response format is unexpected, set empty array
          setForums([]);
          setTotalPages(1);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load forums. Please try again later.");

        // Set dummy data for testing
        setForums([
          {
            id: 1,
            name: "JavaScript Discussions",
            description: "Talk about all things JavaScript",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_locked: false,
            created_by: { id: 1, name: "Admin" },
            category_detail: { id: 1, name: "Programming" },
            messages_count: 5,
            replies_count: 12,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedCategory]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      // Handle category as a number
      setNewForum({
        ...newForum,
        [name]: value ? parseInt(value) : null,
      });
    } else {
      setNewForum({
        ...newForum,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle forum creation
  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating new forum with data:", newForum);

      const createdForum = await forumAPI.createForum(newForum);
      console.log("Created forum:", createdForum);

      // Add the new forum to the list
      setForums([createdForum, ...forums]);

      // Reset the form
      setNewForum({
        name: "",
        description: "",
        category: null,
        tags: [],
        is_locked: false,
      });

      setShowCreateForm(false);

      // Show success message
      alert("Forum created successfully!");
    } catch (err) {
      console.error("Error creating forum:", err);
      alert("Failed to create forum. Please try again.");
    }
  };

  // Handle forum deletion
  const handleDeleteForum = async (forumId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this forum? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await forumAPI.deleteForum(forumId);
      setForums(forums.filter((forum) => forum.id !== forumId));
    } catch (err) {
      console.error("Error deleting forum:", err);
      alert("Failed to delete forum. Please try again.");
    }
  };

  if (loading && forums.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading forums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Discussion Forums</h1>
        {currentUser && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create New Forum"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {showCreateForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Create New Forum</h2>
          <form onSubmit={handleCreateForum}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Forum Name</label>
              <input
                type="text"
                name="name"
                value={newForum.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={newForum.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={newForum.category || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_locked"
                  checked={newForum.is_locked}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Lock Forum</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create Forum
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category filter */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Filter by Category</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => {
            setSelectedCategory(e.target.value ? Number(e.target.value) : null);
            setPage(1);
          }}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Forums list */}
      {forums.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {forums.map((forum) => (
            <ForumCard
              key={forum.id}
              forum={forum}
              onDelete={
                currentUser &&
                (currentUser.id === forum.created_by?.id ||
                  currentUser.role === "admin" ||
                  currentUser.role === "moderator")
                  ? () => handleDeleteForum(forum.id)
                  : null
              }
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No forums found.</p>
          {!showCreateForm && currentUser && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Your First Forum
            </button>
          )}
          {!currentUser && (
            <p className="text-sm text-gray-500">
              Please{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                login
              </Link>{" "}
              to create a forum.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            <div className="px-3 py-1 text-sm">
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ForumList;
