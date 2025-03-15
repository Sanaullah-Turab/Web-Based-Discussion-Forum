import { useState, useEffect } from 'react';
import ChatDiscussion from '../components/ChatDiscussion';
import Modal from '../components/Modal';
import axios from 'axios';
import { authHeaders } from '../services/discussionApi.js';

const BASE_URL = 'http://localhost:8000/';
const PAGE_SIZE = 1;
let TOTAL_PAGES = 1;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState({ name: 'all' });
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [forums, setForums] = useState({});
  const [categories, setCategories] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newForum, setNewForum] = useState({
    name: '',
    category: '',
    description: '',
    tags: [],
    is_locked: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // fetch forums and setForums state
  useEffect(() => {
    console.log("fetching forums");
    fetchForums(`${BASE_URL}api/forums/?page_size=${PAGE_SIZE}`);
    fetchCategories();
  }, []);

  const fetchForums = async (url) => {
    try {
      const response = await axios.get(url, {
        credentials: "include",
        headers: authHeaders(),
      });
      setForums(response.data);
      TOTAL_PAGES = Math.ceil(response.data.count / PAGE_SIZE);
      console.log("forms", response.data);
    }
    catch (error) {
      console.error("Error fetching forums:", error);
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/categories`, {
        credentials: "include",
        headers: authHeaders(),
      });
      console.log("categories", response.data);
      setCategories(response.data);

      // set default category for new forum
      setNewForum({ ...newForum, category: String(response.data[0].id) });
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const createForum = async (url) => {
    try {
      const response = await axios.post(url, newForum, {
        credentials: "include",
        headers: authHeaders(),
      });
      console.log("Forum created:", response.data);
      setIsCreateModalOpen(false);
      setNewForum({ title: '', category: '', description: '' });
      setSelectedForum(response.data);
    }
    catch (error) {
      console.error("Error creating forum:", error);
    }
  }


  function handleCreateForum(e) {
    e.preventDefault();
    console.log("Creating forum", newForum);
    createForum(`${BASE_URL}api/forums/`);
  }


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchForums(`${BASE_URL}api/forums/?page_size=${PAGE_SIZE}&page=${newPage}&category_id=${selectedCategory.id ? selectedCategory.id : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Discussion Forums
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Join the conversation on various topics</p>
          </div>
          <button
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Forum
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-4 sm:mb-6 space-y-3">
          {/* Search Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search forums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedCategory?.name === 'all'
                      ? 'bg-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  onClick={() => {
                    setSelectedCategory({ name: 'all' });
                    fetchForums(`${BASE_URL}api/forums/?page_size=${PAGE_SIZE}`);
                    setSelectedForum(null);
                    setCurrentPage(1);
                  }}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedCategory?.name === category.name
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      fetchForums(`${BASE_URL}api/forums/?page_size=${PAGE_SIZE}&category_id=${category.id}`);
                      setSelectedForum(null);
                      setCurrentPage(1);
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors cursor-pointer min-w-[120px]"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forums List or Selected Discussion */}
        {selectedForum ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedForum(null)}
              className="mb-2 sm:mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Forums
            </button>
            <ChatDiscussion forum={selectedForum} />
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {forums?.results?.map(forum => (
                <div
                  key={forum.id}
                  className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedForum(forum)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {forum.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {forum.category_detail?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created {new Date(forum.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{forum.description}</p>
                    </div>
                    <div className="flex sm:flex-col items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">{forum.messageCount}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700">{forum.replyCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {forums?.results?.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm sm:text-base text-gray-500">No forums found for the selected category.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all forums
                </button>
              </div>
            )}

            {/* Pagination */}
            {TOTAL_PAGES > 0 && (
              <div className="mt-6 flex justify-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === TOTAL_PAGES}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    currentPage === TOTAL_PAGES
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Create Forum Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Forum"
        >
          <form onSubmit={handleCreateForum} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Forum Title
              </label>
              <input
                type="text"
                id="title"
                value={newForum.name}
                onChange={(e) => setNewForum({ ...newForum, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={newForum.category}
                onChange={(e) => setNewForum({ ...newForum, category: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newForum.description}
                onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Forum
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
