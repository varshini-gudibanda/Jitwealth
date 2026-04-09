from core.mongodb import mongodb


class LoginAuditReadRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("login_master")

    def list_by_member(self, member_id, skip, limit):
        cursor = (
            self.collection.find({"member_id": member_id}, {"_id": 0})
            .sort("login_datetime", -1)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor)

    def count_by_member(self, member_id):
        return self.collection.count_documents({"member_id": member_id})
