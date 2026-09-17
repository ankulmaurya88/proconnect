import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const user = await login(username, password);

      console.log("Logged in user:", user);

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  }

  return (
    <div className="login-page">
      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <h1>Login</h1>

        <div className="login-field">
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <button
          className="login-button"
          type="submit"
        >
          Login
        </button>
      </form>

      <p className="register-link">
        Don't have an account?{" "}
        <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;