from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math
import os
import random

W, H = 2400, 1350
OUT = os.path.join(os.path.dirname(__file__), "img", "agent-innovation-flightpath.png")
FONT_REGULAR = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_ITALIC = r"C:\Windows\Fonts\segoeuiz.ttf"


def font(size, bold=False, italic=False):
    path = FONT_ITALIC if italic else (FONT_BOLD if bold else FONT_REGULAR)
    return ImageFont.truetype(path, size)


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[index:index + 2], 16) for index in (0, 2, 4)) + (alpha,)


def vertical_gradient():
    image = Image.new("RGBA", (W, H))
    pixels = image.load()
    top = rgba("#030615")
    bottom = rgba("#07142A")
    for y in range(H):
        ratio = y / (H - 1)
        color = tuple(round(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(4))
        for x in range(W):
            pixels[x, y] = color
    return image


def add_nebula(base, center, radius, color, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=rgba(color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.48))
    base.alpha_composite(layer)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_wrapped(draw, text, xy, max_width, fnt, fill, line_gap=8, anchor="la"):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        proposed = word if not line else line + " " + word
        if draw.textbbox((0, 0), proposed, font=fnt)[2] <= max_width:
            line = proposed
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    x, y = xy
    for item in lines:
        draw.text((x, y), item, font=fnt, fill=fill, anchor=anchor)
        y += fnt.size + line_gap
    return y


def glow_line(base, points, color, width=8):
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.line(points, fill=rgba(color, 155), width=width * 5, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(width * 2.4))
    base.alpha_composite(glow)
    draw = ImageDraw.Draw(base)
    draw.line(points, fill=rgba(color, 225), width=width, joint="curve")


def arrow(draw, tip, direction, color):
    x, y = tip
    size = 18
    if direction == "right":
        pts = [(x, y), (x - size, y - size * 0.62), (x - size, y + size * 0.62)]
    elif direction == "left":
        pts = [(x, y), (x + size, y - size * 0.62), (x + size, y + size * 0.62)]
    else:
        pts = [(x, y), (x - size * 0.62, y - size), (x + size * 0.62, y - size)]
    draw.polygon(pts, fill=rgba(color, 245))


def icon(draw, kind, x, y, color):
    c = rgba(color, 245)
    lw = 7
    if kind == "agent":
        draw.ellipse((x - 23, y - 23, x + 23, y + 23), outline=c, width=lw)
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=c)
        for dx, dy in ((0, -38), (34, 15), (-34, 15)):
            draw.line((x, y, x + dx, y + dy), fill=c, width=lw)
            draw.ellipse((x + dx - 6, y + dy - 6, x + dx + 6, y + dy + 6), fill=c)
    elif kind == "context":
        for offset in (0, 14, 28):
            draw.rounded_rectangle((x - 34, y - 30 + offset, x + 34, y - 8 + offset), 10, outline=c, width=lw)
        draw.line((x - 18, y - 45, x + 18, y - 45), fill=c, width=lw)
    elif kind == "proof":
        draw.rounded_rectangle((x - 30, y - 38, x + 30, y + 38), 10, outline=c, width=lw)
        draw.line((x - 17, y, x - 2, y + 16), fill=c, width=lw)
        draw.line((x - 2, y + 16, x + 22, y - 16), fill=c, width=lw)
    elif kind == "connect":
        for dx, dy in ((0, -30), (-32, 22), (32, 22)):
            draw.ellipse((x + dx - 10, y + dy - 10, x + dx + 10, y + dy + 10), outline=c, width=lw)
            draw.line((x, y, x + dx, y + dy), fill=c, width=lw)
    elif kind == "flow":
        draw.ellipse((x - 42, y - 12, x - 18, y + 12), outline=c, width=lw)
        draw.ellipse((x + 18, y - 35, x + 42, y - 11), outline=c, width=lw)
        draw.ellipse((x + 18, y + 11, x + 42, y + 35), outline=c, width=lw)
        draw.line((x - 18, y, x + 18, y - 22), fill=c, width=lw)
        draw.line((x - 18, y, x + 18, y + 22), fill=c, width=lw)
    elif kind == "voice":
        heights = (16, 34, 52, 34, 16)
        for idx, height in enumerate(heights):
            xx = x - 30 + idx * 15
            draw.line((xx, y - height / 2, xx, y + height / 2), fill=c, width=lw)


def card(base, card_data):
    x, y, w, h = card_data["box"]
    color = card_data["color"]
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    rounded(sd, (x + 8, y + 15, x + w + 8, y + h + 15), 26, rgba("#000000", 170))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(shadow)

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    rounded(ld, (x, y, x + w, y + h), 26, rgba("#0E1631", 238), rgba(color, 175), 2)
    rounded(ld, (x + 1, y + 1, x + w - 1, y + 9), 24, rgba(color, 225))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((x + w - 145, y - 70, x + w + 70, y + 145), fill=rgba(color, 86))
    glow = glow.filter(ImageFilter.GaussianBlur(38))
    layer.alpha_composite(glow)
    base.alpha_composite(layer)

    draw = ImageDraw.Draw(base)
    draw.text((x + 32, y + 38), "LAB " + card_data["number"], font=font(20, bold=True), fill=rgba(color), anchor="la")
    draw.text((x + w - 34, y + 38), card_data["phase"], font=font(18, bold=True), fill=rgba("#C7CEE9"), anchor="ra")
    icon(draw, card_data["icon"], x + 55, y + 112, color)
    draw.text((x + 102, y + 84), card_data["title"], font=font(30, bold=True), fill=rgba("#F4F7FF"), anchor="la")
    draw.text((x + 102, y + 124), card_data["intent"], font=font(18, bold=True), fill=rgba(color), anchor="la")
    draw.line((x + 32, y + 172, x + w - 32, y + 172), fill=rgba("#2D3A63"), width=2)
    draw.text((x + 32, y + 198), "VALUE", font=font(15, bold=True), fill=rgba("#94A2CE"), anchor="la")
    draw_wrapped(draw, card_data["value"], (x + 32, y + 222), w - 64, font(19), rgba("#D8E1F6"), line_gap=4)


def main():
    random.seed(20260717)
    base = vertical_gradient()
    add_nebula(base, (360, 130), 310, "#5534B9", 130)
    add_nebula(base, (2100, 380), 360, "#0A8FCB", 100)
    add_nebula(base, (1250, 1240), 420, "#00A9A1", 80)

    stars = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stars)
    for _ in range(310):
        x, y = random.randrange(W), random.randrange(H)
        r = random.choice((1, 1, 1, 2, 2, 3))
        alpha = random.randrange(45, 180)
        sd.ellipse((x - r, y - r, x + r, y + r), fill=(224, 239, 255, alpha))
    base.alpha_composite(stars)

    draw = ImageDraw.Draw(base)
    # Subtle grid for an innovation-map feel.
    for x in range(0, W + 1, 120):
        draw.line((x, 220, x, H - 120), fill=rgba("#6A79A7", 24), width=1)
    for y in range(260, H - 100, 100):
        draw.line((60, y, W - 60, y), fill=rgba("#6A79A7", 20), width=1)

    # Header.
    draw.text((110, 74), "COPILOT STUDIO", font=font(22, bold=True), fill=rgba("#72E7FF"), anchor="la")
    draw.text((110, 115), "AGENT INNOVATION FLIGHTPATH", font=font(58, bold=True), fill=rgba("#F4F7FF"), anchor="la")
    draw.text((110, 188), "Six labs. One platform. A clear route from first agent to live customer impact.", font=font(25), fill=rgba("#B9C6E5"), anchor="la")
    rounded(draw, (1840, 82, 2288, 158), 38, rgba("#14264B", 225), rgba("#52D7F3", 110), 1)
    draw.text((2064, 120), "BUILD  ->  SCALE  ->  ENGAGE", font=font(17, bold=True), fill=rgba("#9EEFFF"), anchor="mm")

    cards = [
        {"number": "01", "phase": "FOUNDATION", "icon": "agent", "color": "#45B8FF", "title": "Meet the Agent Maker", "intent": "Intent: create a grounded foundation", "value": "Multilingual answers rooted in trusted public knowledge.", "box": (80, 330, 650, 270)},
        {"number": "02", "phase": "CONTEXT", "icon": "context", "color": "#39DF7A", "title": "Bring in business context", "intent": "Intent: make every agent context-aware", "value": "Dataverse, Skills, and Memory turn customer data into action.", "box": (875, 330, 650, 270)},
        {"number": "03", "phase": "TRUST", "icon": "proof", "color": "#B37BFF", "title": "Evidence-based RFP", "intent": "Intent: make evidence operational", "value": "Sourced RFP and RFI answers across your work surface.", "box": (1670, 330, 650, 270)},
        {"number": "04", "phase": "ORCHESTRATE", "icon": "connect", "color": "#FFB44A", "title": "Connect specialist agents", "intent": "Intent: unite expert capabilities", "value": "ServiceNow and specialists operate in one connected experience.", "box": (1670, 710, 650, 270)},
        {"number": "05", "phase": "AUTOMATE", "icon": "flow", "color": "#FF637A", "title": "Multi-agent email Workflow", "intent": "Intent: automate the response loop", "value": "Classify, route, and personalize action at operational scale.", "box": (875, 710, 650, 270)},
        {"number": "06", "phase": "ENGAGE", "icon": "voice", "color": "#3DE5FF", "title": "Real-time voice agent", "intent": "Intent: make agents feel immediate", "value": "Live multilingual voice creates natural customer moments.", "box": (80, 710, 650, 270)},
    ]

    # Flight path behind the cards, routing left-to-right then back along the lower row.
    glow_line(base, [(730, 465), (875, 465)], "#4FD5FF", 6)
    glow_line(base, [(1525, 465), (1670, 465)], "#9D7BFF", 6)
    glow_line(base, [(1995, 600), (1995, 710)], "#FFB44A", 6)
    glow_line(base, [(1670, 845), (1525, 845)], "#FF637A", 6)
    glow_line(base, [(875, 845), (730, 845)], "#3DE5FF", 6)
    draw = ImageDraw.Draw(base)
    arrow(draw, (855, 465), "right", "#4FD5FF")
    arrow(draw, (1650, 465), "right", "#9D7BFF")
    arrow(draw, (1995, 690), "down", "#FFB44A")
    arrow(draw, (1545, 845), "left", "#FF637A")
    arrow(draw, (750, 845), "left", "#3DE5FF")

    for card_data in cards:
        card(base, card_data)

    # Platform outcome band: the value accumulation the learner should understand.
    band = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(band)
    rounded(bd, (100, 1080, 2300, 1240), 28, rgba("#0B1A36", 238), rgba("#4EDCFF", 92), 2)
    base.alpha_composite(band)
    draw = ImageDraw.Draw(base)
    draw.text((150, 1120), "THE PLATFORM OUTCOME", font=font(18, bold=True), fill=rgba("#66DCF9"), anchor="la")
    draw.text((150, 1160), "Copilot Studio becomes an innovation platform - not a single agent.", font=font(30, bold=True), fill=rgba("#F2F6FF"), anchor="la")
    draw.text((150, 1204), "Knowledge + Actions + Orchestration + Workflows + Voice = durable, human-centered agent innovation", font=font(20), fill=rgba("#B8C7E8"), anchor="la")

    concepts = [("KNOWLEDGE", "#45B8FF"), ("ACTIONS", "#39DF7A"), ("ORCHESTRATION", "#B37BFF"), ("WORKFLOWS", "#FF637A"), ("VOICE", "#3DE5FF")]
    x = 1510
    for label, color in concepts:
        width = draw.textbbox((0, 0), label, font=font(15, bold=True))[2] + 40
        rounded(draw, (x, 1137, x + width, 1183), 23, rgba("#132448", 245), rgba(color, 125), 1)
        draw.text((x + width / 2, 1160), label, font=font(15, bold=True), fill=rgba(color), anchor="mm")
        x += width + 12

    # Fine border and export.
    draw.rounded_rectangle((12, 12, W - 12, H - 12), radius=34, outline=rgba("#7EA9F7", 70), width=2)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    base.convert("RGB").save(OUT, quality=95)
    print(f"Wrote {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()