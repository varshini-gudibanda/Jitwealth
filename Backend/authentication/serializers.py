
from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    email_id = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=64, write_only=True)
    mobile_number = serializers.CharField(max_length=15)
    province_id = serializers.IntegerField()

    salutation = serializers.IntegerField(required=False, default=1)  # 1=Mr, 2=Mrs, 3=Ms
    dob = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    pincode = serializers.CharField(required=False, allow_blank=True)
    whatsapp_number = serializers.CharField(required=False, allow_blank=True)
    about = serializers.CharField(required=False, allow_blank=True)
    membership_type = serializers.IntegerField(required=False, default=1)
    job_status = serializers.IntegerField(required=False, default=1)  # 1=salary, 2=self-employed, 3=student, 4=retired, 5=business

    def validate_mobile_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("mobile_number must be numeric")
        if len(value) < 10:
            raise serializers.ValidationError("mobile_number must be at least 10 digits")
        return value


class LoginSerializer(serializers.Serializer):
    email_id = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=64, write_only=True)


class SendOTPSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    otp_for = serializers.IntegerField()
    otp_type = serializers.IntegerField()


class VerifyOTPSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    otp_for = serializers.IntegerField()
    otp_type = serializers.IntegerField()
    otp_code = serializers.CharField(min_length=4, max_length=8)