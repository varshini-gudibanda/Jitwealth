from core.mongodb import mongodb


class MemberRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("member_master")

    def get_by_member_id(self, member_id):
        return self.collection.find_one(
            {"member_id": member_id},
            {"_id": 0, "password_hash": 0},
        )

    def get_by_email_id(self, email_id):
        return self.collection.find_one(
            {"email_id": email_id},
            {"_id": 0},
        )

    def update_member(self, member_id, updates):
        return self.collection.update_one(
            {"member_id": member_id},
            {"$set": updates},
        )

    def change_password(self, member_id, password_hash):
        return self.collection.update_one(
            {"member_id": member_id},
            {"$set": {"password_hash": password_hash}},
        )

    def list_members(self, filters=None, skip=0, limit=20):
        filters = filters or {}
        cursor = (
            self.collection.find(filters, {"_id": 0, "password_hash": 0})
            .sort("member_id", -1)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor)
