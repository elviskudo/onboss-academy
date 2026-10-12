#!/usr/bin/env python3
"""Validasi cepat konten MDX sebelum build. Jalankan: python3 scripts/check_content.py"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent / "src/content/chapters"
errors = []
langs = sorted(d.name for d in ROOT.iterdir() if d.is_dir())

for f in sorted(ROOT.rglob("*.mdx")):
    text = f.read_text()
    rel = f.relative_to(ROOT)

    parts = text.split("---", 2)
    if len(parts) < 3 or not text.startswith("---"):
        errors.append(f"{rel}: frontmatter tidak valid (harus diawali ---)")
        continue
    fm, body = parts[1], parts[2]

    try:
        data = yaml.safe_load(fm)
    except Exception as e:
        errors.append(f"{rel}: YAML error — {str(e).splitlines()[0]} (kutip ganda di dalam string?)")
        continue
    for key in ("title", "description"):
        if not isinstance(data.get(key), str):
            errors.append(f"{rel}: {key} harus string (kutip YAML?)")
    if not isinstance(data.get("order"), int) or isinstance(data.get("order"), bool):
        errors.append(f"{rel}: order bukan integer")
    quiz = data.get("quiz")
    if not isinstance(quiz, list) or not quiz:
        errors.append(f"{rel}: quiz kosong")
    else:
        for i, item in enumerate(quiz):
            opts = item.get("options") if isinstance(item, dict) else None
            if not isinstance(opts, list) or len(opts) < 2:
                errors.append(f"{rel}: quiz[{i}] options < 2")
            elif not all(isinstance(o, str) for o in opts):
                errors.append(f"{rel}: quiz[{i}] options harus semua string — kutip nilainya")
            ans = item.get("answer") if isinstance(item, dict) else None
            if not isinstance(ans, int) or isinstance(ans, bool) or not (0 <= ans < len(opts or [])):
                errors.append(f"{rel}: quiz[{i}] answer di luar rentang options")

    uses_tryit = "<TryIt" in body
    if uses_tryit:
        imp = "import TryIt from '../../../components/TryIt.astro';"
        if imp not in body:
            errors.append(f"{rel}: import TryIt salah/hilang — harus tepat: {imp}")
        if not re.match(r"\s*\nimport TryIt", body):
            errors.append(f"{rel}: harus ada baris kosong setelah frontmatter sebelum import")
        for tag in re.finditer(r"<TryIt\b.*?/>", body, re.S):
            if tag.group(0).count("`") % 2 == 1:
                errors.append(f"{rel}: backtick ganjil di <TryIt> — template literal kurang penutup `")

    if body.count("```") % 2 == 1:
        errors.append(f"{rel}: code fence ``` tidak seimbang")

if errors:
    print("\n".join(errors))
    print(f"\n{len(errors)} error pada {len(langs)} bahasa")
    sys.exit(1)
print(f"OK — {len(list(ROOT.rglob('*.mdx')))} MDX valid, {len(langs)} bahasa: {', '.join(langs)}")
