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


def is_supported_kompas_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and parsed.netloc.lower() in KOMPAS_DOMAINS
