from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.id")
    receiver = serializers.ReadOnlyField(source="receiver.id")
    conversation = serializers.ReadOnlyField(source="conversation.id")

    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "sender",
            "receiver",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "conversation",
            "sender",
            "receiver",
            "created_at",
            "updated_at",
        ]

    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Message cannot be empty."
            )

        return value


class ConversationSerializer(serializers.ModelSerializer):
    user1 = serializers.ReadOnlyField(source="user1.id")
    user2 = serializers.ReadOnlyField(source="user2.id")

    last_message = serializers.SerializerMethodField()
    last_message_at = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "user1",
            "user2",
            "last_message",
            "last_message_at",
            "created_at",
        ]

    def get_last_message(self, obj):
        messages = list(obj.messages.all())

        if not messages:
            return None

        return messages[0].content

    def get_last_message_at(self, obj):
        messages = list(obj.messages.all())

        if not messages:
            return None

        return messages[0].created_at