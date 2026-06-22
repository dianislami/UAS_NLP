from urllib.parse import urlparse


KOMPAS_DOMAINS = {
    "www.kompas.com",
    "regional.kompas.com",
    "nasional.kompas.com",
    "megapolitan.kompas.com",
    "surabaya.kompas.com",
    "bandung.kompas.com",
    "medan.kompas.com",
    "makassar.kompas.com",
    "lestari.kompas.com",
}

LIPUTAN6_DOMAINS = {
    "www.liputan6.com",
    "m.liputan6.com",
}

DETIK_DOMAINS = {
    "www.detik.com",
    "detik.com",
    "news.detik.com",
}


def is_supported_kompas_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and parsed.netloc.lower() in KOMPAS_DOMAINS


def is_supported_liputan6_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and parsed.netloc.lower() in LIPUTAN6_DOMAINS


def is_supported_detik_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and parsed.netloc.lower() in DETIK_DOMAINS
