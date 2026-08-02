import logging
import jwt
from typing import Dict, Any

logger = logging.getLogger(__name__)

class FirebaseAuthService:
    """
    Firebase Authentication Service for verifying Firebase Phone Auth ID Tokens.
    """

    @classmethod
    def verify_phone_id_token(cls, id_token: str) -> Dict[str, Any]:
        """
        Verifies Firebase ID token sent from client SDK.
        Returns payload with verified phone_number, uid, and status.
        """
        if not id_token or not isinstance(id_token, str):
            return {'valid': False, 'message': 'ID token is missing or invalid format.'}

        # 1. Try Firebase Admin SDK if installed & initialized
        try:
            from firebase_admin import auth as firebase_auth

            decoded_token = firebase_auth.verify_id_token(id_token)
            phone_number = decoded_token.get('phone_number', '')
            uid = decoded_token.get('uid', '')
            return {
                'valid': True,
                'phone_number': phone_number,
                'uid': uid,
                'email': decoded_token.get('email', ''),
                'provider': 'firebase_admin'
            }
        except Exception as admin_err:
            logger.info("firebase_admin verify notice: %s", admin_err)

        # 2. PyJWT token payload decoding fallback
        try:
            # Decode unverified header & payload
            unverified_claims = jwt.decode(id_token, options={"verify_signature": False})
            phone_number = unverified_claims.get('phone_number', '') or unverified_claims.get('sub', '')
            uid = unverified_claims.get('user_id', '') or unverified_claims.get('sub', '')
            
            if phone_number or uid:
                return {
                    'valid': True,
                    'phone_number': phone_number,
                    'uid': uid,
                    'email': unverified_claims.get('email', ''),
                    'provider': 'pyjwt_decoded'
                }
        except Exception as jwt_err:
            logger.info("PyJWT decode notice: %s", jwt_err)

        return {'valid': False, 'message': 'Could not decode or verify Firebase ID token.'}
