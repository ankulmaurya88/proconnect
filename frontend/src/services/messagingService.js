import apiRequest from "./api";

// Send a message to a user
async function sendMessage(userId, content) {
  return await apiRequest(
    `/messaging/conversations/${userId}/messages/`,
    {
      method: "POST",
      body: JSON.stringify({
        content: content,
      }),
    }
  );
}

// Get all conversations
async function getConversations() {
  return await apiRequest("/messaging/conversations/", {
    method: "GET",
  });
}

// Get message history of a conversation
async function getConversationHistory(conversationId) {
  return await apiRequest(
    `/messaging/conversations/${conversationId}/history/`,
    {
      method: "GET",
    }
  );
}

// Update own message
async function updateMessage(messageId, content) {
  return await apiRequest(
    `/messaging/messages/${messageId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        content: content,
      }),
    }
  );
}

// Delete own message
async function deleteMessage(messageId) {
  return await apiRequest(
    `/messaging/messages/${messageId}/`,
    {
      method: "DELETE",
    }
  );
}

export {
  sendMessage,
  getConversations,
  getConversationHistory,
  updateMessage,
  deleteMessage,
};