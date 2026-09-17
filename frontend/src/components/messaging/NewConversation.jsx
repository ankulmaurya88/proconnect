import { useState } from "react";

function NewConversation({ onStart, loading }) {
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!receiverId) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    try {
      await onStart(receiverId, content);

      setReceiverId("");
      setContent("");
    } catch (error) {
      console.error(
        "Error starting conversation:",
        error.message
      );
    }
  }

  return (
    <section className="messaging-section">
      <h2>Start New Conversation</h2>

      <form
        className="new-conversation-form"
        onSubmit={handleSubmit}
      >
        <input
          type="number"
          placeholder="Receiver user ID"
          value={receiverId}
          onChange={(event) =>
            setReceiverId(event.target.value)
          }
          disabled={loading}
        />

        <textarea
          placeholder="Write your first message..."
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          disabled={loading}
        />

        <button
          type="submit"
          disabled={
            loading ||
            !receiverId ||
            !content.trim()
          }
        >
          {loading
            ? "Sending..."
            : "Start Conversation"}
        </button>
      </form>
    </section>
  );
}

export default NewConversation;