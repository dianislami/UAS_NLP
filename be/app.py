from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from predict import summarize_article
from scrapers.kompas import scrape_kompas_article
from utils.filters import is_supported_kompas_url


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleRequest(BaseModel):
    article: str


class ScrapeRequest(BaseModel):
    url: str


@app.post("/scrape")
def scrape_article(request: ScrapeRequest):
    if not is_supported_kompas_url(request.url):
        return {
            "success": False,
            "message": "Saat ini hanya mendukung URL Kompas.com"
        }

    article = scrape_kompas_article(request.url)
    if not article:
        return {
            "success": False,
            "message": "Artikel gagal diambil. Pastikan URL Kompas valid dan dapat diakses."
        }

    return {
        "success": True,
        "data": article
    }


@app.post("/summarize")
def summarize(request: ArticleRequest):
    try:
        return summarize_article(request.article)
    except OSError as exc:
        raise HTTPException(
            status_code=503,
            detail="Model summarization belum tersedia. Pastikan file model sudah ada di indobert_disaster_summarizer."
        ) from exc
