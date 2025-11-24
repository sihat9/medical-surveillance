// Doctor Functions
function loadDoctorDashboard() {
    loadDoctorCompanies();
}

function loadDoctorCompanies() {
    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    const container = document.getElementById('doctorCompanyList');
    
    container.innerHTML = '';
    
    Object.values(companies).forEach(company => {
        const card = `
            <div class="company-card" onclick="loadCompanyWorkers('${company.name}')">
                <h4>${company.name}</h4>
                <p>👥 ${company.workerCount} pekerja</p>
                <p>📍 Status: ${company.status}</p>
                <div class="status-badge status-${company.status}">${company.status}</div>
            </div>
        `;
        container.innerHTML += card;
    });
    
    if (Object.keys(companies).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Tiada syarikat untuk disemak</p>';
    }
}

function loadCompanyWorkers(companyName) {
    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
    const companyWorkers = workers.filter(worker => worker.syarikat === companyName);
    
    document.getElementById('workerListTitle').textContent = `👥 Senarai Pekerja - ${companyName}`;
    displayWorkers(companyWorkers);
    showScreen('workerListScreen');
}

function displayWorkers(workers) {
    const tbody = document.getElementById('workerTableBody');
    tbody.innerHTML = '';
    
    workers.forEach(worker => {
        const row = `
            <tr>
                <td>${worker.nama}</td>
                <td>${worker.ic}</td>
                <td>${worker.jantina || '-'}</td>
                <td><span class="status-${worker.status}">${worker.status}</span></td>
                <td class="action-icons">
                    <span class="icon" onclick="viewUSECHHForm('${worker.ic}')" title="Borang USECHH">📝</span>
                    <span class="icon" onclick="viewLabReport('${worker.ic}')" title="Lab Report">📊</span>
                    <span class="icon" onclick="generateReport('${worker.ic}')" title="Generate Report">📄</span>
                    <span class="icon" onclick="openSignatureQR('${worker.ic}', '${worker.nama}')" title="Tandatangan">✍️</span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    if (workers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #7f8c8d;">Tiada pekerja ditemui</td></tr>';
    }
}

function filterCompanies() {
    const searchTerm = document.getElementById('companySearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    const container = document.getElementById('doctorCompanyList');
    
    container.innerHTML = '';
    
    Object.values(companies).forEach(company => {
        if (searchTerm && !company.name.toLowerCase().includes(searchTerm)) {
            return;
        }
        
        if (statusFilter && company.status !== statusFilter) {
            return;
        }
        
        const card = `
            <div class="company-card" onclick="loadCompanyWorkers('${company.name}')">
                <h4>${company.name}</h4>
                <p>👥 ${company.workerCount} pekerja</p>
                <p>📍 Status: ${company.status}</p>
                <div class="status-badge status-${company.status}">${company.status}</div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Placeholder functions for other features
function viewUSECHHForm(workerIC) {
    alert(`Borang USECHH untuk: ${workerIC}\n\n(Fitur ini dalam pembangunan)`);
}

function viewLabReport(workerIC) {
    alert(`Lab Report untuk: ${workerIC}\n\n(Fitur ini dalam pembangunan)`);
}

function generateReport(workerIC) {
    alert(`Generate Report untuk: ${workerIC}\n\n(Fitur ini dalam pembangunan)`);
}
