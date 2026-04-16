#!/usr/bin/env python3
import re

# 读取 index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 交换表头列的位置
# 原来的表头：货币 | 汇率 (1单位基准货币) | 换算金额 | 100单位换算 | 1000单位换算
# 修改后：货币 | 换算金额 | 汇率 (1单位基准货币) | 100单位换算 | 1000单位换算

# 找到表头部分
header_match = re.search(r'<thead>\s*<tr>(.*?)</tr>\s*</thead>', content, re.DOTALL)
if header_match:
    header_content = header_match.group(1)
    
    # 提取各个th标签
    th_pattern = r'<th[^>]*>(.*?)</th>'
    th_matches = re.findall(th_pattern, header_content, re.DOTALL)
    
    if len(th_matches) >= 3:  # 至少有3列
        # 交换第2列和第3列的位置
        th_matches[1], th_matches[2] = th_matches[2], th_matches[1]
        
        # 更新表头HTML
        new_header = ''
        for i, th_content in enumerate(th_matches):
            # 恢复width属性
            widths = ['20%', '20%', '20%', '20%', '20%']
            new_header += f'<th width="{widths[i]}">{th_content}</th>\n'
        
        # 替换原来的表头内容
        new_header_content = f'<thead>\n    <tr>\n{new_header}    </tr>\n  </thead>'
        content = content[:header_match.start()] + new_header_content + content[header_match.end():]
        
        print("✅ 表头列已交换成功")
        
        # 2. 交换表格数据生成逻辑
        # 找到 JavaScript 中的 table row 生成部分
        row_html_pattern = r'row\.innerHTML = `(.*?)`;'
        row_html_match = re.search(row_html_pattern, content, re.DOTALL)
        
        if row_html_match:
            row_html = row_html_match.group(1)
            
            # 提取各个td标签的内容（注意转义字符）
            td_pattern = r'<td[^>]*>.*?</td>'
            td_matches = re.findall(td_pattern, row_html, re.DOTALL)
            
            if len(td_matches) >= 3:  # 至少有3列数据
                # 交换第2列和第3列
                td_matches[1], td_matches[2] = td_matches[2], td_matches[1]
                
                # 重新构建row.innerHTML
                new_row_html = '\n                    '.join(td_matches)
                new_row_html = new_row_html.replace('\\n', '')  # 清理换行符
                
                # 替换原来的row.innerHTML
                content = content.replace(row_html_match.group(0), f'row.innerHTML = `{new_row_html}`;')
                print("✅ 表格数据列已交换成功")
            else:
                print("⚠️  未找到足够的表格数据列")
        else:
            print("⚠️  未找到表格数据生成部分")
    else:
        print("⚠️  表头列数量不足")
else:
    print("⚠️  未找到表头部分")

# 保存修改
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 文件已保存，正在推送更新...")
