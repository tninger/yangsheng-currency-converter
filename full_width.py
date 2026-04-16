#!/usr/bin/env python3
import re

# 读取 index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改currency-details，让内容占满整个宽度
css_pattern = r'\.currency-details\s*\{[^}]*\}'
css_match = re.search(css_pattern, content)

if css_match:
    css_content = css_match.group(0)
    
    # 确保使用justify-content: space-between来占满宽度
    if 'justify-content:' in css_content:
        css_content = re.sub(
            r'justify-content:\s*[^;]+;',
            'justify-content: space-between;',
            css_content
        )
    else:
        css_content = css_content.replace(';', '; justify-content: space-between;')
    
    # 确保gap足够小，让内容更紧凑
    if 'gap:' in css_content:
        css_content = re.sub(r'gap:\s*\d+px;', 'gap: 4px;', css_content)
    else:
        css_content = css_content.replace(';', '; gap: 4px;')
    
    # 确保flex: 1让内容占满宽度
    if 'flex:' in css_content:
        css_content = re.sub(r'flex:\s*[^;]+;', 'flex: 1;', css_content)
    else:
        css_content = css_content.replace(';', '; flex: 1;')
    
    content = content.replace(css_match.group(0), css_content)
    print("✅ 已调整currency-details占满宽度")

# 2. 调整currency-info，让货币信息占满左侧空间
currency_info_pattern = r'\.currency-info\s*\{[^}]*\}'
currency_info_match = re.search(currency_info_pattern, content)

if currency_info_match:
    currency_info_css = currency_info_match.group(0)
    
    # 确保flex: 1占满空间
    if 'flex:' in currency_info_css:
        currency_info_css = re.sub(r'flex:\s*[^;]+;', 'flex: 1;', currency_info_css)
    else:
        currency_info_css = currency_info_css.replace(';', '; flex: 1;')
    
    # 确保使用flex布局
    if 'display:' not in currency_info_css:
        currency_info_css = currency_info_css.replace('{', '{ display: flex;')
    
    # 确保align-items: center
    if 'align-items:' not in currency_info_css:
        currency_info_css = currency_info_css.replace(';', '; align-items: center;')
    
    # 调整gap
    if 'gap:' in currency_info_css:
        currency_info_css = re.sub(r'gap:\s*[^;]+;', 'gap: 6px;', currency_info_css)
    else:
        currency_info_css = currency_info_css.replace(';', '; gap: 6px;')
    
    content = content.replace(currency_info_match.group(0), currency_info_css)
    print("✅ 已调整currency-info占满左侧空间")

# 3. 调整amount-display和rate-display的最小宽度，让它们更紧凑
amount_display_pattern = r'\.amount-display\s*\{[^}]*\}'
amount_display_match = re.search(amount_display_pattern, content)

if amount_display_match:
    amount_display_css = amount_display_match.group(0)
    
    # 减小最小宽度
    if 'min-width:' in amount_display_css:
        amount_display_css = re.sub(r'min-width:\s*[^;]+;', 'min-width: 60px;', amount_display_css)
    else:
        amount_display_css = amount_display_css.replace(';', '; min-width: 60px;')
    
    content = content.replace(amount_display_match.group(0), amount_display_css)
    print("✅ 已调整amount-display最小宽度")

rate_display_pattern = r'\.rate-display\s*\{[^}]*\}'
rate_display_match = re.search(rate_display_pattern, content)

if rate_display_match:
    rate_display_css = rate_display_match.group(0)
    
    # 减小最小宽度
    if 'min-width:' in rate_display_css:
        rate_display_css = re.sub(r'min-width:\s*[^;]+;', 'min-width: 50px;', rate_display_css)
    else:
        rate_display_css = rate_display_css.replace(';', '; min-width: 50px;')
    
    content = content.replace(rate_display_match.group(0), rate_display_css)
    print("✅ 已调整rate-display最小宽度")

# 4. 调整currency-item的padding，让内容更靠近边缘
currency_item_pattern = r'\.currency-item\s*\{[^}]*\}'
currency_item_match = re.search(currency_item_pattern, content)

if currency_item_match:
    currency_item_css = currency_item_match.group(0)
    
    # 减少左右padding，让内容更靠近边缘
    if 'padding:' in currency_item_css:
        currency_item_css = re.sub(
            r'padding:\s*[^;]+;',
            'padding: 8px 4px;',
            currency_item_css
        )
    else:
        currency_item_css = currency_item_css.replace(';', '; padding: 8px 4px;')
    
    content = content.replace(currency_item_match.group(0), currency_item_css)
    print("✅ 已调整currency-item padding")

# 5. 调整容器的最大宽度，或者移除最大宽度限制
container_pattern = r'\.container\s*\{[^}]*\}'
container_match = re.search(container_pattern, content)

if container_match:
    container_css = container_match.group(0)
    
    # 增加最大宽度，或者使用百分比
    if 'max-width:' in container_css:
        container_css = re.sub(
            r'max-width:\s*[^;]+;',
            'max-width: 100%;',
            container_css
        )
    else:
        container_css = container_css.replace(';', '; max-width: 100%;')
    
    # 确保宽度占满
    if 'width:' not in container_css:
        container_css = container_css.replace(';', '; width: 100%;')
    
    content = content.replace(container_match.group(0), container_css)
    print("✅ 已调整容器宽度")

# 6. 调整body的padding，让容器更靠近屏幕边缘
body_pattern = r'body\s*\{[^}]*\}'
body_match = re.search(body_pattern, content, re.DOTALL)

if body_match:
    body_css = body_match.group(0)
    
    # 减少body的padding
    if 'padding:' in body_css:
        body_css = re.sub(r'padding:\s*[^;]+;', 'padding: 2px;', body_css)
    else:
        body_css = body_css.replace(';', '; padding: 2px;')
    
    content = content.replace(body_match.group(0), body_css)
    print("✅ 已调整body padding")

# 7. 调整header和input-section的padding，让它们也更紧凑
header_pattern = r'\.header\s*\{[^}]*\}'
header_match = re.search(header_pattern, content)

if header_match:
    header_css = header_match.group(0)
    
    if 'padding:' in header_css:
        header_css = re.sub(r'padding:\s*[^;]+;', 'padding: 6px 8px;', header_css)
    
    content = content.replace(header_match.group(0), header_css)
    print("✅ 已调整header padding")

input_section_pattern = r'\.input-section\s*\{[^}]*\}'
input_section_match = re.search(input_section_pattern, content)

if input_section_match:
    input_section_css = input_section_match.group(0)
    
    if 'padding:' in input_section_css:
        input_section_css = re.sub(r'padding:\s*[^;]+;', 'padding: 6px 8px;', input_section_css)
    
    content = content.replace(input_section_match.group(0), input_section_css)
    print("✅ 已调整input-section padding")

# 保存修改
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 左右占满宽度调整已完成")
