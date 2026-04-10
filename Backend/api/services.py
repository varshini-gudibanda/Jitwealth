from datetime import datetime
import random

from .repositories import LearningRepository


class LearningService:
    def __init__(self):
        self.repo = LearningRepository()

    def get_courses(self):
        return self.repo.list_courses()

    def get_course_by_id(self, course_id):
        course = self.repo.get_course(course_id)
        if not course:
            raise ValueError("Course not found")
        return course

    def get_my_courses(self, member_id):
        progress_rows = self.repo.list_progress_by_member(member_id)
        courses = {c.get("course_id"): c for c in self.repo.list_courses()}

        result = []
        for row in progress_rows:
            course = courses.get(row.get("course_id"), {})
            result.append({
                "course_id": row.get("course_id"),
                "title": course.get("title"),
                "description": course.get("description"),
                "progress": row.get("progress", 0),
                "status": "Completed" if row.get("progress", 0) >= 100 else "In Progress",
            })
        return result

    def update_progress(self, member_id, course_id, progress):
        course = self.repo.get_course(course_id)
        if not course:
            raise ValueError("Course not found")

        now = datetime.utcnow()
        updates = {
            "member_id": member_id,
            "course_id": course_id,
            "progress": progress,
            "updated_at": now,
        }
        if progress >= 100:
            updates["completed_at"] = now

        return self.repo.upsert_progress(member_id, course_id, updates)

    def get_lessons_for_course(self, course_id):
        course = self.repo.get_course(course_id)
        if not course:
            raise ValueError("Course not found")
        return self.repo.list_lessons_by_course(course_id)

    def mark_lesson_complete(self, member_id, lesson_id):
        lesson = self.repo.get_lesson(lesson_id)
        if not lesson:
            raise ValueError("Lesson not found")

        course_id = lesson.get("course_id")
        all_lessons = self.repo.list_lessons_by_course(course_id)
        total_lessons = len(all_lessons)

        current = self.repo.get_progress(member_id, course_id) or {
            "member_id": member_id,
            "course_id": course_id,
            "completed_lessons": [],
            "progress": 0,
        }

        completed = set(current.get("completed_lessons", []))
        completed.add(lesson_id)
        progress = int((len(completed) / total_lessons) * 100) if total_lessons else 0

        updated = self.repo.upsert_progress(
            member_id,
            course_id,
            {
                "member_id": member_id,
                "course_id": course_id,
                "completed_lessons": sorted(list(completed)),
                "progress": progress,
                "updated_at": datetime.utcnow(),
            },
        )

        return {
            "lesson_id": lesson_id,
            "course_id": course_id,
            "progress": updated.get("progress", progress),
            "completed_lessons": updated.get("completed_lessons", sorted(list(completed))),
        }

    def calculate_signal(self, prev_close):
        confidence = random.randint(80, 95)
        p = float(prev_close)

        return {
            "strength": "HIGH" if confidence > 90 else "MEDIUM" if confidence > 85 else "LOW",
            "confidence": confidence,
            "buy": {
                "entry": round(p * 1.007),
                "sl": round(p * 1.0015),
                "t1": round(p * 1.012),
                "t2": round(p * 1.017),
                "t3": round(p * 1.022),
            },
            "sell": {
                "entry": round(p * 0.997),
                "sl": round(p * 1.002),
                "t1": round(p * 0.992),
                "t2": round(p * 0.987),
                "t3": round(p * 0.982),
            },
        }
