document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is already locked out by a previous fast-fail check
    const lockExpiry = localStorage.getItem('nexus_admin_lockout');
    if (lockExpiry && Date.now() < parseInt(lockExpiry)) {
        triggerLockdown();
        return;
    } else if (lockExpiry) {
        localStorage.removeItem('nexus_admin_lockout');
    }

    // 2. Initialize 12 Second Kill Switch
    let timeLeft = 12.0;
    const countdownEl = document.getElementById('countdown');
    let timerId = null;

    function formatTime(t) {
        return t.toFixed(1);
    }

    timerId = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timeLeft = 0;
            countdownEl.innerText = "0.0";
            
            // Activate penalty lockdown! Save expiry for 5 minutes in local storage
            localStorage.setItem('nexus_admin_lockout', Date.now() + (5 * 60 * 1000));
            triggerLockdown();
        } else {
            countdownEl.innerText = formatTime(timeLeft);
        }
    }, 100);

    function triggerLockdown() {
        document.getElementById('loginCard').style.display = 'none';
        document.getElementById('lockdownScreen').style.display = 'flex';
    }

    // 3. Handle Auth Submission
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Pause timer while API processes so they don't get banned while waiting
        clearInterval(timerId);
        submitBtn.disabled = true;
        submitBtn.innerText = 'Verifying Protocol...';
        errorMsg.innerText = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${window.API_BASE_URL}/admin/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Save JWT Securely
                localStorage.setItem('nexus_admin_jwt', data.token);
                window.location.replace('index.html'); // Vault opened successfully
            } else {
                handleFailedAttempt(data.message || 'Authorization server rejected credentials.');
            }
        } catch (err) {
            console.error("Auth Fail:", err);
            handleFailedAttempt('Network error or server unreachable.');
        }
    });

    function handleFailedAttempt(msg) {
        // If they fail, they are instantly banned. 
        localStorage.setItem('nexus_admin_lockout', Date.now() + (5 * 60 * 1000));
        triggerLockdown();
    }
});
