import enLocale from "./translations/en.json";
import nbLocale from "./translations/nb.json";
import esLocale from "./translations/es.json";
import itLocale from "./translations/it.json";
import deLocale from "./translations/de.json";
import frLocale from "./translations/fr.json";

export function trnslt(hass: any, key: string, fallback?: string): string {
    // Try hass.localize (used by HA frontend)
    if (hass && typeof hass.localize === "function") {
        const result = hass.localize(key);
        if (result && result !== key) return result;
    }

    // Try hass.resources (used by HA backend)
    if (hass && hass.resources && typeof hass.resources === "object") {
        const lang = hass.language || "en";
        const res = hass.resources[lang]?.[key];
        if (res) return res;
    }
    // Try local translation files
    const lang = (hass && hass.language) ? hass.language : "en";
    let localRes: string | undefined;
    if (lang.startsWith("nb")) {
        localRes = (nbLocale as Record<string, string>)[key];
    } else if (lang.startsWith("es")) {
        localRes = (esLocale as Record<string, string>)[key];
    } else if (lang.startsWith("it")) {
        localRes = (itLocale as Record<string, string>)[key];
    } else if (lang.startsWith("de")) {
        localRes = (deLocale as Record<string, string>)[key];
    } else if (lang.startsWith("fr")) {
        localRes = (frLocale as Record<string, string>)[key];
    } else {
        localRes = (enLocale as Record<string, string>)[key];
    }
    if (localRes) return localRes;
    // Return fallback if provided, otherwise the key
    return fallback !== undefined ? fallback : key;
}

