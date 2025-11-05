// /lib/api.ts
export const API_BASE = "http://localhost:5000/api";

export async function registerUser(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // send/receive cookies
    });
    return await res.json();
}

export async function loginUser(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    return await res.json();
}

export async function getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
}

export async function logoutUser() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    return await res.json();
}
