import logging
from django.db.models import Q
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from django.db.models import Prefetch
from .permissions import IsMessageSender

from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from .models import Conversation, Message
from .serializers import MessageSerializer,ConversationSerializer


logger = logging.getLogger("proconnect")


class MessageListCreateView(ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs.get("conversation_id")

        if not conversation_id:
            return Message.objects.none()

        user = self.request.user

        return (
            Message.objects
            .filter(
                conversation_id=conversation_id
            )
            .filter(
                Q(conversation__user1=user)
                |
                Q(conversation__user2=user)
            )
            .select_related(
                "sender",
                "receiver",
                "conversation",
            )
            .order_by("created_at")
        )

    def perform_create(self, serializer):
        receiver_id = self.kwargs["user_id"]

        receiver = get_object_or_404(
            User,
            id=receiver_id
        )

        if receiver == self.request.user:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "You cannot send a message to yourself."
            )

        user1, user2 = sorted(
            [self.request.user, receiver],
            key=lambda user: user.id
        )

        conversation, created = Conversation.objects.get_or_create(
            user1=user1,
            user2=user2,
        )

        message = serializer.save(
            conversation=conversation,
            sender=self.request.user,
            receiver=receiver,
        )

        logger.info(
            "Message sent: sender_id=%s receiver_id=%s message_id=%s",
            self.request.user.id,
            receiver.id,
            message.id,
        )

class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        latest_messages = (
            Message.objects
            .order_by("-created_at")
        )

        return (
            Conversation.objects
            .filter(
                Q(user1=user) | Q(user2=user)
            )
            .select_related(
                "user1",
                "user2",
            )
            .prefetch_related(
                Prefetch(
                    "messages",
                    queryset=latest_messages,
                )
            )
            .order_by("-created_at")
        )


class MessageDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [
        IsAuthenticated,
        IsMessageSender,
    ]

    def get_queryset(self):
        return (
            Message.objects
            .filter(
                conversation__user1=self.request.user
            )
            |
            Message.objects
            .filter(
                conversation__user2=self.request.user
            )
        ).select_related(
            "sender",
            "receiver",
            "conversation",
        )

    def perform_update(self, serializer):
        message = serializer.save()

        logger.info(
            "Message updated: user_id=%s message_id=%s",
            self.request.user.id,
            message.id,
        )

    def perform_destroy(self, instance):
        message_id = instance.id

        instance.delete()

        logger.info(
            "Message deleted: user_id=%s message_id=%s",
            self.request.user.id,
            message_id,
        )