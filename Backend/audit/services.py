from .repositories import LoginAuditReadRepository


class LoginAuditService:
    def __init__(self):
        self.repo = LoginAuditReadRepository()

    def _paginate(self, member_id, page, page_size):
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

    def get_my_login_history(self, member_id, page=1, page_size=20):
        return self._paginate(member_id=member_id, page=page, page_size=page_size)

    def get_member_login_history(self, member_id, page=1, page_size=20):
        return self._paginate(member_id=member_id, page=page, page_size=page_size)
