const MASTER_BEACON = 'https://nexus-api-hkfu.onrender.com/api/health';

// DOM Nodes
const nodes = {
    sysRest: document.getElementById('sysRest'),
    sysCpu: document.getElementById('sysCpu'),
    sysDb: document.getElementById('sysDb'),
    sysLag: document.getElementById('sysLag'),
    sysRedis: document.getElementById('sysRedis'),
    sysBreaker: document.getElementById('sysBreaker'),
    cacheHits: document.getElementById('cacheHits'),
    cacheMisses: document.getElementById('cacheMisses'),
    cacheGraph: document.getElementById('cacheGraph'),
    cacheRatio: document.getElementById('cacheRatio'),
    activeConns: document.getElementById('activeConns'),
    droppedConns: document.getElementById('droppedConns'),
    qWait: document.getElementById('qWait'),
    qAct: document.getElementById('qAct'),
    qComp: document.getElementById('qComp'),
    qFail: document.getElementById('qFail'),
    logFeed: document.getElementById('logFeed')
};

const addLog = (msg, isError = false) => {
    const el = document.createElement('div');
    el.className = `log-line ${isError ? 'error' : ''}`;
    el.innerText = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    nodes.logFeed.prepend(el);
    if(nodes.logFeed.children.length > 50) nodes.logFeed.removeChild(nodes.logFeed.lastChild);
};

const pollMetrics = async () => {
    try {
        const res = await fetch(MASTER_BEACON);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        // System Panel
        nodes.sysRest.innerText = "200 OK";
        nodes.sysRest.className = "val-green";
        
        // Telemetry maps
        const sys = data.system || {};
        nodes.sysCpu.innerText = `${sys.cpuUsage || 0}%`;
        nodes.sysLag.innerText = `${sys.eventLoopLag || 0}ms`;
        nodes.activeConns.innerText = sys.activeRequests || 0;
        nodes.droppedConns.innerText = sys.droppedRequests || 0;
        
        // Breaker
        const breakerStr = data.breaker || "UNKNOWN";
        nodes.sysBreaker.innerText = breakerStr;
        nodes.sysBreaker.className = breakerStr === "OPEN" ? "label-open" : "label-closed";
        if(breakerStr === "OPEN") {
            nodes.sysDb.innerText = "LOCKED";
            nodes.sysDb.className = "val-red";
            document.getElementById('healthStatusPulse').innerText = "DEGRADED (BREAKER OPEN)";
            document.getElementById('healthStatusPulse').style.color = "var(--neon-orange)";
        } else {
            nodes.sysDb.innerText = "ALIVE";
            nodes.sysDb.className = "val-green";
            document.getElementById('healthStatusPulse').innerText = "ONLINE";
            document.getElementById('healthStatusPulse').style.color = "var(--neon-green)";
        }

        // Cache Panel
        const cache = data.cache || { hits: 0, misses: 0 };
        nodes.cacheHits.innerText = cache.hits;
        nodes.cacheMisses.innerText = cache.misses;
        const totalReq = cache.hits + cache.misses;
        const hitRatio = totalReq > 0 ? ((cache.hits / totalReq) * 100).toFixed(1) : 100;
        nodes.cacheRatio.innerText = `${hitRatio}% Hit Rate`;
        nodes.cacheGraph.style.width = `${hitRatio}%`;
        
        if (hitRatio < 80 && totalReq > 50) {
            nodes.cacheGraph.style.backgroundColor = "var(--neon-orange)";
        } else {
            nodes.cacheGraph.style.backgroundColor = "var(--neon-green)";
        }

        // Queue
        const q = data.queue || { waiting: 0, active: 0, completed: 0, failed: 0 };
        nodes.qWait.innerText = q.waiting;
        nodes.qAct.innerText = q.active;
        nodes.qComp.innerText = q.completed;
        nodes.qFail.innerText = q.failed;
        
        addLog(`Physical telemetry heartbeat received.`);

    } catch(e) {
        nodes.sysRest.innerText = "TIMEOUT";
        nodes.sysRest.className = "val-red";
        document.getElementById('healthStatusPulse').innerText = "OFFLINE";
        document.getElementById('healthStatusPulse').style.color = "var(--neon-red)";
        addLog(`Failed to communicate with Master Node: ${e.message}`, true);
    }
};

pollMetrics();
setInterval(pollMetrics, 5000);
