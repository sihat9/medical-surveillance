// Admin Functions
function loadAdminDashboard() {
    loadCompanies();
}

function previewExcel() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    const preview = document.getElementById('filePreview');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Display preview
        let previewHTML = '<h4>Preview Data:</h4>';
        previewHTML += '<table style="width: 100%; border-collapse: collapse;">';
        
        // Show first 5 rows
        jsonData.slice(0, 6).forEach((row, index) => {
            previewHTML += '<tr>';
            row.forEach(cell => {
                if (index === 0) {
                    previewHTML += `<th style="border: 1px solid #ddd; padding: 8px; background: #34495e; color: white;">${cell}</th>`;
                } else {
                    previewHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`;
                }
            });
            previewHTML += '</tr>';
        });
        
        previewHTML += '</table>';
        
        if (jsonData.length > 6) {
            previewHTML += `<p>... dan ${jsonData.length - 6} baris lagi</p>`;
        }
        
        preview.innerHTML = previewHTML;
        uploadBtn.disabled = false;
    };
    
    reader.readAsArrayBuffer(file);
}

function uploadWorkers() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Sila pilih file Excel');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process and save worker data
        saveWorkersToSheet(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
}

function saveWorkersToSheet(workers) {
    // Simulate saving to Google Sheets
    console.log('Saving workers:', workers);
    
    // Save to localStorage for demo
    const existingWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
    const existingCompanies = JSON.parse(localStorage.getItem('companies') || '{}');
    
    workers.forEach(worker => {
        if (worker.NAMA && worker.IC) {
            const workerData = {
                id: worker.IC,
                nama: worker.NAMA,
                ic: worker.IC,
                syarikat: worker.SYARIKAT || 'Unknown',
                jantina: worker.JANTINA || '',
                status: 'PENDING',
                timestamp: new Date().toISOString()
            };
            
            existingWorkers.push(workerData);
            
            // Update company data
            if (worker.SYARIKAT) {
                if (!existingCompanies[worker.SYARIKAT]) {
                    existingCompanies[worker.SYARIKAT] = {
                        name: worker.SYARIKAT,
                        workerCount: 0,
                        status: 'PENDING'
                    };
                }
                existingCompanies[worker.SYARIKAT].workerCount++;
            }
        }
    });
    
    localStorage.setItem('workers', JSON.stringify(existingWorkers));
    localStorage.setItem('companies', JSON.stringify(existingCompanies));
    
    alert(`Berjaya memuat naik ${workers.length} pekerja!`);
    loadCompanies();
    
    // Reset form
    document.getElementById('excelFile').value = '';
    document.getElementById('filePreview').innerHTML = '';
    document.getElementById('uploadBtn').disabled = true;
}

function loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    const container = document.getElementById('companyList');
    
    container.innerHTML = '';
    
    Object.values(companies).forEach(company => {
        const card = `
            <div class="company-card">
                <h4>${company.name}</h4>
                <p>👥 ${company.workerCount} pekerja</p>
                <p>📅 Didaftar: ${new Date().toLocaleDateString('ms-MY')}</p>
                <div class="status-badge status-${company.status}">${company.status}</div>
            </div>
        `;
        container.innerHTML += card;
    });
    
    if (Object.keys(companies).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Tiada syarikat didaftarkan</p>';
    }
}
