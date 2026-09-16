from django.contrib.auth.models import User
from django.db import models


class Conversation(models.Model):
    user1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="conversations_as_user1",
    )

    user2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="conversations_as_user2",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user1", "user2"],
                name="unique_conversation",
            )
        ]

    def __str__(self):
        return (
            f"Conversation: "
            f"{self.user1.username} - {self.user2.username}"
        )


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )

    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_messages",
    )

    content = models.TextField(max_length=5000)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"Message from "
            f"{self.sender.username} "
            f"to {self.receiver.username}"
        )