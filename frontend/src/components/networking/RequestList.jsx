function RequestList({
  receivedRequests,
  sentRequests,
  loading,
  onUpdate,
}) {
  return (
    <>
      <section className="networking-section">
        <h2>Received Requests</h2>

        {loading ? (
          <p>Loading requests...</p>
        ) : receivedRequests.length === 0 ? (
          <p>No received requests.</p>
        ) : (
          receivedRequests.map(
            function (request) {
              return (
                <div
                  className="request-card"
                  key={request.id}
                >
                  <p>
                    User #{request.sender} sent you
                    a connection request.
                  </p>

                  <p>
                    Status: {request.status}
                  </p>

                  <button
                    type="button"
                    onClick={function () {
                      onUpdate(
                        request.id,
                        "accepted"
                      );
                    }}
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      onUpdate(
                        request.id,
                        "rejected"
                      );
                    }}
                  >
                    Reject
                  </button>
                </div>
              );
            }
          )
        )}
      </section>

      <section className="networking-section">
        <h2>Sent Requests</h2>

        {loading ? (
          <p>Loading requests...</p>
        ) : sentRequests.length === 0 ? (
          <p>No sent requests.</p>
        ) : (
          sentRequests.map(
            function (request) {
              return (
                <div
                  className="request-card"
                  key={request.id}
                >
                  <p>
                    You sent a request to User #
                    {request.receiver}.
                  </p>

                  <p>
                    Status: {request.status}
                  </p>
                </div>
              );
            }
          )
        )}
      </section>
    </>
  );
}

export default RequestList;