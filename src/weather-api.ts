import {version} from "../package.json";

export let METEOGRAM_CARD_API_CALL_COUNT = 0;
export let METEOGRAM_CARD_API_SUCCESS_COUNT = 0;

// Return type now includes both data and expires
export async function fetchWeatherDataFromAPI(lat: number, lon: number): Promise<{ data: any, expires: Date | null }> {
    let forecastUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
    let dedicatedForecastUrl = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
    let headers: Record<string, string> = {};
    let statusCode = 0;

    try {
        headers = {
            'Origin': window.location.origin,
            'Accept': 'application/json'
        };

        // Use dedicatedForecastUrl if origin contains ui.nabu.casa
        const urlToUse = window.location.origin.includes("ui.nabu.casa")
            ? dedicatedForecastUrl
            : forecastUrl;

        // Increment call count immediately before fetch
        METEOGRAM_CARD_API_CALL_COUNT++;
        const response = await fetch(urlToUse, { headers, mode: 'cors' });

        statusCode = response.status;

        // Get expires header (always, even if not throttled)
        const expiresHeader = response.headers.get("Expires");
        let expires: Date | null = null;
        if (expiresHeader) {
            const expiresDate = new Date(expiresHeader);
            if (!isNaN(expiresDate.getTime())) {
                expires = expiresDate;
            }
        }

        if (statusCode === 429) {
            const nextTry = expires ? expires.toLocaleTimeString() : "later";
            throw new Error(`Weather API throttling: Too many requests. Please wait until ${nextTry} before retrying.`);
        }

        if (statusCode === 304) {
            throw new Error("API returned 304 but no cached data is available.");
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Weather API returned ${response.status}: ${response.statusText}\n${errorText}`);
        }

        const jsonData = await response.json();
        // Increment success count only after successful fetch and parse
        METEOGRAM_CARD_API_SUCCESS_COUNT++;
        return { data: jsonData, expires };

    } catch (error: unknown) {
        let diag = `<br><b>API Error</b><br>`;
        if (error instanceof Error) {
            diag += `Error: <code>${error.message}</code><br>`;
        } else {
            diag += `Error: <code>${String(error)}</code><br>`;
        }
        diag += `Status: <code>${statusCode}</code><br>`;
        diag += `API URL: <code>${forecastUrl}</code><br>`;
        diag += `Origin header: <code>${headers['Origin']}</code><br>`;
        diag += `Card version: <code>${version || "unknown"}</code><br>`;
        diag += `Client type: <code>${navigator.userAgent}</code><br>`;
        throw new Error(`<br>Failed to get weather data: ${(error as Error).message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${diag}`);
    }
}
