from __future__ import annotations

from scrapers.base import BaseArticleScraper
from scrapers.detik import DetikScraper
from scrapers.kompas import KompasScraper
from scrapers.liputan6 import Liputan6Scraper
from utils.filters import (
    is_supported_detik_url,
    is_supported_kompas_url,
    is_supported_liputan6_url,
)


def get_scraper_for_url(url: str) -> BaseArticleScraper | None:
    if is_supported_kompas_url(url):
        return KompasScraper()
    if is_supported_liputan6_url(url):
        return Liputan6Scraper()
    if is_supported_detik_url(url):
        return DetikScraper()
    return None
