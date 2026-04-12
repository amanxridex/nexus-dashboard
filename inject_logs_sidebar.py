import os
import glob
import re

html_files = glob.glob('*.html')

logs_nav_item = '''
            <a href="logs.html" class="nav-item">
                <i class="fas fa-terminal"></i>
                <span>System Logs</span>
            </a>'''

for file in html_files:
    if file == 'logs.html': 
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'href="logs.html"' in content: 
        continue
        
    # Append right under analytics
    analytics_pattern = r'(<a href="analytics\.html" class="nav-item[^"]*">.*?<\/a>)'
    
    if re.search(analytics_pattern, content, re.DOTALL):
        new_content = re.sub(analytics_pattern, r'\1' + logs_nav_item, content, flags=re.DOTALL)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Injected Logs completely into {file}')
