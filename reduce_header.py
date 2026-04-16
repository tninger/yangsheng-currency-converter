#!/usr/bin/env python3
import re

# 读取 index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到header部分
header_pattern = r'<div class="header">(.*?)</div>'
header_match = re.search(header_pattern, content, re.DOTALL)

if header_match:
    header_content = header_match.group(1)
    
    # 修改header样式，使其更紧凑
    # 1. 减小padding
    # 2. 减小字体大小
    # 3. 减小图标大小
    # 4. 减少行间距
    
    # 修改CSS中的header样式
    css_pattern = r'\.header\s*\{[^}]*\}'
    css_match = re.search(css_pattern, content)
    
    if css_match:
        css_content = css_match.group(0)
        # 减小padding和字体大小
        css_content = css_content.replace('padding: 20px;', 'padding: 10px 15px;')
        css_content = css_content.replace('text-align: center;', 'text-align: center;')
        
        # 替换CSS
        content = content.replace(css_match.group(0), css_content)
        print("✅ Header CSS已调整")
    
    # 修改h1样式
    h1_css_pattern = r'h1\s*\{[^}]*\}'
    h1_css_match = re.search(h1_css_pattern, content)
    
    if h1_css_match:
        h1_css = h1_css_match.group(0)
        # 减小字体大小和边距
        h1_css = h1_css.replace('font-size: 20px;', 'font-size: 16px;')
        h1_css = h1_css.replace('margin-bottom: 5px;', 'margin-bottom: 2px;')
        
        content = content.replace(h1_css_match.group(0), h1_css)
        print("✅ h1 CSS已调整")
    
    # 修改subtitle样式
    subtitle_css_pattern = r'\.subtitle\s*\{[^}]*\}'
    subtitle_css_match = re.search(subtitle_css_pattern, content)
    
    if subtitle_css_match:
        subtitle_css = subtitle_css_match.group(0)
        # 减小字体大小
        subtitle_css = subtitle_css.replace('font-size: 13px;', 'font-size: 11px;')
        subtitle_css = subtitle_css.replace('opacity: 0.9;', 'opacity: 0.8;')
        
        content = content.replace(subtitle_css_match.group(0), subtitle_css)
        print("✅ subtitle CSS已调整")
    
    # 修改currency-icon样式
    icon_css_pattern = r'\.currency-icon\s*\{[^}]*\}'
    icon_css_match = re.search(icon_css_pattern, content)
    
    if icon_css_match:
        icon_css = icon_css_match.group(0)
        # 减小图标大小
        icon_css = icon_css.replace('font-size: 32px;', 'font-size: 24px;')
        icon_css = icon_css.replace('margin-bottom: 8px;', 'margin-bottom: 5px;')
        
        content = content.replace(icon_css_match.group(0), icon_css)
        print("✅ 图标CSS已调整")
    
    # 修改整个容器的padding
    container_css_pattern = r'\.container\s*\{[^}]*\}'
    container_css_match = re.search(container_css_pattern, content)
    
    if container_css_match:
        container_css = container_css_match.group(0)
        # 减小整体padding
        if 'padding: 15px;' in container_css:
            container_css = container_css.replace('padding: 15px;', 'padding: 10px;')
        elif 'padding:' in container_css:
            container_css = re.sub(r'padding:\s*\d+px;', 'padding: 8px;', container_css)
        
        content = content.replace(container_css_match.group(0), container_css)
        print("✅ 容器CSS已调整")
    
    # 修改body的padding
    body_css_pattern = r'body\s*\{[^}]*\}'
    body_css_match = re.search(body_css_pattern, content, re.DOTALL)
    
    if body_css_match:
        body_css = body_css_match.group(0)
        # 减小body padding
        body_css = re.sub(r'padding:\s*\d+px;', 'padding: 8px;', body_css)
        
        content = content.replace(body_css_match.group(0), body_css)
        print("✅ body CSS已调整")
else:
    print("⚠️ 未找到header部分")

# 保存修改
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 标题区域已调整为紧凑设计")
