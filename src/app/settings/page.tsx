"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    darkMode: false,
    language: "en"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setSettings({
            emailNotifications: data.email_notifications,
            darkMode: data.dark_mode,
            language: data.language
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchSettings();
    }
  }, [session, status]);

  const handleSaveSettings = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          email_notifications: settings.emailNotifications,
          dark_mode: settings.darkMode,
          language: settings.language,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user data from Supabase
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', session.user.id);

      if (deleteError) throw deleteError;

      // Sign out the user
      await signOut({ callbackUrl: '/' });
      toast.success('Account deleted successfully');
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account');
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Loading your settings...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8 max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/signin"}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive notifications about your capsules via email.
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enable dark mode for a better viewing experience.
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, darkMode: checked }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <select
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
} 