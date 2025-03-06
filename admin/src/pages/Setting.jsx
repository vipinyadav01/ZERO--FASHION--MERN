import React, { useState, useEffect } from 'react';
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
    RefreshCw,
    Check,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
    // State management with default values
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
        language: 'en',
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

    // Theme management - apply theme based on settings
    useEffect(() => {
        // Add or remove dark mode class to document based on settings
        if (settings.appearance.darkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#1a1a1a';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f9fafb';
        }
    }, [settings.appearance.darkMode]);

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        message: '',
        mismatched: false
    });

    // Language options
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
    ];

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();

        // Password validation for password change
        if (
            settings.passwordForm.newPassword &&
            (settings.passwordForm.newPassword !== settings.passwordForm.confirmPassword)
        ) {
            setPasswordValidation({
                isValid: false,
                message: 'Passwords do not match',
                mismatched: true
            });
            toast.error('Passwords do not match');
            return;
        }

        // If new password is provided but current password is empty
        if (settings.passwordForm.newPassword && !settings.passwordForm.currentPassword) {
            setPasswordValidation({
                isValid: false,
                message: 'Please enter your current password',
                mismatched: false
            });
            toast.error('Please enter your current password');
            return;
        }

        // Save settings to localStorage for persistence
        localStorage.setItem('userSettings', JSON.stringify(settings));

        // Success notification
        toast.success('Settings updated successfully');

        // Reset password form after successful submission
        if (settings.passwordForm.newPassword) {
            setSettings({
                ...settings,
                passwordForm: {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }
            });
            setPasswordValidation({
                isValid: true,
                message: 'Password updated successfully',
                mismatched: false
            });
        }
    };

    // Toggle dark mode with immediate effect
    const toggleDarkMode = () => {
        setSettings({
            ...settings,
            appearance: {
                ...settings.appearance,
                darkMode: !settings.appearance.darkMode
            }
        });
    };

    // Change language handler
    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSettings({ ...settings, language: newLanguage });

        // You would typically implement language change logic here
        // For demonstration, we'll just show a toast
        const selectedLang = languages.find(lang => lang.code === newLanguage);
        toast.info(`Language changed to ${selectedLang.name}`);
    };

    // Password validation checker
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            hasMinLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
        };
    };

    // Handle password change with validation
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setSettings({
            ...settings,
            passwordForm: {
                ...settings.passwordForm,
                [name]: value
            }
        });

        if (name === 'newPassword') {
            const validation = validatePassword(value);

            if (!validation.isValid) {
                setPasswordValidation({
                    isValid: false,
                    message: 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters',
                    validation
                });
            } else {
                setPasswordValidation({
                    isValid: true,
                    message: 'Password meets requirements',
                    validation
                });
            }
        }

        if (name === 'confirmPassword') {
            if (value !== settings.passwordForm.newPassword) {
                setPasswordValidation({
                    ...passwordValidation,
                    mismatched: true,
                    message: 'Passwords do not match'
                });
            } else {
                setPasswordValidation({
                    ...passwordValidation,
                    mismatched: false,
                    message: 'Passwords match'
                });
            }
        }
    };

    // Custom Toggle Switch Component
    const ToggleSwitch = ({ enabled, onChange, size = 'default', disabled = false }) => (
        <button
            type="button"
            className={`${enabled ? 'bg-blue-500' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                relative inline-flex ${size === 'small' ? 'h-5 w-9' : 'h-6 w-11'}
                flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            onClick={disabled ? null : onChange}
            disabled={disabled}
        >
            <span
                className={`${enabled ? (size === 'small' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}
                    pointer-events-none inline-block ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'}
                    transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );

    return (
        <div className={`min-h-screen ${settings.appearance.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>Settings <span className='bg-gradient-to-br bg-pink-300 to to-blue-400'>functionality under process</span>

                    </h1>
                    <p className={`mt-2 text-sm ${settings.appearance.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className={`${settings.appearance.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden transition-colors duration-200`}>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Notifications Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <BellRing className="w-5 h-5 text-blue-500" />
                                    <h2 className={`text-lg font-medium ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Notifications
                                    </h2>
                                </div>
                                <div className={`${settings.appearance.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 space-y-4 transition-colors duration-200`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Email Notifications
                                            </p>
                                            <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Receive updates about your account via email
                                            </p>
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
                                            <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Order Updates
                                            </p>
                                            <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Get notified about order status changes
                                            </p>
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
                                            <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Security Alerts
                                            </p>
                                            <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Important notifications about your account security
                                            </p>
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
                                    <h2 className={`text-lg font-medium ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Appearance
                                    </h2>
                                </div>
                                <div className={`${settings.appearance.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 space-y-4 transition-colors duration-200`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {settings.appearance.darkMode ?
                                                <Moon className="w-5 h-5 text-yellow-300" /> :
                                                <Sun className="w-5 h-5 text-yellow-500" />
                                            }
                                            <div>
                                                <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {settings.appearance.darkMode ? 'Dark Mode' : 'Light Mode'}
                                                </p>
                                                <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {settings.appearance.darkMode ?
                                                        'Switch to light theme for a brighter look' :
                                                        'Switch to dark theme for reduced eye strain'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            enabled={settings.appearance.darkMode}
                                            onChange={toggleDarkMode}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Animations
                                            </p>
                                            <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Enable or disable interface animations
                                            </p>
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
                                    <h2 className={`text-lg font-medium ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Security
                                    </h2>
                                </div>
                                <div className={`${settings.appearance.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 space-y-6 transition-colors duration-200`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                Two-Factor Authentication
                                            </p>
                                            <p className={`text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Add an extra layer of security to your account
                                            </p>
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
                                    <div className={`space-y-4 pt-4 border-t ${settings.appearance.darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <h3 className={`text-sm font-medium ${settings.appearance.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Change Password
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type={settings.showPasswords.current ? "text" : "password"}
                                                    name="currentPassword"
                                                    placeholder="Current Password"
                                                    className={`w-full px-3 py-2 border ${settings.appearance.darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                    value={settings.passwordForm.currentPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                                <button
                                                    type="button"
                                                    className={`absolute right-3 top-2.5 ${settings.appearance.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
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
                                                    name="newPassword"
                                                    placeholder="New Password"
                                                    className={`w-full px-3 py-2 border ${settings.appearance.darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                    value={settings.passwordForm.newPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                                <button
                                                    type="button"
                                                    className={`absolute right-3 top-2.5 ${settings.appearance.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
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

                                            {settings.passwordForm.newPassword && (
                                                <div className={`text-xs ${passwordValidation.isValid ? 'text-green-500' : 'text-red-500'}`}>
                                                    {passwordValidation.message}
                                                </div>
                                            )}

                                            <div className="relative">
                                                <input
                                                    type={settings.showPasswords.confirm ? "text" : "password"}
                                                    name="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    className={`w-full px-3 py-2 border ${settings.appearance.darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${passwordValidation.mismatched && settings.passwordForm.confirmPassword ? 'border-red-500' : ''}`}
                                                    value={settings.passwordForm.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                />
                                                <button
                                                    type="button"
                                                    className={`absolute right-3 top-2.5 ${settings.appearance.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                                    onClick={() => setSettings({
                                                        ...settings,
                                                        showPasswords: {
                                                            ...settings.showPasswords,
                                                            confirm: !settings.showPasswords.confirm
                                                        }
                                                    })}
                                                >
                                                    {settings.showPasswords.confirm ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>

                                            {passwordValidation.mismatched && settings.passwordForm.confirmPassword && (
                                                <div className="text-xs text-red-500">
                                                    Passwords do not match
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Language Section */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Languages className="w-5 h-5 text-blue-500" />
                                    <h2 className={`text-lg font-medium ${settings.appearance.darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Language & Region
                                    </h2>
                                </div>
                                <div className={`${settings.appearance.darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 transition-colors duration-200`}>
                                    <div className="max-w-xs">
                                        <select
                                            value={settings.language}
                                            onChange={handleLanguageChange}
                                            className={`block w-full px-3 py-2 border ${settings.appearance.darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.flag} {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={`mt-2 text-xs ${settings.appearance.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            This will change the language across the application
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Save Button */}
                            <div className={`pt-6 border-t ${settings.appearance.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Reset to default settings
                                            setSettings({
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
                                                language: 'en',
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
                                            toast.info('Settings reset to defaults');
                                        }}
                                        className={`px-6 py-3 ${settings.appearance.darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 flex items-center justify-center gap-2`}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reset to Defaults
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
