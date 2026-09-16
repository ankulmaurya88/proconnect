from rest_framework.permissions import BasePermission


class IsPostAuthor(BasePermission):
    """
    Only the author of a post can modify or delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class IsCommentAuthor(BasePermission):
    """
    Only the author of a comment can modify or delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user