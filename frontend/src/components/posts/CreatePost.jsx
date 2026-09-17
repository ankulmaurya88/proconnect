import { useState } from "react";

import { createPost } from "../../services/postService";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Post content is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newPost = await createPost(content);

      console.log("Post created:", newPost);

      setContent("");

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error("Error creating post:", error.message);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Create Post</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          placeholder="Write something..."
          onChange={(event) => setContent(event.target.value)}
          disabled={loading}
        />

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default CreatePost;