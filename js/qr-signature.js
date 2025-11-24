// QR Signature System
let currentSignatureWorker = null;

function openSignatureQR(workerIC, workerName) {
    currentSignatureWorker = { ic: workerIC, name: workerName };
    
    document.getElementById('qrWorkerName').textContent = workerName;
    document.getElementById('qrWorkerIC').textContent = `IC: ${workerIC}`;
    
    generateQRCode(workerIC, workerName);
    checkExistingSignature(workerIC);
    
    showScreen('qrSignatureScreen');
}

function generateQRCode(workerIC, workerName) {
    const qrData = {
        type: 'signature',
        ic: workerIC,
        name: workerName,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };
    
    const qrString = JSON.stringify(qrData);
    
    // Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    
    // Generate new QR code
    QRCode.toCanvas(document.getElementById('qrcode'), qrString, {
        width: 200,
        margin: 2,
        color: {
            dark: '#2c3e50',
            light: '#ffffff'
        }
    }, function(error) {
        if (error) {
            console.error('QR Code generation error:', error);
            alert('Error generating QR code');
        }
    });
}

function checkExistingSignature(workerIC) {
    // Check if signature exists in localStorage
    const signatures = JSON.parse(localStorage.getItem('signatures') || '{}');
    const signature = signatures[workerIC];
    
    const preview = document.getElementById('signaturePreview');
    const noSignature = document.getElementById('noSignatureText');
    
    if (signature) {
        preview.src = signature;
        preview.style.display = 'block';
        noSignature.style.display = 'none';
    } else {
        preview.style.display = 'none';
        noSignature.style.display = 'block';
    }
}

// Mobile signature functions (would be in separate mobile app)
function openMobileSignature(data) {
    // This would be called when QR code is scanned on mobile
    document.getElementById('mobileWorkerInfo').textContent = 
        `Tandatangan untuk: ${data.name} (${data.ic})`;
    
    showScreen('mobileSignatureScreen');
    initializeSignatureCanvas();
}

function initializeSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const [x, y] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function getCoordinates(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        
        return [x, y];
    }
}

function clearSignature() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const canvas = document.getElementById('signatureCanvas');
    const signatureData = canvas.toDataURL('image/png');
    
    // Save to localStorage
    const signatures = JSON.parse(localStorage.getItem('signatures') || '{}');
    signatures[currentSignatureWorker.ic] = signatureData;
    localStorage.setItem('signatures', JSON.stringify(signatures));
    
    alert('Tandatangan berjaya disimpan!');
    showScreen('qrSignatureScreen');
    checkExistingSignature(currentSignatureWorker.ic);
}
