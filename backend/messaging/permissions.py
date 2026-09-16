from rest_framework.permissions import BasePermission


class IsMessageSender(BasePermission):
    """
    Only the sender can update or delete a message.
    """

    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user