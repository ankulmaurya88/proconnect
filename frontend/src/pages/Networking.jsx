import { useEffect, useState } from "react";

import {
  getConnections,
  getReceivedRequests,
  getSentRequests,
  updateConnection,
  removeConnection,
} from "../services/networkingService";

import ConnectionForm from "../components/networking/ConnectionForm";
import ConnectionList from "../components/networking/ConnectionList";
import RequestList from "../components/networking/RequestList";

import "../styles/Networking.css";

function Networking() {
  const [connections, setConnections] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNetworkingData() {
    try {
      setLoading(true);
      setError("");

      const [
        connectionsData,
        receivedData,
        sentData,
      ] = await Promise.all([
        getConnections(),
        getReceivedRequests(),
        getSentRequests(),
      ]);

      console.log(
        "Connections:",
        connectionsData
      );

      console.log(
        "Received requests:",
        receivedData
      );

      console.log(
        "Sent requests:",
        sentData
      );

      setConnections(
        connectionsData.results ||
        connectionsData
      );

      setReceivedRequests(
        receivedData.results ||
        receivedData
      );

      setSentRequests(
        sentData.results ||
        sentData
      );
    } catch (error) {
      console.error(
        "Error loading networking data:",
        error.message
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadNetworkingData();
  }, []);

  function handleRequestSent() {
    loadNetworkingData();
  }

  async function handleUpdateConnection(
    connectionId,
    status
  ) {
    try {
      setError("");

      const data = await updateConnection(
        connectionId,
        status
      );

      console.log(
        "Connection updated:",
        data
      );

      await loadNetworkingData();
    } catch (error) {
      console.error(
        "Error updating connection:",
        error.message
      );

      setError(error.message);
    }
  }

  async function handleRemoveConnection(
    connectionId
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this connection?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await removeConnection(connectionId);

      console.log(
        "Connection removed:",
        connectionId
      );

      setConnections(
        function (currentConnections) {
          return currentConnections.filter(
            function (connection) {
              return connection.id !== connectionId;
            }
          );
        }
      );
    } catch (error) {
      console.error(
        "Error removing connection:",
        error.message
      );

      setError(error.message);
    }
  }

  return (
    <div className="networking-page">
      <div className="networking-container">

        <h1>Networking</h1>

        {error && (
          <p className="networking-error">
            {error}
          </p>
        )}

        <ConnectionForm
          onRequestSent={handleRequestSent}
        />

        <RequestList
          receivedRequests={receivedRequests}
          sentRequests={sentRequests}
          loading={loading}
          onUpdate={handleUpdateConnection}
        />

        <ConnectionList
          connections={connections}
          loading={loading}
          onRemove={handleRemoveConnection}
        />

      </div>
    </div>
  );
}

export default Networking;