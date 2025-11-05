"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SettingsForm({ user }: { user: any }) {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        organization: user?.organization || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        await fetch("http://localhost:5000/api/auth/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        alert("Settings updated successfully!");
    };

    return (
        <form className="space-y-4">
            <div>
                <Label>Full Name</Label>
                <Input name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
                <Label>Organization</Label>
                <Input name="organization" value={formData.organization} onChange={handleChange} />
            </div>
            <Button type="button" onClick={handleSave}>Save</Button>
        </form>
    );
}
