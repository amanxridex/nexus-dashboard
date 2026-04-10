document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('id');

    if (!uid) {
        alert("Fatal Error: Missing User UUID. Connection securely terminated.");
        window.location.replace('users.html');
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/users/analytics/${uid}`, {
            method: 'GET',
            headers: {
                // Ensure auth if middleware gets strictly enabled
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();

        if (json.success && json.data) {
            const profile = json.data.profile;
            const wallet = json.data.wallet;
            const bookings = json.data.bookings;

            // Render Hero Profile
            document.getElementById('uiName').innerText = profile.full_name || 'Anonymous User';
            document.getElementById('uiEmail').innerText = profile.email || 'No email attached';
            document.getElementById('uiUid').innerText = profile.firebase_uid;
            document.getElementById('uiAvatar').src = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'U')}&background=random`;
            
            // Render Tech Footprint
            document.getElementById('uiDevice').innerHTML = profile.device_info ? `<i class="fas fa-mobile-alt" style="color:var(--text-muted); margin-right:5px;"></i> ${profile.device_info}` : 'Unknown';
            if (profile.current_location && profile.current_location !== 'Not Available') {
                 document.getElementById('uiLocation').innerHTML = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.current_location)}" target="_blank" style="color:#3b82f6;text-decoration:none;"><i class="fas fa-map-marker-alt"></i> ${profile.current_location}</a>`;
            } else {
                 document.getElementById('uiLocation').innerText = 'Unknown';
            }
            
            // FCM status
            if (profile.fcm_token) {
                 document.getElementById('uiFcm').innerHTML = `<span style="color:#10b981"><i class="fas fa-check-circle"></i> Opted-In (Active)</span>`;
            } else {
                 document.getElementById('uiFcm').innerHTML = `<span style="color:#ef4444"><i class="fas fa-times-circle"></i> Opted-Out</span>`;
            }

            // Render Telemetry Matrices (Convert Seconds to readable if large, else just show seconds/minutes)
            let rawSecs = profile.total_session_seconds || 0;
            let timeStr = `${rawSecs}<span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">sec</span>`;
            if (rawSecs > 60) {
                 timeStr = `${Math.floor(rawSecs / 60)}<span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">m </span> ${rawSecs % 60}<span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">s</span>`;
            }
            if (rawSecs > 3600) {
                 timeStr = `${(rawSecs / 3600).toFixed(1)}<span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">hrs</span>`;
            }
            
            document.getElementById('uiTimeSpent').innerHTML = timeStr;
            document.getElementById('uiSessions').innerText = profile.session_count || 0;
            document.getElementById('uiWalletBalance').innerText = `₹${wallet.balance ? wallet.balance.toLocaleString('en-IN') : 0}`;

            if(profile.last_active_time) {
                document.getElementById('uiLastActive').innerText = new Date(profile.last_active_time).toLocaleString();
            } else {
                document.getElementById('uiLastActive').innerText = 'Never Pungent';
                document.getElementById('uiLastActive').style.color = "var(--text-muted)";
            }

            // Render Bookings Tab
            const bTable = document.getElementById('uiBookingsList');
            if (bookings && bookings.length > 0) {
                bTable.innerHTML = bookings.map(b => {
                    const d = new Date(b.created_at).toLocaleString();
                    return `
                    <tr>
                        <td><strong>#${b.id.substring(0,8).toUpperCase()}</strong></td>
                        <td>${b.fest_id || 'Unknown Fest'}</td>
                        <td><span style="color:var(--green)">₹${b.total_amount}</span></td>
                        <td>${d}</td>
                        <td><span class="status-badge ${b.status || 'success'}">${b.status || 'success'}</span></td>
                    </tr>
                    `
                }).join('');
            } else {
                bTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No transaction history found for this user.</td></tr>`;
            }

            // Reveal Dashboard
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('analyticsDashboard').style.display = 'block';

        } else {
            throw new Error(json.message || "Failed to parse API structure securely.");
        }

    } catch (e) {
        console.error("Critical Security Abort", e);
        document.getElementById('loadingState').innerHTML = `
            <i class="fas fa-shield-alt" style="font-size: 3rem; color: #ef4444;"></i>
            <h3 style="margin-top: 1rem; color: #ef4444;">Access Denied or Database Error</h3>
            <p style="color: var(--text-muted);">${e.message}</p>
            <a href="users.html" class="btn btn-secondary" style="margin-top: 1rem;">Return to Safety</a>
        `;
    }
});

function switchTab(tabId) {
    // Boilerplate for expanding multiple tabs later if requested
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabId + 'Tab').classList.add('active');
}
