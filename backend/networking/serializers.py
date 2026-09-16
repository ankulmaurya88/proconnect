from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Connection


class ConnectionSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.id")

    class Meta:
        model = Connection
        fields = [
            "id",
            "sender",
            "receiver",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "sender",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_receiver(self, value):
        request = self.context["request"]

        if value == request.user:
            raise serializers.ValidationError(
                "You cannot send a connection request to yourself."
            )

        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError(
                "User does not exist."
            )

        return value

    def validate(self, attrs):
        request = self.context["request"]
        receiver = attrs["receiver"]

        existing = Connection.objects.filter(
            sender=request.user,
            receiver=receiver,
        ).first()

        if existing:
            if existing.status == "pending":
                raise serializers.ValidationError(
                    "Connection request already exists."
                )

            if existing.status == "accepted":
                raise serializers.ValidationError(
                    "You are already connected."
                )

            if existing.status == "rejected":
                raise serializers.ValidationError(
                    "Connection request was previously rejected."
                )

        reverse_connection = Connection.objects.filter(
            sender=receiver,
            receiver=request.user,
        ).first()

        if reverse_connection:
            if reverse_connection.status == "pending":
                raise serializers.ValidationError(
                    "This user has already sent you a connection request."
                )

            if reverse_connection.status == "accepted":
                raise serializers.ValidationError(
                    "You are already connected."
                )

        return attrs


class ConnectionActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ["id", "status"]
        read_only_fields = ["id"]

    def validate_status(self, value):
        if value not in ["accepted", "rejected"]:
            raise serializers.ValidationError(
                "Status must be accepted or rejected."
            )

        return value