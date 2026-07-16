from PIL import Image, ImageDraw, ImageFont

S = 720
# vertical gradient purple -> pink
top = Image.new('RGB', (S, S), (124, 58, 237))
bot = Image.new('RGB', (S, S), (236, 72, 153))
mask = Image.linear_gradient('L').resize((S, S))
grad = Image.composite(bot, top, mask)

# circular mask
circle = Image.new('L', (S, S), 0)
ImageDraw.Draw(circle).ellipse([0, 0, S - 1, S - 1], fill=255)
out = Image.new('RGBA', (S, S), (0, 0, 0, 0))
out.paste(grad, (0, 0), circle)

# subtle inner ring
d = ImageDraw.Draw(out)
d.ellipse([14, 14, S - 15, S - 15], outline=(255, 255, 255, 90), width=6)

# MJ initials
font = None
for fp in [r'C:\Windows\Fonts\segoeuib.ttf', r'C:\Windows\Fonts\arialbd.ttf']:
    try:
        font = ImageFont.truetype(fp, 340)
        break
    except Exception:
        pass
if font is None:
    font = ImageFont.load_default()
d.text((S / 2, S / 2 - 12), 'MJ', font=font, fill=(255, 255, 255, 255), anchor='mm')

out.save('promo/img/michael.png')
print('avatar generated', out.size)
