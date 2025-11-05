// /lib/auth.ts
export async function checkAuth() {
    try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
            credentials: "include",
        });

        if (res.ok) {
            const user = await res.json();
            return user;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
