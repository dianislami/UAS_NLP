from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from predict import summarize_article
from scrapers.router import get_scraper_for_url


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
    scraper = get_scraper_for_url(request.url)
    if not scraper:
        return {
            "success": False,
            "message": "Saat ini hanya mendukung Kompas, Liputan6, dan Detik."
        }

    article = scraper.parse_article(request.url)
    if not article:
        return {
            "success": False,
            "message": "Artikel gagal diambil. Pastikan URL valid dan dapat diakses."
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
