document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const metaTitle = document.getElementById('metaTitle');
    const metaBody = document.getElementById('metaBody');
    const tbody = document.getElementById('recipientsTableBody');

    if (!id) {
        metaTitle.innerText = "Error";
        metaBody.innerText = "No Broadcast ID provided in the URL.";
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444;">Missing ID parameter</td></tr>';
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/notifications/broadcast-details/${encodeURIComponent(id)}`);
        const data = await response.json();

        if (data.success) {
            metaTitle.innerHTML = `<span style="background:var(--primary-color);color:white;padding:3px 8px;border-radius:12px;font-size:12px;vertical-align:middle;margin-right:10px;">${data.audience} Target</span> ${data.title}`;
            metaBody.innerText = data.body;

            const recipients = data.recipients;
            
            if (recipients.length > 0) {
                tbody.innerHTML = '';
                recipients.forEach(r => {
                    const date = new Date(r.sent_at).toLocaleString();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${r.full_name}</strong></td>
                        <td>${r.email}</td>
                        <td>${r.phone}</td>
                        <td>${date}</td>
                        <td class="token-cell" title="${r.firebase_uid} | ${r.fcm_token}">${r.fcm_token}</td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No recipients found for this broadcast.</td></tr>';
            }

        } else {
            metaTitle.innerText = "Failed to load broadcast";
            metaBody.innerText = data.message || "Unknown API error";
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444;">${data.message || 'Error loading records'}</td></tr>`;
        }
    } catch (e) {
        console.error("Fetch error:", e);
        metaTitle.innerText = "Network Error";
        metaBody.innerText = "Check backend connection.";
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444;">Network connection failed.</td></tr>';
    }
});
