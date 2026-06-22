from __future__ import annotations

from scrapers.base import BaseArticleScraper, SourceConfig
from utils.filters import is_supported_detik_url
from utils.http import HttpClient


DETIK_CONFIG = SourceConfig(
    name="Detik.com",
    base_url="https://www.detik.com/",
    title_selectors=["h1.detail__title", "h1"],
    date_selectors=[".detail__date", "time"],
    author_selectors=[".detail__author", ".author"],
    content_selectors=[".detail__body-text", "article"],
    remove_selectors=[".detail__body-tag", ".parallaxindetail"],
)


class DetikScraper(BaseArticleScraper):
    def __init__(self, client: HttpClient | None = None) -> None:
        super().__init__(config=DETIK_CONFIG, client=client)

    def parse_article(self, url: str) -> dict | None:
        if not is_supported_detik_url(url):
            return None
        return super().parse_article(url)
