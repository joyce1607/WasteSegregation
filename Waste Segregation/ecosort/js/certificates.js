/**
 * EcoSort - Certificates Generation Logic
 */

const CERTS_DATA = [
    { id: 'c1', type: 'Sustainability', title: 'Sustainability Contributor', reason: 'For joining the circular economy movement and sorting your first items.', reqPoints: 0 },
    { id: 'c2', type: 'Recycling', title: 'Recycling Champion', reason: 'For consistently sorting recyclable materials and diverting waste from landfills.', reqPoints: 1000 },
    { id: 'c3', type: 'Green Hero', title: 'Green Hero', reason: 'For achieving exceptional milestones in waste reduction and smart sorting.', reqPoints: 5000 },
    { id: 'c4', type: 'Mastery', title: 'Sustainability Master', reason: 'For reaching the highest ranks of environmental contribution and mastery of waste sorting.', reqPoints: 25000 }
];

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    renderCertificates();
});

function renderCertificates() {
    const container = document.getElementById('certList');
    container.innerHTML = '';
    
    CERTS_DATA.forEach(cert => {
        const isUnlocked = currentUser.ecoPoints >= cert.reqPoints;
        
        const html = `
            <div class="card cert-card" style="opacity: ${isUnlocked ? '1' : '0.6'};">
                <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
                <h3 style="margin-bottom: 0.5rem;">${cert.title}</h3>
                <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 1.5rem;">${isUnlocked ? 'Unlocked' : `Requires ${cert.reqPoints.toLocaleString()} points`}</p>
                
                <button class="btn btn-primary" style="width: 100%;" ${!isUnlocked ? 'disabled' : ''} onclick="generateCertificate('${cert.id}')">
                    ${isUnlocked ? '<i class="fa-solid fa-eye"></i> View Certificate' : '<i class="fa-solid fa-lock"></i> Locked'}
                </button>
            </div>
        `;
        container.innerHTML += html;
    });
}

function generateCertificate(certId) {
    const cert = CERTS_DATA.find(c => c.id === certId);
    if(!cert) return;
    
    // Show modal
    document.getElementById('certModal').style.display = 'flex';
    document.getElementById('loadingCert').style.display = 'block';
    document.getElementById('previewImg').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';
    
    // Populate template
    document.getElementById('tplType').textContent = cert.type;
    document.getElementById('tplName').textContent = currentUser.fullName;
    document.getElementById('tplReason').textContent = cert.reason;
    document.getElementById('tplDate').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('tplId').textContent = `ID: ECO-${currentUser.id.split('-')[1]}-${certId.toUpperCase()}`;
    
    // Give DOM time to update before capturing
    setTimeout(() => {
        const templateEl = document.getElementById('certTemplate');
        
        // Temporarily make it visible for html2canvas
        const wrapper = document.getElementById('certificateWrapper');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.zIndex = '-1';
        
        html2canvas(templateEl, {
            scale: 2, // Higher quality
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            // Re-hide wrapper
            wrapper.style.position = 'fixed';
            wrapper.style.top = '-9999px';
            wrapper.style.left = '-9999px';
            
            const imgData = canvas.toDataURL('image/png');
            
            document.getElementById('loadingCert').style.display = 'none';
            
            const preview = document.getElementById('previewImg');
            preview.src = imgData;
            preview.style.display = 'block';
            
            const dlBtn = document.getElementById('downloadBtn');
            dlBtn.href = imgData;
            dlBtn.download = `EcoSort_${cert.title.replace(/\s+/g, '_')}.png`;
            dlBtn.style.display = 'inline-flex';
        });
    }, 500);
}

function closeModal() {
    document.getElementById('certModal').style.display = 'none';
}
