// Helper to get version from global variable or fallback
export function getVersion(): string {
    // Try global injected variable (set by rollup/banner or index.html)
    if ((window as any).meteogramCardVersion) {
        return (window as any).meteogramCardVersion;
    }
    // Fallback to hardcoded version string if needed
    return "unknown";
}

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

// Format diagnostic error message with version and client name
export function formatDiagnosticError(message: string, version?: string, client?: string): string {
    const v = version || getVersion();
    const c = client || getClientName();
    return `[v${v}][${c}] ${message}`;
}
