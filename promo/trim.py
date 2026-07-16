from PIL import Image, ImageChops
import glob, os

for path in sorted(glob.glob('promo/img/*.png')):
    im = Image.open(path).convert('RGB')
    corner = im.getpixel((im.width - 1, im.height - 1))
    bg = Image.new('RGB', im.size, corner)
    diff = ImageChops.difference(im, bg).convert('L').point(lambda p: 255 if p > 18 else 0)
    bbox = diff.getbbox()
    if bbox:
        cropped = im.crop(bbox)
        cropped.save(path)
        print(os.path.basename(path), im.size, '->', cropped.size)
    else:
        print(os.path.basename(path), 'no content bbox')
