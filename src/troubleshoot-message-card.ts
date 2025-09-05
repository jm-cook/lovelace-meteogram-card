// Register for Home Assistant custom cards
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "troubleshoot-message-card",
    name: "Troubleshoot Message Card",
    description: "Shows a formatted troubleshooting message for iOS/iPad.",
    preview: "",
    documentationURL: ""
});
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

@customElement('troubleshoot-message-card')
export class TroubleshootMessageCard extends LitElement {
    @property({ type: String }) message: string = "troubleshoot-message-card";
    @state() private statusText: string = "Checking Met.no forecast for Bergen...";
    @state() private lastFetchTime: number = 0;
    private statusTimer: number | null = null;

    static styles = css`
        ha-card {
            padding: 16px;
            font-size: 1.1em;
            background: #fffbe6;
            color: #333;
            border: 1px solid #ffe58f;
        }
        .message {
            white-space: pre-wrap;
            word-break: break-word;
        }
        .status {
            margin-top: 12px;
            padding: 10px;
            background: #e3f2fd;
            border-radius: 6px;
            font-size: 0.98em;
            color: #1565c0;
        }
        .error {
            color: #b71c1c;
            background: #ffebee;
            border-radius: 6px;
            padding: 10px;
            margin-top: 12px;
            font-size: 0.98em;
        }
    `;

    setConfig(config: { message?: string }) {
        this.message = config.message || "troubleshoot-message-card";
    }

    getCardSize() {
        return 1;
    }

    connectedCallback() {
        super.connectedCallback();
        this.appendLog("Card loaded, starting forecast check...");
        // Detect and log client type and iOS version if possible
        const clientInfo = this.getClientInfo();
        this.appendLog(`Client info: ${clientInfo}`);
        this.fetchForecast();
        this.statusTimer = window.setInterval(() => this.fetchForecast(), 30000);
   }

    // Helper to detect client type and iOS version (if iPad)
    private getClientInfo(): string {
        const ua = navigator.userAgent || "";
        let info = ua;

        // Try to detect iPad/iOS and version
        if (/iPad|iPhone|iPod/.test(ua)) {
            // iOS version is usually in "OS 15_3_1" format
            const match = ua.match(/OS (\d+[_\d]*)/);
            if (match) {
                const iosVersion = match[1].replace(/_/g, ".");
                info = `iOS device (${ua.includes("iPad") ? "iPad" : "iPhone/iPod"}), iOS version: ${iosVersion}`;
            } else {
                info = `iOS device (${ua.includes("iPad") ? "iPad" : "iPhone/iPod"}), version unknown`;
            }
        } else if (/Macintosh/.test(ua) && 'ontouchend' in document) {
            // iPadOS 13+ reports as Macintosh with touch events
            const match = ua.match(/Version\/(\d+\.\d+)/);
            if (match) {
                info = `iPadOS device (Macintosh with touch), iPadOS version: ${match[1]}`;
            } else {
                info = "iPadOS device (Macintosh with touch), version unknown";
            }
        } else if (/Android/.test(ua)) {
            info = "Android device";
        } else if (/Windows/.test(ua)) {
            info = "Windows device";
        } else if (/Macintosh/.test(ua)) {
            info = "Mac device";
        } else {
            info = `Other device: ${ua}`;
        }
        return info;
    }

    disconnectedCallback() {
        if (this.statusTimer) {
            clearInterval(this.statusTimer);
            this.statusTimer = null;
        }
        super.disconnectedCallback();
    }

    appendLog(entry: string) {
        const timestamp = new Date().toLocaleTimeString();
        this.message += `\n[${timestamp}] ${entry}`;
        this.requestUpdate();
    }

    async fetchForecast() {
        const now = Date.now();
        if (now - this.lastFetchTime < 10000) {
            this.appendLog("Fetch skipped (rate limit: 10s)");
            return;
        }
        this.lastFetchTime = now;

        const latitude = 60.3838;
        const longitude = 5.3318;

        // --- Log the origin ---
        this.appendLog(`Detected window.location.origin: ${window.location.origin}`);

        // --- Call status endpoint first ---
        this.appendLog("Preparing to call Met.no status API...");
        let statusUrl = "https://api.met.no/weatherapi/locationforecast/2.0/status";
        let dedicatedStatusUrl = "https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/status";
        if (window.location.origin.includes("ui.nabu.casa")) {
            statusUrl = dedicatedStatusUrl;
            this.appendLog("Using dedicated Met.no status API endpoint for nabu.casa.");
        } else if (window.location.origin.includes("met.no")) {
            statusUrl = "/weatherapi/locationforecast/2.0/status";
            this.appendLog("Using relative status API URL due to origin.");
        } else {
            this.appendLog("Using public status API URL.");
        }

        let statusResult = "";
        try {
            this.appendLog(`Calling status API: ${statusUrl}`);
            const statusResp = await fetch(statusUrl, {
                headers: {
                    "Origin": window.location.origin,
                    "Accept": "application/json"
                }
            });
            this.appendLog(`Status API responded with: ${statusResp.status} ${statusResp.statusText}`);
            if (!statusResp.ok) {
                const errText = await statusResp.text();
                statusResult = `<div class="error">Status fetch failed.<br>
                    HTTP ${statusResp.status}: ${statusResp.statusText}<br>
                    ${errText ? `<pre>${errText}</pre>` : ""}</div>`;
                this.appendLog(`Status error: ${statusResp.status} ${statusResp.statusText}${errText ? " - " + errText : ""}`);
            } else {
                const statusData = await statusResp.json();
                statusResult = `<div class="status">
                    <b>Met.no Status Response:</b><br>
                    <pre>${JSON.stringify(statusData, null, 2).slice(0, 200)}${JSON.stringify(statusData, null, 2).length > 200 ? "..." : ""}</pre>
                    <span style="font-size:0.9em;color:#333;">Last checked: ${new Date().toLocaleString()}</span>
                </div>`;
                this.appendLog("Status API call successful.");
            }
        } catch (err: any) {
            statusResult = `<div class="error">Status fetch error:<br>
                ${err?.message ? err.message : err}</div>`;
            this.appendLog(`Status fetch error: ${err?.message ? err.message : err}`);
        }

        // --- Now call forecast endpoint ---
        this.appendLog(`Preparing to call Met.no forecast API for Bergen (lat=${latitude}, lon=${longitude})...`);
        let apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
        let dedicatedApiUrl = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
        if (window.location.origin.includes("ui.nabu.casa")) {
            apiUrl = dedicatedApiUrl;
            this.appendLog("Using dedicated Met.no API endpoint for nabu.casa.");
        } else if (window.location.origin.includes("met.no")) {
            apiUrl = `/weatherapi/locationforecast/2.0/complete?lat=${latitude}&lon=${longitude}`;
            this.appendLog("Using relative API URL due to origin.");
        } else {
            this.appendLog("Using public API URL.");
        }

        let forecastResult = "";
        try {
            this.appendLog(`Calling forecast API: ${apiUrl}`);
            const resp = await fetch(apiUrl, {
                headers: {
                    "Origin": window.location.origin,
                    "Accept": "application/json"
                }
            });
            this.appendLog(`Forecast API responded with status: ${resp.status} ${resp.statusText}`);
            if (!resp.ok) {
                const errText = await resp.text();
                forecastResult = `<div class="error">Forecast fetch failed.<br>
                    HTTP ${resp.status}: ${resp.statusText}<br>
                    ${errText ? `<pre>${errText}</pre>` : ""}</div>`;
                this.appendLog(`Forecast error: ${resp.status} ${resp.statusText}${errText ? " - " + errText : ""}`);
            } else {
                const data = await resp.json();
                const forecastStr = JSON.stringify(data, null, 2);
                forecastResult = `<div class="status">
                    <b>Met.no Forecast Response:</b><br>
                    <pre>${forecastStr.slice(0, 200)}${forecastStr.length > 200 ? "..." : ""}</pre>
                    <span style="font-size:0.9em;color:#333;">Last checked: ${new Date().toLocaleString()}</span>
                </div>`;
                this.appendLog("Forecast API call successful, forecast data received.");
            }
        } catch (err: any) {
            forecastResult = `<div class="error">Forecast fetch error:<br>
                ${err?.message ? err.message : err}</div>`;
            this.appendLog(`Forecast fetch error: ${err?.message ? err.message : err}`);
        }

        // --- Show both status and forecast results ---
        this.statusText = `${statusResult}${forecastResult}`;
    }

    render() {
        return html`
            <ha-card>
                <div class="message">${this.message}</div>
                ${unsafeHTML(this.statusText)}
            </ha-card>
        `;
    }
}
