function MessageList({
  messages,
  currentUserId,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (messages.length === 0) {
    return <p>No messages yet.</p>;
  }

  return (
    <div className="message-list">
      {messages.map(function (message) {
        const isOwnMessage =
          message.sender === currentUserId;

        return (
          <div
            className={
              isOwnMessage
                ? "message-card own-message"
                : "message-card"
            }
            key={message.id}
          >
            <p className="message-sender">
              User #{message.sender}
            </p>

            <p className="message-content">
              {message.content}
            </p>

            <small>
              {message.created_at}
            </small>

            {isOwnMessage && (
              <div className="message-actions">
                <button
                  type="button"
                  onClick={() => onEdit(message)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(message.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;