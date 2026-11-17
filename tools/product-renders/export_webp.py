"""Convierte los renders PNG a WebP y crea el índice público de IDs."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('input', type=Path)
parser.add_argument('--quality', type=int, default=90)
args = parser.parse_args()
products = json.loads((HERE / 'catalog.json').read_text(encoding='utf-8'))
ids = [p['id'] for p in products]
if len(ids) != 60 or len(set(ids)) != 60:
    raise SystemExit('El catálogo debe contener exactamente 60 identificadores únicos')
destination = ROOT / 'frontend' / 'images' / 'products'
destination.mkdir(parents=True, exist_ok=True)
hashes = set()
for product_id in ids:
    source = args.input / (product_id + '.png')
    if not source.is_file():
        raise SystemExit('Falta el render: ' + product_id)
    with Image.open(source) as image:
        if image.size != (512, 512):
            raise SystemExit('Dimensiones incorrectas: ' + product_id)
        image.convert('RGB').save(destination / (product_id + '.webp'), 'WEBP', quality=args.quality, method=6)
    digest = hashlib.sha256((destination / (product_id + '.webp')).read_bytes()).hexdigest()
    if digest in hashes:
        raise SystemExit('Imagen duplicada: ' + product_id)
    hashes.add(digest)
(ROOT / 'frontend' / 'product-images.js').write_text("'use strict';\nglobalThis.NudoProductImages = new Set(" + json.dumps(ids, ensure_ascii=False, indent=2) + ");\n", encoding='utf-8')
print(f'{len(ids)} imágenes únicas; {sum((destination / (i + ".webp")).stat().st_size for i in ids)} bytes')
