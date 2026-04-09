from django.contrib.auth.hashers import check_password, make_password

from masters.repositories import ProvinceRepository
from .repositories import MemberRepository


class MemberService:
    def __init__(self):
        self.member_repository = MemberRepository()
        self.province_repository = ProvinceRepository()

    def get_me(self, member_id):
        member = self.member_repository.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")

        return self._safe_member(member)

    def update_me(self, member_id, payload):
        member = self.member_repository.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")

        updates = {}

        allowed_fields = [
            "full_name",
            "salutation",
            "dob",
            "address",
            "city",
            "province_id",
            "pincode",
            "mobile_number",
            "whatsapp_number",
            "about",
            "job_status",
            "membership_type",
        ]

        for field in allowed_fields:
            if field in payload:
                updates[field] = payload[field]

        if "province_id" in updates:
            if not self.province_repository.exists(updates["province_id"]):
                raise ValueError("Invalid province_id")

        self.member_repository.update_member(member_id, updates)

        updated_member = self.member_repository.get_by_member_id(member_id)
        return self._safe_member(updated_member)

    def change_password(self, member_id, old_password, new_password):
        member = self.member_repository.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")

        stored_hash = member.get("password_hash")
        if not stored_hash:
            raise ValueError("Password not set for this member")

        if not check_password(old_password, stored_hash):
            raise ValueError("Old password is incorrect")

        new_hash = make_password(new_password)
        self.member_repository.change_password(member_id, new_hash)

        return {"changed": True}

    def _safe_member(self, member):
        return {
            "member_id": member.get("member_id"),
            "member_no": member.get("member_no"),
            "salutation": member.get("salutation"),
            "full_name": member.get("full_name"),
            "dob": member.get("dob"),
            "address": member.get("address"),
            "city": member.get("city"),
            "province_id": member.get("province_id"),
            "pincode": member.get("pincode"),
            "mobile_number": member.get("mobile_number"),
            "whatsapp_number": member.get("whatsapp_number"),
            "email_id": member.get("email_id"),
            "gmail": member.get("gmail"),
            "about": member.get("about"),
            "job_status": member.get("job_status"),
            "registration_date": member.get("registration_date"),
            "member_status": member.get("member_status"),
            "membership_type": member.get("membership_type"),
        }
