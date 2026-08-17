import os
import re

html_files = [
    'dashboard.html', 'scanner.html', 'collection.html', 'rewards.html',
    'leaderboard.html', 'challenges.html', 'certificates.html', 'alerts.html',
    'impact.html', 'partners.html', 'profile.html'
]
base_dir = r"c:\Users\JOYCERUTH\OneDrive\Desktop\Waste Segregation\ecosort"

sidebar_regex = re.compile(r'<aside class="sidebar".*?</aside>', re.DOTALL)
topbar_regex = re.compile(r'<header class="topbar">.*?<h2[^>]*>(.*?)</h2>.*?</header>', re.DOTALL)

nav_html = """
    <!-- Minimal Header -->
    <header class="minimal-header">
        <div class="header-logo">
            <i class="fa-solid fa-leaf"></i> EcoSort
        </div>
        <div class="header-actions">
            <button class="icon-btn"><i class="fa-regular fa-bell"></i></button>
            <div class="user-avatar" id="topAvatar" onclick="window.location.href='profile.html'">U</div>
        </div>
    </header>

    <!-- Floating Bottom Dock -->
    <nav class="floating-dock">
        <a href="dashboard.html" class="dock-item" data-page="dashboard.html">
            <i class="fa-solid fa-house"></i>
            <span>Dashboard</span>
        </a>
        <a href="collection.html" class="dock-item" data-page="collection.html">
            <i class="fa-solid fa-box"></i>
            <span>Collection</span>
        </a>
        <a href="scanner.html" class="dock-item scan-btn" data-page="scanner.html">
            <div class="scan-circle">
                <i class="fa-solid fa-camera"></i>
            </div>
        </a>
        <a href="rewards.html" class="dock-item" data-page="rewards.html">
            <i class="fa-solid fa-star"></i>
            <span>Rewards</span>
        </a>
        <button class="dock-item more-btn" id="moreNavBtn">
            <i class="fa-solid fa-ellipsis"></i>
            <span>More</span>
        </button>
    </nav>
    
    <!-- More Menu -->
    <div class="more-menu-overlay" id="moreNavOverlay"></div>
    <div class="more-menu" id="moreNavMenu">
        <div class="more-menu-header">
            <h4>Explore EcoSort</h4>
            <button id="closeMoreMenu"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="more-menu-grid">
            <a href="impact.html" class="more-item"><i class="fa-solid fa-earth-americas" style="color: #2196f3;"></i> <span>Impact</span></a>
            <a href="leaderboard.html" class="more-item"><i class="fa-solid fa-trophy" style="color: #fbc02d;"></i> <span>Rankings</span></a>
            <a href="challenges.html" class="more-item"><i class="fa-solid fa-bullseye" style="color: #ff5722;"></i> <span>Challenges</span></a>
            <a href="certificates.html" class="more-item"><i class="fa-solid fa-certificate" style="color: #9c27b0;"></i> <span>Certificates</span></a>
            <a href="alerts.html" class="more-item"><i class="fa-solid fa-bell" style="color: #e91e63;"></i> <span>Alerts</span></a>
            <a href="partners.html" class="more-item"><i class="fa-solid fa-building" style="color: #607d8b;"></i> <span>Partners</span></a>
            <a href="profile.html" class="more-item"><i class="fa-solid fa-user" style="color: #4caf50;"></i> <span>Profile</span></a>
            <a href="#" onclick="logout(); return false;" class="more-item text-danger"><i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span></a>
        </div>
    </div>
"""

for f in html_files:
    path = os.path.join(base_dir, f)
    if not os.path.exists(path):
        print(f"Skipping {f}, not found.")
        continue
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def replace_topbar(match):
        title = match.group(1)
        return f'<div class="page-header" style="margin-bottom: 2rem;"><h2 style="margin:0; font-size: 1.5rem; color: var(--primary-dark);">{title}</h2></div>'
    
    content = topbar_regex.sub(replace_topbar, content)
    content = sidebar_regex.sub('', content)
    
    if '<div class="app-container">' in content and '<!-- Minimal Header -->' not in content:
        content = content.replace('<div class="app-container">', f'<div class="app-container">\n{nav_html}')
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Updated all HTML files successfully.")
