from django.urls import path

from .views import (
    MessageListCreateView,
    ConversationListView,
    MessageDetailView,
)


urlpatterns = [
    path(
        "conversations/",
        ConversationListView.as_view(),
        name="conversation-list",
    ),

    path(
        "conversations/<int:user_id>/messages/",
        MessageListCreateView.as_view(),
        name="message-list-create",
    ),

    path(
        "conversations/<int:conversation_id>/history/",
        MessageListCreateView.as_view(),
        name="message-history",
    ),

    path(
        "messages/<int:pk>/",
        MessageDetailView.as_view(),
        name="message-detail",
    ),
]