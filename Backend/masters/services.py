from .repositories import ProvinceRepository


class ProvinceService:
    def __init__(self):
        self.repository = ProvinceRepository()

    def list_provinces(self):
        return self.repository.get_all_provinces()

    def get_province(self, province_id):
        province = self.repository.get_by_id(province_id)
        if not province:
            raise ValueError("Province not found")
        return province
