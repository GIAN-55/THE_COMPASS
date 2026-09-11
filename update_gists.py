#!/usr/bin/env python3
"""
Actualiza los Gists secretos (Manual + Indicaciones) desde tus archivos locales.
Uso: python update_gists.py
Requiere las variables de entorno GITHUB_GIST_TOKEN, MANUAL_GIST_ID, INDICACIONES_GIST_ID.
"""
import os
import sys
import requests

TOKEN = os.environ.get("GITHUB_GIST_TOKEN")
MANUAL_GIST_ID = os.environ.get("MANUAL_GIST_ID")
INDICACIONES_GIST_ID = os.environ.get("INDICACIONES_GIST_ID")

MANUAL_LOCAL_PATH = "MANUAL_DE_MI_FILOSOFÍA.md"
INDICACIONES_LOCAL_PATH = "indicaciones.md"

API_URL = "https://api.github.com/gists/{gist_id}"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
}


def update_gist(gist_id: str, local_path: str, filename_in_gist: str) -> None:
    with open(local_path, "r", encoding="utf-8") as f:
        content = f.read()

    payload = {"files": {filename_in_gist: {"content": content}}}
    response = requests.patch(
        API_URL.format(gist_id=gist_id), headers=HEADERS, json=payload
    )
    response.raise_for_status()
    print(f"Actualizado: {filename_in_gist} -> gist {gist_id}")


def main() -> None:
    if not all([TOKEN, MANUAL_GIST_ID, INDICACIONES_GIST_ID]):
        sys.exit(
            "Faltan variables de entorno: GITHUB_GIST_TOKEN, MANUAL_GIST_ID, INDICACIONES_GIST_ID"
        )

    update_gist(MANUAL_GIST_ID, MANUAL_LOCAL_PATH, "manual.md")
    update_gist(INDICACIONES_GIST_ID, INDICACIONES_LOCAL_PATH, "indicaciones.md")


if __name__ == "__main__":
    main()
