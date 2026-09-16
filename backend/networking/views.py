

# Create your views here.
import logging
from django.db.models import Q
from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)
from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Connection
from .serializers import ConnectionSerializer,ConnectionActionSerializer


logger = logging.getLogger("proconnect")


class ConnectionListCreateView(ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(
            sender=self.request.user
        ).select_related(
            "sender",
            "receiver",
        ).order_by("-created_at")

    def perform_create(self, serializer):
        connection = serializer.save(
            sender=self.request.user
        )

        logger.info(
            "Connection request sent: sender_id=%s receiver_id=%s",
            self.request.user.id,
            connection.receiver.id,
        )



# class ConnectionRequestActionView(RetrieveUpdateAPIView):
#     serializer_class = ConnectionActionSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Connection.objects.filter(
#             receiver=self.request.user,
#             status="pending",
#         ).select_related(
#             "sender",
#             "receiver",
#         )

#     def perform_update(self, serializer):
#         connection = serializer.save()

#         logger.info(
#             "Connection request updated: "
#             "user_id=%s connection_id=%s status=%s",
#             self.request.user.id,
#             connection.id,
#             connection.status,
#         )

class ConnectionRequestActionView(RetrieveUpdateDestroyAPIView):
    serializer_class = ConnectionActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Connection.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related(
            "sender",
            "receiver",
        )

    def perform_update(self, serializer):
        connection = serializer.save()

        logger.info(
            "Connection request updated: "
            "user_id=%s connection_id=%s status=%s",
            self.request.user.id,
            connection.id,
            connection.status,
        )

    def perform_destroy(self, instance):
        connection_id = instance.id

        if instance.status != "accepted":
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                "Only accepted connections can be removed."
            )

        instance.delete()

        logger.info(
            "Connection removed: user_id=%s connection_id=%s",
            self.request.user.id,
            connection_id,
        )
class MyConnectionsView(ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return (
            Connection.objects
            .filter(
                status="accepted"
            )
            .filter(
                Q(sender=user) | Q(receiver=user)
            )
            .select_related(
                "sender",
                "receiver",
            )
            .order_by("-updated_at")
        )



class ReceivedRequestsView(ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Connection.objects
            .filter(
                receiver=self.request.user,
                status="pending",
            )
            .select_related(
                "sender",
                "receiver",
            )
            .order_by("-created_at")
        )


class SentRequestsView(ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Connection.objects
            .filter(
                sender=self.request.user,
                status="pending",
            )
            .select_related(
                "sender",
                "receiver",
            )
            .order_by("-created_at")
        )


class RemoveConnectionView(DestroyAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            status="accepted",
        )

    def perform_destroy(self, instance):
        connection_id = instance.id

        instance.delete()

        logger.info(
            "Connection removed: user_id=%s connection_id=%s",
            self.request.user.id,
            connection_id,
        )