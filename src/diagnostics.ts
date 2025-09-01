

// Helper to detect client name from user agent
export function getClientName(): string {
    const ua = navigator.userAgent;
    if (/Home Assistant/.test(ua)) return "HA Companion";
    if (/Edg/.test(ua)) return "Edge";
    if (/Chrome/.test(ua)) return "Chrome";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Firefox/.test(ua)) return "Firefox";
    return "Unknown";
}

