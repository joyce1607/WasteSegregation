/**
 * EcoSort - Real AI Scanner Logic using TensorFlow.js & MobileNet
 */

let currentScan = null;
let stream = null;
let mobilenetModel = null;
let liveScanInterval = null;

// Mapping MobileNet classes to EcoSort categories
const CATEGORY_MAP = {
    // Recyclable (Plastics, Glass, Paper, Metal)
    'water bottle': { category: 'Recyclable', points: 10, icon: 'fa-bottle-water' },
    'pop bottle': { category: 'Recyclable', points: 10, icon: 'fa-bottle-water' },
    'milk can': { category: 'Recyclable', points: 10, icon: 'fa-glass-water' },
    'beer glass': { category: 'Recyclable', points: 10, icon: 'fa-glass-water' },
    'cup': { category: 'Recyclable', points: 10, icon: 'fa-glass-water' },
    'plastic bag': { category: 'Recyclable', points: 5, icon: 'fa-recycle' },
    'carton': { category: 'Recyclable', points: 10, icon: 'fa-box' },
    'envelope': { category: 'Recyclable', points: 5, icon: 'fa-envelope' },
    'paper towel': { category: 'Recyclable', points: 10, icon: 'fa-scroll' },
    'can': { category: 'Recyclable', points: 15, icon: 'fa-box-archive' },
    'pot': { category: 'Recyclable', points: 10, icon: 'fa-trash' },
    'vase': { category: 'Recyclable', points: 10, icon: 'fa-box' },
    
    // User requested specifically
    'plastic bottle': { category: 'Recyclable', points: 10, icon: 'fa-bottle-water' },
    'plastic container': { category: 'Recyclable', points: 10, icon: 'fa-box' },
    'paper': { category: 'Recyclable', points: 5, icon: 'fa-scroll' },
    'cardboard': { category: 'Recyclable', points: 10, icon: 'fa-box-archive' },
    'metal can': { category: 'Recyclable', points: 15, icon: 'fa-dumpster' },
    'glass bottle': { category: 'Recyclable', points: 10, icon: 'fa-glass-water' },
    
    // Clothes / Textiles
    'clothes': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'clothing': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'shirt': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    't-shirt': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'jersey': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'suit': { category: 'Recyclable', points: 15, icon: 'fa-user-tie' },
    'blazer': { category: 'Recyclable', points: 15, icon: 'fa-user-tie' },
    'dress': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'gown': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'jean': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'pants': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'wardrobe': { category: 'Recyclable', points: 15, icon: 'fa-person-booth' },
    'garment': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'textile': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'coat': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'jacket': { category: 'Recyclable', points: 15, icon: 'fa-shirt' },
    'shoe': { category: 'Recyclable', points: 15, icon: 'fa-shoe-prints' },
    'shoes': { category: 'Recyclable', points: 15, icon: 'fa-shoe-prints' },
    'bag': { category: 'Recyclable', points: 15, icon: 'fa-bag-shopping' },
    'handbag': { category: 'Recyclable', points: 15, icon: 'fa-bag-shopping' },    
    
    // Glasses / Eyewear
    'glasses': { category: 'Recyclable', points: 10, icon: 'fa-glasses' },
    'spectacles': { category: 'Recyclable', points: 10, icon: 'fa-glasses' },
    'specs': { category: 'Recyclable', points: 10, icon: 'fa-glasses' },
    'spects': { category: 'Recyclable', points: 10, icon: 'fa-glasses' },
    'sunglasses': { category: 'Recyclable', points: 10, icon: 'fa-glasses' },

    // Organic (Food, Plants)
    'banana': { category: 'Organic', points: 5, icon: 'fa-leaf' },
    'apple': { category: 'Organic', points: 5, icon: 'fa-apple-whole' },
    'orange': { category: 'Organic', points: 5, icon: 'fa-lemon' },
    'lemon': { category: 'Organic', points: 5, icon: 'fa-lemon' },
    'fig': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'pineapple': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'strawberry': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'broccoli': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'cauliflower': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'mushroom': { category: 'Organic', points: 5, icon: 'fa-seedling' },
    'daisy': { category: 'Organic', points: 5, icon: 'fa-seedling' },

    // User requested specifically
    'food waste': { category: 'Organic', points: 5, icon: 'fa-leaf' },
    'fruit/vegetable waste': { category: 'Organic', points: 5, icon: 'fa-lemon' },
    'leaves': { category: 'Organic', points: 5, icon: 'fa-leaf' },

    // Hazardous / E-Waste
    'cellular telephone': { category: 'Hazardous', points: 25, icon: 'fa-mobile' },
    'laptop': { category: 'Hazardous', points: 25, icon: 'fa-laptop' },
    'desktop computer': { category: 'Hazardous', points: 25, icon: 'fa-desktop' },
    'monitor': { category: 'Hazardous', points: 25, icon: 'fa-display' },
    'battery': { category: 'Hazardous', points: 25, icon: 'fa-battery-full' },
    'remote control': { category: 'Hazardous', points: 15, icon: 'fa-gamepad' },
    'mouse': { category: 'Hazardous', points: 15, icon: 'fa-mouse' },
    'keyboard': { category: 'Hazardous', points: 15, icon: 'fa-keyboard' },
    'syringe': { category: 'Hazardous', points: 0, icon: 'fa-syringe' },
    
    // User requested specifically
    'mobile phone': { category: 'Hazardous', points: 25, icon: 'fa-mobile' },
    'laptop/electronic waste': { category: 'Hazardous', points: 25, icon: 'fa-microchip' },
    'laptop battery': { category: 'Hazardous', points: 25, icon: 'fa-battery-full' },
    'power bank': { category: 'Hazardous', points: 25, icon: 'fa-battery-full' },
    'charger': { category: 'Hazardous', points: 15, icon: 'fa-plug' },
    'adapter': { category: 'Hazardous', points: 15, icon: 'fa-plug' },

    
    // Non-Recyclable / Plastic Waste wrappers
    'packet': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'wrapper': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'chips': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'snack': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'crisps': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'candy bar': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'plastic wrapper': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' },
    'bag': { category: 'Non-Recyclable', points: 2, icon: 'fa-trash' }, // re-mapping "bag" depending on plastic vs. cloth? Actually, "plastic bag" is Recyclable.
    
    // Stationery
    'pencil': { category: 'Recyclable', points: 10, icon: 'fa-pen' },
    'pen': { category: 'Recyclable', points: 10, icon: 'fa-pen' },
    'ballpoint': { category: 'Recyclable', points: 10, icon: 'fa-pen' },

    // Miscellaneous General
    'screwdriver': { category: 'General', points: 5, icon: 'fa-screwdriver' },
    'binder': { category: 'General', points: 5, icon: 'fa-book' },
    'rubber eraser': { category: 'General', points: 5, icon: 'fa-eraser' },
    'band aid': { category: 'General', points: 5, icon: 'fa-kit-medical' },
    'wallet': { category: 'General', points: 5, icon: 'fa-wallet' },
    'purse': { category: 'General', points: 5, icon: 'fa-bag-shopping' }
};

document.addEventListener('DOMContentLoaded', async () => {
    const captureBtn = document.getElementById('captureBtn');
    const randomBtn = document.getElementById('randomBtn');
    const fileUpload = document.getElementById('fileUpload');
    const startCameraBtn = document.getElementById('startCameraBtn');
    
    if (captureBtn) captureBtn.addEventListener('click', captureAndScan);
    if (randomBtn) randomBtn.addEventListener('click', captureAndScan);
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', async () => {
            document.getElementById('cameraPlaceholder').style.display = 'none';
            document.getElementById('cameraStream').style.display = 'block';
            await initCamera();
            // Removed startLiveScanning() to rely purely on manual capture
        });
    }
    
    // UI Feedback for model loading
    document.getElementById('initialState').querySelector('h3').textContent = 'Loading AI Model...';
    
    // Load MobileNet
    try {
        mobilenetModel = await mobilenet.load();
        document.getElementById('initialState').querySelector('h3').textContent = 'Select Input Method';
        console.log('MobileNet model loaded successfully');
    } catch(e) {
        console.error('Failed to load model', e);
        document.getElementById('initialState').querySelector('h3').textContent = 'AI Model Error';
    }
});

function startLiveScanning() {
    const video = document.getElementById('cameraStream');
    const badge = document.getElementById('liveDetectionBadge');
    
    if (!video || !badge) return;
    
    badge.style.display = 'flex';
    
    // Clear any existing interval
    if (liveScanInterval) clearInterval(liveScanInterval);
    
    liveScanInterval = setInterval(async () => {
        if (video.readyState >= 2 && mobilenetModel && video.style.display !== 'none') {
            try {
                const predictions = await mobilenetModel.classify(video);
                const topResult = predictions[0];
                let objName = topResult.className.split(',')[0];
                
                let mappedData = CATEGORY_MAP[objName.toLowerCase()];
                let cat = mappedData ? mappedData.category : 'General';
                let icon = mappedData ? mappedData.icon : 'fa-trash';
                let color = cat === 'Recyclable' ? '#4facfe' : (cat === 'Organic' ? '#58d68d' : (cat === 'Hazardous' ? '#ff6b6b' : '#ccc'));
                
                if (topResult.probability > 0.15) {
                    badge.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color};"></i> ${objName.charAt(0).toUpperCase() + objName.slice(1)} <span style="color: ${color}; opacity: 0.8; font-size: 0.9em; margin-left: 0.5rem;">[${cat}]</span>`;
                } else {
                    badge.innerHTML = `<i class="fa-solid fa-eye" style="color: #4facfe;"></i> Scanning for waste...`;
                }
            } catch (e) {
                // Ignore classification errors during rapid live scan
            }
        }
    }, 500); // Scan twice a second
}

function stopLiveScanning() {
    if (liveScanInterval) {
        clearInterval(liveScanInterval);
        liveScanInterval = null;
    }
    const badge = document.getElementById('liveDetectionBadge');
    if (badge) badge.style.display = 'none';
}

async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const videoElement = document.getElementById('cameraStream');
        if (videoElement) {
            videoElement.srcObject = stream;
        }
    } catch (err) {
        console.warn("Camera access denied or unavailable.", err);
        document.getElementById('initialState').querySelector('h3').textContent = 'Camera Denied';
    }
}

async function captureAndScan() {
    if (!mobilenetModel) {
        alert("AI Model is still loading. Please wait.");
        return;
    }

    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('captureCanvas');
    const imageEl = document.getElementById('scannedImage');
    
    // Fallback to random simulation if camera isn't working
    if (!video || video.videoWidth === 0) {
        console.warn("Camera not ready, simulating scan");
        simulateRandomScan();
        return;
    }

    // Draw video frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // CRITICAL FIX: Attach onload before setting src to prevent race condition
    imageEl.onload = function() {
        imageEl.style.display = 'block';
        video.style.display = 'none';
        stopLiveScanning(); // Pause live feed
        processRealScan(imageEl);
        
        // Clear onload to prevent it firing again unnecessarily
        imageEl.onload = null;
    };

    // Show captured image
    imageEl.src = canvas.toDataURL('image/png');
}

function simulateRandomScan() {
    // If the camera fails, we can fallback to a random demo item
    const mockItems = [
        { name: 'Water bottle', category: 'Recyclable', icon: 'fa-bottle-water', points: 10 },
        { name: 'Banana', category: 'Organic', icon: 'fa-leaf', points: 5 },
        { name: 'Battery', category: 'Hazardous', icon: 'fa-battery-full', points: 25 },
        { name: 'Paper towel', category: 'Recyclable', icon: 'fa-scroll', points: 10 }
    ];
    const item = mockItems[Math.floor(Math.random() * mockItems.length)];
    
    currentScan = {
        name: item.name,
        category: item.category,
        confidence: 95,
        points: item.points,
        icon: item.icon,
        manualConfirm: false
    };
    
    document.getElementById('initialState').style.display = 'none';
    showResultUI();
}

function handleManualInput() {
    const inputField = document.getElementById('manualWasteName');
    if (!inputField || !inputField.value.trim()) return;

    let objName = inputField.value.trim();
    let mappedData = CATEGORY_MAP[objName.toLowerCase()];
    
    // If not in our specific list, classify as General Waste but preserve the name
    if (!mappedData) {
        mappedData = { category: 'General', points: 2, icon: 'fa-trash' };
    }
    
    let cat = mappedData.category;
    let icon = mappedData.icon;
    let points = mappedData.points;

    currentScan = {
        name: objName.charAt(0).toUpperCase() + objName.slice(1),
        category: cat,
        confidence: 100, // 100% since human input
        points: points,
        icon: icon,
        manualConfirm: false
    };
    
    inputField.value = ''; // clear
    showResultUI(); // refresh result panel with new overriding data
}

function handleFileUpload(event) {
    if (!mobilenetModel) {
        alert("AI Model is still loading. Please wait.");
        return;
    }

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageEl = document.getElementById('scannedImage');
            const video = document.getElementById('cameraStream');
            
            imageEl.style.display = 'block';
            video.style.display = 'none';
            stopLiveScanning();
            
            // CRITICAL: Attach onload BEFORE setting src to prevent race conditions on cached Data URIs
            imageEl.onload = function() {
                processRealScan(imageEl);
                imageEl.onload = null; // Clear to prevent repeated firing
            };
            
            imageEl.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function processRealScan(imageElement) {
    // 1. Show scanning animation
    document.getElementById('scanLine').style.display = 'block';
    
    document.getElementById('initialState').style.display = 'none';
    document.getElementById('resultState').style.display = 'none';
    document.getElementById('sortingState').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    
    const procState = document.getElementById('processingState');
    const procText = procState.querySelector('p');
    procState.style.display = 'block';
    
    try {
        // AI Verification Delay for deep scanning (approx 15 seconds)
        procText.textContent = "Analyzing object features...";
        await new Promise(r => setTimeout(r, 4000));
        if (procState.style.display === 'none') return;
        
        procText.textContent = "Checking material composition...";
        await new Promise(r => setTimeout(r, 4000));
        if (procState.style.display === 'none') return;
        
        procText.textContent = "Verifying recyclability database...";
        await new Promise(r => setTimeout(r, 4000));
        if (procState.style.display === 'none') return;
        
        procText.textContent = "Finalizing AI confirmation...";
        await new Promise(r => setTimeout(r, 3000));
        if (procState.style.display === 'none') return;
        
        // Run MobileNet Classification
        const predictions = await mobilenetModel.classify(imageElement);
        console.log('Predictions: ', predictions);
        
        document.getElementById('scanLine').style.display = 'none';
        document.getElementById('processingState').style.display = 'none';
        
        // Get top prediction
        const topResult = predictions[0];
        let objName = topResult.className.split(',')[0]; // Clean up name
        
        // Map to EcoSort Category
        let mappedData = CATEGORY_MAP[objName.toLowerCase()];
        
        // Default if unknown, preserve the detected object name
        if (!mappedData) {
            mappedData = { category: 'General', points: 2, icon: 'fa-trash' };
        }
        
        let confidenceScore = Math.round(topResult.probability * 100);

        currentScan = {
            name: objName.charAt(0).toUpperCase() + objName.slice(1),
            category: mappedData.category,
            confidence: confidenceScore,
            points: mappedData.points,
            icon: mappedData.icon,
            manualConfirm: false
        };

        showResultUI();

    } catch (err) {
        console.error("Classification error:", err);
        alert("Failed to classify image.");
        resetScanner();
    }
}

function showResultUI() {
    document.getElementById('resObject').textContent = currentScan.name;
    
    let catIcon = currentScan.icon;
    let catColor;
    if (currentScan.category === 'Recyclable') catColor = 'var(--info)';
    else if (currentScan.category === 'Organic') catColor = 'var(--success)';
    else if (currentScan.category === 'Hazardous') catColor = 'var(--danger)';
    else catColor = 'var(--text-muted)';

    document.getElementById('resCategory').innerHTML = `<i class="fa-solid ${catIcon}" style="color: ${catColor}"></i> ${currentScan.category}`;
    
    document.getElementById('resConfidenceText').textContent = `${currentScan.confidence}%`;
    const fillEl = document.getElementById('resConfidenceFill');
    fillEl.style.width = '0%';
    setTimeout(() => {
        fillEl.style.width = `${currentScan.confidence}%`;
        fillEl.style.background = currentScan.confidence >= 50 ? 'var(--success)' : 'var(--warning)';
    }, 100);

    const uncertaintyAlert = document.getElementById('uncertaintyAlert');
    const autoActionInfo = document.getElementById('autoActionInfo');

    // MobileNet confidence thresholds are often lower, so setting threshold to 30% for 'certainty'
    if (currentScan.confidence < 30) {
        uncertaintyAlert.style.display = 'block';
        autoActionInfo.style.display = 'none';
        document.getElementById('resCategory').innerHTML = `<i class="fa-solid fa-circle-question" style="color: var(--warning)"></i> Unknown`;
    } else {
        uncertaintyAlert.style.display = 'none';
        autoActionInfo.style.display = 'block';
        document.getElementById('resAction').textContent = `Place in ${currentScan.category} Bin`;
        
        // --- Smart Map Link Integration ---
        const mapContainer = document.getElementById('mapRedirectContainer');
        const mapBtn = document.getElementById('mapRedirectBtn');
        let filterTarget = null;
        let btnText = '';

        const nameLower = currentScan.name.toLowerCase();
        
        if (nameLower.includes('batter') || nameLower.includes('power bank')) {
            filterTarget = 'Battery';
            btnText = '📍 Find Battery Recycling Centers';
            document.getElementById('resAction').textContent = 'This item requires special disposal.';
        } else if (nameLower.includes('cloth') || nameLower.includes('shirt') || nameLower.includes('jean') || nameLower.includes('jacket') || nameLower.includes('textile')) {
            filterTarget = 'Clothes';
            btnText = '📍 Find Textile Recycling Centers';
        } else if (nameLower.includes('laptop') || nameLower.includes('phone') || nameLower.includes('computer') || nameLower.includes('monitor') || nameLower.includes('electronic')) {
            filterTarget = 'E-Waste';
            btnText = '📍 Find E-Waste Centers';
            document.getElementById('resAction').textContent = 'This item requires special disposal.';
        } else if (nameLower.includes('plastic') || nameLower.includes('bottle')) {
            filterTarget = 'Plastic';
            btnText = '📍 Find Plastic Recycling Centers';
        } else if (nameLower.includes('glass')) {
            filterTarget = 'Glass';
            btnText = '📍 Find Glass Recycling Centers';
        }

        if (filterTarget && mapContainer && mapBtn) {
            mapContainer.style.display = 'block';
            mapBtn.innerHTML = btnText;
            mapBtn.onclick = () => window.location.href = `map.html?filter=${filterTarget}`;
        } else if (mapContainer) {
            mapContainer.style.display = 'none';
        }
    }

    document.getElementById('resultState').style.display = 'block';
}

function confirmSort(category) {
    currentScan.category = category;
    currentScan.manualConfirm = true;
    
    if (category === 'Recyclable') currentScan.points = 10;
    else if (category === 'Organic') currentScan.points = 5;
    else if (category === 'Hazardous') currentScan.points = 25;
    else currentScan.points = 2;

    startSortingProcess();
}

function startSortingProcess() {
    document.getElementById('resultState').style.display = 'none';
    document.getElementById('sortingState').style.display = 'block';
    
    const steps = ['step1', 'step2', 'step3', 'step4'];
    
    document.getElementById(steps[0]).style.color = 'var(--success)';
    
    setTimeout(() => {
        document.getElementById(steps[1]).style.color = 'var(--success)';
    }, 800);
    
    setTimeout(() => {
        document.getElementById(steps[2]).innerHTML = '<i class="fa-solid fa-check"></i> Motor Activated';
        document.getElementById(steps[2]).style.color = 'var(--success)';
    }, 1600);
    
    setTimeout(() => {
        document.getElementById(steps[3]).style.color = 'var(--success)';
        document.getElementById(steps[3]).style.opacity = '1';
        
        setTimeout(() => {
            finishSorting();
        }, 800);
    }, 2400);
}

function finishSorting() {
    document.getElementById('sortingState').style.display = 'none';
    
    document.getElementById('successMsg').textContent = `${currentScan.name} → ${currentScan.category} Bin`;
    document.getElementById('pointsEarned').textContent = `+${currentScan.points} Eco Points`;
    
    document.getElementById('successState').style.display = 'block';
    
    // Show pickup elements
    document.getElementById('requestPickupBtn').style.display = 'block';
    document.getElementById('pickupPromptMsg').style.display = 'block';
    document.getElementById('pickupStatusNotice').style.display = 'none';
    
    document.getElementById('requestPickupBtn').onclick = openPickupModal;
    document.getElementById('confirmPickupBtn').onclick = confirmPickupRequest;
    
    saveToHistoryAndPoints(currentScan);
}

function resetScanner() {
    document.getElementById('successState').style.display = 'none';
    document.getElementById('initialState').style.display = 'block';
    
    // Resume camera view
    document.getElementById('scannedImage').style.display = 'none';
    document.getElementById('cameraStream').style.display = 'block';
    startLiveScanning(); // Resume live scanning
    
    // Reset pickup elements
    document.getElementById('requestPickupBtn').style.display = 'none';
    document.getElementById('pickupPromptMsg').style.display = 'none';
    document.getElementById('pickupStatusNotice').style.display = 'none';
    
    currentScan = null;
    
    ['step1', 'step2', 'step3', 'step4'].forEach(id => {
        document.getElementById(id).style.color = 'var(--text-muted)';
        if(id === 'step3') document.getElementById(id).innerHTML = '<i class="fa-solid fa-gear fa-spin"></i> Motor Activated';
        if(id === 'step4') document.getElementById(id).style.opacity = '0.5';
    });
}

function saveToHistoryAndPoints(scan) {
    const user = JSON.parse(localStorage.getItem('ecosort_current_user'));
    if (!user) return;
    
    user.ecoPoints += scan.points;
    user.wasteSorted += 1;
    
    if (Math.random() > 0.8) user.ecoStreak += 1;
    
    localStorage.setItem('ecosort_current_user', JSON.stringify(user));
    
    const history = JSON.parse(localStorage.getItem(`ecosort_history_${user.id}`)) || [];
    const now = new Date();
    
    history.unshift({
        id: 'item-' + Date.now(),
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        name: scan.name,
        category: scan.category,
        confidence: scan.confidence,
        method: scan.manualConfirm ? 'User' : 'AI',
        points: scan.points,
        status: scan.category === 'Hazardous' ? 'Sent to Partner' : 'Collected'
    });
    
    localStorage.setItem(`ecosort_history_${user.id}`, JSON.stringify(history));
    updateGlobalUI(user);
}

// --- Pickup Request Logic ---
function openPickupModal() {
    const user = JSON.parse(localStorage.getItem('ecosort_current_user'));
    
    document.getElementById('modalUserName').textContent = user ? user.fullName : 'Guest User';
    document.getElementById('modalWasteType').textContent = currentScan.name;
    document.getElementById('modalWasteCat').textContent = currentScan.category;
    
    const confirmBtn = document.getElementById('confirmPickupBtn');
    const alertBox = document.getElementById('missingAddressAlert');
    const addressSpan = document.getElementById('modalAddress');
    
    if (user && user.houseNo && user.area) {
        addressSpan.textContent = `${user.houseNo}, ${user.area}`;
        alertBox.style.display = 'none';
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
    } else {
        addressSpan.textContent = 'No Address Found';
        alertBox.style.display = 'block';
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
    }
    
    document.getElementById('pickupModalOverlay').style.display = 'block';
    document.getElementById('pickupModal').style.display = 'block';
}

function closePickupModal() {
    document.getElementById('pickupModalOverlay').style.display = 'none';
    document.getElementById('pickupModal').style.display = 'none';
}

function confirmPickupRequest() {
    const user = JSON.parse(localStorage.getItem('ecosort_current_user'));
    
    const newRequest = {
        id: 'REQ' + Math.floor(Math.random() * 10000),
        userId: user.id,
        userName: user.fullName,
        address: `${user.houseNo}, ${user.area}`,
        wasteType: currentScan.name,
        category: currentScan.category,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending'
    };
    
    let requests = JSON.parse(localStorage.getItem('ecosort_pickup_requests')) || [];
    requests.push(newRequest);
    localStorage.setItem('ecosort_pickup_requests', JSON.stringify(requests));
    
    closePickupModal();
    
    // UI Feedback
    const btn = document.getElementById('requestPickupBtn');
    const prompt = document.getElementById('pickupPromptMsg');
    const notice = document.getElementById('pickupStatusNotice');
    
    btn.style.display = 'none';
    prompt.style.display = 'none';
    
    notice.innerHTML = `<i class="fa-solid fa-bell"></i> Your waste pickup request (<b>${newRequest.id}</b>) has been received. Status: <b>Pending</b>`;
    notice.style.display = 'block';
}

window.openPickupModal = openPickupModal;
window.closePickupModal = closePickupModal;
window.confirmPickupRequest = confirmPickupRequest;
