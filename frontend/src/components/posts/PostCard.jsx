import { useState } from "react";

import CommentSection from "./CommentSection";

import {
  updatePost,
  deletePost,
  toggleLike,
} from "../../services/postService";

import "../../styles/PostCard.css";

function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  const [liked, setLiked] = useState(post.liked_by_me);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(event) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Post content is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updatedPost = await updatePost(
        post.id,
        content
      );

      console.log("Post updated:", updatedPost);

      setIsEditing(false);

      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error(
        "Error updating post:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deletePost(post.id);

      console.log("Post deleted:", post.id);

      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    try {
      setLikeLoading(true);
      setError("");

      const data = await toggleLike(post.id);

      console.log("Like response:", data);

      setLiked(data.liked);

      setLikesCount(function (currentCount) {
        if (data.liked) {
          return currentCount + 1;
        }

        return Math.max(0, currentCount - 1);
      });
    } catch (error) {
      console.error(
        "Error liking post:",
        error.message
      );

      setError(error.message);
    } finally {
      setLikeLoading(false);
    }
  }

  function handleCancel() {
    setContent(post.content);
    setIsEditing(false);
    setError("");
  }

  return (
    <article
      className="post-card"
      id={`post-${post.id}`}
    >
      <h3 className="post-author">
        User #{post.author}
      </h3>

      {isEditing ? (
        <form
          className="post-edit-form"
          onSubmit={handleUpdate}
        >
          <textarea
            className="post-edit-input"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            disabled={loading}
          />

          <div className="post-edit-actions">
            <button
              className="post-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              className="post-button"
              type="button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="post-content">
            {post.content}
          </p>

          <p className="post-stats">
            {likesCount} likes ·{" "}
            {post.comments_count} comments
          </p>

          <div className="post-actions">
            <button
              className="post-button"
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
            >
              {likeLoading
                ? "..."
                : liked
                ? "Unlike"
                : "Like"}
            </button>

            <button
              className="post-button"
              type="button"
            >
              Comment
            </button>

            <button
              className="post-button"
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              Edit
            </button>

            <button
              className="post-button"
              type="button"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>

          <CommentSection postId={post.id} />
        </>
      )}

      {error && (
        <p className="post-error">
          {error}
        </p>
      )}
    </article>
  );
}

export default PostCard;