import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
# Extract CSS
style_match = re.search(r'<style>(.*?)</style>', html, flags=re.DOTALL)
if style_match:
    css_content = style_match.group(1).strip()
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)
    html = html.replace(style_match.group(0), '<link rel="stylesheet" href="css/style.css">')
# Extract JS
script_match = re.search(r'<script>(.*?)</script>', html, flags=re.DOTALL)
if script_match:
    js_content = script_match.group(1).strip()
    with open('js/script.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    html = html.replace(script_match.group(0), '<script src="js/script.js" defer></script>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Extraction finished.')
