// Base API URL
const API_BASE_URL = "http://localhost:8000";

// Get CSRF token from localStorage
const getCsrfToken = () => {
  return localStorage.getItem("csrfToken");
};

// Get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Headers for authenticated requests
const authHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCsrfToken(),
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * API Services for messages
 */
export const messageAPI = {
  // Get messages with optional filters (forum_id)
  getMessages: async (filters = {}) => {
    try {
      // Construct query string from filters
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams
        ? `${API_BASE_URL}/api/messages/?${queryParams}`
        : `${API_BASE_URL}/api/messages/`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Create a new message or reply
  createMessage: async (messageData) => {
    try {
      console.log("Making API request to create message:", messageData);

      const response = await fetch(`${API_BASE_URL}/api/messages/`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || JSON.stringify(data) || "Failed to create message"
        );
      }

      return data;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  },

  // Update a message
  updateMessage: async (messageId, messageData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/${messageId}/`,
        {
          method: "PATCH",
          credentials: "include",
          headers: authHeaders(),
          body: JSON.stringify(messageData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update message");
      }

      return data;
    } catch (error) {
      console.error(`Error updating message ${messageId}:`, error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/${messageId}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete message");
      }

      return true;
    } catch (error) {
      console.error(`Error deleting message ${messageId}:`, error);
      throw error;
    }
  },
};

/**
 * API Services for forums
 */
export const forumAPI = {
  // Get all forums with pagination and filters
  getForums: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      // Construct query string from filters
      const queryParams = new URLSearchParams({
        page,
        page_size: pageSize,
        ...filters,
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/api/forums/?${queryParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch forums");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching forums:", error);
      throw error;
    }
  },

  // Get a single forum by ID
  getForum: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forums/${forumId}/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch forum");
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching forum ${forumId}:`, error);
      throw error;
    }
  },

  // Create a new forum
  createForum: async (forumData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forums/`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify(forumData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create forum");
      }

      return data;
    } catch (error) {
      console.error("Error creating forum:", error);
      throw error;
    }
  },

  // Update a forum
  updateForum: async (forumId, forumData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forums/${forumId}/`, {
        method: "PATCH",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify(forumData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update forum");
      }

      return data;
    } catch (error) {
      console.error(`Error updating forum ${forumId}:`, error);
      throw error;
    }
  },

  // Delete a forum
  deleteForum: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forums/${forumId}/`, {
        method: "DELETE",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete forum");
      }

      return true;
    } catch (error) {
      console.error(`Error deleting forum ${forumId}:`, error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get all tags
  getTags: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },
};
