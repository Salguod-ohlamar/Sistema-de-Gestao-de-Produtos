const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function saveSession(session) {
    localStorage.setItem("sgpr_access_token", session.accessToken);
    localStorage.setItem("sgpr_company", JSON.stringify(session.company));
    localStorage.setItem("sgpr_principal_type", session.principalType || "company");
    localStorage.setItem("sgpr_session_role", session.role || "");
    localStorage.setItem("sgpr_session_is_admin", String(Boolean(session.isAdmin)));
}

export function clearSession() {
    [
        "sgpr_access_token",
        "sgpr_company",
        "sgpr_principal_type",
        "sgpr_session_role",
        "sgpr_session_is_admin"
    ].forEach((key) => localStorage.removeItem(key));
}

export function getPrincipalType() {
    const token = localStorage.getItem("sgpr_access_token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")));
        if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
            clearSession();
            return null;
        }
        return localStorage.getItem("sgpr_principal_type");
    } catch {
        clearSession();
        return null;
    }
}

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("sgpr_access_token");
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const error = response.status === 403
        ? await response.clone().json().catch(() => ({}))
        : {};
    const accessDisabled = response.status === 403 && /inativ/i.test(error.error || "");
    if ((response.status === 401 || accessDisabled) && !path.startsWith("/auth/")) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        clearSession();
        window.location.replace(`/?login=required&returnTo=${encodeURIComponent(returnTo)}`);
    }
    return response;
}