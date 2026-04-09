from core.mongodb import mongodb


class WAMessageRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("wa_msgs")

    def create_message(self, doc):
        self.collection.insert_one(doc)
        return doc

    def get_message_by_id(self, msg_id):
        return self.collection.find_one({"msg_id": msg_id}, {"_id": 0})

    def list_by_member(self, member_id, skip, limit):
        cursor = (
            self.collection.find({"member_id": member_id}, {"_id": 0})
            .sort("msg_date", -1)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor)

    def count_by_member(self, member_id):
        return self.collection.count_documents({"member_id": member_id})

    def update_send_status(self, msg_id, send_status):
        result = self.collection.update_one(
            {"msg_id": msg_id},
            {"$set": {"send_status": send_status}},
        )
        return result.modified_count > 0
