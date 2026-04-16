#!/usr/bin/env python3
import re

# 读取 index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改currency-details的grid布局为自适应宽度
# 原来的: grid-template-columns: 60px 1fr 80px;
# 修改为: grid-template-columns: auto 1fr auto;

css_pattern = r'\.currency-details\s*\{[^}]*\}'
css_match = re.search(css_pattern, content)

if css_match:
    css_content = css_match.group(0)
    
    # 替换固定宽度为自适应宽度
    if 'grid-template-columns:' in css_content:
        # 找到并替换grid-template-columns
        css_content = re.sub(
            r'grid-template-columns:\s*[^;]+;',
            'grid-template-columns: auto 1fr auto;',
            css_content
        )
        print("✅ 已修改grid-template-columns为自适应宽度")
    
    # 确保有足够的gap
    if 'gap:' in css_content:
        css_content = re.sub(r'gap:\s*\d+px;', 'gap: 10px;', css_content)
    else:
        css_content = css_content.replace(';', '; gap: 10px;')
    
    # 替换CSS
    content = content.replace(css_match.group(0), css_content)
else:
    print("⚠️ 未找到currency-details CSS")

# 2. 调整货币代码和名称的显示方式
# 让货币代码和名称在同一行显示，而不是上下排列

currency_code_pattern = r'\.currency-code\s*\{[^}]*\}'
currency_code_match = re.search(currency_code_pattern, content)

if currency_code_match:
    currency_code_css = currency_code_match.group(0)
    
    # 修改为flex布局，让代码和名称在同一行
    currency_code_css = re.sub(
        r'display:\s*[^;]+;',
        'display: flex; align-items: center; gap: 4px;',
        currency_code_css
    )
    
    # 移除flex-direction: column
    currency_code_css = currency_code_css.replace('flex-direction: column;', '')
    
    content = content.replace(currency_code_match.group(0), currency_code_css)
    print("✅ 已修改currency-code为水平布局")
else:
    print("⚠️ 未找到currency-code CSS")

# 3. 调整货币名称的显示
currency_name_pattern = r'\.currency-name\s*\{[^}]*\}'
currency_name_match = re.search(currency_name_pattern, content)

if currency_name_match:
    currency_name_css = currency_name_match.group(0)
    
    # 修改货币名称样式
    currency_name_css = re.sub(
        r'margin-top:\s*[^;]+;',
        'margin-top: 0;',
        currency_name_css
    )
    
    # 调整字体大小
    currency_name_css = re.sub(
        r'font-size:\s*[^;]+;',
        'font-size: 9px;',
        currency_name_css
    )
    
    content = content.replace(currency_name_match.group(0), currency_name_css)
    print("✅ 已调整currency-name样式")
else:
    print("⚠️ 未找到currency-name CSS")

# 4. 调整金额和汇率的对齐方式
amount_display_pattern = r'\.amount-display\s*\{[^}]*\}'
amount_display_match = re.search(amount_display_pattern, content)

if amount_display_match:
    amount_display_css = amount_display_match.group(0)
    
    # 确保金额右对齐
    if 'text-align: right;' not in amount_display_css:
        amount_display_css = amount_display_css.replace(';', '; text-align: right;')
    
    content = content.replace(amount_display_match.group(0), amount_display_css)
    print("✅ 已调整amount-display对齐方式")
else:
    print("⚠️ 未找到amount-display CSS")

rate_display_pattern = r'\.rate-display\s*\{[^}]*\}'
rate_display_match = re.search(rate_display_pattern, content)

if rate_display_match:
    rate_display_css = rate_display_match.group(0)
    
    # 确保汇率左对齐
    if 'text-align: left;' not in rate_display_css:
        rate_display_css = rate_display_css.replace(';', '; text-align: left;')
    
    content = content.replace(rate_display_match.group(0), rate_display_css)
    print("✅ 已调整rate-display对齐方式")
else:
    print("⚠️ 未找到rate-display CSS")

# 5. 调整货币项目的整体padding，给自适应宽度更多空间
currency_item_pattern = r'\.currency-item\s*\{[^}]*\}'
currency_item_match = re.search(currency_item_pattern, content)

if currency_item_match:
    currency_item_css = currency_item_match.group(0)
    
    # 增加左右padding
    if 'padding:' in currency_item_css:
        # 将原来的padding修改为更大的左右padding
        currency_item_css = re.sub(
            r'padding:\s*[^;]+;',
            'padding: 6px 12px;',
            currency_item_css
        )
    else:
        currency_item_css = currency_item_css.replace(';', '; padding: 6px 12px;')
    
    content = content.replace(currency_item_match.group(0), currency_item_css)
    print("✅ 已调整currency-item padding")
else:
    print("⚠️ 未找到currency-item CSS")

# 6. 调整容器宽度，给自适应布局更多空间
container_pattern = r'\.container\s*\{[^}]*\}'
container_match = re.search(container_pattern, content)

if container_match:
    container_css = container_match.group(0)
    
    # 增加最大宽度
    if 'max-width:' in container_css:
        container_css = re.sub(
            r'max-width:\s*[^;]+;',
            'max-width: 500px;',
            container_css
        )
    else:
        container_css = container_css.replace(';', '; max-width: 500px;')
    
    content = content.replace(container_match.group(0), container_css)
    print("✅ 已调整容器宽度")
else:
    print("⚠️ 未找到container CSS")

# 7. 修改HTML结构，让货币代码和名称在同一行显示
# 找到currency-code的HTML部分
# 原来的: <div class="currency-code">${currencyCode}<span class="currency-name">${currency.name}</span></div>
# 修改为: <div class="currency-code"><span class="currency-code-text">${currencyCode}</span><span class="currency-name">${currency.name}</span></div>

html_pattern = r'<div class="currency-code">(.*?)</div>'
html_matches = re.findall(html_pattern, content, re.DOTALL)

if html_matches:
    for old_html in set(html_matches):
        # 提取货币代码和名称
        if '<span class="currency-name">' in old_html:
            # 已经是正确的格式
            continue
        
        # 修改为水平布局
        currency_code = old_html.replace('${currencyCode}', '').replace('${currency.name}', '').strip()
        new_html = f'<span class="currency-code-text">${{currencyCode}}</span><span class="currency-name">${{currency.name}}</span>'
        
        content = content.replace(
            f'<div class="currency-code">{old_html}</div>',
            f'<div class="currency-code">{new_html}</div>'
        )
    
    print("✅ 已修改HTML结构为水平布局")

# 保存修改
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 自适应宽度布局已应用完成")
