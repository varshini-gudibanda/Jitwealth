from datetime import datetime

from core.counter import Counter
from authentication.repositories import MemberRepository
from .repositories import WAMessageRepository


class WAMessageService:
    def __init__(self):
        self.repo = WAMessageRepository()
        self.member_repo = MemberRepository()

    def queue_message(self, member_id, msg_type, msg):
        member = self.member_repo.get_by_member_id(member_id)
        if not member:
            raise ValueError("Member not found")

        doc = {
            "msg_id": Counter.get_next_id("msg_id"),
            "msg_date": datetime.utcnow(),
            "member_id": member_id,
            "msg_type": msg_type,
            "msg": msg,
            "send_status": 0,
        }
        return self.repo.create_message(doc)

    def get_history(self, member_id, page=1, page_size=20):
        if page < 1 or page_size < 1:
            raise ValueError("Invalid pagination values")

        skip = (page - 1) * page_size
        items = self.repo.list_by_member(member_id=member_id, skip=skip, limit=page_size)
        total = self.repo.count_by_member(member_id=member_id)

        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total": total,
        }

    def update_send_status(self, msg_id, send_status):
        updated = self.repo.update_send_status(msg_id=msg_id, send_status=send_status)
        if not updated:
            raise ValueError("Message not found or status unchanged")
        return {"updated": True, "msg_id": msg_id, "send_status": send_status}
