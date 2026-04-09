from rest_framework import serializers


class MemberProfileUpdateSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=False, max_length=120)
    salutation = serializers.IntegerField(required=False)
    dob = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    province_id = serializers.IntegerField(required=False)
    pincode = serializers.CharField(required=False, allow_blank=True, max_length=20)
    mobile_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    whatsapp_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    about = serializers.CharField(required=False, allow_blank=True)
    job_status = serializers.IntegerField(required=False)
    membership_type = serializers.IntegerField(required=False)

    def validate_mobile_number(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("mobile_number must contain only digits")
        return value

    def validate_whatsapp_number(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("whatsapp_number must contain only digits")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, min_length=8)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("new_password and confirm_password must match")
        return attrs
