import apiRequest from "./api";

// =========================
// Posts
// =========================

async function getPosts(params = "") {
  return await apiRequest(`/posts/${params}`, {
    method: "GET",
  });
}

async function getPost(postId) {
  return await apiRequest(`/posts/${postId}/`, {
    method: "GET",
  });
}

async function createPost(content) {
  return await apiRequest("/posts/", {
    method: "POST",
    body: JSON.stringify({
      content: content,
    }),
  });
}

async function updatePost(postId, content) {
  return await apiRequest(`/posts/${postId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      content: content,
    }),
  });
}

async function deletePost(postId) {
  return await apiRequest(`/posts/${postId}/`, {
    method: "DELETE",
  });
}


// =========================
// Like / Unlike
// =========================

async function toggleLike(postId) {
  return await apiRequest(`/posts/${postId}/like/`, {
    method: "POST",
  });
}


// =========================
// Comments
// =========================

async function getComments(postId) {
  return await apiRequest(`/posts/${postId}/comments/`, {
    method: "GET",
  });
}

async function createComment(postId, content) {
  return await apiRequest(`/posts/${postId}/comments/`, {
    method: "POST",
    body: JSON.stringify({
    post: postId,
    content: content,
    }),
  });
}

async function updateComment(commentId, content) {
  return await apiRequest(`/posts/comments/${commentId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      content: content,
    }),
  });
}

async function deleteComment(commentId) {
  return await apiRequest(`/posts/comments/${commentId}/`, {
    method: "DELETE",
  });
}


// =========================
// Feed
// =========================

async function getFeed(params = "") {
  return await apiRequest(`/posts/feed/${params}`, {
    method: "GET",
  });
}


export {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getFeed,
};