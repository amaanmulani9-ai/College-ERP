/**
 * CampusPro ERP - Realtime Mobile & Web Sync Engine
 * Establishes real-time SSE stream connecting Mobile App actions to the Web application.
 */

(function () {
    let lastHandledTs = null;

    function createToastContainer() {
        let container = document.getElementById('realtime-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'realtime-toast-container';
            container.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 24px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    function showRealtimeToast(title, message, iconClass = 'fas fa-sync-alt') {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: linear-gradient(135deg, #0284c7, #0369a1);
            color: #ffffff;
            padding: 14px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(2, 132, 199, 0.3);
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        toast.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 16px;">
                <i class="${iconClass}"></i>
            </div>
            <div>
                <strong style="display: block; font-size: 14px; margin-bottom: 2px;">⚡ ${title}</strong>
                <span style="opacity: 0.9;">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function handleRealtimeEvent(event) {
        if (!event || event.type === 'heartbeat' || event.type === 'none') return;
        if (event.timestamp === lastHandledTs) return;
        lastHandledTs = event.timestamp;

        console.log("⚡ Realtime Sync Event Received:", event);

        if (event.type === 'biometric_punch') {
            const p = event.payload || {};
            showRealtimeToast("Mobile Attendance Sync", `${p.student} (${p.student_code}) logged ${p.status}`, "fas fa-fingerprint");
        } else if (event.type === 'chat_message') {
            const p = event.payload || {};
            showRealtimeToast("Live Mobile Chat", `${p.sender}: ${p.message}`, "fas fa-comment-dots");
        } else if (event.type === 'announcement') {
            const p = event.payload || {};
            showRealtimeToast("New Announcement", p.title || "New broadcast dispatched", "fas fa-bullhorn");
        }
    }

    function initSSE() {
        if (!!window.EventSource) {
            const source = new EventSource('/api/realtime-stream/');
            source.onmessage = function (e) {
                try {
                    const data = JSON.parse(e.data);
                    handleRealtimeEvent(data);
                } catch (err) {}
            };
            source.onerror = function () {
                source.close();
                setTimeout(initPolling, 5000);
            };
        } else {
            initPolling();
        }
    }

    function initPolling() {
        setInterval(() => {
            fetch('/api/realtime-stream/?poll=true')
                .then(res => res.json())
                .then(data => handleRealtimeEvent(data))
                .catch(() => {});
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', initSSE);
})();
