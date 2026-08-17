// Municipal Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Check Authentication (Mock)
    if (!localStorage.getItem('municipalLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the default section
    showSection('overview', document.querySelector('.nav-item.active'));

    // Populate Data
    populateCollectionTable();
    populateSmartBins();
    populatePartners();
    populatePickupRequests();

    // Initialize Charts
    initRecyclingChart();
    initAreaChart();
    
    // The map is initialized when its section is shown to avoid Leaflet rendering bugs
});

// Sidebar Navigation
function showSection(sectionId, element) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show target section
    document.getElementById('section-' + sectionId).classList.add('active');
    
    // Update Sidebar classes
    if (element) {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        element.classList.add('active');
        
        // Update Title
        document.getElementById('pageTitle').textContent = element.textContent.trim() + ' Dashboard';
    }
    
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');

    // Initialize Map if the map section is shown
    if (sectionId === 'map') {
        setTimeout(initMap, 100);
    }
    
    // Refresh pickup requests if navigating to it
    if (sectionId === 'pickup') {
        populatePickupRequests();
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
    localStorage.removeItem('municipalLoggedIn');
    window.location.href = 'login.html';
}

// ----------------------------------------------------
// Demo Data & Populaton
// ----------------------------------------------------

function populateCollectionTable() {
    const data = [
        { area: 'Area A', collected: '2,450 kg', bins: 24, status: 'Complete', class: 'green', last: '10 mins ago', vehicle: 'V-04' },
        { area: 'Area B', collected: '1,820 kg', bins: 18, status: 'In Progress', class: 'yellow', last: 'Currently Active', vehicle: 'V-12' },
        { area: 'Area C', collected: '2,100 kg', bins: 21, status: 'Complete', class: 'green', last: '1 hour ago', vehicle: 'V-07' },
        { area: 'Area D', collected: '980 kg', bins: 12, status: 'Pending', class: 'red', last: 'Scheduled 14:00', vehicle: 'V-02' },
        { area: 'Area E', collected: '3,100 kg', bins: 30, status: 'Complete', class: 'green', last: '2 hours ago', vehicle: 'V-09' }
    ];

    const tbody = document.getElementById('collection-table-body');
    if (!tbody) return;
    
    let html = '';
    data.forEach(row => {
        html += `
            <tr>
                <td><strong>${row.area}</strong></td>
                <td>${row.collected}</td>
                <td>${row.bins}</td>
                <td><span class="status-indicator"><div class="dot ${row.class}"></div> ${row.status}</span></td>
                <td>${row.last}</td>
                <td>${row.vehicle}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function populateSmartBins() {
    const data = [
        { id: '101', area: 'Area A', type: 'Recyclable', fill: 72, status: 'Online', class: 'green' },
        { id: '102', area: 'Area B', type: 'Organic', fill: 91, status: 'Almost Full', class: 'yellow' },
        { id: '103', area: 'Area C', type: 'Hazardous', fill: 100, status: 'Full', class: 'red' },
        { id: '104', area: 'Area A', type: 'General', fill: 45, status: 'Online', class: 'green' },
        { id: '105', area: 'Area D', type: 'Recyclable', fill: 12, status: 'Online', class: 'green' },
        { id: '106', area: 'Area C', type: 'Organic', fill: 88, status: 'Almost Full', class: 'yellow' }
    ];

    const container = document.getElementById('bins-container');
    if (!container) return;

    let html = '';
    data.forEach(bin => {
        let icon = 'trash-can';
        let color = '#ccc';
        if (bin.type === 'Recyclable') { icon = 'recycle'; color = '#58d68d'; }
        if (bin.type === 'Organic') { icon = 'seedling'; color = '#a9dfbf'; }
        if (bin.type === 'Hazardous') { icon = 'triangle-exclamation'; color = '#ff6b6b'; }

        html += `
            <div class="bin-card">
                <div class="bin-header">
                    <span class="bin-title">Bin #${bin.id}</span>
                    <i class="fa-solid fa-${icon}" style="color: ${color};"></i>
                </div>
                <div class="bin-location"><i class="fa-solid fa-location-dot"></i> ${bin.area} &bull; ${bin.type}</div>
                <div class="status-indicator" style="margin-bottom: 0.5rem;">
                    <div class="dot ${bin.class}"></div> ${bin.status}
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${bin.fill}%; background: ${color}; color: ${bin.fill > 20 ? 'black' : 'white'}">${bin.fill}%</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function populatePartners() {
    const data = [
        { name: 'Demo Recycling Corp', type: 'Recycling', icon: 'recycle', location: 'North Zone', received: '6,820 kg', status: 'Active', output: 'Raw Plastic/Metal' },
        { name: 'EcoBio Facilities', type: 'Organic', icon: 'seedling', location: 'East Zone', received: '3,250 kg', status: 'Processing', output: 'Compost' },
        { name: 'City Energy Plant', type: 'Energy Recovery', icon: 'bolt', location: 'South Zone', received: '1,780 kg', status: 'Active', output: '2,450 kWh' },
        { name: 'Safe E-Waste LLC', type: 'E-Waste', icon: 'microchip', location: 'West Zone', received: '480 kg', status: 'Batching', output: 'Recovered Rare Metals' }
    ];

    const container = document.getElementById('partners-container');
    if (!container) return;

    let html = '';
    data.forEach(p => {
        html += `
            <div class="bin-card">
                <div class="bin-header">
                    <span class="bin-title">${p.name}</span>
                    <i class="fa-solid fa-${p.icon}"></i>
                </div>
                <div class="bin-location"><i class="fa-solid fa-tag"></i> ${p.type} &bull; ${p.location}</div>
                <hr style="border-color: rgba(255,255,255,0.05); margin: 1rem 0;">
                <p style="margin: 0.5rem 0; font-size: 0.9rem;"><strong>Received:</strong> ${p.received}</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;"><strong>Status:</strong> ${p.status}</p>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;"><strong>Output:</strong> <span style="color: var(--neon-green);">${p.output}</span></p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ----------------------------------------------------
// Pickup Requests Logic
// ----------------------------------------------------

window.filterPickupRequests = function() {
    populatePickupRequests();
}

function populatePickupRequests() {
    const tbody = document.getElementById('pickup-table-body');
    if (!tbody) return;
    
    const filter = document.getElementById('pickupFilter') ? document.getElementById('pickupFilter').value : 'All';
    let requests = JSON.parse(localStorage.getItem('ecosort_pickup_requests')) || [];
    
    // Check if there are no requests
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No pickup requests found.</td></tr>';
        return;
    }
    
    // Filter
    if (filter !== 'All') {
        requests = requests.filter(r => r.status === filter);
    }
    
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No pickup requests matching the filter.</td></tr>';
        return;
    }

    let html = '';
    // Reverse array to show newest first
    requests.reverse().forEach(req => {
        let statusClass = 'yellow'; // pending
        if (req.status === 'Accepted') statusClass = 'blue';
        if (req.status === 'Collector Assigned') statusClass = 'purple';
        if (req.status === 'Collected') statusClass = 'green';
        if (req.status === 'Cancelled') statusClass = 'red';
        
        let actionButtons = '';
        if (req.status === 'Pending') {
            actionButtons = `<button class="btn btn-sm" onclick="changePickupStatus('${req.id}', 'Accepted')" style="background: var(--info); color: white; padding: 5px 10px; font-size: 0.8rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Accept</button>`;
        } else if (req.status === 'Accepted') {
            actionButtons = `<button class="btn btn-sm" onclick="changePickupStatus('${req.id}', 'Collector Assigned')" style="background: var(--primary-color); color: white; padding: 5px 10px; font-size: 0.8rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Assign Collector</button>`;
        } else if (req.status === 'Collector Assigned') {
            actionButtons = `<button class="btn btn-sm" onclick="changePickupStatus('${req.id}', 'Collected')" style="background: var(--success); color: white; padding: 5px 10px; font-size: 0.8rem; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Mark Collected</button>`;
        } else if (req.status === 'Collected') {
            actionButtons = `<span style="color: var(--success); font-weight: bold;"><i class="fa-solid fa-check"></i> Finished</span>`;
        }
        
        html += `
            <tr>
                <td><strong>${req.id}</strong></td>
                <td>
                    <div style="font-weight: 500;">${req.userName}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${req.address}</div>
                </td>
                <td>
                    <div>${req.wasteType}</div>
                    <div style="font-size: 0.8rem; color: var(--primary-color);">${req.category}</div>
                </td>
                <td>${req.date} <br> <small>${req.time}</small></td>
                <td><span class="status-indicator"><div class="dot ${statusClass}"></div> ${req.status}</span></td>
                <td>
                    ${actionButtons}
                    ${req.status !== 'Collected' ? `<button class="btn btn-sm" style="background: #e0e0e0; color: #333; padding: 5px 10px; font-size: 0.8rem; border: none; border-radius: 4px; cursor: pointer;" onclick="alert('Viewing map for ${req.id}')"><i class="fa-solid fa-map"></i> View</button>` : ''}
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

window.changePickupStatus = function(id, newStatus) {
    let requests = JSON.parse(localStorage.getItem('ecosort_pickup_requests')) || [];
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index].status = newStatus;
        localStorage.setItem('ecosort_pickup_requests', JSON.stringify(requests));
        populatePickupRequests(); // Refresh table
    }
}

// ----------------------------------------------------
// Charts (Chart.js)
// ----------------------------------------------------
Chart.defaults.color = '#555';
Chart.defaults.font.family = "'Outfit', sans-serif";

function initRecyclingChart() {
    const ctx = document.getElementById('recyclingChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Plastic', 'Paper', 'Metal', 'Glass'],
            datasets: [{
                data: [2850, 1920, 1240, 810],
                backgroundColor: [
                    '#4facfe', // blue
                    '#a9dfbf', // light green
                    '#f1c40f', // yellow
                    '#e0e0e0'  // grey/white
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

function initAreaChart() {
    const ctx = document.getElementById('areaChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Area A', 'Area B', 'Area C', 'Area D', 'Area E'],
            datasets: [
                {
                    label: 'Recyclable (kg)',
                    data: [1200, 900, 1100, 400, 1500],
                    backgroundColor: '#4facfe'
                },
                {
                    label: 'Organic (kg)',
                    data: [800, 600, 700, 300, 1000],
                    backgroundColor: '#58d68d'
                },
                {
                    label: 'Other/Hazardous (kg)',
                    data: [450, 320, 300, 280, 600],
                    backgroundColor: '#ff6b6b'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

// ----------------------------------------------------
// Map (Leaflet)
// ----------------------------------------------------
let mapInitialized = false;
function initMap() {
    if (mapInitialized || typeof L === 'undefined') return;
    
    const mapEl = document.getElementById('municipal-map');
    if (!mapEl) return;
    
    // Map set to Andhra Pradesh (Vijayawada region)
    const map = L.map('municipal-map').setView([16.5062, 80.6480], 12);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);
    
    // Demo Markers
    
    // Bins (Green)
    const binIcon = L.divIcon({ html: '<div style="background:#58d68d; width:15px; height:15px; border-radius:50%; border:2px solid white;"></div>', className: '' });
    L.marker([16.5162, 80.6280], {icon: binIcon}).addTo(map).bindPopup('<b>Bin #101</b><br>Area A (Recyclable)');
    L.marker([16.4962, 80.6580], {icon: binIcon}).addTo(map).bindPopup('<b>Bin #102</b><br>Area B (Organic)');
    L.marker([16.5362, 80.6480], {icon: binIcon}).addTo(map).bindPopup('<b>Bin #103</b><br>Area C (Hazardous)');
    
    // Truck (Blue)
    const truckIcon = L.divIcon({ html: '<div style="background:#4facfe; width:20px; height:20px; border-radius:5px; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-truck"></i></div>', className: '' });
    L.marker([16.5100, 80.6400], {icon: truckIcon}).addTo(map).bindPopup('<b>Vehicle V-04</b><br>Status: In Route');
    
    // Facility (Yellow)
    const facilityIcon = L.divIcon({ html: '<div style="background:#f1c40f; width:25px; height:25px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:black; font-size:12px;"><i class="fa-solid fa-building"></i></div>', className: '' });
    L.marker([16.5200, 80.6700], {icon: facilityIcon}).addTo(map).bindPopup('<b>Demo Recycling Corp</b><br>Partner Facility');
    
    mapInitialized = true;
}
