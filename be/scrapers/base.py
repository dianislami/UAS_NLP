from __future__ import annotations

import json
from dataclasses import dataclass, field
from urllib.parse import urlparse

from bs4 import BeautifulSoup
from dateutil import parser as date_parser

from utils.http import HttpClient
from utils.text import clean_text


@dataclass(frozen=True)
class SourceConfig:
    name: str
    base_url: str
    title_selectors: list[str] = field(default_factory=list)
    date_selectors: list[str] = field(default_factory=list)
    author_selectors: list[str] = field(default_factory=list)
    content_selectors: list[str] = field(default_factory=list)
    remove_selectors: list[str] = field(default_factory=list)


class BaseArticleScraper:
    def __init__(self, config: SourceConfig, client: HttpClient | None = None) -> None:
        self.config = config
        self.client = client or HttpClient()

    def parse_article(self, url: str) -> dict | None:
        if not self.client.can_fetch(url):
            return None

        html = self.client.get(url)
        if not html:
            return None

        soup = BeautifulSoup(html, "lxml")
        self._remove_noise(soup)

        title = self._extract_title(soup)
        content = self._extract_content(soup)
        if not title or not content:
            return None

        return {
            "title": title,
            "url": self._canonical_url(soup, url),
            "source": self.config.name,
            "published_date": self._extract_date(soup),
            "author": self._extract_author(soup),
            "content": content,
        }

    def _remove_noise(self, soup: BeautifulSoup) -> None:
        selectors = [
            "script",
            "style",
            "noscript",
            "iframe",
            "form",
            "nav",
            "footer",
            ".ads",
            ".advertisement",
            ".related",
            ".tag",
            ".share",
            *self.config.remove_selectors,
        ]
        for selector in selectors:
            for element in soup.select(selector):
                element.decompose()

    def _extract_title(self, soup: BeautifulSoup) -> str:
        for selector in self.config.title_selectors:
            element = soup.select_one(selector)
            if element:
                text = clean_text(element.get_text(" "))
                if text:
                    return text
        meta = soup.select_one("meta[property='og:title'], meta[name='twitter:title']")
        return clean_text(meta.get("content", "")) if meta else ""

    def _extract_content(self, soup: BeautifulSoup) -> str:
        paragraphs: list[str] = []
        for selector in self.config.content_selectors:
            container = soup.select_one(selector)
            if not container:
                continue
            for paragraph in container.find_all(["p", "li"]):
                text = clean_text(paragraph.get_text(" "))
                if self._is_useful_paragraph(text):
                    paragraphs.append(text)
            if paragraphs:
                return clean_text(" ".join(paragraphs))

        for paragraph in soup.find_all("p"):
            text = clean_text(paragraph.get_text(" "))
            if self._is_useful_paragraph(text):
                paragraphs.append(text)
        return clean_text(" ".join(paragraphs))

    def _extract_date(self, soup: BeautifulSoup) -> str:
        candidates: list[str] = []
        meta_selectors = [
            "meta[property='article:published_time']",
            "meta[name='pubdate']",
            "meta[name='publishdate']",
            "meta[name='date']",
        ]
        for selector in meta_selectors:
            meta = soup.select_one(selector)
            if meta and meta.get("content"):
                candidates.append(meta["content"])

        for selector in self.config.date_selectors:
            element = soup.select_one(selector)
            if element:
                candidates.append(element.get("datetime") or element.get_text(" "))

        json_ld_date = self._extract_json_ld_field(soup, "datePublished")
        if json_ld_date:
            candidates.append(json_ld_date)

        for candidate in candidates:
            parsed = self._parse_date(candidate)
            if parsed:
                return parsed
        return ""

    def _extract_author(self, soup: BeautifulSoup) -> str:
        meta = soup.select_one("meta[name='author'], meta[property='article:author']")
        if meta and meta.get("content"):
            return clean_text(meta["content"])

        for selector in self.config.author_selectors:
            element = soup.select_one(selector)
            if element:
                author = clean_text(element.get_text(" "))
                if author:
                    return author

        return clean_text(self._extract_json_ld_author(soup))

    def _extract_json_ld_field(self, soup: BeautifulSoup, field: str) -> str:
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "{}")
            except json.JSONDecodeError:
                continue
            for item in self._flatten_json_ld(data):
                value = item.get(field)
                if isinstance(value, str):
                    return value
        return ""

    def _extract_json_ld_author(self, soup: BeautifulSoup) -> str:
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "{}")
            except json.JSONDecodeError:
                continue
            for item in self._flatten_json_ld(data):
                author = item.get("author")
                if isinstance(author, dict):
                    return str(author.get("name", ""))
                if isinstance(author, list) and author:
                    first = author[0]
                    if isinstance(first, dict):
                        return str(first.get("name", ""))
                if isinstance(author, str):
                    return author
        return ""

    def _flatten_json_ld(self, data: object) -> list[dict]:
        if isinstance(data, dict):
            graph = data.get("@graph")
            if isinstance(graph, list):
                return [item for item in graph if isinstance(item, dict)] + [data]
            return [data]
        if isinstance(data, list):
            return [item for item in data if isinstance(item, dict)]
        return []

    def _parse_date(self, raw_date: str) -> str:
        cleaned = clean_text(raw_date)
        if not cleaned:
            return ""
        try:
            return date_parser.parse(cleaned, fuzzy=True).isoformat()
        except (ValueError, TypeError, OverflowError):
            return cleaned

    def _is_useful_paragraph(self, text: str) -> bool:
        lowered = text.casefold()
        blocked = [
            "baca juga",
            "simak juga",
            "download aplikasi",
            "ikuti berita",
            "copyright",
            "editor:",
            "penulis:",
        ]
        return len(text) >= 40 and not any(item in lowered for item in blocked)

    def _canonical_url(self, soup: BeautifulSoup, fallback_url: str) -> str:
        canonical = soup.select_one("link[rel='canonical']")
        if canonical and canonical.get("href"):
            href = str(canonical["href"])
            parsed = urlparse(href)
            if parsed.scheme in {"http", "https"} and parsed.netloc:
                return href
        return fallback_url
