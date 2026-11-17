"""Prepara fotografías de Pexels como WebP cuadrados para el catálogo NUDO.

Las referencias y las páginas de origen están registradas en sources.json.
Para reutilizar descargas existentes, pasar --cache con un directorio de JPEG.
"""
import argparse
import hashlib
import json
import urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--cache', type=Path)
parser.add_argument('--quality', type=int, default=73)
args = parser.parse_args()
sources = json.loads((HERE / 'sources.json').read_text(encoding='utf-8'))
products = json.loads((ROOT / 'tools' / 'product-renders' / 'catalog.json').read_text(encoding='utf-8'))
ids = [p['product_id'] for p in sources]
if len(ids) != 60 or len(set(ids)) != 60 or len({p['photo_id'] for p in sources}) != 60:
    raise SystemExit('Se requieren 60 productos y 60 fotografías de origen distintas')
if set(ids) != {p['id'] for p in products}:
    raise SystemExit('Las fotografías no coinciden con los IDs del catálogo')
output = ROOT / 'frontend' / 'images' / 'products'
hashes = set()
for record in sources:
    product_id, photo_id = record['product_id'], record['photo_id']
    cached = args.cache / (photo_id + '.jpg') if args.cache else None
    if cached and cached.is_file():
        data = cached.read_bytes()
    else:
        url = f'https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w=850'
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read()
    with Image.open(BytesIO(data)) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        square = ImageOps.fit(im, (512, 512), method=Image.Resampling.LANCZOS)
        square.save(output / (product_id + '.webp'), 'WEBP', quality=args.quality, method=6)
    digest = hashlib.sha256((output / (product_id + '.webp')).read_bytes()).hexdigest()
    if digest in hashes:
        raise SystemExit('Fotografía duplicada para ' + product_id)
    hashes.add(digest)
print(f'{len(ids)} fotografías WebP únicas; {sum((output / (i + ".webp")).stat().st_size for i in ids)} bytes')
