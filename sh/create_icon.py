#!/usr/bin/env python3
"""
创建时间转换器应用图标的简单脚本
需要安装 Pillow 库：pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os

    # 创建图标
    size = 256
    img = Image.new('RGBA', (size, size), (0, 123, 255, 255))  # 蓝色背景
    draw = ImageDraw.Draw(img)

    # 绘制时钟图标
    center = size // 2
    radius = size // 3

    # 绘制外圆
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], 
                 fill=(255, 255, 255, 255), outline=(0, 0, 0, 255), width=3)

    # 绘制时针
    draw.line([center, center, center + radius//2, center], 
              fill=(0, 0, 0, 255), width=4)

    # 绘制分针
    draw.line([center, center, center, center - radius*2//3], 
              fill=(0, 0, 0, 255), width=3)

    # 绘制中心点
    draw.ellipse([center - 8, center - 8, center + 8, center + 8], 
                 fill=(0, 0, 0, 255))

    # 添加文字
    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        # 如果没有找到字体，使用默认字体
        font = ImageFont.load_default()

    text = "时间转换"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = center - text_width // 2
    text_y = size - 40

    draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)

    # 保存为 PNG
    img.save('time_converter_icon.png', 'PNG')
    print("✅ PNG 图标已创建：time_converter_icon.png")

    # 保存为 ICO（需要额外处理）
    try:
        # 创建不同尺寸的图标
        icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        img.save('time_converter_icon.ico', format='ICO', sizes=icon_sizes)
        print("✅ ICO 图标已创建：time_converter_icon.ico")
    except Exception as e:
        print(f"⚠️  ICO 图标创建失败：{e}")
        print("💡 建议使用在线工具将 PNG 转换为 ICO 格式")

except ImportError:
    print("❌ 需要安装 Pillow 库：pip install Pillow")
except Exception as e:
    print(f"❌ 图标创建失败：{e}")