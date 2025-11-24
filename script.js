// Global variables
let currentUser = null;
let currentRole = null;

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
}

// Login function
function login() {
    const clinicName = document.getElementById('clinicName').value;
    const password = document.getElementById('password').value;
    const userRole = document.getElementById('userRole').value;
    
    if (!clinicName || !password) {
        alert('Sila isi semua maklumat login');
        return;
    }
    
    // Simpan user info
    currentUser = {
        clinicName: clinicName,
        role: userRole
    };
    
    currentRole = userRole;
    
    // Show dashboard based on role
    showDashboard();
}

// Show appropriate dashboard
function showDashboard() {
    // Hide all role dashboards
    document.getElementById('maDashboard').style.display = 'none';
    document.getElementById('doctorDashboard').style.display = 'none';
    
    // Show correct dashboard
    if (currentRole === 'ma') {
        document.getElementById('maDashboard').style.display = 'block';
        document.getElementById('welcomeMessage').textContent = `Selamat datang, Staff MA - ${currentUser.clinicName}`;
    } else if (currentRole === 'doctor') {
        document.getElementById('doctorDashboard').style.display = 'block';
        document.getElementById('welcomeMessage').textContent = `Selamat datang, Dr. - ${currentUser.clinicName}`;
        updateDoctorCounts();
    }
    
    showScreen('dashboardScreen');
}

// Logout function
function logout() {
    currentUser = null;
    currentRole = null;
    
    // Clear form fields
    document.getElementById('clinicName').value = '';
    document.getElementById('password').value = '';
    document.getElementById('userRole').selectedIndex = 0;
    
    showScreen('loginScreen');
}

// Update counts for doctor dashboard
function updateDoctorCounts() {
    // Ini akan diintegrasikan dengan Google Sheets nanti
    document.getElementById('pendingCount').textContent = '5 rekod';
    document.getElementById('completedCount').textContent = '23 rekod';
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical Surveillance System loaded');
    
    // Set default screen
    showScreen('loginScreen');
});
