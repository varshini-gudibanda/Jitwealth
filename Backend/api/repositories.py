from core.mongodb import mongodb


class LearningRepository:
    def __init__(self):
        self.courses = mongodb.get_collection("courses")
        self.lessons = mongodb.get_collection("lessons")
        self.progress = mongodb.get_collection("progress")

    def list_courses(self):
        return list(self.courses.find({}, {"_id": 0}))

    def get_course(self, course_id):
        return self.courses.find_one({"course_id": course_id}, {"_id": 0})

    def list_lessons_by_course(self, course_id):
        return list(self.lessons.find({"course_id": course_id}, {"_id": 0}).sort("lesson_id", 1))

    def get_lesson(self, lesson_id):
        return self.lessons.find_one({"lesson_id": lesson_id}, {"_id": 0})

    def get_progress(self, member_id, course_id):
        return self.progress.find_one(
            {"member_id": member_id, "course_id": course_id},
            {"_id": 0},
        )

    def upsert_progress(self, member_id, course_id, updates):
        self.progress.update_one(
            {"member_id": member_id, "course_id": course_id},
            {"$set": updates},
            upsert=True,
        )
        return self.get_progress(member_id, course_id)

    def list_progress_by_member(self, member_id):
        return list(self.progress.find({"member_id": member_id}, {"_id": 0}))
