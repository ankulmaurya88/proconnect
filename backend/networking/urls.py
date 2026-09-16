from django.urls import path

from .views import (
    ConnectionListCreateView,
    ConnectionRequestActionView,
    MyConnectionsView,
    ReceivedRequestsView,
    SentRequestsView,
)


urlpatterns = [
    # Send connection request + list sent connections
    path(
        "connections/",
        ConnectionListCreateView.as_view(),
        name="connection-list-create",
    ),

    # Incoming pending requests
    path(
        "connections/received/",
        ReceivedRequestsView.as_view(),
        name="received-requests",
    ),

    # Outgoing pending requests
    path(
        "connections/sent/",
        SentRequestsView.as_view(),
        name="sent-requests",
    ),

    # Accept / Reject / Remove connection
    path(
        "connections/<int:pk>/",
        ConnectionRequestActionView.as_view(),
        name="connection-detail",
    ),
]