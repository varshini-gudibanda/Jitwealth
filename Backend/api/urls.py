from django.urls import path

from .views import (
    CourseListView,
    CourseDetailView,
    MyCoursesView,
    UpdateCourseProgressView,
    CourseLessonsView,
    MarkLessonCompleteView,
    CalculateSignalView,
)

urlpatterns = [
    path("courses/", CourseListView.as_view(), name="courses-list"),
    path("courses/<int:course_id>/", CourseDetailView.as_view(), name="course-detail"),
    path("my-courses/", MyCoursesView.as_view(), name="my-courses"),
    path("courses/<int:course_id>/progress/", UpdateCourseProgressView.as_view(), name="course-progress-update"),
    path("courses/<int:course_id>/lessons/", CourseLessonsView.as_view(), name="course-lessons"),
    path("lessons/<int:lesson_id>/complete/", MarkLessonCompleteView.as_view(), name="lesson-complete"),
    path("calculator/calculate/", CalculateSignalView.as_view(), name="calculator-calculate"),
]
