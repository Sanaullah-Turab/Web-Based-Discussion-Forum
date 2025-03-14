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

export const forumAPI = {
  // Get all forums with optional filters
  getForums: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add filters based on API documentation
      if (filters.category_id)
        queryParams.append("category_id", filters.category_id);
      if (filters.user_id) queryParams.append("user_id", filters.user_id);
      if (filters.tags_id) {
        // Handle multiple tags
        if (Array.isArray(filters.tags_id)) {
          filters.tags_id.forEach((tag) => queryParams.append("tags_id", tag));
        } else {
          queryParams.append("tags_id", filters.tags_id);
        }
      }
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.page_size) queryParams.append("page_size", filters.page_size);

      console.log("Querying forums with params:", queryParams.toString());

      const response = await fetch(
        `${API_BASE_URL}/api/forums/?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      const data = await response.json();
      console.log("Forums API response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch forums");
      }

      return data;
    } catch (error) {
      console.error("Error fetching forums:", error);
      throw error;
    }
  },

  // Get a specific forum by ID
  getForum: async (forumId) => {
    try {
      // Ensure forumId is a number
      const id = Number(forumId);
      console.log(`Fetching forum with ID: ${id}`);

      const response = await fetch(`${API_BASE_URL}/api/forums/${id}/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      console.log("Forum fetch response status:", response.status);

      const data = await response.json();
      console.log(`Forum ${id} data:`, data);

      if (!response.ok) {
        throw new Error(data.detail || "No Forum matches the given query.");
      }

      return data;
    } catch (error) {
      console.error(`Error fetching forum ${forumId}:`, error);
      throw error;
    }
  },

  // Create a new forum
  createForum: async (forumData) => {
    try {
      // Format the data according to API docs
      const apiData = {
        name: forumData.name,
        description: forumData.description,
        category: forumData.category || null,
        tags: forumData.tags || [],
        is_locked: forumData.is_locked || false,
      };

      console.log("Creating forum with data:", apiData);

      const response = await fetch(`${API_BASE_URL}/api/forums/`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      console.log("Forum creation response:", data);

      if (!response.ok) {
        throw new Error(JSON.stringify(data) || "Failed to create forum");
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
};

// Forum membership API
export const forumMembershipAPI = {
  // Get memberships with filters
  getMemberships: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.user_id) queryParams.append("user_id", filters.user_id);
      if (filters.forum_id) queryParams.append("forum_id", filters.forum_id);

      const response = await fetch(
        `${API_BASE_URL}/api/forum-memberships/?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      const data = await response.json();
      console.log("Forum memberships data:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch memberships");
      }

      return data;
    } catch (error) {
      console.error("Error fetching memberships:", error);
      throw error;
    }
  },

  // Join a forum
  joinForum: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forum-memberships/`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({
          forum: Number(forumId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data) || "Failed to join forum");
      }

      return data;
    } catch (error) {
      console.error(`Error joining forum ${forumId}:`, error);
      throw error;
    }
  },

  // Leave a forum
  leaveForum: async (membershipId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forum-memberships/${membershipId}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to leave forum");
      }

      return true;
    } catch (error) {
      console.error(`Error leaving forum membership ${membershipId}:`, error);
      throw error;
    }
  },
};

// Message API for creating and fetching forum messages
export const messageAPI = {
  // Get messages for a forum
  getMessages: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // IMPORTANT: According to the API docs, it should be forum, not forum_id
      if (filters.forum_id) queryParams.append("forum", filters.forum_id);
      if (filters.user_id) queryParams.append("user", filters.user_id);
      if (filters.page) queryParams.append("page", filters.page);
      if (filters.page_size) queryParams.append("page_size", filters.page_size);

      console.log(`Fetching messages with params: ${queryParams.toString()}`);

      const response = await fetch(
        `${API_BASE_URL}/api/messages/?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      console.log("Messages response status:", response.status);
      const data = await response.json();

      // Add this detailed logging to check message structure
      console.log("Messages API response:", data);
      if (Array.isArray(data) && data.length > 0) {
        console.log("Sample message structure:", data[0]);
        console.log("User details present?", Boolean(data[0].user_detail));
        if (data[0].user_detail) {
          console.log("User details example:", data[0].user_detail);
        }
      }

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch messages");
      }

      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Create a new message or reply
  createMessage: async (messageData) => {
    try {
      console.log("Creating message with data:", messageData);

      // According to API docs, the format should be:
      const apiData = {
        content: messageData.content,
        forum: Number(messageData.forum),
        parent: messageData.parent ? Number(messageData.parent) : null,
      };

      console.log("Formatted message data for API:", apiData);

      const response = await fetch(`${API_BASE_URL}/api/messages/`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify(apiData),
      });

      console.log("Message creation response status:", response.status);

      const data = await response.json();
      console.log("Message creation response:", data);

      // Add detailed logging of user information
      if (data) {
        console.log("Created message user ID:", data.user);
        console.log("User details included?", Boolean(data.user_detail));
        if (data.user_detail) {
          console.log("User details:", data.user_detail);
        }
      }

      if (!response.ok) {
        console.error("Message creation failed with response:", data);
        throw new Error(JSON.stringify(data) || "Failed to create message");
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
      const apiData = {
        content: messageData.content,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/messages/${messageId}/`,
        {
          method: "PATCH",
          credentials: "include",
          headers: authHeaders(),
          body: JSON.stringify(apiData),
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

  // Get user details for message authors
  getUserDetails: async (userId) => {
    try {
      if (!userId) {
        console.error("Cannot fetch user details: No user ID provided");
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      if (!response.ok) {
        console.error(
          `Error fetching user ${userId} details:`,
          response.status
        );
        return null;
      }

      const data = await response.json();
      return {
        id: userId,
        name: data.username || data.name || `User ${userId}`,
        avatar:
          data.avatar || `https://ui-avatars.com/api/?name=User+${userId}`,
        role: data.role || "user",
      };
    } catch (error) {
      console.error(`Error fetching user ${userId} details:`, error);
      return null;
    }
  },
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await response.json();
      console.log("Categories API response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch categories");
      }

      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

// Tag API
export const tagAPI = {
  // Get all tags
  getTags: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags/`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch tags");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },
};

// Mentions API
export const mentionAPI = {
  // Get mentions for current user
  getUserMentions: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.message_id) queryParams.append("message", filters.message_id);

      const response = await fetch(
        `${API_BASE_URL}/api/message-mentions/?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch mentions");
      }

      return data;
    } catch (error) {
      console.error("Error fetching mentions:", error);
      throw error;
    }
  },
};

// Export everything as a default object for convenience
export default {
  forumAPI,
  forumMembershipAPI,
  categoryAPI,
  tagAPI,
  messageAPI,
  mentionAPI,
};
