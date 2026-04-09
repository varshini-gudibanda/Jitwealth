from rest_framework.throttling import UserRateThrottle


class AuthSignupThrottle(UserRateThrottle):
    scope = "auth_signup"


class AuthLoginThrottle(UserRateThrottle):
    scope = "auth_login"


class AuthOTPSendThrottle(UserRateThrottle):
    scope = "auth_otp_send"


class AuthOTPVerifyThrottle(UserRateThrottle):
    scope = "auth_otp_verify"


class MessageSendThrottle(UserRateThrottle):
    scope = "msg_send"


class MessageStatusUpdateThrottle(UserRateThrottle):
    scope = "msg_status_update"


class AuditReadThrottle(UserRateThrottle):
    scope = "audit_read"


class DashboardReadThrottle(UserRateThrottle):
    scope = "dashboard_read"
