export const SESSION_TIMEOUT_MS = 10 * 60 * 1000;
export const AUTH_SESSION_CHANGED_EVENT = "auth-session-changed";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const LAST_ACTIVITY_KEY = "authLastActivityAt";

const now = () => Date.now();

const emitSessionChanged = () => {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
};

export const readStoredUser = () => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
};

export const readLastActivityAt = () => {
    const storedLastActivityAt = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
    return Number.isFinite(storedLastActivityAt) && storedLastActivityAt > 0
        ? storedLastActivityAt
        : null;
};

export const hasExpiredSession = (timestamp = now()) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        return false;
    }

    const lastActivityAt = readLastActivityAt();
    return !lastActivityAt || timestamp - lastActivityAt >= SESSION_TIMEOUT_MS;
};

export const clearAuthSession = ({ notify = true } = {}) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);

    if (notify) {
        emitSessionChanged();
    }
};

export const readStoredToken = () => {
    if (hasExpiredSession()) {
        clearAuthSession();
        return null;
    }

    return localStorage.getItem(TOKEN_KEY);
};

export const persistAuthSession = ({ accessToken, user }, timestamp = now()) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
    emitSessionChanged();
};

export const refreshAuthToken = (accessToken, timestamp = now()) => {
    if (!accessToken) {
        return;
    }

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
    emitSessionChanged();
};

export const touchAuthSession = (timestamp = now()) => {
    if (!localStorage.getItem(TOKEN_KEY)) {
        return;
    }

    localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
    emitSessionChanged();
};

export const msUntilSessionExpires = (timestamp = now()) => {
    const lastActivityAt = readLastActivityAt();

    if (!localStorage.getItem(TOKEN_KEY) || !lastActivityAt) {
        return 0;
    }

    return Math.max(0, SESSION_TIMEOUT_MS - (timestamp - lastActivityAt));
};
