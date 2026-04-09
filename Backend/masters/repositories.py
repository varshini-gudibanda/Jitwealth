from core.mongodb import mongodb


class ProvinceRepository:
    def __init__(self):
        self.collection = mongodb.get_collection("province_master")

    def get_all_provinces(self):
        return list(
            self.collection.find(
                {},
                {
                    "_id": 0,
                    "province_id": 1,
                    "province_name": 1,
                    "province_status": 1,
                },
            ).sort("province_name", 1)
        )

    def get_by_id(self, province_id):
        return self.collection.find_one(
            {"province_id": province_id},
            {
                "_id": 0,
                "province_id": 1,
                "province_name": 1,
                "province_status": 1,
            },
        )

    def exists(self, province_id):
        return self.collection.count_documents({"province_id": province_id}, limit=1) > 0
