import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiRequest from "../services/api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/register/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      console.log("Registration successful:", data);

      // Registration succeeded.
      // Backend does not return JWT tokens,
      // so go to login page.
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        <h1>Create Account</h1>

        <div className="register-field">
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="first_name">
            First Name
          </label>

          <input
            id="first_name"
            type="text"
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="register-field">
          <label htmlFor="last_name">
            Last Name
          </label>

          <input
            id="last_name"
            type="text"
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button
          className="register-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;