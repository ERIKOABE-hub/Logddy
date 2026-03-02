import os

import firebase_admin
from firebase_admin import auth, credentials

_firebase_initialized = False


def initialize_firebase():
    global _firebase_initialized

    if _firebase_initialized:
        print('Firebase is already initialized.')
        return

    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase-credentials.json')
    print(f'Credential path: {cred_path}')

    try:
        cred = credentials.Certificate(cred_path)
        print('Credential loaded successfully.')

        firebase_admin.initialize_app(cred)
        print('Firebase Admin SDK initialized successfully.')

        _firebase_initialized = True

    except Exception as e:
        print(f'Error initializing Firebase Admin SDK: {e}')
        raise


def verify_firebase_token(id_token: str) -> dict:
    try:
        decoded_token = auth.verify_id_token(id_token)
        print(f'JWT verification successful: uid={decoded_token.get("uid")}')
        return decoded_token
    except Exception as e:
        print(f'JWT verification failed: {e}')
        raise
