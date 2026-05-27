from PIL import Image, ImageDraw
import math

BLUE = (13, 110, 253)      # #0d6efd — matches extension accent
WHITE = (255, 255, 255)

def draw_crescent(draw, cx, cy, outer_r, inner_r, offset_x, fill_color):
    """Draw a crescent moon by drawing a full circle then masking with a smaller offset circle."""
    # Create a temporary mask image
    size = int(outer_r * 2 + 4)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    ox, oy = outer_r + 2, outer_r + 2
    mask_draw.ellipse([ox - outer_r, oy - outer_r, ox + outer_r, oy + outer_r], fill=255)
    mask_draw.ellipse([ox - inner_r + offset_x, oy - inner_r, ox + inner_r + offset_x, oy + inner_r], fill=0)
    # Paste the mask onto the main image using the fill color
    return mask, (int(cx - ox), int(cy - oy))

def draw_star(draw, cx, cy, outer_r, inner_r, points=5, fill_color=WHITE):
    """Draw a regular n-pointed star."""
    coords = []
    for i in range(points * 2):
        angle = math.pi / 2 + i * math.pi / points
        r = outer_r if i % 2 == 0 else inner_r
        x = cx + r * math.cos(angle)
        y = cy - r * math.sin(angle)
        coords.append((x, y))
    draw.polygon(coords, fill=fill_color)

def generate_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factors based on size
    scale = size / 128.0
    cx, cy = size / 2, size / 2

    # Crescent dimensions
    outer_r = int(45 * scale)
    inner_r = int(36 * scale)
    offset_x = int(18 * scale)

    # Draw crescent on a temporary layer so we can composite
    temp = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp)

    # Draw outer circle (blue)
    temp_draw.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], fill=BLUE)
    # Cut out inner circle (transparent) — offset to create crescent
    temp_draw.ellipse([cx - inner_r + offset_x, cy - inner_r, cx + inner_r + offset_x, cy + inner_r], fill=(0, 0, 0, 0))

    # Draw star (white) — positioned on the crescent
    star_cx = int(cx - 10 * scale)
    star_cy = int(cy - 18 * scale)
    star_outer = int(16 * scale)
    star_inner = int(7 * scale)
    draw_star(temp_draw, star_cx, star_cy, star_outer, star_inner, fill_color=WHITE)

    # Composite
    img = Image.alpha_composite(img, temp)
    return img

if __name__ == '__main__':
    sizes = [16, 32, 48, 128]
    out_dir = '../src/assets/icons'
    for s in sizes:
        icon = generate_icon(s)
        icon.save(f'{out_dir}/icon{s}.png')
        print(f'Generated icon{s}.png')
