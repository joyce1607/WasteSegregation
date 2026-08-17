/**
 * EcoSort - Shared Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Dock More Menu
    const moreNavBtn = document.getElementById('moreNavBtn');
    const moreNavMenu = document.getElementById('moreNavMenu');
    const moreNavOverlay = document.getElementById('moreNavOverlay');
    const closeMoreMenu = document.getElementById('closeMoreMenu');

    function toggleMoreMenu() {
        if (!moreNavMenu || !moreNavOverlay) return;
        moreNavMenu.classList.toggle('open');
        moreNavOverlay.classList.toggle('open');
    }

    if (moreNavBtn) moreNavBtn.addEventListener('click', toggleMoreMenu);
    if (closeMoreMenu) closeMoreMenu.addEventListener('click', toggleMoreMenu);
    if (moreNavOverlay) moreNavOverlay.addEventListener('click', toggleMoreMenu);
    
    // Highlight Active Dock Item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.dock-item').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2. Load User Data (Check Auth)
    if (typeof checkAuth === 'function') {
        const user = checkAuth();
        if (user) {
            updateGlobalUI(user);
        }
    }
});

// Update top bar elements with user data
function updateGlobalUI(user) {
    const topName = document.getElementById('topName');
    const topLevel = document.getElementById('topLevel');
    const topAvatar = document.getElementById('topAvatar');

    if (topName) topName.textContent = user.fullName;
    if (topLevel) topLevel.textContent = user.level;
    if (topAvatar) {
        topAvatar.textContent = user.fullName.charAt(0).toUpperCase();
    }
}
