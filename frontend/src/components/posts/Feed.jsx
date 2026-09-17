








import { useEffect, useState } from "react";

import { getFeed } from "../../services/postService";
import PostCard from "./PostCard";
import "../../styles/Feed.css";

function Feed({ refreshTrigger }) {
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [author, setAuthor] = useState("");

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeed(
    searchValue = search,
    orderingValue = ordering,
    authorValue = author,
    pageValue = page
  ) {
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

      if (authorValue.trim()) {
        params.append("author", authorValue);
      }

      params.append("page", pageValue);

      const queryString = params.toString();

      const data = await getFeed(`?${queryString}`);

      console.log("Feed received:", data);

      setPosts(data.results || data);

      setHasNextPage(Boolean(data.next));
      setHasPreviousPage(Boolean(data.previous));
    } catch (error) {
      console.error(
        "Error loading feed:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    function () {
      loadFeed();
    },
    [refreshTrigger]
  );

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);

    loadFeed(
      search,
      ordering,
      author,
      1
    );
  }

  function handleOrderingChange(event) {
    const value = event.target.value;

    setOrdering(value);
    setPage(1);

    loadFeed(
      search,
      value,
      author,
      1
    );
  }

  function handleAuthorChange(event) {
    setAuthor(event.target.value);
  }

  function handleAuthorFilter(event) {
    event.preventDefault();

    setPage(1);

    loadFeed(
      search,
      ordering,
      author,
      1
    );
  }

  function handleNextPage() {
    if (!hasNextPage) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);

    loadFeed(
      search,
      ordering,
      author,
      nextPage
    );
  }

  function handlePreviousPage() {
    if (!hasPreviousPage) {
      return;
    }

    const previousPage = page - 1;

    setPage(previousPage);

    loadFeed(
      search,
      ordering,
      author,
      previousPage
    );
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
    return (
      <div className="feed">
        <p className="feed-message">
          Loading feed...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed">
        <p className="feed-error">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="feed">

      {/* Search / Filters */}
      <div className="feed-controls">

        {/* Search */}
        <form
          className="feed-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="feed-input"
            placeholder="Search posts..."
            value={search}
            onChange={function (event) {
              setSearch(event.target.value);
            }}
          />

          <button
            className="feed-button"
            type="submit"
          >
            Search
          </button>
        </form>

        {/* Ordering */}
        <div className="feed-ordering">
          <label htmlFor="ordering">
            Order:
          </label>

          <select
            id="ordering"
            className="feed-select"
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
        </div>

        {/* Author Filter */}
        <form
          className="feed-author"
          onSubmit={handleAuthorFilter}
        >
          <input
            type="number"
            className="feed-input"
            placeholder="Author ID"
            value={author}
            onChange={handleAuthorChange}
          />

          <button
            className="feed-button"
            type="submit"
          >
            Filter
          </button>
        </form>

      </div>

      {/* Posts */}
      <div className="feed-posts">
        {posts.length === 0 ? (
          <p className="feed-message">
            No posts found.
          </p>
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

      {/* Pagination */}
      <div className="feed-pagination">

        <button
          className="feed-button"
          type="button"
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage || loading}
        >
          Previous
        </button>

        <span className="feed-page-number">
          Page {page}
        </span>

        <button
          className="feed-button"
          type="button"
          onClick={handleNextPage}
          disabled={!hasNextPage || loading}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Feed;














// import { useEffect, useState } from "react";

// import { getFeed } from "../../services/postService";
// import PostCard from "./PostCard";
// import "../../styles/Feed.css";
// function Feed({ refreshTrigger }) {
//   const [posts, setPosts] = useState([]);

//   const [search, setSearch] = useState("");
//   const [ordering, setOrdering] = useState("-created_at");
//   const [author, setAuthor] = useState("");

//   const [page, setPage] = useState(1);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [hasPreviousPage, setHasPreviousPage] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   async function loadFeed(
//     searchValue = search,
//     orderingValue = ordering,
//     authorValue = author,
//     pageValue = page
//   ) {
//     try {
//       setLoading(true);
//       setError("");

//       const params = new URLSearchParams();

//       if (searchValue.trim()) {
//         params.append("search", searchValue);
//       }

//       if (orderingValue) {
//         params.append("ordering", orderingValue);
//       }

//       if (authorValue.trim()) {
//         params.append("author", authorValue);
//       }

//       params.append("page", pageValue);

//       const queryString = params.toString();

//       const data = await getFeed(`?${queryString}`);

//       console.log("Feed received:", data);

//       setPosts(data.results || data);

//       setHasNextPage(Boolean(data.next));
//       setHasPreviousPage(Boolean(data.previous));
//     } catch (error) {
//       console.error(
//         "Error loading feed:",
//         error.message
//       );

//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(
//     function () {
//       loadFeed();
//     },
//     [refreshTrigger]
//   );

//   function handleSearch(event) {
//     event.preventDefault();

//     setPage(1);

//     loadFeed(
//       search,
//       ordering,
//       author,
//       1
//     );
//   }

//   function handleOrderingChange(event) {
//     const value = event.target.value;

//     setOrdering(value);
//     setPage(1);

//     loadFeed(
//       search,
//       value,
//       author,
//       1
//     );
//   }

//   function handleAuthorChange(event) {
//     setAuthor(event.target.value);
//   }

//   function handleAuthorFilter(event) {
//     event.preventDefault();

//     setPage(1);

//     loadFeed(
//       search,
//       ordering,
//       author,
//       1
//     );
//   }

//   function handleNextPage() {
//     if (!hasNextPage) {
//       return;
//     }

//     const nextPage = page + 1;

//     setPage(nextPage);

//     loadFeed(
//       search,
//       ordering,
//       author,
//       nextPage
//     );
//   }

//   function handlePreviousPage() {
//     if (!hasPreviousPage) {
//       return;
//     }

//     const previousPage = page - 1;

//     setPage(previousPage);

//     loadFeed(
//       search,
//       ordering,
//       author,
//       previousPage
//     );
//   }

//   function handlePostUpdated(updatedPost) {
//     setPosts(function (currentPosts) {
//       return currentPosts.map(function (post) {
//         if (post.id === updatedPost.id) {
//           return updatedPost;
//         }

//         return post;
//       });
//     });
//   }

//   function handlePostDeleted(postId) {
//     setPosts(function (currentPosts) {
//       return currentPosts.filter(function (post) {
//         return post.id !== postId;
//       });
//     });
//   }

//   if (loading) {
//     return <p>Loading feed...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       {/* Search */}
//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search posts..."
//           value={search}
//           onChange={function (event) {
//             setSearch(event.target.value);
//           }}
//         />

//         <button type="submit">
//           Search
//         </button>
//       </form>

//       {/* Ordering */}
//       <select
//         value={ordering}
//         onChange={handleOrderingChange}
//       >
//         <option value="-created_at">
//           Newest first
//         </option>

//         <option value="created_at">
//           Oldest first
//         </option>
//       </select>

//       {/* Author Filter */}
//       <form onSubmit={handleAuthorFilter}>
//         <input
//           type="number"
//           placeholder="Author ID"
//           value={author}
//           onChange={handleAuthorChange}
//         />

//         <button type="submit">
//           Filter
//         </button>
//       </form>

//       {/* Posts */}
//       {posts.length === 0 ? (
//         <p>No posts found.</p>
//       ) : (
//         posts.map(function (post) {
//           return (
//             <PostCard
//               key={post.id}
//               post={post}
//               onPostUpdated={handlePostUpdated}
//               onPostDeleted={handlePostDeleted}
//             />
//           );
//         })
//       )}

//       {/* Pagination */}
//       <div>
//         <button
//           type="button"
//           onClick={handlePreviousPage}
//           disabled={!hasPreviousPage || loading}
//         >
//           Previous
//         </button>

//         <span>
//           {" "} Page {page} {" "}
//         </span>

//         <button
//           type="button"
//           onClick={handleNextPage}
//           disabled={!hasNextPage || loading}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Feed;