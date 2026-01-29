## 1. リソース一覧

| リソース名 | 説明 |
| --- | --- |
| /api/learners | ラーナー（ユーザー） |
| /api/skills | 技術 |
| /api/logs | 学習ログ |
| /api/learner_skills | ラーナーの学習技術 |
| /api/likes | いいね |
| /api/images | 画像 |

---

## 2. エンドポイント一覧

| No. | HTTP | エンドポイント | 説明 | 認証 | 補足 |
| --- | --- | --- | --- | --- | --- |
| 001 | GET | /api/roles | ロールを取得 | 不要 |  |
| 002 | GET | /api/skills | 技術を取得する | 不要 |  |
| 003 | POST | /api/learners | プロフィールを作成（初回登録） | 必要 |  |
| 004 | GET | /api/learners/me | 自分のプロフィールを取得 | 必要 |  |
| 005 | PUT | /api/learners/me | 自分のプロフィールを更新 | 必要 |  |
| 006 | DELETE | /api/learners/me | 自分のプロフィールを削除 | 必要 | 論理削除 |
| 007 | GET | /api/learners | ラーナーの一覧を取得 | 不要 |  |
| 008 | GET | /api/learners/:id | 特定のラーナーのプロフィールを取得 | 不要 |  |
| 009 | GET | /api/learners/:id/logs | 特定のラーナーのログを取得 | 不要 | 他人のプロフィール画面に表示 |
| 010 | GET | /api/logs | ログを取得 | 不要 |  |
| 011 | GET | /api/learners/me/logs | 自分のログを取得 | 必要 |  |
| 012 | GET | /api/logs/:id | 特定のログを取得 | 不要 |  |
| 013 | POST | /api/logs | ログを作成 | 必要 |  |
| 014 | PUT | /api/logs/:id | 特定のログを更新 | 必要 |  |
| 015 | DELETE | /api/logs/:id | 特定のログを削除 | 必要 | 論理削除 |
| 016 | GET | /api/logs/:log_id/likes |  ログのいいね数を取得 | 不要 |  |
| 017 | GET | /api/learners/me/skills | 自分の学習技術を取得 | 必要 |  |
| 018 | POST | /api/learners/me/skills | 自分の学習技術を作成 | 必要 |  |
| 019 | DELETE | /api/learners/me/skills/:skill_id | 自分の特定の学習技術を削除 | 必要 | 物理削除
learner_skills は
learner_id + skill_id を一意制約とし、
同一スキルの複数登録は不可とする |
| 020 | POST | /api/logs/:log_id/likes | 特定のログにいいねをする | 必要 |  |
| 021 | DELETE | /api/logs/:log_id/likes | いいねを取り消し（削除） | 必要 | 物理削除
バックエンドで認証トークンから`learner_id`を取得し、該当レコードを削除する |
| 022 | POST | /api/logs/:log_id/images | 画像を添付する | 必要 |  |
| 023 | DELETE | /api/logs/:log_id/images/:image_id | 画像を削除する | 必要 |  |

---

## 3. リクエスト・レスポンス形式

---

## 3-001. ロールを取得する(GET)

### エンドポイント

```
GET /api/roles
```

### リクエスト

認証：不要

```
なし
```

### レスポンス（200 OK）

```json
[
    { "id": 1, "role_name": "Builder" },
    { "id": 2, "role_name": "Beginner" }
]
```

---

## 3-002. 技術を取得する(GET)

### エンドポイント

```
GET /api/skills
```

### リクエスト

認証：不要

```json
なし
```

### レスポンス(200 OK)

```json
[
      { "id": 1, "skill_name": "TypeScript" },
      { "id": 2, "skill_name": "JavaScript" },
      { "id": 3, "skill_name": "Next.js"},
      { "id": 4, "skill_name": "React.js"},
      { "id": 5, "skill_name": "Vue.js"}
]
```

---

## 3-003. プロフィールを作成(POST)

### エンドポイント

```
POST /api/learners
```

### リクエスト

- ヘッダー

```json
Authorization: Bearer <Firebase ID Token>
Content-Type: application/json
```

- ボディ

```json

{
    "name": "eriko",
    "introduction": "Next.jsを勉強中です！よろしくお願いします。",
    "role_id": 1,  
    "skill_ids": [1, 3, 4]  // ← TypeScript, Next.js, React.js
}
```

### レスポンス(201 Created)

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase-uid-xyz123",
    "name": "eriko",
    "bio": "Reactを勉強中です！よろしくお願いします。",
    "role": {
      "id": 1,
      "role_name": "Beginner"
    },
    "skills": [
      { "id": 1, "skill_name": "TypeScript" },
      { "id": 3, "skill_name": "Next.js" },
      { "id": 4, "skill_name": "React.js" }
    ],
    "created_at": "2026-01-28T15:30:45Z",
    "updated_at": "2026-01-28T15:30:45Z"
}
```

### エラーレスポンス

- バリデーションエラー(400 Bad Request)

```json
{
    "error": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "名前は1〜100文字で設定してください"
      },
      {
        "field": "role_id",
        "message": "Invalid role_id"
      }
    ]
}
```

- 認証エラー(401 Unauthorized)

```json
{
    "error": "Unauthorized",
    "message": "Invalid or missing authentication token"
}
```

- 既存プロフィール存在（409 Conflict）

```json
{
    "error": "Profile already exists",
    "message": "このアカウントは既にプロフィールを作成しています"
}
```

---

## 3-004.  自分のプロフィールを取得(GET)

### リクエスト

```
GET /api/learners/me
```

- ヘッダー

```json
Authorization: Bearer <Firebase ID Token>
```

- ボディ

```json
なし
```

### レスポンス(200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firebase_uid": "firebase-uid-xyz123",
  "name": "eriko",
  "introduction": "Next.jsを勉強しています！自分のログが助けになれば嬉しいです。",
  "role": {
    "id": 1,
    "role_name": "Beginner"
  },
  "skills": [
    { "id": 1, "skill_name": "TypeScript" },
    { "id": 3, "skill_name": "Next.js" },
    { "id": 4, "skill_name": "React.js" }
  ]
}
```

### エラーレスポンス

- 認証エラー(401 Unauthorized)

```json
{
    "error": "Unauthorized",
    "message": "認証に失敗しました"
}
```

- プロフィール未作成（404 Not Found）

```json
{
    "error": "Profile not found",
    "message": "プロフィールが作成されていません"
}
```

---

## 3-005. 自分のプロフィールを更新(PUT)

### リクエスト

```
PUT /api/learners/me
```

- ヘッダー

```json
Authorization: Bearer <Firebase ID Token>
Content-Type: application/json
```

- ボディ

```json
{
    "introduction":"Next.jsを勉強しています！自分のログが助けになれば嬉しいです。"
}
```

### レスポンス

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase-uid-xyz123",
    "name": "eriko",
    "introduction": "Next.jsを勉強しています！自分のログが助けになれば嬉しいです。",
    "role": {
      "id": 1,
      "role_name": "Beginner"
    },
    "skills": [
      { "id": 1, "skill_name": "TypeScript" },
      { "id": 3, "skill_name": "Next.js" },
      { "id": 4, "skill_name": "React.js" }
    ],
    "created_at": "2026-01-28T15:30:45Z",
    "updated_at": "2026-01-29T10:20:30Z"  
}
```

### エラーレスポンス

- バリデーションエラー(400 Bad Request)

```json
}  
    "error": "Validation failed",
    "message": "入力内容に誤りがあります",
    "details": [
      {
        "field": "introduction",
        "message": "自己紹介は500文字以内で入力してください"
      }
    ]
}
```

- 認証エラー(401 Unauthorized)

```json
{
    "error": "Unauthorized",
    "message": "認証に失敗しました
}
```

- プロフィール未作成（404 Not Found）

```json
{
    "error": "Profile not found",
    "message": "プロフィールが見つかりません"
}
```

---

## 3-006. 自分のプロフィールを削除(DELETE)

### エンドポイント

```
DELETE api/learners/me
```

### リクエスト(204 No Content)

- ヘッダー

```json
Authorization: Bearer <Firebase ID Token>
```

- ボディ

```json
なし
```

### レスポンス

```json
なし
```

### エラーレスポンス

- 認証エラー(401 Unauthorized)

```json
{
    "error": "Unauthorized",
    "message": "認証に失敗しました
}
```

- プロフィール未作成（404 Not Found）

```json
{
    "error": "Profile not found",
    "message": "プロフィールが見つかりません"
}
```

---

## 4. HTTPステータスコード一覧

| コード | 名称 | 意味 |
| --- | --- | --- |
| 200 | OK | 取得・更新成功 |
| 201 | Created | 作成成功 |
| 204 | No Content | 削除成功（ボディなし） |
| 400 | Bad Request | リクエストが不正（バリデーションエラー） |
| 401 | Unauthorized | 認証エラー（ログインしていない） |
| 403 | Forbidden | 権限エラー（ログイン済みだが権限なし） |
| 404 | Not Found | リソースが存在しない |
| 409 | Conflict | 重複エラー（既に存在する） |
| 500 | Internal Server Error | サーバーエラー |