/**
 * EcoSort - Interactive Map Logic (Leaflet + Dark Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Map
    // Setting initial view to Andhra Pradesh (near Vijayawada)
    const map = L.map('map', {
        zoomControl: false // We will move zoom control to bottom right later
    }).setView([16.5062, 80.6480], 7); 

    // Add Dark Matter Tile Layer (Free, no API Key needed)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Map Controls (Bottom Right)
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    let currentFilter = 'All';
    let markersLayer = L.layerGroup().addTo(map);
    let userMarker = null;

    // Check URL parameters for initial filters (e.g., from scanner)
    const urlParams = new URLSearchParams(window.location.search);
    const initFilter = urlParams.get('filter');
    if (initFilter) {
        currentFilter = initFilter;
        // Highlight correct filter tab
        document.querySelectorAll('.map-filter').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === initFilter);
        });
    }

    // Mock Data for Centers in Andhra Pradesh
    const allCenters = [
        { id: 1, name: 'Eco Green Recycling (Vijayawada)', lat: 16.5062, lng: 80.6480, distance: 'Local', types: ['Plastic', 'Paper', 'Glass'], status: 'Open', hours: '8:00 AM – 6:00 PM', icon: 'fa-recycle' },
        { id: 2, name: 'TechRecycle Center (Vizag)', lat: 17.6868, lng: 83.2185, distance: 'Local', types: ['E-Waste', 'Battery'], status: 'Open', hours: '9:00 AM – 5:00 PM', icon: 'fa-microchip' },
        { id: 3, name: 'Textile Recovery Hub (Guntur)', lat: 16.3067, lng: 80.4365, distance: 'Local', types: ['Clothes'], status: 'Closing Soon', hours: '9:00 AM – 4:00 PM', icon: 'fa-shirt' },
        { id: 4, name: 'Metro Battery Disposal (Amalapuram)', lat: 16.5787, lng: 82.0061, distance: 'Local', types: ['Battery', 'E-Waste'], status: 'Closed', hours: '10:00 AM – 2:00 PM', icon: 'fa-battery-full' },
        { id: 5, name: 'Global Plastics Co. (Tirupati)', lat: 13.6288, lng: 79.4192, distance: 'Local', types: ['Plastic'], status: 'Open', hours: '24 Hours', icon: 'fa-bottle-water' }
    ];

    // Functions
    function createCustomIcon(faClass, isUser = false) {
        return L.divIcon({
            className: 'custom-leaflet-icon',
            html: `<div class="custom-marker ${isUser ? 'user-marker' : 'recycle-marker'}"><i class="fa-solid ${faClass}"></i></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18]
        });
    }

    function renderMapAndList() {
        markersLayer.clearLayers();
        const listContainer = document.getElementById('centersList');
        listContainer.innerHTML = '';
        
        let filteredCenters = allCenters.filter(c => currentFilter === 'All' || c.types.includes(currentFilter));
        
        document.getElementById('centersCountText').textContent = `${filteredCenters.length} centers found`;

        if (filteredCenters.length === 0) {
            listContainer.innerHTML = `<div class="text-center text-muted" style="padding: 2rem;">No centers found for ${currentFilter}.</div>`;
            return;
        }

        filteredCenters.forEach((center, index) => {
            // Add Marker
            const marker = L.marker([center.lat, center.lng], { icon: createCustomIcon(center.icon) });
            
            const popupHTML = `
                <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${center.name}</h3>
                    <div style="color: #4facfe; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;">📍 ${center.distance}</div>
                    <div style="font-size: 0.85rem; color: #ccc; margin-bottom: 0.5rem;"><strong>Accepts:</strong><br>${center.types.join(' • ')}</div>
                    <div style="font-size: 0.85rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
                        <strong>Hours:</strong> ${center.hours}<br>
                        <strong>Status:</strong> <span style="color: ${center.status === 'Open' ? '#58d68d' : (center.status === 'Closed' ? '#ff6b6b' : '#ffb74d')}">${center.status}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}')" style="flex: 1; padding: 0.5rem; border-radius: 6px; border: none; background: #2196f3; color: white; cursor: pointer; font-weight: 600;">Directions</button>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupHTML);
            markersLayer.addLayer(marker);

            // Add List Item
            const div = document.createElement('div');
            div.className = 'center-item';
            
            let statClass = 'status-open';
            let statIcon = '🟢';
            if (center.status === 'Closing Soon') { statClass = 'status-soon'; statIcon = '🟡'; }
            else if (center.status === 'Closed') { statClass = ''; statIcon = '🔴'; }

            div.innerHTML = `
                <div class="center-title">
                    <span style="display:flex; align-items:center; gap:0.5rem;"><i class="fa-solid ${center.icon}" style="color: var(--primary-color);"></i> ${center.name}</span>
                </div>
                <div style="margin-bottom: 0.5rem;"><span class="dist-badge">📍 ${center.distance}</span></div>
                <div class="center-accepts">${center.types.join(' • ')}</div>
                <div style="margin-bottom: 0.5rem;"><span class="center-status ${statClass}">${statIcon} ${center.status}</span></div>
                <div class="action-row">
                    <button class="btn-filled" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}')"><i class="fa-solid fa-diamond-turn-right"></i> Directions</button>
                </div>
            `;
            
            div.addEventListener('click', () => {
                map.flyTo([center.lat, center.lng], 15);
                marker.openPopup();
                if (window.innerWidth <= 768) {
                    document.getElementById('sidePanel').classList.remove('expanded');
                }
            });

            listContainer.appendChild(div);
        });

        // Fit bounds to show all markers (only if not searching specific location)
        if (markersLayer.getLayers().length > 0 && !userMarker) {
            const group = new L.featureGroup(markersLayer.getLayers());
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // UI Events
    document.querySelectorAll('.map-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentFilter = target.getAttribute('data-filter');
            renderMapAndList();
        });
    });

    document.getElementById('useMyLocationBtn').addEventListener('click', () => {
        // Mock geolocation
        if (userMarker) map.removeLayer(userMarker);
        const myLat = 16.5062, myLng = 80.6480; // Mock Vijayawada User Loc
        userMarker = L.marker([myLat, myLng], { icon: createCustomIcon('fa-user', true) }).addTo(map);
        userMarker.bindPopup('<div style="color:black; font-weight:600;">📍 Your Location</div>').openPopup();
        map.flyTo([myLat, myLng], 7);
        renderMapAndList();
    });

    document.getElementById('mapSearchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = e.target.value.toLowerCase();
            if (val.includes('andhra') || val.includes('ap') || val.includes('vijayawada') || val.includes('vizag') || val.includes('amalapuram')) {
                document.getElementById('useMyLocationBtn').click();
            } else {
                alert("Simulated: Location not found via direct search in demo. Try 'Andhra Pradesh' or 'Vijayawada'.");
            }
        }
    });

    // Mobile Panel Handle
    document.getElementById('mobileHandle').addEventListener('click', () => {
        document.getElementById('sidePanel').classList.toggle('expanded');
    });

    // Initialize View
    renderMapAndList();
});
