import apiRequest from "./api";

// Send connection request
async function sendConnectionRequest(receiverId) {
  return await apiRequest("/networking/connections/", {
    method: "POST",
    body: JSON.stringify({
      receiver: receiverId,
    }),
  });
}

// Get accepted connections
async function getConnections() {
  return await apiRequest("/networking/connections/", {
    method: "GET",
  });
}

// Get received pending requests
async function getReceivedRequests() {
  return await apiRequest(
    "/networking/connections/received/",
    {
      method: "GET",
    }
  );
}

// Get sent pending requests
async function getSentRequests() {
  return await apiRequest(
    "/networking/connections/sent/",
    {
      method: "GET",
    }
  );
}

// Accept / Reject request
async function updateConnection(connectionId, status) {
  return await apiRequest(
    `/networking/connections/${connectionId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: status,
      }),
    }
  );
}

// Remove accepted connection
async function removeConnection(connectionId) {
  return await apiRequest(
    `/networking/connections/${connectionId}/`,
    {
      method: "DELETE",
    }
  );
}

export {
  sendConnectionRequest,
  getConnections,
  getReceivedRequests,
  getSentRequests,
  updateConnection,
  removeConnection,
};