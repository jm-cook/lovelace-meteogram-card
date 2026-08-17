export const CARD_NAME = "Meteogram Card";
export const METEOGRAM_CARD_STARTUP_TIME = new Date();
// Off by default, including in beta. Tying this to the version meant every beta user
// got a status panel under their chart whether or not they were diagnosing anything.
// It stays available two ways: `diagnostics: true` for someone who wants it
// permanently, and `debug: true`, which now implies it.
export const DIAGNOSTICS_DEFAULT = false;
