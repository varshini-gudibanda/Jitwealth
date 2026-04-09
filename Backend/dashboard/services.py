from .repositories import DashboardRepository


class DashboardService:
    def __init__(self):
        self.repo = DashboardRepository()

    def member_overview(self, member_id):
        member = self.repo.get_member(member_id)
        if not member:
            raise ValueError("Member not found")

        total_messages = self.repo.count_messages_by_member(member_id)
        sent_messages = self.repo.count_messages_by_member_and_status(member_id, 1)
        pending_messages = self.repo.count_messages_by_member_and_status(member_id, 0)

        total_logins = self.repo.count_logins_by_member(member_id)
        last_login = self.repo.get_last_login_by_member(member_id)

        total_otps = self.repo.count_otps_by_member(member_id)
        active_otps = self.repo.count_active_otps_by_member(member_id)

        total_members = self.repo.count_members()
        active_members = self.repo.count_members_by_status(1)

        return {
            "member": {
                "member_id": member.get("member_id"),
                "full_name": member.get("full_name"),
                "email_id": member.get("email_id"),
                "membership_type": member.get("membership_type"),
                "member_status": member.get("member_status"),
            },
            "messaging": {
                "total": total_messages,
                "sent": sent_messages,
                "pending": pending_messages,
            },
            "logins": {
                "total": total_logins,
                "last_login": last_login.get("login_datetime") if last_login else None,
                "last_login_ip": last_login.get("login_ip") if last_login else None,
            },
            "otp": {
                "total": total_otps,
                "active": active_otps,
            },
            "platform": {
                "total_members": total_members,
                "active_members": active_members,
            },
        }
