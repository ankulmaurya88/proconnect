from rest_framework.permissions import BasePermission


class IsProfileOwner(BasePermission):
    """
    Only the owner of the profile can modify it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsProfileResourceOwner(BasePermission):
    """
    Only the owner of a profile resource can access/modify it.
    Used for Education, Experience and Project objects.
    """

    def has_object_permission(self, request, view, obj):
        return obj.profile.user == request.user