#!/usr/bin/env python3
"""Bundle src/ into dist/index.html (standalone) and dist/artifact.html (Artifact body)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def main() -> None:
    head = read(SRC / "head.html").strip()
    css = read(SRC / "style.css")
    body = read(SRC / "body.html").strip()
    js_files = sorted((SRC / "js").glob("*.js"))
    js = "\n".join(f"/* ---- {f.name} ---- */\n" + read(f) for f in js_files)

    inner = f"{head}\n<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n"
    DIST.mkdir(exist_ok=True)
    (DIST / "artifact.html").write_text(inner, encoding="utf-8")
    (DIST / "app.js").write_text(js, encoding="utf-8")  # for `node --check`

    full = (
        "<!doctype html>\n<html lang=\"zh-Hant-HK\">\n<head>\n"
        "<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
        f"{head}\n<style>\n{css}\n</style>\n</head>\n<body>\n{body}\n<script>\n{js}\n</script>\n</body>\n</html>\n"
    )
    (DIST / "index.html").write_text(full, encoding="utf-8")
    docs = ROOT / "docs"  # GitHub Pages serves this folder
    docs.mkdir(exist_ok=True)
    (docs / "index.html").write_text(full, encoding="utf-8")
    (docs / ".nojekyll").write_text("", encoding="utf-8")
    kb = len(full.encode("utf-8")) / 1024
    print(f"built dist/index.html ({kb:.0f} KB) from {len(js_files)} js files")


if __name__ == "__main__":
    main()
