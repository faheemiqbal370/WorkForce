document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Update ---
    const updateNav = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const authLinkContainer = navLinks.querySelector('[data-auth-link]');
        const dashboardLink = navLinks.querySelector('a[href="dashboard.html"]');
        const logoutLink = navLinks.querySelector('#logout-btn');
        if (dashboardLink) dashboardLink.parentElement.remove();
        if (logoutLink) logoutLink.parentElement.remove();
        if (authLinkContainer) authLinkContainer.remove();

        if (isLoggedIn) {
            const dashboardLi = document.createElement('li');
            dashboardLi.innerHTML = '<a href="dashboard.html" class="btn btn-secondary">Dashboard</a>';
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" id="logout-btn" class="btn btn-primary">Logout</a>';
            navLinks.appendChild(dashboardLi);
            navLinks.appendChild(logoutLi);

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    alert('You have been logged out.');
                    window.location.href = 'index.html';
                });
            }
        } else {
            const loginLi = document.createElement('li');
            loginLi.setAttribute('data-auth-link', '');
            loginLi.innerHTML = '<a href="login.html" class="btn btn-primary">Login</a>';
            navLinks.appendChild(loginLi);
        }
    };

    // --- Burger Menu Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        const navAnchors = document.querySelectorAll('.nav-links a');
        navAnchors.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }

    // --- Highlight Active Nav Link ---
    const navAnchors = document.querySelectorAll('.nav-links a');
    const currentPageName = new URL(window.location.href).pathname.split('/').pop() || 'index.html';
    navAnchors.forEach(link => {
        link.classList.remove('active');
        const linkName = new URL(link.href).pathname.split('/').pop();
        if (linkName === currentPageName) {
            link.classList.add('active');
        }
    });

    // --- Protect Restricted Pages ---
    const protectedPages = ['dashboard.html', 'booking.html', 'confirmation.html', 'labour-profile.html'];
    const currentPageFile = new URL(window.location.href).pathname.split('/').pop();
    if (protectedPages.includes(currentPageFile)) {
        if (!localStorage.getItem('isLoggedIn')) {
            alert('You must be logged in to view this page.');
            window.location.href = 'login.html';
        }
    }

    // --- Login Form Handling ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        let isOtpSent = false;
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const mobileInput = document.getElementById('mobile');
            const termsCheckbox = document.getElementById('terms');
            const submitBtn = loginForm.querySelector('button');

            if (!termsCheckbox.checked) {
                alert('Please agree to the Terms & Conditions.');
                return;
            }

            if (!isOtpSent) {
                if (!mobileInput.value.trim()) {
                    alert('Please enter a mobile number.');
                    return;
                }
                const otpGroup = document.createElement('div');
                otpGroup.classList.add('form-group');
                otpGroup.innerHTML = `
                    <label for="otp">Enter OTP</label>
                    <input type="text" id="otp" placeholder="Enter OTP" required>
                `;
                mobileInput.parentElement.after(otpGroup);
                submitBtn.textContent = 'Verify OTP';
                isOtpSent = true;
            } else {
                const otpInput = document.getElementById('otp');
                if (!otpInput.value.trim()) {
                    alert('Please enter an OTP.');
                    return;
                }
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';
                localStorage.setItem('isLoggedIn', 'true');
                setTimeout(() => {
                    alert('Login Successful!');
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    }

    // --- Dashboard Search Functionality ---
    const searchBtn = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            const services = document.querySelectorAll('.service-categories .category-card span');
            services.forEach(service => {
                const serviceText = service.textContent.toLowerCase();
                service.parentElement.style.display = serviceText.includes(query) ? 'block' : 'none';
            });
        });
    }

    // --- Homepage Search Functionality ---
    const homeSearchBtn = document.querySelector('.hero-cta button');
    const homeSearchInput = document.querySelector('.hero-cta input');
    if (homeSearchBtn && homeSearchInput) {
        homeSearchBtn.addEventListener('click', () => {
            const query = homeSearchInput.value.toLowerCase();
            const services = document.querySelectorAll('.category-card span');
            services.forEach(service => {
                const serviceText = service.textContent.toLowerCase();
                service.parentElement.style.display = serviceText.includes(query) ? 'block' : 'none';
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initialize navigation
    updateNav();
});