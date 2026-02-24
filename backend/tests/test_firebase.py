"""
app/core/firebase.py のテスト

対象関数:
  - initialize_firebase(): Firebase Admin SDK を初期化する
  - verify_firebase_token(id_token): JWT トークンを検証して decoded_token を返す
"""

import os
from unittest.mock import MagicMock, patch

import pytest

# ---------------------------------------------------------------------------
# フィクスチャ
# ---------------------------------------------------------------------------


@pytest.fixture(autouse=True)
def reset_firebase_state():
    """各テスト前後に _firebase_initialized フラグをリセットする。"""
    import app.core.firebase as m

    m._firebase_initialized = False
    yield
    m._firebase_initialized = False


# ---------------------------------------------------------------------------
# initialize_firebase() のテスト
# ---------------------------------------------------------------------------


class TestInitializeFirebase:
    # ===== 正常系 =====

    @patch('app.core.firebase.firebase_admin')
    @patch('app.core.firebase.credentials.Certificate')
    def test_first_call_succeeds(self, mock_cert, mock_firebase_admin):
        """正常系: 初回呼び出しで初期化が成功する。"""
        from app.core.firebase import initialize_firebase

        initialize_firebase()

        mock_cert.assert_called_once()
        mock_firebase_admin.initialize_app.assert_called_once()

    def test_sets_initialized_flag_on_success(self):
        """正常系: 初期化成功後に _firebase_initialized が True になる。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        with patch('app.core.firebase.credentials.Certificate'):
            with patch('app.core.firebase.firebase_admin'):
                assert m._firebase_initialized is False
                initialize_firebase()
                assert m._firebase_initialized is True

    @patch('app.core.firebase.credentials.Certificate')
    def test_uses_default_credential_path(self, mock_cert):
        """正常系: FIREBASE_CREDENTIALS_PATH 未設定時は、
        'firebase-credentials.json' を使用する。"""
        from app.core.firebase import initialize_firebase

        env = {k: v for k, v in os.environ.items() if k != 'FIREBASE_CREDENTIALS_PATH'}
        with patch('app.core.firebase.firebase_admin'):
            with patch.dict(os.environ, env, clear=True):
                initialize_firebase()

        mock_cert.assert_called_once_with('firebase-credentials.json')

    @patch('app.core.firebase.credentials.Certificate')
    def test_uses_env_var_credential_path(self, mock_cert):
        """正常系: FIREBASE_CREDENTIALS_PATH が設定されている場合はその値を使用する。"""
        from app.core.firebase import initialize_firebase

        with patch('app.core.firebase.firebase_admin'):
            with patch.dict(
                os.environ, {'FIREBASE_CREDENTIALS_PATH': '/secrets/sa.json'}
            ):
                initialize_firebase()

        mock_cert.assert_called_once_with('/secrets/sa.json')

    @patch('app.core.firebase.firebase_admin')
    @patch('app.core.firebase.credentials.Certificate')
    def test_initialize_app_called_with_certificate(
        self, mock_cert, mock_firebase_admin
    ):
        """正常系: credentials.Certificate の戻り値で initialize_app が呼ばれる。"""
        from app.core.firebase import initialize_firebase

        fake_cred = MagicMock()
        mock_cert.return_value = fake_cred

        initialize_firebase()

        mock_firebase_admin.initialize_app.assert_called_once_with(fake_cred)

    # ===== 境界値 =====

    @patch('app.core.firebase.firebase_admin')
    @patch('app.core.firebase.credentials.Certificate')
    def test_already_initialized_skips_reinitialization(
        self, mock_cert, mock_firebase_admin
    ):
        """境界値: _firebase_initialized が True の場合は再初期化しない。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        m._firebase_initialized = True
        initialize_firebase()

        mock_cert.assert_not_called()
        mock_firebase_admin.initialize_app.assert_not_called()

    @patch('app.core.firebase.firebase_admin')
    @patch('app.core.firebase.credentials.Certificate')
    def test_double_call_initializes_only_once(self, mock_cert, mock_firebase_admin):
        """境界値: 2 回連続で呼び出しても初期化は 1 回だけ実行される。"""
        from app.core.firebase import initialize_firebase

        initialize_firebase()
        initialize_firebase()

        assert mock_cert.call_count == 1
        assert mock_firebase_admin.initialize_app.call_count == 1

    @patch('app.core.firebase.credentials.Certificate')
    def test_empty_string_credential_path(self, mock_cert):
        """境界値: FIREBASE_CREDENTIALS_PATH が空文字列の場合もそのまま渡す。"""
        from app.core.firebase import initialize_firebase

        with patch('app.core.firebase.firebase_admin'):
            with patch.dict(os.environ, {'FIREBASE_CREDENTIALS_PATH': ''}):
                initialize_firebase()

        mock_cert.assert_called_once_with('')

    # ===== 異常系 =====

    @patch('app.core.firebase.credentials.Certificate')
    def test_certificate_file_not_found_propagates(self, mock_cert):
        """異常系: 認証情報ファイルが存在しない場合に例外が伝播する。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        mock_cert.side_effect = FileNotFoundError('firebase-credentials.json not found')

        with pytest.raises(
            FileNotFoundError, match='firebase-credentials.json not found'
        ):
            initialize_firebase()

        assert m._firebase_initialized is False

    @patch('app.core.firebase.firebase_admin')
    def test_initialize_app_failure_propagates(self, mock_firebase_admin):
        """異常系: firebase_admin.initialize_app が失敗した場合に例外が伝播する。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        with patch('app.core.firebase.credentials.Certificate'):
            mock_firebase_admin.initialize_app.side_effect = RuntimeError(
                'App init failed'
            )

            with pytest.raises(RuntimeError, match='App init failed'):
                initialize_firebase()

        assert m._firebase_initialized is False

    @patch('app.core.firebase.credentials.Certificate')
    def test_invalid_credential_format_propagates(self, mock_cert):
        """異常系: 認証情報ファイルのフォーマットが不正な場合に例外が伝播する。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        mock_cert.side_effect = ValueError('Invalid credential format')

        with pytest.raises(ValueError, match='Invalid credential format'):
            initialize_firebase()

        assert m._firebase_initialized is False

    @patch('app.core.firebase.credentials.Certificate')
    def test_io_error_on_credential_load_propagates(self, mock_cert):
        """異常系: 認証情報ファイルの読み取り時の IOError が伝播する。"""
        from app.core.firebase import initialize_firebase

        mock_cert.side_effect = OSError('Permission denied')

        with pytest.raises(IOError, match='Permission denied'):
            initialize_firebase()

    @patch('app.core.firebase.credentials.Certificate')
    def test_initialized_flag_stays_false_on_failure(self, mock_cert):
        """異常系: 初期化が失敗しても _firebase_initialized は False のまま。"""
        import app.core.firebase as m
        from app.core.firebase import initialize_firebase

        mock_cert.side_effect = RuntimeError('Unexpected error')

        with pytest.raises(RuntimeError):
            initialize_firebase()

        assert m._firebase_initialized is False


# ---------------------------------------------------------------------------
# verify_firebase_token() のテスト
# ---------------------------------------------------------------------------


class TestVerifyFirebaseToken:
    # ===== 正常系 =====

    @patch('app.core.firebase.auth')
    def test_valid_token_returns_decoded_token(self, mock_auth):
        """正常系: 有効なトークンで decoded_token を返す。"""
        from app.core.firebase import verify_firebase_token

        expected = {'uid': 'user_abc123', 'email': 'user@example.com'}
        mock_auth.verify_id_token.return_value = expected

        result = verify_firebase_token('valid.jwt.token')

        assert result == expected

    @patch('app.core.firebase.auth')
    def test_calls_auth_verify_with_token(self, mock_auth):
        """正常系: auth.verify_id_token が渡したトークンで呼ばれる。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.return_value = {'uid': 'uid_xyz'}

        verify_firebase_token('my.test.token')

        mock_auth.verify_id_token.assert_called_once_with('my.test.token')

    @patch('app.core.firebase.auth')
    def test_returns_all_claims_from_decoded_token(self, mock_auth):
        """正常系: decoded_token の全クレームをそのまま返す。"""
        from app.core.firebase import verify_firebase_token

        claims = {
            'uid': 'uid_001',
            'email': 'a@b.com',
            'email_verified': True,
            'name': 'Test User',
            'iat': 1700000000,
            'exp': 1700003600,
        }
        mock_auth.verify_id_token.return_value = claims

        result = verify_firebase_token('token_with_all_claims')

        assert result == claims

    # ===== 境界値 =====

    @patch('app.core.firebase.auth')
    def test_token_with_only_uid(self, mock_auth):
        """境界値: uid のみを含む最小限のペイロードのトークン。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.return_value = {'uid': 'minimal_uid'}

        result = verify_firebase_token('minimal.token')

        assert result['uid'] == 'minimal_uid'

    @patch('app.core.firebase.auth')
    def test_empty_string_token_raises(self, mock_auth):
        """境界値: 空文字列トークンで例外が送出される。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = ValueError('Token must not be empty')

        with pytest.raises(ValueError):
            verify_firebase_token('')

    @patch('app.core.firebase.auth')
    def test_none_token_raises(self, mock_auth):
        """境界値: None トークンで例外が送出される。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = TypeError('Token must be a string')

        with pytest.raises(TypeError):
            verify_firebase_token(None)

    @patch('app.core.firebase.auth')
    def test_very_long_token_is_passed_through(self, mock_auth):
        """境界値: 非常に長いトークン文字列をそのまま auth に渡す。"""
        from app.core.firebase import verify_firebase_token

        long_token = 'a' * 2048
        mock_auth.verify_id_token.return_value = {'uid': 'uid_long'}

        verify_firebase_token(long_token)

        mock_auth.verify_id_token.assert_called_once_with(long_token)

    # ===== 異常系 =====

    @patch('app.core.firebase.auth')
    def test_invalid_token_raises(self, mock_auth):
        """異常系: 不正なトークンで InvalidIdTokenError が伝播する。"""
        from firebase_admin.auth import InvalidIdTokenError

        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = InvalidIdTokenError('Invalid token')

        with pytest.raises(InvalidIdTokenError):
            verify_firebase_token('invalid.token.here')

    @patch('app.core.firebase.auth')
    def test_expired_token_raises(self, mock_auth):
        """異常系: 期限切れトークンで ExpiredIdTokenError が伝播する。"""
        from firebase_admin.auth import ExpiredIdTokenError

        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = ExpiredIdTokenError(
            'Token has expired', None
        )

        with pytest.raises(ExpiredIdTokenError):
            verify_firebase_token('expired.jwt.token')

    @patch('app.core.firebase.auth')
    def test_revoked_token_raises(self, mock_auth):
        """異常系: 失効済みトークンで RevokedIdTokenError が伝播する。"""
        from firebase_admin.auth import RevokedIdTokenError

        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = RevokedIdTokenError(
            'Token has been revoked'
        )

        with pytest.raises(RevokedIdTokenError):
            verify_firebase_token('revoked.jwt.token')

    @patch('app.core.firebase.auth')
    def test_malformed_token_raises(self, mock_auth):
        """異常系: JWT フォーマットが不正なトークンで ValueError が伝播する。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = ValueError('Failed to decode token')

        with pytest.raises(ValueError):
            verify_firebase_token('not-a-real-jwt')

    @patch('app.core.firebase.auth')
    def test_network_error_propagates(self, mock_auth):
        """異常系: ネットワークエラー時に例外が伝播する。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = ConnectionError('Network unreachable')

        with pytest.raises(ConnectionError):
            verify_firebase_token('valid.looking.token')

    @patch('app.core.firebase.auth')
    def test_unexpected_exception_propagates(self, mock_auth):
        """異常系: 想定外の例外も re-raise される。"""
        from app.core.firebase import verify_firebase_token

        mock_auth.verify_id_token.side_effect = RuntimeError('Unexpected error')

        with pytest.raises(RuntimeError, match='Unexpected error'):
            verify_firebase_token('some.token')
