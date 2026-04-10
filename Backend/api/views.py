from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from core.response import success_response, error_response
from .serializers import CourseProgressUpdateSerializer, CalculatorRequestSerializer
from .services import LearningService


class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = LearningService().get_courses()
        return success_response(data=data, message="Courses fetched")


class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            data = LearningService().get_course_by_id(course_id)
            return success_response(data=data, message="Course fetched")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class MyCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member_id = getattr(request.user, "member_id", None)
        if member_id is None:
            return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        data = LearningService().get_my_courses(member_id)
        return success_response(data=data, message="My courses fetched")


class UpdateCourseProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, course_id):
        member_id = getattr(request.user, "member_id", None)
        if member_id is None:
            return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        serializer = CourseProgressUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        try:
            data = LearningService().update_progress(
                member_id=member_id,
                course_id=course_id,
                progress=serializer.validated_data["progress"],
            )
            return success_response(data=data, message="Course progress updated")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class CourseLessonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            data = LearningService().get_lessons_for_course(course_id)
            return success_response(data=data, message="Lessons fetched")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class MarkLessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        member_id = getattr(request.user, "member_id", None)
        if member_id is None:
            return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        try:
            data = LearningService().mark_lesson_complete(member_id, lesson_id)
            return success_response(data=data, message="Lesson marked complete")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class CalculateSignalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CalculatorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        data = LearningService().calculate_signal(serializer.validated_data["prev_close"])
        return success_response(data=data, message="Signal calculated")
