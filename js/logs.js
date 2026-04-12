const API_URL = window.API_BASE_URL || 'https://nexus-dashboard-backend.onrender.com/api/admin';
let currentProject = null;
let currentPlatform = null;
let pollInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    initLogsSystem();
});

async function initLogsSystem() {
    try {
        const token = localStorage.getItem('nexus_admin_jwt');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Fetch configured bridged environments
        const res = await fetch(`${API_URL}/admin/logs/projects`);
        
        if (res.status === 401 || res.status === 403) {
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        const selector = document.getElementById('projectSelector');
        
        if (data.success && data.projects) {
            selector.innerHTML = '<option value="">-- Extrapolate Central Telemetry Socket --</option>';
            data.projects.forEach(p => {
                const icon = p.platform === 'Vercel' ? '▲ Vercel Front-End' : '⬛ Render Back-End';
                selector.innerHTML += `<option value="${p.id}" data-platform="${p.platform}">${icon} | ${p.name}</option>`;
            });
            appendLog('System successfully mapped to 6 regional endpoints.', 'info', 'nexus-core');
        } else {
            selector.innerHTML = '<option value="">ERROR: Could not fetch routes.</option>';
            appendLog('Critical error mapping proxy backend.', 'error', 'nexus-core');
        }
    } catch (err) {
        console.error(err);
        appendLog('Connection failed to administration backend.', 'error', 'nexus-core');
    }
}

async function switchProject() {
    const selector = document.getElementById('projectSelector');
    if (!selector.value) {
        stopPolling();
        return;
    }
    
    const selectedOption = selector.options[selector.selectedIndex];
    currentProject = selector.value;
    currentPlatform = selectedOption.getAttribute('data-platform');
    
    document.getElementById('terminalOutput').innerHTML = ''; // clear terminal
    appendLog(`Bridging direct proxy to ${currentPlatform} [ID: ${currentProject}]...`, 'info', 'proxy-manager');
    
    await fetchLogs();
    startPolling();
}

async function fetchLogs() {
    if (!currentProject || !currentPlatform) return;
    
    try {
        const btn = document.getElementById('refreshBtn');
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Pulling...';
        btn.disabled = true;

        const res = await fetch(`${API_URL}/admin/logs/fetch?projectId=${currentProject}&platform=${currentPlatform}`);
        const data = await res.json();

        if (data.success) {
            renderLogs(data.logs);
        } else {
            appendLog(`Extraction error: ${data.message}`, 'error', 'proxy-error');
        }

        btn.innerHTML = '<i class="fas fa-sync"></i> Pull Latest';
        btn.disabled = false;
        
    } catch(err) {
        appendLog('Fatal network desync while extracting logs payload.', 'error', 'network');
    }
}

function renderLogs(logsArray) {
    const terminal = document.getElementById('terminalOutput');
    terminal.innerHTML = '';
    
    if (!logsArray || logsArray.length === 0) {
        appendLog('No recent traffic or error signatures found on this node.', 'warning', 'nexus-core');
        return;
    }
    
    // Logs returned newest first typically, we iterate in reverse so newest is at the bottom, mimicking real tailing
    // wait, if we want newest at bottom, we do reverse. 
    for(let i = logsArray.length - 1; i >= 0; i--) {
        const log = logsArray[i];
        
        let timeStr = new Date(log.timestamp).toLocaleTimeString();
        let safeMsg = log.message.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // XSS safeguard
        
        let line = document.createElement('div');
        line.className = `log-line ${log.level}`;
        line.innerHTML = `<span class="timestamp">[${timeStr}]</span> <span class="source">[${log.source}]</span> ${safeMsg}`;
        
        terminal.appendChild(line);
    }
    
    // Auto scroll bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function appendLog(message, level='info', source='system') {
    const terminal = document.getElementById('terminalOutput');
    let timeStr = new Date().toLocaleTimeString();
    
    let line = document.createElement('div');
    line.className = `log-line ${level}`;
    line.innerHTML = `<span class="timestamp">[${timeStr}]</span> <span class="source">[${source}]</span> ${message}`;
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function startPolling() {
    stopPolling();
    pollInterval = setInterval(fetchLogs, 10000); // Poll every 10 seconds securely
}

function stopPolling() {
    if (pollInterval) clearInterval(pollInterval);
}
