import re
# Update HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
seo_meta = """<meta name="robots" content="index, follow">
<link rel="canonical" href="https://votrenom-portfolio.com/">
<meta property="og:url" content="https://votrenom-portfolio.com/">
<meta property="og:image" content="https://votrenom-portfolio.com/assets/images/profile_avatar_1774733411572.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@votrenom">
<meta name="twitter:title" content="Portfolio — Développeur Full Stack & Designer">
<meta name="twitter:description" content="Création d'expériences web exceptionnelles.">
<meta name="twitter:image" content="https://votrenom-portfolio.com/assets/images/profile_avatar_1774733411572.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Votre Nom",
  "jobTitle": "Développeur Full Stack & Designer",
  "url": "https://votrenom-portfolio.com/",
  "sameAs": [
    "https://github.com/username",
    "https://linkedin.com/in/username"
  ],
  "image": "https://votrenom-portfolio.com/assets/images/profile_avatar_1774733411572.png"
}
</script>"""
html = html.replace('</title>\n<meta', '</title>\n' + seo_meta + '\n<meta')
# Images
html = html.replace('<div class="hero__profile-placeholder">VN</div>', '<img src="assets/images/profile_avatar_1774733411572.png" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">')
html = re.sub(r'<div class="about__image-placeholder">.*?</div>', '<img src="assets/images/profile_avatar_1774733411572.png" alt="Developer Workspace" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius);">', html, flags=re.DOTALL)
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#667eea,#764ba2);">01</div>', '<img src="assets/images/project_ecommerce_1774733427452.png" alt="E-Commerce Platform" style="width:100%;height:100%;object-fit:cover;">')
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#f093fb,#f5576c);">02</div>', '<img src="assets/images/project_mobile_1774733753942.png" alt="Fitness Tracker App" style="width:100%;height:100%;object-fit:cover;">')
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#4facfe,#00f2fe);">03</div>', '<img src="assets/images/project_dashboard_1774733711383.png" alt="Dashboard Analytics" style="width:100%;height:100%;object-fit:cover;">')
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#a18cd1,#fbc2eb);">04</div>', '<img src="assets/images/project_blog_1774734592112.png" alt="Blog CMS" style="width:100%;height:100%;object-fit:cover;">')
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#ffecd2,#fcb69f);">05</div>', '<img src="assets/images/project_dashboard_1774733711383.png" alt="API RESTful" style="width:100%;height:100%;object-fit:cover;">')
html = html.replace('<div class="project-card__image-placeholder" style="background:linear-gradient(135deg,#89f7fe,#66a6ff);">06</div>', '<img src="assets/images/project_brand_1774733771308.png" alt="Brand Identity" style="width:100%;height:100%;object-fit:cover;">')
# Update modal references
html = html.replace('<div class="modal__image" id="modalImage" style="background:var(--gradient);"></div>', '<div class="modal__image" id="modalImage" style="background:var(--bg-dark); background-size: cover; background-position: center;"></div>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
# Update CSS for Glassmorphism & Premium adjustments
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()
css = css.replace('--card-bg: rgba(255,255,255,0.03);', '--card-bg: rgba(255, 255, 255, 0.04);\n  --card-blur: blur(16px);')
css = css.replace('--card-border: rgba(255,255,255,0.06);', '--card-border: rgba(255,255,255,0.08);')
css = css.replace('--primary: #6C63FF;', '--primary: #8a2be2;')
css = css.replace('--accent: #00D9FF;', '--accent: #00f2fe;')
card_rule = '.counter-card {\\n  text-align: center;'
css = css.replace('.counter-card {\n  text-align: center;', '.counter-card {\n  backdrop-filter: var(--card-blur);\n  -webkit-backdrop-filter: var(--card-blur);\n  text-align: center;')
css = css.replace('.skill-card {\n  background: var(--card-bg);', '.skill-card {\n  background: var(--card-bg);\n  backdrop-filter: var(--card-blur);\n  -webkit-backdrop-filter: var(--card-blur);')
css = css.replace('.service-card {\n  background: var(--card-bg);', '.service-card {\n  background: var(--card-bg);\n  backdrop-filter: var(--card-blur);\n  -webkit-backdrop-filter: var(--card-blur);')
css = css.replace('.project-card {\n  background: var(--card-bg);', '.project-card {\n  background: var(--card-bg);\n  backdrop-filter: var(--card-blur);\n  -webkit-backdrop-filter: var(--card-blur);')
css = css.replace('.navbar.scrolled {\n  background: rgba(10, 10, 15, 0.9);', '.navbar.scrolled {\n  background: rgba(10, 10, 15, 0.65);')
# Increase body transition for smooth dark/light
css = css.replace('transition: background 0.5s ease, color 0.5s ease;', 'transition: background 0.5s ease, color 0.5s ease, filter 0.5s ease;')
with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
# Update Javascript
with open('js/script.js', 'r', encoding='utf-8') as f:
    js = f.read()
# Make the modal show the correct image corresponding to the array gradient or url
modal_update = """
  $('#modalImage').style.background = `url(${project.img || ''})`;
  $('#modalImage').style.backgroundSize = 'cover';
  $('#modalImage').style.backgroundPosition = 'center';
"""
old_modal_update = "  $('#modalImage').style.background = project.gradient;"
js = js.replace(old_modal_update, modal_update)
# Add image property to modal array
js = js.replace("gradient: 'linear-gradient(135deg,#667eea,#764ba2)' }", "img: 'assets/images/project_ecommerce_1774733427452.png' }")
js = js.replace("gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' }", "img: 'assets/images/project_mobile_1774733753942.png' }")
js = js.replace("gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)' }", "img: 'assets/images/project_dashboard_1774733711383.png' }")
js = js.replace("gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' }", "img: 'assets/images/project_blog_1774734592112.png' }")
js = js.replace("gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)' }", "img: 'assets/images/project_dashboard_1774733711383.png' }") # reused
js = js.replace("gradient: 'linear-gradient(135deg,#89f7fe,#66a6ff)' }", "img: 'assets/images/project_brand_1774733771308.png' }")
with open('js/script.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updates applied successfully.")
