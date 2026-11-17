"""Clasifica los envases a partir de los datos descriptivos del catálogo."""
import json
from collections import Counter
from pathlib import Path

path = Path(__file__).with_name('catalog.json')
products = json.loads(path.read_text(encoding='utf-8'))
for p in products:
    name, art = p['name'].lower(), p['art'].lower()
    if 'jar' in art: kind = 'tarro'
    elif 'tube' in art: kind = 'tubo'
    elif 'oil' in art or 'sérum' in name or 'aceite' in name: kind = 'gotero'
    elif 'spray' in name or 'bruma' in name or 'protector térmico' in name: kind = 'pulverizador'
    elif 'polvo' in name: kind = 'polvo'
    elif 'jabón' in name or 'loción corporal' in name or 'gel de ducha' in name: kind = 'dosificador'
    else: kind = 'botella'
    p['container'] = kind
path.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(dict(Counter(p['container'] for p in products)))
