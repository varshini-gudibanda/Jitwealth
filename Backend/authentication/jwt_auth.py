# jwt_auth.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from .repositories import MemberRepository
from .constants import MEMBER_STATUS_ACTIVE

class AuthenticatedMember:
    def __init__(self, member_doc):
        self.member_id = member_doc["member_id"]
        self.email_id = member_doc["email_id"]
        self.full_name = member_doc.get("full_name", "")
        self.membership_type = member_doc.get("membership_type", 1)
        self.is_authenticated = True

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        member_id = validated_token.get("member_id")
        if member_id is None:
            raise InvalidToken("Token missing member_id")

        repo = MemberRepository()
        member = repo.get_by_member_id(member_id)
        if not member:
            raise InvalidToken("Member not found")

        if member.get("member_status") != MEMBER_STATUS_ACTIVE:
            raise InvalidToken("Member inactive")

        return AuthenticatedMember(member)