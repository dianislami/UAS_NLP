from __future__ import annotations

from scrapers.base import BaseArticleScraper, SourceConfig
from utils.filters import is_supported_kompas_url
from utils.http import HttpClient


KOMPAS_CONFIG = SourceConfig(
    name="Kompas.com",
    base_url="https://www.kompas.com/",
    title_selectors=["h1.read__title", "h1", ".read__title"],
    date_selectors=[".read__time", "time"],
    author_selectors=[".read__author", ".credit-title-name", ".author"],
    content_selectors=[".read__content", "article"],
    remove_selectors=[".read__credit", ".ads-on-paragraph"],
)


class KompasScraper(BaseArticleScraper):
    def __init__(self, client: HttpClient | None = None) -> None:
        super().__init__(config=KOMPAS_CONFIG, client=client)

    def parse_article(self, url: str) -> dict | None:
        if not is_supported_kompas_url(url):
            return None
        return super().parse_article(url)


def scrape_kompas_article(url: str) -> dict | None:
    return KompasScraper().parse_article(url)
