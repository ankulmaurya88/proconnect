function ConversationList({
  conversations,
  selectedConversation,
  onSelect,
  loading,
}) {
  if (loading) {
    return <p>Loading conversations...</p>;
  }

  if (conversations.length === 0) {
    return <p>No conversations yet.</p>;
  }

  return (
    <section className="messaging-section">
      <h2>Conversations</h2>

      <div className="conversation-list">
        {conversations.map(function (conversation) {
          const isSelected =
            selectedConversation?.id === conversation.id;

          return (
            <button
              className={
                isSelected
                  ? "conversation-card selected"
                  : "conversation-card"
              }
              key={conversation.id}
              type="button"
              onClick={() => onSelect(conversation)}
            >
              <strong>
                User #{conversation.user2}
              </strong>

              <p>{conversation.last_message}</p>

              <small>
                Conversation #{conversation.id}
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ConversationList;