// Utility Functions
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical Surveillance System initialized');
    
    // Check if user is already logged in (for demo)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showScreen('loginScreen');
    }
});

// Demo data initialization
function initializeDemoData() {
    if (!localStorage.getItem('demoInitialized')) {
        const demoCompanies = {
            'Syarikat A Sdn Bhd': {
                name: 'Syarikat A Sdn Bhd',
                workerCount: 15,
                status: 'PENDING'
            },
            'Syarikat B Manufacturing': {
                name: 'Syarikat B Manufacturing', 
                workerCount: 8,
                status: 'IN_PROGRESS'
            },
            'Syarikat C Engineering': {
                name: 'Syarikat C Engineering',
                workerCount: 12,
                status: 'COMPLETED'
            }
        };
        
        localStorage.setItem('companies', JSON.stringify(demoCompanies));
        localStorage.setItem('demoInitialized', 'true');
    }
}

// Call demo initialization
initializeDemoData();
