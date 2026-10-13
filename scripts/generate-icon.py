# -*- coding: utf-8 -*-
"""BeBetter 应用图标生成脚本

设计原则：扁平、纯色、单一图形，无渐变 / 无光斑 / 无发光。
（渐变 + 光斑 + 发光在小尺寸下会糊成一团，且观感廉价。）

用法:
    python scripts/generate-icon.py preview             # 生成候选方案对比图，用于选定方向
    python scripts/generate-icon.py build [variant]     # 产出全部正式资源（默认 check）

可选 variant: check | letter | arrow | book
依赖: Pillow
"""

import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")
ASSETS = os.path.join(ROOT, "assets")
CAND = os.path.join(ROOT, ".trae", "icon-candidates")

# ---- 色板（单色扁平，取自 src/constants/colors.ts）----
BLUE = (77, 157, 224)  # #4D9DE0
WHITE = (255, 255, 255)

SS = 4  # 超采样倍数
DENSITIES = [("mdpi", 1.0), ("hdpi", 1.5), ("xhdpi", 2.0), ("xxhdpi", 3.0), ("xxxhdpi", 4.0)]
LAUNCHER_BASE = 48
FOREGROUND_BASE = 108
SPLASH_BASE = 160

FONT_DIR = r"C:\Windows\Fonts"

# 每个方案的自适应图标背景色（供 drawable/ic_launcher_bg.xml 使用）
VARIANT_BG = {
    "check": "#4D9DE0",
    "arrow": "#4D9DE0",
    "book": "#4D9DE0",
    "letter": "#FFFFFF",
}


def _font(paths, size):
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def label_font(size):
    return _font(
        [
            os.path.join(FONT_DIR, "msyhbd.ttc"),
            os.path.join(FONT_DIR, "msyh.ttc"),
            os.path.join(FONT_DIR, "simhei.ttf"),
            os.path.join(FONT_DIR, "segoeuib.ttf"),
        ],
        size,
    )


def letter_font(size):
    return _font(
        [
            os.path.join(FONT_DIR, "seguibl.ttf"),
            os.path.join(FONT_DIR, "segoeuib.ttf"),
            os.path.join(FONT_DIR, "arialbd.ttf"),
        ],
        size,
    )


def _rounded_bg(ss, color, radius_ratio):
    shape = Image.new("L", (ss, ss), 0)
    ImageDraw.Draw(shape).rounded_rectangle(
        [0, 0, ss - 1, ss - 1], radius=int(ss * radius_ratio), fill=255
    )
    layer = Image.new("RGBA", (ss, ss), color + (255,))
    layer.putalpha(shape)
    return layer


def _box(ss, ratio):
    """居中方形区域，边长 = ratio * ss"""
    m = (1 - ratio) / 2 * ss
    return m, m, ss - m, ss - m


# ---------------- 各方案的图形绘制（单色，居中） ----------------


def draw_check(lay, ss, color, ratio):
    x0, y0, x1, y1 = _box(ss, ratio)
    s = x1 - x0
    d = ImageDraw.Draw(lay)
    p = lambda nx, ny: (x0 + nx * s, y0 + ny * s)
    lw = max(2, int(s * 0.19))
    pts = [p(0.12, 0.50), p(0.38, 0.78), p(0.90, 0.18)]
    d.line(pts, fill=color, width=lw, joint="curve")
    r = lw / 2.0
    for cx, cy in pts:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def draw_arrow(lay, ss, color, ratio):
    x0, y0, x1, y1 = _box(ss, ratio)
    s = x1 - x0
    d = ImageDraw.Draw(lay)
    p = lambda nx, ny: (x0 + nx * s, y0 + ny * s)
    lw = max(2, int(s * 0.17))
    a, b = p(0.05, 0.95), p(0.72, 0.28)
    d.line([a, b], fill=color, width=lw)
    r = lw / 2.0
    d.ellipse([a[0] - r, a[1] - r, a[0] + r, a[1] + r], fill=color)
    d.polygon([p(0.99, 0.01), p(0.92, 0.45), p(0.55, 0.08)], fill=color)


def draw_book(lay, ss, color, ratio):
    x0, y0, x1, y1 = _box(ss, ratio)
    s = x1 - x0
    d = ImageDraw.Draw(lay)
    p = lambda nx, ny: (x0 + nx * s, y0 + ny * s)
    gap = 0.028
    d.polygon([p(0.50 - gap, 0.22), p(0.04, 0.14), p(0.04, 0.70), p(0.50 - gap, 0.80)], fill=color)
    d.polygon([p(0.50 + gap, 0.22), p(0.96, 0.14), p(0.96, 0.70), p(0.50 + gap, 0.80)], fill=color)


def draw_letter(lay, ss, color, ratio):
    x0, y0, x1, y1 = _box(ss, ratio)
    s = x1 - x0
    d = ImageDraw.Draw(lay)
    probe = letter_font(1000)
    bb = d.textbbox((0, 0), "B", font=probe)
    size = max(1, int(round(1000 * s / (bb[3] - bb[1]))))
    f = letter_font(size)
    bb = d.textbbox((0, 0), "B", font=f)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.text((x0 + (s - w) / 2 - bb[0], y0 + (s - h) / 2 - bb[1]), "B", font=f, fill=color)


DRAWERS = {"check": draw_check, "arrow": draw_arrow, "book": draw_book, "letter": draw_letter}


def render(variant, size, mode="full"):
    """mode: full = 底色圆角方块 + 图形；fg = 透明底，仅供自适应图标前景"""
    ss = size * SS
    img = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    if mode == "full":
        bg = WHITE if variant == "letter" else BLUE
        img = _rounded_bg(ss, bg, 0.22)
    glyph = BLUE if variant == "letter" else WHITE
    ratio = 0.40 if mode == "fg" else 0.50
    lay = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    DRAWERS[variant](lay, ss, glyph, ratio)
    return Image.alpha_composite(img, lay).resize((size, size), Image.Resampling.LANCZOS)


# ---------------- 候选对比图 ----------------


def preview():
    os.makedirs(CAND, exist_ok=True)
    variants = [("check", "对勾"), ("letter", "字母 B"), ("arrow", "上升箭头"), ("book", "书本")]
    cell, pad, top = 300, 26, 76
    small = 132
    w = pad + len(variants) * (cell + pad)
    h = top + cell + 56 + small + 40
    sheet = Image.new("RGB", (w, h), (243, 244, 246))
    d = ImageDraw.Draw(sheet)
    big_f, small_f, tag_f = label_font(28), label_font(20), label_font(22)

    for i, (v, name) in enumerate(variants):
        x = pad + i * (cell + pad)
        d.text((x + cell / 2, top - 42), f"{chr(65 + i)}  {name}", font=big_f, fill=(28, 32, 38), anchor="mm")

        icon = render(v, 1024, "full").resize((cell, cell), Image.Resampling.LANCZOS)
        sheet.paste(icon, (x, top), icon)

        # 真实 48px 尺寸放大展示，观察小尺寸下是否清晰
        tiny = render(v, 48, "full").resize((small, small), Image.Resampling.NEAREST)
        tx, ty = x + (cell - small) // 2, top + cell + 40
        sheet.paste(tiny, (tx, ty), tiny)
        d.text((x + cell / 2, ty + small + 16), "48px 放大", font=small_f, fill=(140, 144, 152), anchor="mm")
        d.text((x + cell / 2, ty + small + 40), f"variant: {v}", font=tag_f, fill=(160, 164, 172), anchor="mm")

    out = os.path.join(CAND, "compare.png")
    sheet.save(out)
    print(f"候选对比图: {out}  {sheet.size[0]}x{sheet.size[1]}")


# ---------------- 正式资源产出 ----------------


def _save_webp(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", lossless=True, quality=100, method=6)
    print(f"  {os.path.relpath(path, ROOT):<66} {img.size[0]}x{img.size[1]}")


def build(variant):
    if variant not in DRAWERS:
        raise SystemExit(f"未知 variant: {variant}（可选 {'/'.join(DRAWERS)}）")

    print(f"方案: {variant}    自适应背景色: {VARIANT_BG[variant]}")
    print("母版:")
    icon = render(variant, 1024, "full")
    icon.save(os.path.join(ASSETS, "icon.png"), "PNG")
    print(f"  {'assets/icon.png':<66} 1024x1024")
    fg1024 = render(variant, 1024, "fg")
    fg1024.save(os.path.join(ASSETS, "adaptive-icon.png"), "PNG")
    print(f"  {'assets/adaptive-icon.png':<66} 1024x1024")

    print("Android 传统图标 + 自适应前景:")
    for name, scale in DENSITIES:
        dpi = os.path.join(RES, f"mipmap-{name}")
        _save_webp(render(variant, int(LAUNCHER_BASE * scale), "full"), os.path.join(dpi, "ic_launcher.webp"))
        _save_webp(render(variant, int(LAUNCHER_BASE * scale), "full"), os.path.join(dpi, "ic_launcher_round.webp"))
        _save_webp(render(variant, int(FOREGROUND_BASE * scale), "fg"), os.path.join(dpi, "ic_launcher_foreground.webp"))

    print("启动图 logo（深色 splash 上展示完整图标）:")
    for name, scale in DENSITIES:
        dpi = os.path.join(RES, f"drawable-{name}")
        path = os.path.join(dpi, "splashscreen_logo.png")
        img = render(variant, int(SPLASH_BASE * scale), "full")
        os.makedirs(dpi, exist_ok=True)
        img.save(path, "PNG")
        print(f"  {os.path.relpath(path, ROOT):<66} {img.size[0]}x{img.size[1]}")

    # 自适应图标背景 drawable（纯色，与图标底色一致）
    bg_path = os.path.join(RES, "drawable", "ic_launcher_bg.xml")
    with open(bg_path, "w", encoding="utf-8") as f:
        f.write(
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<shape xmlns:android="http://schemas.android.com/apk/res/android"\n'
            '    android:shape="rectangle">\n'
            f'    <solid android:color="{VARIANT_BG[variant]}" />\n'
            "</shape>\n"
        )
    print(f"  {os.path.relpath(bg_path, ROOT):<66} solid {VARIANT_BG[variant]}")
    print("完成。")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] == "preview":
        preview()
    elif args[0] == "build":
        build(args[1] if len(args) > 1 else "check")
    else:
        raise SystemExit(__doc__)