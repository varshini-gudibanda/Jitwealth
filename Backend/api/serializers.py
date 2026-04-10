from rest_framework import serializers


class CourseProgressUpdateSerializer(serializers.Serializer):
    progress = serializers.IntegerField(min_value=0, max_value=100)


class CalculatorRequestSerializer(serializers.Serializer):
    prev_close = serializers.FloatField(min_value=0.01)
