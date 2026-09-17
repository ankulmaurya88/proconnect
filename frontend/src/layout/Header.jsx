import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">

        <div className="header-logo">
          <Link to="/home">
            ProConnect
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/home">Home</Link>

          <Link to="/profile">Profile</Link>

          <Link to="/networking">
            Networking
          </Link>

          <Link to="/messaging">
            Messaging
          </Link>

          <button
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </nav>

      </div>
    </header>
  );
}

export default Header;