import { useState } from "react";

import {
  sendConnectionRequest,
} from "../../services/networkingService";

function ConnectionForm({ onRequestSent }) {
  const [receiverId, setReceiverId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!receiverId) {
      setError("User ID is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await sendConnectionRequest(
        receiverId
      );

      console.log(
        "Connection request sent:",
        data
      );

      setMessage("Connection request sent.");
      setReceiverId("");

      if (onRequestSent) {
        onRequestSent(data);
      }
    } catch (error) {
      console.error(
        "Error sending connection request:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="networking-section">
      <h2>Send Connection Request</h2>

      <form
        className="networking-form"
        onSubmit={handleSubmit}
      >
        <input
          type="number"
          placeholder="Enter user ID"
          value={receiverId}
          onChange={function (event) {
            setReceiverId(event.target.value);
          }}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Request"}
        </button>
      </form>

      {message && (
        <p className="networking-message">
          {message}
        </p>
      )}

      {error && (
        <p className="networking-error">
          {error}
        </p>
      )}
    </section>
  );
}

export default ConnectionForm;