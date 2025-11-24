// Authentication System
let currentUser = null;

function showRoleFields() {
    const role = document.getElementById('userRole').value;
    
    // Hide all role fields
    document.querySelectorAll('.role-fields').forEach(field => {
        field.classList.remove('active');
    });
    
    // Show selected role fields
    if (role) {
        document.getElementById(role + 'Fields').classList.add('active');
    }
}

function login() {
    const role = document.getElementById('userRole').value;
    
    if (!role) {
        alert('Sila pilih peranan');
        return;
    }
    
    let userData = {};
    
    switch(role) {
        case 'admin':
            const adminName = document.getElementById('adminName').value;
            if (!adminName) {
                alert('Sila masukkan nama admin');
                return;
            }
            userData = { role: 'admin', name: adminName, id: 'ADMIN_' + Date.now() };
            break;
            
        case 'doctor':
            const doctorId = document.getElementById('doctorId').value;
            if (!doctorId) {
                alert('Sila masukkan ID Doktor');
                return;
            }
            userData = { role: 'doctor', id: doctorId, name: 'Dr. ' + doctorId };
            break;
            
        case 'ma':
            const maId = document.getElementById('maId').value;
            if (!maId) {
                alert('Sila masukkan ID MA');
                return;
            }
            userData = { role: 'ma', id: maId, name: 'MA ' + maId };
            break;
    }
    
    currentUser = userData;
    showDashboard();
}

function showDashboard() {
    if (!currentUser) return;
    
    const role = currentUser.role;
    const dashboardId = role + 'Dashboard';
    
    // Show welcome message
    const welcomeElement = document.getElementById(role + 'Welcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Selamat datang, ${currentUser.name}`;
    }
    
    // Load dashboard data
    if (role === 'admin') {
        loadAdminDashboard();
    } else if (role === 'doctor') {
        loadDoctorDashboard();
    } else if (role === 'ma') {
        loadMADashboard();
    }
    
    showScreen(dashboardId);
}

function logout() {
    currentUser = null;
    // Clear form fields
    document.getElementById('userRole').selectedIndex = 0;
    document.getElementById('adminName').value = '';
    document.getElementById('doctorId').value = '';
    document.getElementById('maId').value = '';
    document.querySelectorAll('.role-fields').forEach(field => {
        field.classList.remove('active');
    });
    
    showScreen('loginScreen');
}

// Initialize auth system
document.addEventListener('DOMContentLoaded', function() {
    showScreen('loginScreen');
});
