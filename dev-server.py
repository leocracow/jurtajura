#!/usr/bin/env python3
"""Serwer deweloperski — odwzorowuje reguły adresów z .htaccess.

Tylko do podglądu lokalnego; NIE wgrywać na produkcję.
Uruchomienie: python3 dev-server.py [port]
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

# Strony, których adres różni się od nazwy pliku (sekcja 2 .htaccess)
ALIASES = {
    "/atrakcje-w-okolicy-jurty": "/okolica.html",
    "/galeria-jurta-jura": "/galeria.html",
    "/kontakt-jak-nas-znalezc": "/kontakt.html",
    "/wyposazenie-jurty-jurta-jura": "/wyposazenie.html",
}


class Handler(SimpleHTTPRequestHandler):
    def translate_request(self, path):
        clean = urlsplit(path).path.rstrip("/") or "/"
        if clean == "/":
            return "/index.html"
        if clean in ("/en", "/de", "/uk"):
            return clean + "/index.html"
        if clean in ALIASES:
            return ALIASES[clean]
        if not clean.endswith(".html") and "." not in clean.rsplit("/", 1)[-1]:
            return clean + ".html"
        return path

    def do_GET(self):
        self.path = self.translate_request(self.path) + (
            "?" + urlsplit(self.path).query if urlsplit(self.path).query else ""
        )
        super().do_GET()


if __name__ == "__main__":
    import os
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8471))
    print(f"Serwer: http://localhost:{port}")
    ThreadingHTTPServer(("", port), Handler).serve_forever()
