import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import {
  getConversations,
  getConversationHistory,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../services/messagingService";

import ConversationList from "../components/messaging/ConversationList";
import MessageList from "../components/messaging/MessageList";
import MessageInput from "../components/messaging/MessageInput";
import NewConversation from "../components/messaging/NewConversation";

import "../styles/Messaging.css";

function Messaging() {
  const { currentUser } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] = useState(false);

  const [startingConversation, setStartingConversation] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(function () {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoadingConversations(true);
      setError("");

      const data = await getConversations();

      console.log("Conversations:", data);

      setConversations(data.results || data);
    } catch (error) {
      console.error(
        "Error loading conversations:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function handleStartConversation(
    receiverId,
    content
  ) {
    try {
      setStartingConversation(true);
      setError("");

      const newMessage = await sendMessage(
        receiverId,
        content
      );

      console.log(
        "Conversation started:",
        newMessage
      );

      await loadConversations();
    } catch (error) {
      console.error(
        "Error starting conversation:",
        error.message
      );

      setError(error.message);

      throw error;
    } finally {
      setStartingConversation(false);
    }
  }

  async function handleSelectConversation(conversation) {
    try {
      setSelectedConversation(conversation);
      setLoadingMessages(true);
      setError("");

      const data = await getConversationHistory(
        conversation.id
      );

      console.log("Message history:", data);

      setMessages(data.results || data);
    } catch (error) {
      console.error(
        "Error loading message history:",
        error.message
      );

      setError(error.message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(content) {
    if (!selectedConversation) {
      return;
    }

    try {
      setSending(true);
      setError("");

      /*
       * Conversation contains user1 and user2.
       * Find the other user.
       */
      const receiverId =
        selectedConversation.user1 === currentUser.id
          ? selectedConversation.user2
          : selectedConversation.user1;

      const newMessage = await sendMessage(
        receiverId,
        content
      );

      console.log("Message sent:", newMessage);

      setMessages(function (currentMessages) {
        return [...currentMessages, newMessage];
      });

      await loadConversations();
    } catch (error) {
      console.error(
        "Error sending message:",
        error.message
      );

      setError(error.message);

      throw error;
    } finally {
      setSending(false);
    }
  }

  async function handleEditMessage(message) {
    const newContent = window.prompt(
      "Edit message:",
      message.content
    );

    if (newContent === null) {
      return;
    }

    if (!newContent.trim()) {
      return;
    }

    try {
      setError("");

      const updatedMessage = await updateMessage(
        message.id,
        newContent
      );

      console.log(
        "Message updated:",
        updatedMessage
      );

      setMessages(function (currentMessages) {
        return currentMessages.map(function (item) {
          if (item.id === updatedMessage.id) {
            return updatedMessage;
          }

          return item;
        });
      });
    } catch (error) {
      console.error(
        "Error updating message:",
        error.message
      );

      setError(error.message);
    }
  }

  async function handleDeleteMessage(messageId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteMessage(messageId);

      console.log(
        "Message deleted:",
        messageId
      );

      setMessages(function (currentMessages) {
        return currentMessages.filter(
          function (message) {
            return message.id !== messageId;
          }
        );
      });
    } catch (error) {
      console.error(
        "Error deleting message:",
        error.message
      );

      setError(error.message);
    }
  }

  return (
    <div className="messaging-page">
      <div className="messaging-container">

        <h1>Messaging</h1>

        {error && (
          <p className="messaging-error">
            {error}
          </p>
        )}

        <NewConversation
          onStart={handleStartConversation}
          loading={startingConversation}
        />

        <div className="messaging-layout">

          <aside className="messaging-sidebar">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelect={handleSelectConversation}
              loading={loadingConversations}
            />
          </aside>

          <main className="chat-window">

            {!selectedConversation ? (
              <div className="chat-empty">
                <h2>Select a conversation</h2>

                <p>
                  Choose a conversation to view messages.
                </p>
              </div>
            ) : (
              <>
                <div className="chat-header">
                  <h2>
                    Conversation #
                    {selectedConversation.id}
                  </h2>

                  <p>
                    User #
                    {selectedConversation.user1 ===
                    currentUser.id
                      ? selectedConversation.user2
                      : selectedConversation.user1}
                  </p>
                </div>

                <MessageList
                  messages={messages}
                  currentUserId={currentUser.id}
                  loading={loadingMessages}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                />

                <MessageInput
                  onSend={handleSendMessage}
                  loading={sending}
                />
              </>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}

export default Messaging;