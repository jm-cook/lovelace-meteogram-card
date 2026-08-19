/**
 * The visual editor, as a schema Home Assistant renders itself.
 *
 * This replaces a 787-line custom element that built its markup as an HTML string.
 * That editor needed Home Assistant's form components to be registered on the page,
 * and ha-textfield is not: every <ha-textfield> rendered as an unknown element —
 * present in the DOM with the right attributes, drawing nothing — which is why Title,
 * Latitude, Longitude and Altitude were invisible. There is no documented set of
 * components a custom card may rely on, so the fix is to stop relying on them.
 */
import { trnslt } from "./translations";
import { MeteogramCardConfig } from "./types";

/**
 * getConfigForm is static and computeLabel is handed only the schema, so there is no
 * hass here. That matters less than it looks: trnslt uses hass solely for its
 * language, since these keys live in this card's own bundled translations and
 * hass.localize never resolves them. Home Assistant keeps <html lang> in step with the
 * user's profile language, with the browser's as a backstop.
 */
const lang = (): string =>
    (typeof document !== "undefined" && document.documentElement.getAttribute("lang")) ||
    (typeof navigator !== "undefined" && navigator.language) ||
    "en";

const t = (key: string, fallback: string): string =>
    trnslt({ language: lang() }, `ui.editor.meteogram.${key}`, fallback);

/** Field name to its label. Resolved per call so a language change is picked up. */
const LABELS: Record<string, () => string> = {
    title: () => t("title_label", "Title"),
    entity_id: () => t("weather_entity", "Weather entity"),
    latitude: () => t("latitude", "Latitude"),
    longitude: () => t("longitude", "Longitude"),
    altitude: () => t("altitude", "Altitude"),
    display_mode: () => t("display_mode", "Display mode"),
    meteogram_hours: () => t("meteogram_length", "Meteogram length"),
    aspect_ratio: () => t("aspect_ratio", "Aspect ratio"),
    layout_mode: () => t("layout_mode", "Layout mode"),
    diagnostics: () => t("diagnostics", "Diagnostics"),
    layers: () => t("display_options", "Display options"),
    advanced: () => t("advanced", "Advanced"),
    show_cloud_cover: () => t("attributes.cloud_coverage", "Show cloud cover"),
    show_pressure: () => t("attributes.air_pressure", "Show air pressure"),
    show_precipitation: () => t("attributes.precipitation", "Show precipitation"),
    show_weather_icons: () => t("attributes.weather_icons", "Show weather icons"),
    dense_weather_icons: () => t("attributes.dense_icons", "Dense weather icons (hourly)"),
    show_wind: () => t("attributes.wind", "Show wind"),
    show_sun: () => t("attributes.sun", "Show sunrise/sunset"),
};

const HELPERS: Record<string, () => string> = {
    title: () => t("title_description", "Card title (optional, shown at the top of the card)"),
    entity_id: () => t("choose_weather_entity",
        "Choose a weather entity, or leave empty to fetch from Met.no using the coordinates below."),
    // Says what they are for rather than disabling them. The old editor greyed these
    // out whenever an entity was selected, which was wrong once the day/night strip
    // existed: it computes sunrise and sunset from these coordinates whatever supplies
    // the forecast, so an entity for somewhere else drew the wrong sun times and the
    // fields that would have fixed it were unreachable.
    latitude: () => t("coordinates_helper",
        "Used for sunrise and sunset, and for the forecast when no weather entity is set. "
        + "Defaults to Home Assistant's location."),
    altitude: () => t("optional", "Optional"),
    meteogram_hours: () => t("choose_hours",
        "How much forecast to show. Pick a value or type your own, such as 96h."),
    aspect_ratio: () => t("aspect_ratio_helper", "Pick a ratio or type your own, such as 1.6 or 5:3."),
};

/**
 * What the card does when a key is absent, mirrored from setConfig.
 *
 * The form needs these because Home Assistant renders from the stored config: a key
 * that is not in the YAML arrives as undefined and a boolean selector draws that as
 * off. Every layer toggle therefore showed the opposite of what the card was doing,
 * and the first click on a wrongly-unchecked box wrote the value it already had, so
 * nothing appeared to happen. The schema has no `default` key to express this, which
 * is why the editor merges them into the data it hands the form.
 */
export const CARD_DEFAULTS: MeteogramCardConfig = {
    show_cloud_cover: true,
    show_pressure: true,
    show_precipitation: true,
    show_weather_icons: true,
    dense_weather_icons: true,
    show_wind: true,
    show_sun: true,
    display_mode: "full",
    meteogram_hours: "48h",
    aspect_ratio: "16:9",
    layout_mode: "sections",
};

export function meteogramConfigForm() {
    return {
        schema: [
            { name: "title", selector: { text: {} } },
            { name: "entity_id", selector: { entity: { filter: [{ domain: "weather" }] } } },
            {
                type: "grid",
                name: "",
                schema: [
                    { name: "latitude", selector: { number: { mode: "box", step: "any" } } },
                    { name: "longitude", selector: { number: { mode: "box", step: "any" } } },
                    { name: "altitude", selector: { number: { mode: "box", step: 1, unit_of_measurement: "m" } } },
                ],
            },
            {
                type: "grid",
                name: "",
                schema: [
                    {
                        name: "display_mode",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [
                                    { value: "full", label: t("display_full", "Full") },
                                    { value: "core", label: t("display_core", "Core") },
                                    { value: "focussed", label: t("display_focussed", "Focussed") },
                                ],
                            },
                        },
                    },
                    {
                        // custom_value replaces the old select-plus-conditional-input pair:
                        // a listed span or a typed one, in one field.
                        name: "meteogram_hours",
                        selector: {
                            select: {
                                mode: "dropdown",
                                custom_value: true,
                                options: [
                                    { value: "8h", label: t("hours_8", "8 hours") },
                                    { value: "12h", label: t("hours_12", "12 hours") },
                                    { value: "24h", label: t("hours_24", "24 hours") },
                                    { value: "48h", label: t("hours_48", "48 hours") },
                                    { value: "72h", label: t("hours_72", "72 hours") },
                                    { value: "120h", label: t("hours_120", "120 hours") },
                                    { value: "max", label: t("hours_max", "Max available") },
                                ],
                            },
                        },
                    },
                    {
                        name: "aspect_ratio",
                        selector: {
                            select: {
                                mode: "dropdown",
                                custom_value: true,
                                options: ["16:9", "4:3", "1:1", "21:9", "3:2"],
                            },
                        },
                    },
                ],
            },
            {
                type: "expandable",
                name: "layers",
                schema: [
                    { name: "show_cloud_cover", selector: { boolean: {} } },
                    { name: "show_pressure", selector: { boolean: {} } },
                    { name: "show_precipitation", selector: { boolean: {} } },
                    { name: "show_weather_icons", selector: { boolean: {} } },
                    { name: "dense_weather_icons", selector: { boolean: {} } },
                    { name: "show_wind", selector: { boolean: {} } },
                    { name: "show_sun", selector: { boolean: {} } },
                ],
            },
            {
                type: "expandable",
                name: "advanced",
                schema: [
                    {
                        name: "layout_mode",
                        selector: { select: { mode: "dropdown", options: ["sections", "panel", "grid"] } },
                    },
                    { name: "diagnostics", selector: { boolean: {} } },
                ],
            },
        ],

        computeLabel: (schema: { name: string }): string | undefined => LABELS[schema.name]?.(),
        computeHelper: (schema: { name: string }): string | undefined => HELPERS[schema.name]?.(),

        /** Rejected rather than silently drawn wrong. */
        assertConfig: (config: MeteogramCardConfig) => {
            const hasLat = config.latitude !== undefined && config.latitude !== null;
            const hasLon = config.longitude !== undefined && config.longitude !== null;
            if (hasLat !== hasLon) {
                throw new Error(
                    "latitude and longitude must be set together. One on its own is ignored, "
                    + "and the card falls back to Home Assistant's location."
                );
            }
            if (hasLat && Math.abs(Number(config.latitude)) > 90) {
                throw new Error("latitude must be between -90 and 90.");
            }
            if (hasLon && Math.abs(Number(config.longitude)) > 180) {
                throw new Error("longitude must be between -180 and 180.");
            }
        },
    };
}
