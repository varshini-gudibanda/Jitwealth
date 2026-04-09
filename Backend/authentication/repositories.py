
from datetime import datetime
from core.mongodb import mongodb

class MemberRepository:
    def __init__(self):
        self.col = mongodb.get_collection("member_master")

    def get_by_email(self, email_id):
        return self.col.find_one({"email_id": email_id})

    def get_by_member_id(self, member_id):
        return self.col.find_one({"member_id": member_id})

    def exists_email(self, email_id):
        return self.col.count_documents({"email_id": email_id}, limit=1) > 0

    def create_member(self, member_doc):
        self.col.insert_one(member_doc)
        return member_doc

    def update_gmail_token(self, member_id, token):
        return self.col.update_one(
            {"member_id": member_id},
            {"$set": {"gmail_token": token, "updated_at": datetime.utcnow()}}
        )


class OTPRepository:
    def __init__(self):
        self.col = mongodb.get_collection("otp")

    def create_otp(self, otp_doc):
        self.col.insert_one(otp_doc)
        return otp_doc

    def expire_old_otps(self, member_id, otp_for, otp_type, now_dt):
        return self.col.update_many(
            {
                "member_id": member_id,
                "otp_for": otp_for,
                "otp_type": otp_type,
                "otp_status": 1,
                "expiry_date": {"$lt": now_dt},
            },
            {"$set": {"otp_status": 0}}
        )

    def find_valid_otp(self, member_id, otp_for, otp_type, otp_code, now_dt):
        return self.col.find_one(
            {
                "member_id": member_id,
                "otp_for": otp_for,
                "otp_type": otp_type,
                "otp_code": otp_code,
                "otp_status": 1,
                "expiry_date": {"$gte": now_dt},
            }
        )

    def mark_used(self, otp_id):
        return self.col.update_one(
            {"otp_id": otp_id},
            {"$set": {"otp_status": 2}}
        )


class LoginAuditRepository:
    def __init__(self):
        self.col = mongodb.get_collection("login_master")

    def add_login_event(self, login_doc):
        self.col.insert_one(login_doc)
        return login_doc