from core.mongodb import mongodb


class DashboardRepository:
    def __init__(self):
        self.members = mongodb.get_collection("member_master")
        self.messages = mongodb.get_collection("wa_msgs")
        self.logins = mongodb.get_collection("login_master")
        self.otps = mongodb.get_collection("otp")
        self.progress = mongodb.get_collection("progress")

    def get_member(self, member_id):
        return self.members.find_one({"member_id": member_id}, {"_id": 0, "password_hash": 0})

    def count_members(self):
        return self.members.count_documents({})

    def count_members_by_status(self, member_status):
        return self.members.count_documents({"member_status": member_status})

    def count_messages_by_member(self, member_id):
        return self.messages.count_documents({"member_id": member_id})

    def count_messages_by_member_and_status(self, member_id, send_status):
        return self.messages.count_documents({"member_id": member_id, "send_status": send_status})

    def count_logins_by_member(self, member_id):
        return self.logins.count_documents({"member_id": member_id})

    def get_last_login_by_member(self, member_id):
        return self.logins.find_one({"member_id": member_id}, {"_id": 0}, sort=[("login_datetime", -1)])

    def count_otps_by_member(self, member_id):
        return self.otps.count_documents({"member_id": member_id})

    def count_active_otps_by_member(self, member_id):
        return self.otps.count_documents({"member_id": member_id, "otp_status": 1})

    def list_progress_by_member(self, member_id):
        return list(self.progress.find({"member_id": member_id}, {"_id": 0, "progress": 1}))
