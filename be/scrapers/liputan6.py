from __future__ import annotations

from scrapers.base import BaseArticleScraper, SourceConfig
from utils.filters import is_supported_liputan6_url
from utils.http import HttpClient


LIPUTAN6_CONFIG = SourceConfig(
    name="Liputan6.com",
    base_url="https://www.liputan6.com/",
    title_selectors=[
        "h1",
        ".read-page--header--title",
        ".article-header h1",
    ],
    date_selectors=[
        "time",
        ".read-page--header--date",
        ".article-header .date",
        ".date",
    ],
    author_selectors=[
        ".read-page--header--author",
        ".article-header .author",
        ".author",
        "[rel='author']",
    ],
    content_selectors=[
        ".article-content-body__item-content",
        ".read-page--article-content-body",
        ".article-content-body",
        "article",
    ],
    remove_selectors=[
        ".read-page--related",
        ".baca-juga",
        ".ads",
        ".advertisement",
        ".share",
    ],
)


class Liputan6Scraper(BaseArticleScraper):
    def __init__(self, client: HttpClient | None = None) -> None:
        super().__init__(config=LIPUTAN6_CONFIG, client=client)

    def parse_article(self, url: str) -> dict | None:
        if not is_supported_liputan6_url(url):
            return None
        return super().parse_article(url)
