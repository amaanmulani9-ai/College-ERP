import os


def str_env(name, default=""):
    return os.environ.get(name, default)


def bool_env(name, default=False):
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def list_env(name, default=None):
    value = os.environ.get(name)
    if value is None:
        return default or []
    return [item.strip() for item in value.split(",") if item.strip()]


def int_env(name, default):
    value = os.environ.get(name)
    if value is None or value == "":
        return default
    return int(value)
