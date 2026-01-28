from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import os 
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS設定
def get_cors_origins() -> list[str]:
    origins =  os.getenv('CORS_ORIGINS','[http://localhost:3000]')
    try:
        return json.loads(origins)
    except json.JSONDecodeError:
        logger.warning('Invalid CORS_ORIGINS format. Fallback to localhost.')
        return ['http://localhost:3000']
    
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('🚀 Application starting...')    

# FastAPI アプリケーション本体
app = FastAPI(title='Logy API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
    )

# ヘルスチェック
@app.get('/')
def read_root():
    return {
        'status: ok',
        'message: API is running'
        }