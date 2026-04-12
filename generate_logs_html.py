import re

with open('users.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract everything before main content to keep the sidebar exact
nav_matcher = re.search(r'(.*?<main class="main-content">)', content, re.DOTALL)
if nav_matcher:
    prefix = nav_matcher.group(1)
    prefix = prefix.replace('class="nav-item active"', 'class="nav-item"')
else:
    print('Failed to extract prefix')
    exit(1)

logs_nav = '''
            <a href="logs.html" class="nav-item active">
                <i class="fas fa-terminal"></i>
                <span>System Logs</span>
            </a>'''
analytics_pattern = r'(<a href="analytics\.html" class="nav-item">.*?<\/a>)'
prefix = re.sub(analytics_pattern, r'\1' + logs_nav, prefix, flags=re.DOTALL)

body = '''
        <!-- Top Bar -->
        <header class="topbar">
            <div class="topbar-left">
                <button class="mobile-menu-toggle" id="mobileMenuToggle">
                    <i class="fas fa-bars"></i>
                </button>
                <h2>Terminal & Traffic Logs</h2>
            </div>
            <div class="topbar-right">
                <div class="user-menu">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin">
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
            <div class="terminal-container">
                <div class="terminal-header">
                    <div class="terminal-actions">
                        <select id="projectSelector" class="terminal-select" onchange="switchProject()">
                            <option value="">[ Loading Available Service Bridges... ]</option>
                        </select>
                        <button class="btn-refresh" onclick="fetchLogs()" id="refreshBtn">
                            <i class="fas fa-sync"></i> Pull Latest
                        </button>
                        <span id="autoRefreshStatus" style="color: #6b7280; font-size: 0.8rem; margin-left:15px;"><i class="fas fa-circle-notch fa-spin"></i> Live</span>
                    </div>
                </div>
                <div class="terminal-body" id="terminalOutput">
                    <div class="log-line info"><span class="timestamp">[SYS]</span> <span class="source">[nexus-core]</span> Initializing logging bridge...</div>
                </div>
            </div>
        </div>
    </main>

    <div class="toast-container" id="toastContainer"></div>

    <style>
        .terminal-container {
            background: #0b0f19;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 150px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: 'Consolas', 'Courier New', monospace;
        }
        .terminal-header {
            background: #111827;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .terminal-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .terminal-select {
            background: #1f2937;
            color: #10b981;
            border: 1px solid #374151;
            padding: 8px 15px;
            border-radius: 6px;
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            width: 300px;
        }
        .btn-refresh {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        .btn-refresh:hover { background: #4338ca; }
        
        .terminal-body {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
            background: #050505;
        }
        .log-line {
            font-size: 0.85rem;
            line-height: 1.6;
            margin-bottom: 4px;
            word-wrap: break-word;
            padding: 2px 5px;
        }
        .log-line:hover { background: rgba(255,255,255,0.03); }
        .timestamp { color: #6b7280; margin-right: 8px; }
        .source { color: #8b5cf6; margin-right: 8px; font-weight: bold; }
        
        .log-line.error { color: #ef4444; }
        .log-line.warning { color: #f59e0b; }
        .log-line.info { color: #d1d5db; }
        
        .terminal-body::-webkit-scrollbar { width: 8px; }
        .terminal-body::-webkit-scrollbar-track { background: #050505; }
        .terminal-body::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
    </style>
    
    <script src="js/config.js"></script>
    <script src="js/sidebar.js"></script>
    <script src="js/logs.js"></script>
</body>
</html>
'''

with open('logs.html', 'w', encoding='utf-8') as f:
    f.write(prefix + body)

print('Generated logs.html successfully')
