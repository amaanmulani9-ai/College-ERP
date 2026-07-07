from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        logger.debug(f"Authenticate called with username={username}")
        try:
            user = UserModel.objects.get(email=username)
            logger.debug(f"User found: {user.email}")
        except UserModel.DoesNotExist:
            logger.debug("User DoesNotExist")
            return None
        except Exception as e:
            logger.exception(f"Exception during authentication: {e}")
            return None
        else:
            if user.check_password(password):
                logger.debug("Password matched")
                return user
            logger.debug("Password mismatch")
        return None
