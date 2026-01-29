## テーブル1：rolesテーブル

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id  | INT PK | AUTO_INCREMENT | ロール ID |
| role_name | VARCHER(100) | NOT NULL UNIQUE | ロール (現状BeginnerまたはBuilder) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | テーブルの作成日 |

## テーブル2：learnersテーブル

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | UUID PK |  | Learner ID |
| firebase_uid | VARCHER（128） | UNIQUE NOT NULL | Firebase認証ID |
| name | VARCHER(100) | NOT NULL | 名前 |
| introduction | TEXT | NULL | 自己紹介 |
| role_id | INT FK | NOT NULL |  |
| created_at | DATETIME  | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at  | DATETIME  | DEFAULT CURRENT_TIMESTAMP | 更新日時 |
| deleted_at  | DATETIME  | NULL | 削除日時 |

## テーブル3：skillsテーブル

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id  | INT PK | AUTO_INCREMENT | スキル ID |
| skill_name | VARCHER(100) | NOT NULL UNIQUE | 技術名（TypeScriptなど） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | テーブルの作成日 |

## テーブル4：logsテーブル

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | UUID PK |  | ログID |
| learner_id | UUID  FK | NOT NULL  | Learner ID |
| title | VARCHER(100) | NOT NULL  | タイトル |
| contents | TEXT | NOT NULL  | コンテンツ |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| deleted_at  | DATETIME  |  NULL | 削除日時 |
| updated_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

## テーブル5：learner_skillsテーブル

*UNIQUE (learner_id, skill_id)

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | UUID PK |  | Learner＿skill ID |
| learner_id | UUID  FK | NOT NULL UNIQUE | Learner ID |
| skill_id | INT FK | NOT NULL UNIQUE | スキルID |
| created_at  | DATETIME  | DEFAULT CURRENT_TIMESTAMP | 作成日 |

## テーブル6：likesテーブル

*いいね数は **COUNT(likes)** で算出
*UNIQUE (learner_id, log_id)

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | INT PK |  | いいね ID |
| learner_id | UUID FK | NOT NULL  | いいねした人のLearner ID |
| log_id | UUID FK | NOT NULL  | スキルID |
| created_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日 |

## テーブル7：imagesテーブル

| カラム | 型 | 制約 | 説明 |
| --- | --- | --- | --- |
| id | UUID PK |  | 画像ID |
| log_id | UUID FK | NOT NULL  | スキルID |
| image_url | TEXT | NOT NULL | Firebase Storageのdownload URL |
| image_storage_path | TEXT | NOT NULL | Firebase Storageのパス |
| created_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日 |