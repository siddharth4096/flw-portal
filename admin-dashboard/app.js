// Vet Portal - Interactive JavaScript
// Author: AI Assistant
// Description: Handles all interactive features for the Vet Portal application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeCharts();
    initializeChatbot();
    initializeModals();
    initializeResponsiveFeatures();



    
    console.log('Vet Portal initialized successfully');
});


document.addEventListener("DOMContentLoaded", () => {
    const hotspot = document.getElementById("hotspot");

    // Place hotspot at correct spot on the image
    hotspot.style.top = "35%";   // adjust this to match lesion location
    hotspot.style.left = "50%";  // adjust this to match lesion location
});






// Navigation System
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const clickableStatCard = document.querySelector('.stat-card.clickable');

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        const icon = hamburger.querySelector('i');
        
        if (sidebar.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
                hamburger.querySelector('i').className = 'fas fa-bars';
            }
            
            // Initialize section-specific features
            if (sectionId === 'analytics') {
                setTimeout(initializeCharts, 100);
            }
        });
    });

    // Profile dropdown toggle
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
    });


    // 🔔 Notification dropdown toggle
const notificationBtn = document.querySelector('.notification-btn');
const notificationDropdown = document.getElementById('notificationDropdown');

if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display =
            notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close when clicking outside
    document.addEventListener('click', function() {
        notificationDropdown.style.display = 'none';
    });
}






    // Clickable stat card navigation
    if (clickableStatCard) {
        clickableStatCard.addEventListener('click', function() {
            // Navigate to analytics section
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            const analyticsNav = document.querySelector('[data-section="analytics"]');
            const analyticsSection = document.getElementById('analytics');
            
            if (analyticsNav && analyticsSection) {
                analyticsNav.classList.add('active');
                analyticsSection.classList.add('active');
                setTimeout(initializeCharts, 100);
            }
        });
    }

    // 🔒 Logout redirect
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Show confirmation alert
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
         sessionStorage.removeItem("isAdminLoggedIn"); // clear flag
      // Redirect to vet login page
      window.location.href = "../welcome-pages/admin-login-page.html";
    }
  });
}
// Simple Notification Demo
const sendBtn = document.getElementById("sendNotificationBtn");
const notifText = document.getElementById("notificationText");

if (sendBtn && notifText) {
  sendBtn.addEventListener("click", () => {
    const msg = notifText.value.trim();

    if (msg === "") {
      alert("⚠ Please type a notification message before sending.");
      return;
    }

    alert("✅ Notification sent successfully (Demo Only)");
    notifText.value = ""; // clear textbox
  });
}











}

// Charts Initialization
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Breed-wise Cases Bar Chart
    const breedChartCanvas = document.getElementById('breedChart');
    if (breedChartCanvas && !breedChartCanvas.chart) {
        const breedCtx = breedChartCanvas.getContext('2d');
        breedChartCanvas.chart = new Chart(breedCtx, {
            type: 'bar',
            data: {
                labels: ['Gir', 'Sahiwal', 'Murrah Buffalo', 'Jersey', 'Crossbreed'],
                datasets: [{
                    label: 'Number of Cases',
                    data: [45, 32, 28, 20, 15],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderColor: [
                        '#2563eb',
                        '#059669',
                        '#d97706',
                        '#dc2626',
                        '#7c3aed'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
    }

    // Vaccination Coverage Pie Chart
    const vaccinationChartCanvas = document.getElementById('vaccinationChart');
    if (vaccinationChartCanvas && !vaccinationChartCanvas.chart) {
        const vaccinationCtx = vaccinationChartCanvas.getContext('2d');
        vaccinationChartCanvas.chart = new Chart(vaccinationCtx, {
            type: 'pie',
            data: {
                labels: ['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderColor: [
                        '#059669',
                        '#d97706',
                        '#dc2626'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Disease Trends Line Chart
    const trendChartCanvas = document.getElementById('trendChart');
    if (trendChartCanvas && !trendChartCanvas.chart) {
        const trendCtx = trendChartCanvas.getContext('2d');
        trendChartCanvas.chart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'FMD Cases',
                    data: [12, 8, 15, 20, 18, 25],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Respiratory Infections',
                    data: [8, 12, 10, 15, 22, 18],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Skin Conditions',
                    data: [5, 7, 9, 8, 12, 10],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}



// Modal System
function initializeModals() {
    const createPrescriptionBtn = document.getElementById('createPrescription');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');

    // Open QR code modal
    if (createPrescriptionBtn) {
        createPrescriptionBtn.addEventListener('click', function() {
            qrModal.classList.add('show');
            generateQRCode();
        });
    }
 // Farmer message sending (demo)
const sendFarmerMessageBtn = document.getElementById("sendFarmerMessage");

if (sendFarmerMessageBtn) {
    sendFarmerMessageBtn.addEventListener("click", () => {
        const msg = document.getElementById("farmerMessageInput").value.trim();

        if (!msg) {
            showNotification("⚠ Please type a message before sending.", "error");
            return;
        }

        // Demo: simulate sending
        showNotification("✅ Message sent to farmer successfully!", "success");

        // Optionally clear after sending
        document.getElementById("farmerMessageInput").value = "";
    });
}























    // Close QR code modal
    if (closeQrModal) {
        closeQrModal.addEventListener('click', function() {
            qrModal.classList.remove('show');
        });
    }

    // Close modal when clicking outside
    if (qrModal) {
        qrModal.addEventListener('click', function(e) {
            if (e.target === qrModal) {
                qrModal.classList.remove('show');
            }
        });
    }

    // Generate QR code (demo)
    function generateQRCode() {
        const qrCode = document.getElementById('qrCode');
        if (qrCode) {
            // Animate QR code generation
            qrCode.style.opacity = '0.5';
            setTimeout(() => {
                qrCode.style.opacity = '1';
            }, 500);
        }
    }
}

// Responsive Features
function initializeResponsiveFeatures() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
            hamburger.querySelector('i').className = 'fas fa-bars';
        }
    });

    // Initialize case management
    initializeCaseManagement();
    
    // Initialize emergency features
    initializeEmergencyFeatures();
    
    // Add smooth scrolling and animations
    initializeAnimations();
}

// Case Management System
function initializeCaseManagement() {
    const caseItems = document.querySelectorAll('.case-item');
    const caseDetails = document.querySelector('.case-details');

    // Mock case data
    const casesData = {
        'case-001': {
            name: 'Gauri',
            species: 'Gir Cow',
            age: '3 years',
            owner: 'Ram Kumar   ',
            lastVisit: 'March 10, 2024',
            diagnosis: 'Respiratory infection',
            treatment: 'Antibiotics prescribed',
            status: 'urgent'
        },
        'case-002': {
            name: 'Ganga',
            species: 'Murrah Buffalo',
            age: '4 years',
            owner: 'Ravi Sharma',
            lastVisit: 'March 8, 2024',
            diagnosis: 'Routine vaccination',
            treatment: 'FMD vaccine administered',
            status: 'routine'
        }
    };

    caseItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all cases
            caseItems.forEach(c => c.classList.remove('active'));
            // Add active class to clicked case
            this.classList.add('active');
            
            // Update case details (demo)
            const caseId = `case-${String(index + 1).padStart(3, '0')}`;
            updateCaseDetails(casesData[caseId] || casesData['case-001']);
        });
    });

    function updateCaseDetails(caseData) {
        const profileInfo = document.querySelector('.profile-info');
        const historyContent = document.querySelector('.history-content');
        
        if (profileInfo) {
            profileInfo.innerHTML = `
                <p><strong>Name:</strong> ${caseData.name}</p>
                <p><strong>Species:</strong> ${caseData.species}</p>
                <p><strong>Age:</strong> ${caseData.age}</p>
                <p><strong>Owner:</strong> ${caseData.owner}</p>
                <p><strong>Last Visit:</strong> ${caseData.lastVisit}</p>
            `;
        }
        
        if (historyContent) {
            historyContent.innerHTML = `
                <p><strong>Diagnosis:</strong> ${caseData.diagnosis}</p>
                <p><strong>Treatment:</strong> ${caseData.treatment}</p>
            `;
        }
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            caseItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// Emergency Features
function initializeEmergencyFeatures() {
    const emergencyBtns = document.querySelectorAll('.emergency-actions .btn');
    
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showNotification(`${action} initiated successfully!`, 'success');
        });
    });

    // Emergency notifications
    const emergencyNavBtn = document.querySelector('.emergency-btn');
    if (emergencyNavBtn) {
        emergencyNavBtn.addEventListener('click', function() {
            // Navigate to emergency section
            const navItems = document.querySelectorAll('.nav-item');
            const sections = document.querySelectorAll('.section');
            const emergencyNav = document.querySelector('[data-section="emergency"]');
            const emergencySection = document.getElementById('emergency');

            
            // Check if emergency section is already active
            if (emergencySection && emergencySection.classList.contains('active')) {
                // If emergency is active, go back to dashboard
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                const dashboardNav = document.querySelector('[data-section="dashboard"]');
                const dashboardSection = document.getElementById('dashboard');
                
                if (dashboardNav && dashboardSection) {
                    dashboardNav.classList.add('active');
                    dashboardSection.classList.add('active');
                }
            } else {
                // Navigate to emergency section
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                if (emergencyNav && emergencySection) {
                    emergencyNav.classList.add('active');
                    emergencySection.classList.add('active');
                }
            }
        });
    }
}


// Animation System
function initializeAnimations() {
    // Fade in animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observe all cards and sections
    document.querySelectorAll('.stat-card, .chart-card, .case-item, .emergency-card, .badge').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hover effects for interactive elements
    document.querySelectorAll('.stat-card, .case-item, .nav-item').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1002;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Data Update System (Demo)
function updateDashboardData() {
    // Simulate real-time data updates
    const statCards = document.querySelectorAll('.stat-content h3');
    
    setInterval(() => {
        statCards.forEach((card, index) => {
            const currentValue = parseInt(card.textContent);
            let newValue;
            
            switch(index) {
                case 0: // Animals Treated
                    newValue = Math.max(20, currentValue + Math.floor(Math.random() * 3) - 1);
                    break;
                case 1: // Vaccinations
                    newValue = Math.max(10, currentValue + Math.floor(Math.random() * 2));
                    break;
                case 2: // Emergency Cases
                    newValue = Math.max(0, currentValue + Math.floor(Math.random() * 3) - 1);
                    break;
                default:
                    return;
            }
            
            if (newValue !== currentValue) {
                card.style.color = '#22c55e';
                card.textContent = newValue;
                setTimeout(() => {
                    card.style.color = '';
                }, 1000);
            }
        });
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
updateDashboardData();

// Utility Functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}



// Performance Monitoring
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    });
});

if (typeof PerformanceObserver !== 'undefined') {
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// Service Worker Registration (for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

