from contextvars import ContextVar


_request_id_ctx = ContextVar("request_id", default="-")


def set_request_id(request_id):
    _request_id_ctx.set(request_id)


def get_request_id():
    return _request_id_ctx.get()


def clear_request_id():
    _request_id_ctx.set("-")
