"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [formData, setFormData] = useState({ fullName: "", organization: "" });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      const user = await res.json();
      setFormData({ fullName: user.fullName, organization: user.organization });
      setLoading(false);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/auth/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    toast({ title: "Settings saved", description: "Your profile has been updated." });
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading settings...</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your profile and organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>
          <div>
            <Label>Organization</Label>
            <Input name="organization" value={formData.organization} onChange={handleChange} />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
