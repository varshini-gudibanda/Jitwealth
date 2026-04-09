
from datetime import datetime, timedelta
import random

from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken

from core.counter import Counter
from .repositories import MemberRepository, OTPRepository, LoginAuditRepository
from .constants import (
    MEMBER_STATUS_ACTIVE,
    OTP_STATUS_ACTIVE,
    LOGIN_TYPE_PASSWORD,
)

class AuthService:
    def __init__(self):
        self.member_repo = MemberRepository()
        self.otp_repo = OTPRepository()
        self.login_repo = LoginAuditRepository()

    def _tokens_for_member(self, member_doc):
        refresh = RefreshToken()
        refresh["member_id"] = member_doc["member_id"]
        refresh["email_id"] = member_doc["email_id"]
        refresh["membership_type"] = member_doc.get("membership_type", 1)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

    def _safe_member(self, member_doc):
        return {
            "member_id": member_doc["member_id"],
            "member_no": member_doc.get("member_no"),
            "full_name": member_doc.get("full_name"),
            "email_id": member_doc.get("email_id"),
            "mobile_number": member_doc.get("mobile_number"),
            "province_id": member_doc.get("province_id"),
            "membership_type": member_doc.get("membership_type"),
            "member_status": member_doc.get("member_status"),
        }

    def signup(self, payload, request_ip):
        if self.member_repo.exists_email(payload["email_id"]):
            raise ValueError("Email already registered")

        now = datetime.utcnow()
        member_id = Counter.get_next_id("member_id")
        member_no = member_id

        member_doc = {
            "member_id": member_id,
            "member_no": member_no,
            "salutation": payload.get("salutation", 0),
            "full_name": payload["full_name"],
            "dob": payload.get("dob"),
            "address": payload.get("address", ""),
            "city": payload.get("city", ""),
            "province_id": payload["province_id"],
            "pincode": payload.get("pincode", ""),
            "mobile_number": payload["mobile_number"],
            "whatsapp_number": payload.get("whatsapp_number", ""),
            "email_id": payload["email_id"],
            "gmail": payload["email_id"],
            "gmail_token": "",
            "about": payload.get("about", ""),
            "job_status": payload.get("job_status", 0),
            "registration_date": now,
            "member_status": MEMBER_STATUS_ACTIVE,
            "registration_ip": request_ip,
            "membership_type": payload.get("membership_type", 1),
            "password_hash": make_password(payload["password"]),
        }

        self.member_repo.create_member(member_doc)
        tokens = self._tokens_for_member(member_doc)

        return {"member": self._safe_member(member_doc), "tokens": tokens}

    def login(self, email_id, password, request_ip):
        member = self.member_repo.get_by_email(email_id)
        if not member:
            raise ValueError("Invalid credentials")

        if member.get("member_status") != MEMBER_STATUS_ACTIVE:
            raise ValueError("Member is inactive")

        if not check_password(password, member.get("password_hash", "")):
            raise ValueError("Invalid credentials")

        login_doc = {
            "login_id": Counter.get_next_id("login_id"),
            "member_id": member["member_id"],
            "login_datetime": datetime.utcnow(),
            "login_type": LOGIN_TYPE_PASSWORD,
            "login_ip": request_ip,
        }
        self.login_repo.add_login_event(login_doc)

        tokens = self._tokens_for_member(member)
        return {"member": self._safe_member(member), "tokens": tokens}

    def send_otp(self, member_id, otp_for, otp_type):
        member = self.member_repo.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")

        now = datetime.utcnow()
        self.otp_repo.expire_old_otps(member_id, otp_for, otp_type, now)

        otp_code = str(random.randint(100000, 999999))
        otp_doc = {
            "otp_id": Counter.get_next_id("otp_id"),
            "member_id": member_id,
            "otp_for": otp_for,
            "otp_type": otp_type,
            "otp_status": OTP_STATUS_ACTIVE,
            "otp_code": otp_code,
            "created_date": now,
            "expiry_date": now + timedelta(minutes=5),
        }
        self.otp_repo.create_otp(otp_doc)

        # In production, send OTP via provider and do not return otp_code
        return {"member_id": member_id, "sent": True, "expires_in_minutes": 5}

    def verify_otp(self, member_id, otp_for, otp_type, otp_code):
        now = datetime.utcnow()
        otp_doc = self.otp_repo.find_valid_otp(member_id, otp_for, otp_type, otp_code, now)
        if not otp_doc:
            raise ValueError("Invalid or expired OTP")

        self.otp_repo.mark_used(otp_doc["otp_id"])
        return {"verified": True}

    def me(self, member_id):
        member = self.member_repo.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")
        return self._safe_member(member)