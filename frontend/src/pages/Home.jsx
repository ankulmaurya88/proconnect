import { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import CreatePost from "../components/posts/CreatePost";
import Feed from "../components/posts/Feed";

import "../styles/Home.css";

function Home() {
  const { currentUser } = useContext(AuthContext);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handlePostCreated() {
    setRefreshTrigger(function (value) {
      return value + 1;
    });
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <main className="home-feed">

          <h2>
            Welcome, {currentUser?.first_name}
          </h2>

          <CreatePost
            onPostCreated={handlePostCreated}
          />

          <Feed refreshTrigger={refreshTrigger}/>

        </main>
      </div>
    </div>
  );
}

export default Home;