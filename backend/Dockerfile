FROM python:3.11

WORKDIR /code

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコピー
COPY ./app /code/app

# ポート8000を公開
EXPOSE 8000

# サーバー起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]