from rest_framework import serializers


class SendWAMessageSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    msg_type = serializers.IntegerField()
    msg = serializers.CharField(max_length=5000)

    def validate_msg(self, value):
        if not value.strip():
            raise serializers.ValidationError("msg cannot be empty")
        return value.strip()


class UpdateWAMessageStatusSerializer(serializers.Serializer):
    send_status = serializers.IntegerField()
