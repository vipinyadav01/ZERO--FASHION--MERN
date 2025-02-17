import React, { useState } from 'react';
import {
    Bell,
    Moon,
    Sun,
    Globe,
    Lock,
    Shield,
    Smartphone,
    Mail,
    Save,
    BellRing,
    Key,
    Eye,
    EyeOff,
    Palette,
    Languages,
    RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            orderUpdates: true,
            newsletter: false,
            reminderAlerts: true,
            securityAlerts: true
        },
        appearance: {
            darkMode: false,
            compactView: true,
            animations: true,
            sidebarCollapsed: false
        },
        privacy: {
            twoFactorAuth: true,
            activityLog: true,
            dataSharing: false,
            loginAlerts: true
        },
        language: 'English',
        passwordForm: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        showPasswords: {
            current: false,
            new: false,
            confirm: false
        }
    });

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle settings update logic here
        toast.success('Settings updated successfully');
    };

    // Custom Toggle Switch Component
    const ToggleSwitch = ({ enabled, onChange, size = 'default' }) => (
        <button
            type="button"
            className={`${enabled ? 'bg-blue-500' : 'bg-gray-200'
                } relative inline-flex ${size === 'small' ? 'h-5 w-9' : 'h-6 w-11'
                } flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            onClick={onChange}
        >
            <span
                className={`${enabled ? (size === 'small' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'
                    } pointer-events-none inline-block ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'
                    } transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Notifications Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <BellRing className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                            <p className="text-xs text-gray-500">Receive updates about your account via email</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.notifications.email}
                                            onChange={() => setSettings({
                                                ...settings,
                                                notifications: {
                                                    ...settings.notifications,
                                                    email: !settings.notifications.email
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Order Updates</p>
                                            <p className="text-xs text-gray-500">Get notified about order status changes</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.notifications.orderUpdates}
                                            onChange={() => setSettings({
                                                ...settings,
                                                notifications: {
                                                    ...settings.notifications,
                                                    orderUpdates: !settings.notifications.orderUpdates
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Security Alerts</p>
                                            <p className="text-xs text-gray-500">Important notifications about your account security</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.notifications.securityAlerts}
                                            onChange={() => setSettings({
                                                ...settings,
                                                notifications: {
                                                    ...settings.notifications,
                                                    securityAlerts: !settings.notifications.securityAlerts
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Appearance Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Palette className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                                            <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.appearance.darkMode}
                                            onChange={() => setSettings({
                                                ...settings,
                                                appearance: {
                                                    ...settings.appearance,
                                                    darkMode: !settings.appearance.darkMode
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Animations</p>
                                            <p className="text-xs text-gray-500">Enable or disable interface animations</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.appearance.animations}
                                            onChange={() => setSettings({
                                                ...settings,
                                                appearance: {
                                                    ...settings.appearance,
                                                    animations: !settings.appearance.animations
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Security Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-medium text-gray-900">Security</h2>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.privacy.twoFactorAuth}
                                            onChange={() => setSettings({
                                                ...settings,
                                                privacy: {
                                                    ...settings.privacy,
                                                    twoFactorAuth: !settings.privacy.twoFactorAuth
                                                }
                                            })}
                                        />
                                    </div>

                                    {/* Password Change Form */}
                                    <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700">Change Password</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type={settings.showPasswords.current ? "text" : "password"}
                                                    placeholder="Current Password"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                                    onClick={() => setSettings({
                                                        ...settings,
                                                        showPasswords: {
                                                            ...settings.showPasswords,
                                                            current: !settings.showPasswords.current
                                                        }
                                                    })}
                                                >
                                                    {settings.showPasswords.current ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={settings.showPasswords.new ? "text" : "password"}
                                                    placeholder="New Password"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                                    onClick={() => setSettings({
                                                        ...settings,
                                                        showPasswords: {
                                                            ...settings.showPasswords,
                                                            new: !settings.showPasswords.new
                                                        }
                                                    })}
                                                >
                                                    {settings.showPasswords.new ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Language Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Languages className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-lg font-medium text-gray-900">Language & Region</h2>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="max-w-xs">
                                        <select
                                            value={settings.language}
                                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Save Button */}
                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
