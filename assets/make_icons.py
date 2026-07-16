#!/usr/bin/env python3
"""Generate PromptVault icon set (rounded gradient square + white bookmark)."""
from PIL import Image, ImageDraw
import os

OUT_ICONS = os.path.join(os.path.dirname(__file__), "..", "icons")
OUT_ASSETS = os.path.dirname(__file__)
os.makedirs(OUT_ICONS, exist_ok=True)

INDIGO = (99, 102, 241)   # #6366f1
VIOLET = (139, 92, 246)   # #8b5cf6


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size):
    """Diagonal indigo -> violet gradient."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            px[x, y] = lerp(INDIGO, VIOLET, t)
    return img


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def bookmark(draw, S, color):
    x0, x1 = 0.34 * S, 0.66 * S
    y0, y1 = 0.26 * S, 0.76 * S
    notch = 0.12 * S
    xm = (x0 + x1) / 2
    draw.polygon(
        [(x0, y0), (x1, y0), (x1, y1), (xm, y1 - notch), (x0, y1)],
        fill=color,
    )


def make(size, scale=4):
    S = size * scale
    base = gradient(S)
    mask = rounded_mask(S, radius=int(S * 0.235))
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    canvas.paste(base, (0, 0), mask)

    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    bookmark(d, S, (255, 255, 255, 255))
    canvas = Image.alpha_composite(canvas, layer)

    return canvas.resize((size, size), Image.LANCZOS)


for s in (16, 32, 48, 128):
    make(s).save(os.path.join(OUT_ICONS, f"icon{s}.png"))
    print("icon", s)

# 128 store icon (same art, saved to assets for the listing upload)
make(128).save(os.path.join(OUT_ASSETS, "store-icon-128.png"))

# High-res master for promo art
make(512).save(os.path.join(OUT_ASSETS, "icon-master-512.png"))
print("done")
