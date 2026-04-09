import os

from rest_framework.permissions import BasePermission


def _admin_membership_types():
    raw = os.getenv("ADMIN_MEMBERSHIP_TYPES", "9")
    values = []
    for part in raw.split(","):
        part = part.strip()
        if part.isdigit():
            values.append(int(part))
    return values or [9]


def is_admin_member(user):
    if user is None:
        return False
    membership_type = getattr(user, "membership_type", None)
    return membership_type in _admin_membership_types()


class IsAdminMember(BasePermission):
    message = "Admin access required"

    def has_permission(self, request, view):
        return is_admin_member(request.user)
