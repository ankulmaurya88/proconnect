function ConnectionList({
  connections,
  loading,
  onRemove,
}) {
  if (loading) {
    return <p>Loading connections...</p>;
  }

  if (connections.length === 0) {
    return <p>No connections yet.</p>;
  }

  return (
    <section className="networking-section">
      <h2>My Connections</h2>

      <div className="connection-list">
        {connections.map(function (connection) {
          return (
            <div
              className="connection-card"
              key={connection.id}
            >
              <p>
                <strong>
                  Connection #{connection.id}
                </strong>
              </p>

              <p>
                User #{connection.sender}
                {" ↔ "}
                User #{connection.receiver}
              </p>

              <p>
                Status: {connection.status}
              </p>

              <button
                type="button"
                onClick={function () {
                  onRemove(connection.id);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ConnectionList;