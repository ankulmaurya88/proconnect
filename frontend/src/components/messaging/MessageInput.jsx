import { useState } from "react";

function MessageInput({ onSend, loading }) {
  const [content, setContent] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      await onSend(content);

      setContent("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.message
      );
    }
  }

  return (
    <form
      className="message-input-form"
      onSubmit={handleSubmit}
    >
      <textarea
        className="message-input"
        placeholder="Write a message..."
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        disabled={loading}
      />

      <button
        className="message-send-button"
        type="submit"
        disabled={loading || !content.trim()}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;