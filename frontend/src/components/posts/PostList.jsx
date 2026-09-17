
// test for do now youusing feed 

import { useEffect, useState } from "react";

import { getPosts } from "../../services/postService";
import PostCard from "./PostCard";

function PostList({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts(searchValue = search, orderingValue = ordering) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchValue.trim()) {
        params.append("search", searchValue);
      }

      if (orderingValue) {
        params.append("ordering", orderingValue);
      }

      const queryString = params.toString();

      const data = await getPosts(
        queryString ? `?${queryString}` : ""
      );

      console.log("Posts received:", data);

      setPosts(data.results || data);
    } catch (error) {
      console.error(
        "Error loading posts:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    function () {
      loadPosts();
    },
    [refreshTrigger]
  );

  function handleSearch(event) {
    event.preventDefault();

    loadPosts(search, ordering);
  }

  function handleOrderingChange(event) {
    const value = event.target.value;

    setOrdering(value);

    loadPosts(search, value);
  }

  function handlePostUpdated(updatedPost) {
    setPosts(function (currentPosts) {
      return currentPosts.map(function (post) {
        if (post.id === updatedPost.id) {
          return updatedPost;
        }

        return post;
      });
    });
  }

  function handlePostDeleted(postId) {
    setPosts(function (currentPosts) {
      return currentPosts.filter(function (post) {
        return post.id !== postId;
      });
    });
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={function (event) {
            setSearch(event.target.value);
          }}
        />

        <button type="submit">
          Search
        </button>
      </form>

      <select
        value={ordering}
        onChange={handleOrderingChange}
      >
        <option value="-created_at">
          Newest first
        </option>

        <option value="created_at">
          Oldest first
        </option>
      </select>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(function (post) {
          return (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          );
        })
      )}
    </div>
  );
}

export default PostList;