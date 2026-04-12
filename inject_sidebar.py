import os
import glob
import re

html_files = glob.glob('*.html')

restaurant_nav_item = '''
            <a href="restaurants.html" class="nav-item">
                <i class="fas fa-utensils"></i>
                <span>Restaurants</span>
            </a>'''

for file in html_files:
    if file == 'restaurants.html': 
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'href="restaurants.html"' in content: 
        print(f'Skipping {file}, already has Restaurants link.')
        continue
        
    gym_pattern = r'(<a href="gyms\.html" class="nav-item[^"]*">.*?<\/a>)'
    
    if re.search(gym_pattern, content, re.DOTALL):
        new_content = re.sub(gym_pattern, r'\1' + restaurant_nav_item, content, flags=re.DOTALL)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Injected Restaurants cleanly into {file}')
    else:
        print(f'Warning: Could not find Gym link in {file} to attach next to it.')
