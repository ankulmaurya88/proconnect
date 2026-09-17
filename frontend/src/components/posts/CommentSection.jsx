import { useEffect, useState } from "react";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../services/postService";

import "../../styles/CommentSection.css";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadComments() {
    try {
      setLoading(true);
      setError("");

      const data = await getComments(postId);

      console.log("Comments received:", data);

      setComments(data.results || data);
    } catch (error) {
      console.error(
        "Error loading comments:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    function () {
      loadComments();
    },
    [postId]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Comment content is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const newComment = await createComment(
        postId,
        content
      );

      console.log("Comment created:", newComment);

      setComments(function (currentComments) {
        return [...currentComments, newComment];
      });

      setContent("");
    } catch (error) {
      console.error(
        "Error creating comment:",
        error.message
      );

      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(commentId) {
    if (!editingContent.trim()) {
      setError("Comment content is required.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedComment = await updateComment(
        commentId,
        editingContent
      );

      console.log(
        "Comment updated:",
        updatedComment
      );

      setComments(function (currentComments) {
        return currentComments.map(function (comment) {
          if (comment.id === commentId) {
            return updatedComment;
          }

          return comment;
        });
      });

      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error(
        "Error updating comment:",
        error.message
      );

      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(commentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteComment(commentId);

      console.log(
        "Comment deleted:",
        commentId
      );

      setComments(function (currentComments) {
        return currentComments.filter(
          function (comment) {
            return comment.id !== commentId;
          }
        );
      });
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error.message
      );

      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="comment-section">
        <p className="comment-message">
          Loading comments...
        </p>
      </div>
    );
  }

  return (
    <div
      className="comment-section"
      id={`comments-${postId}`}
    >
      <h4 className="comment-title">
        Comments
      </h4>

      {error && (
        <p className="comment-error">
          {error}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="comment-message">
          No comments yet.
        </p>
      ) : (
        <div className="comments-list">
          {comments.map(function (comment) {
            const isEditing =
              editingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className="comment-item"
                id={`comment-${comment.id}`}
              >
                <p className="comment-user">
                  User #{comment.user}
                </p>

                {isEditing ? (
                  <div className="comment-edit">
                    <textarea
                      id={`edit-comment-${comment.id}`}
                      className="comment-edit-input"
                      value={editingContent}
                      onChange={function (event) {
                        setEditingContent(
                          event.target.value
                        );
                      }}
                      disabled={actionLoading}
                    />

                    <div className="comment-actions">
                      <button
                        className="comment-button"
                        type="button"
                        onClick={function () {
                          handleUpdate(comment.id);
                        }}
                        disabled={actionLoading}
                      >
                        {actionLoading
                          ? "Saving..."
                          : "Save"}
                      </button>

                      <button
                        className="comment-button"
                        type="button"
                        onClick={function () {
                          setEditingCommentId(null);
                          setEditingContent("");
                          setError("");
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-content">
                      {comment.content}
                    </p>

                    <div className="comment-actions">
                      <button
                        className="comment-button"
                        type="button"
                        onClick={function () {
                          setEditingCommentId(
                            comment.id
                          );

                          setEditingContent(
                            comment.content
                          );

                          setError("");
                        }}
                        disabled={actionLoading}
                      >
                        Edit
                      </button>

                      <button
                        className="comment-button"
                        type="button"
                        onClick={function () {
                          handleDelete(comment.id);
                        }}
                        disabled={actionLoading}
                      >
                        {actionLoading
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <form
        className="comment-form"
        onSubmit={handleSubmit}
      >
        <textarea
          id={`new-comment-${postId}`}
          className="comment-input"
          value={content}
          placeholder="Write a comment..."
          onChange={function (event) {
            setContent(event.target.value);
          }}
          disabled={submitting}
        />

        <button
          className="comment-submit-button"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Commenting..."
            : "Comment"}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;