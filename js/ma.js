// MA Dashboard Functions
function loadMADashboard() {
    loadMACompanies();
    setupMobileView();
}

function setupMobileView() {
    // Optimize for mobile devices
    document.body.classList.add('mobile-view');
}

function loadMACompanies() {
    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    const container = document.getElementById('maCompanyList');
    
    if (!container) {
        console.log('MA Company List container not found');
        return;
    }
    
    container.innerHTML = '';
    
    Object.values(companies).forEach(company => {
        const card = `
            <div class="company-card" onclick="loadMAWorkers('${company.name}')">
                <h4>${company.name}</h4>
                <p>👥 ${company.workerCount} pekerja</p>
                <p>📅 Pemeriksaan: ${new Date().toLocaleDateString('ms-MY')}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                </div>
                <p class="progress-text">30% selesai</p>
            </div>
        `;
        container.innerHTML += card;
    });
    
    if (Object.keys(companies).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Tiada syarikat untuk hari ini</p>';
    }
}

function loadMAWorkers(companyName) {
    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
    const companyWorkers = workers.filter(worker => worker.syarikat === companyName);
    
    document.getElementById('maWorkerListTitle').textContent = `❤️ Pemeriksaan - ${companyName}`;
    displayMAWorkers(companyWorkers);
    showScreen('maWorkerListScreen');
}

function displayMAWorkers(workers) {
    const container = document.getElementById('maWorkerList');
    container.innerHTML = '';
    
    workers.forEach(worker => {
        const vitalSigns = getVitalSigns(worker.ic);
        const status = vitalSigns ? 'COMPLETED' : 'PENDING';
        
        const workerCard = `
            <div class="ma-worker-card ${status}" onclick="openVitalSignsForm('${worker.ic}', '${worker.nama}')">
                <div class="worker-info">
                    <h4>${worker.nama}</h4>
                    <p>${worker.ic} • ${worker.jantina || '-'}</p>
                </div>
                <div class="vital-status">
                    ${vitalSigns ? `
                        <div class="vital-readings">
                            <span>📏 ${vitalSigns.tinggi}cm</span>
                            <span>⚖️ ${vitalSigns.berat}kg</span>
                            <span>💗 ${vitalSigns.bp}</span>
                            <span>🌡️ ${vitalSigns.suhu}°C</span>
                        </div>
                    ` : `
                        <div class="status-pending">Belum diperiksa</div>
                    `}
                </div>
                <div class="action-indicator">
                    ${status === 'COMPLETED' ? '✅' : '🟡'}
                </div>
            </div>
        `;
        container.innerHTML += workerCard;
    });
}

function openVitalSignsForm(workerIC, workerName) {
    currentWorker = { ic: workerIC, name: workerName };
    
    document.getElementById('vitalWorkerName').textContent = workerName;
    document.getElementById('vitalWorkerIC').textContent = workerIC;
    
    // Load existing data if any
    const existingData = getVitalSigns(workerIC);
    if (existingData) {
        document.getElementById('tinggi').value = existingData.tinggi;
        document.getElementById('berat').value = existingData.berat;
        document.getElementById('tekananDarah').value = existingData.bp;
        document.getElementById('suhu').value = existingData.suhu;
        document.getElementById('denyutanNadi').value = existingData.nadi;
        document.getElementById('spo2').value = existingData.spo2;
    }
    
    showScreen('vitalSignsScreen');
}

function saveVitalSigns() {
    const vitalData = {
        tinggi: document.getElementById('tinggi').value,
        berat: document.getElementById('berat').value,
        bp: document.getElementById('tekananDarah').value,
        suhu: document.getElementById('suhu').value,
        nadi: document.getElementById('denyutanNadi').value,
        spo2: document.getElementById('spo2').value,
        maId: currentUser.id,
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!vitalData.tinggi || !vitalData.berat || !vitalData.bp) {
        alert('Sila isi tinggi, berat dan tekanan darah');
        return;
    }
    
    // Save to localStorage
    saveVitalToStorage(currentWorker.ic, vitalData);
    
    alert('Data vital signs berjaya disimpan!');
    showScreen('maWorkerListScreen');
    
    // Refresh worker list
    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
    const companyWorkers = workers.filter(worker => worker.syarikat === currentWorker.syarikat);
    displayMAWorkers(companyWorkers);
}

function saveVitalToStorage(workerIC, vitalData) {
    const vitalRecords = JSON.parse(localStorage.getItem('vitalSigns') || '{}');
    vitalRecords[workerIC] = vitalData;
    localStorage.setItem('vitalSigns', JSON.stringify(vitalRecords));
}

function getVitalSigns(workerIC) {
    const vitalRecords = JSON.parse(localStorage.getItem('vitalSigns') || '{}');
    return vitalRecords[workerIC];
}

// Lab Report Upload Functions
function openLabUpload() {
    showScreen('labUploadScreen');
    loadPendingLabWorkers();
}

function loadPendingLabWorkers() {
    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
    const container = document.getElementById('labWorkerList');
    container.innerHTML = '';
    
    workers.forEach(worker => {
        const labData = getLabData(worker.ic);
        const hasLabReport = labData && labData.pdfUrl;
        
        const workerCard = `
            <div class="lab-worker-card ${hasLabReport ? 'has-report' : 'no-report'}" 
                 onclick="openLabRemarks('${worker.ic}', '${worker.nama}')">
                <div class="worker-info">
                    <h4>${worker.nama}</h4>
                    <p>${worker.ic}</p>
                </div>
                <div class="lab-status">
                    ${hasLabReport ? `
                        <span class="status-badge status-COMPLETED">PDF Diupload</span>
                        <p class="lab-category">Kategori: ${labData.kategori || 'Belum dikategorikan'}</p>
                    ` : `
                        <span class="status-badge status-PENDING">Tiada PDF</span>
                    `}
                </div>
                <div class="action-indicator">
                    ${hasLabReport ? '📎' : '📤'}
                </div>
            </div>
        `;
        container.innerHTML += workerCard;
    });
}

function openLabRemarks(workerIC, workerName) {
    currentLabWorker = { ic: workerIC, name: workerName };
    
    document.getElementById('labRemarksWorker').textContent = `${workerName} (${workerIC})`;
    
    // Load existing lab data
    const labData = getLabData(workerIC);
    if (labData) {
        document.getElementById('labRemarks').value = labData.remarks || '';
        document.getElementById('labCategory').value = labData.kategori || '';
        
        // Show PDF preview if exists
        if (labData.pdfUrl) {
            document.getElementById('pdfPreview').innerHTML = `
                <iframe src="${labData.pdfUrl}" width="100%" height="300"></iframe>
            `;
        }
    }
    
    showScreen('labRemarksScreen');
}

function uploadLabPDF() {
    const fileInput = document.getElementById('labPdfFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Sila pilih file PDF');
        return;
    }
    
    // Simulate PDF upload
    const pdfUrl = URL.createObjectURL(file);
    
    // Save PDF info
    const labData = getLabData(currentLabWorker.ic) || {};
    labData.pdfUrl = pdfUrl;
    labData.pdfName = file.name;
    labData.uploadTime = new Date().toISOString();
    
    saveLabData(currentLabWorker.ic, labData);
    
    alert('PDF berjaya diupload!');
    document.getElementById('pdfPreview').innerHTML = `
        <iframe src="${pdfUrl}" width="100%" height="300"></iframe>
    `;
}

function saveLabRemarks() {
    const remarks = document.getElementById('labRemarks').value;
    const kategori = document.getElementById('labCategory').value;
    
    if (!kategori) {
        alert('Sila pilih kategori');
        return;
    }
    
    const labData = getLabData(currentLabWorker.ic) || {};
    labData.remarks = remarks;
    labData.kategori = kategori;
    labData.maId = currentUser.id;
    labData.reviewTime = new Date().toISOString();
    
    saveLabData(currentLabWorker.ic, labData);
    
    alert('Remarks berjaya disimpan!');
    showScreen('labUploadScreen');
    loadPendingLabWorkers();
}

function saveLabData(workerIC, labData) {
    const allLabData = JSON.parse(localStorage.getItem('labReports') || '{}');
    allLabData[workerIC] = labData;
    localStorage.setItem('labReports', JSON.stringify(allLabData));
}

function getLabData(workerIC) {
    const allLabData = JSON.parse(localStorage.getItem('labReports') || '{}');
    return allLabData[workerIC];
}
