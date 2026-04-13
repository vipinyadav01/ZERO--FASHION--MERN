import { useState } from 'react';
import { toast } from 'react-toastify';
import { Store, Bell, Shield, User, Save, ChevronRight } from 'lucide-react';
import PageShell from '../components/PageShell';
import PropTypes from 'prop-types';

const InputField = ({ label, value, onChange, type = 'text', placeholder = '', disabled = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 border border-brand-border bg-[#F8F8F6] text-sm font-medium text-brand-text-primary focus:outline-none focus:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);

const Toggle = ({ label, sub, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
        <div>
            <p className="text-sm font-bold text-brand-text-primary">{label}</p>
            {sub && <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mt-0.5">{sub}</p>}
        </div>
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#1A1A1A]' : 'bg-brand-border'}`}
        >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white border border-brand-border">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border">
            <div className="p-2 bg-[#F8F8F6] border border-brand-border">
                <Icon className="w-4 h-4 text-brand-text-primary" />
            </div>
            <h2 className="text-sm font-black text-brand-text-primary uppercase tracking-tight">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const Settings = ({ token }) => {
    // Store info
    const [store, setStore] = useState({
        name: 'Zero Fashion',
        email: 'support@zerofashion.com',
        phone: '+91 98765 43210',
        address: '12 Fashion Street, Mumbai, Maharashtra 400001',
        currency: 'INR',
        taxRate: '18',
    });

    // Notifications
    const [notifs, setNotifs] = useState({
        newOrders: true,
        lowStock: true,
        newUsers: false,
        paymentFailed: true,
        orderDelivered: true,
        weeklyReport: false,
    });

    // Security
    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: true,
        activityLog: true,
    });

    const [saving, setSaving] = useState(false);

    const handleStoreSave = async () => {
        setSaving(true);
        // Simulated save — replace with actual API call when backend supports it
        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        toast.success('Store settings saved');
    };

    const tabs = [
        { id: 'store',    label: 'Store',         icon: Store },
        { id: 'notifs',   label: 'Notifications',  icon: Bell },
        { id: 'security', label: 'Security',        icon: Shield },
    ];
    const [activeTab, setActiveTab] = useState('store');

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Admin Panel</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Settings</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Sidebar tabs */}
                <div className="bg-white border border-brand-border p-2 space-y-1 h-fit">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-colors ${
                                activeTab === t.id
                                    ? 'bg-[#1A1A1A] text-white'
                                    : 'text-brand-text-secondary hover:bg-[#F8F8F6] hover:text-brand-text-primary'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <t.icon className="w-4 h-4" />
                                {t.label}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-5">
                    {activeTab === 'store' && (
                        <>
                            <SectionCard icon={Store} title="Store Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <InputField label="Store Name" value={store.name} onChange={e => setStore(s => ({ ...s, name: e.target.value }))} />
                                    <InputField label="Support Email" value={store.email} onChange={e => setStore(s => ({ ...s, email: e.target.value }))} type="email" />
                                    <InputField label="Phone" value={store.phone} onChange={e => setStore(s => ({ ...s, phone: e.target.value }))} />
                                    <InputField label="Currency" value={store.currency} onChange={e => setStore(s => ({ ...s, currency: e.target.value }))} />
                                    <div className="md:col-span-2">
                                        <InputField label="Store Address" value={store.address} onChange={e => setStore(s => ({ ...s, address: e.target.value }))} />
                                    </div>
                                    <InputField label="Tax Rate (%)" value={store.taxRate} onChange={e => setStore(s => ({ ...s, taxRate: e.target.value }))} type="number" />
                                </div>
                                <div className="mt-5 pt-5 border-t border-brand-border flex justify-end">
                                    <button
                                        onClick={handleStoreSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </SectionCard>

                            <SectionCard icon={User} title="Admin Profile">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <InputField label="Full Name" value="Admin User" onChange={() => {}} placeholder="Your name" />
                                    <InputField label="Email" value="admin@zerofashion.com" onChange={() => {}} type="email" disabled />
                                    <InputField label="New Password" value="" onChange={() => {}} type="password" placeholder="Leave blank to keep current" />
                                    <InputField label="Confirm Password" value="" onChange={() => {}} type="password" placeholder="Confirm new password" />
                                </div>
                                <div className="mt-5 pt-5 border-t border-brand-border flex justify-end">
                                    <button
                                        onClick={() => toast.info('Profile update coming soon')}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        Update Profile
                                    </button>
                                </div>
                            </SectionCard>
                        </>
                    )}

                    {activeTab === 'notifs' && (
                        <SectionCard icon={Bell} title="Notification Preferences">
                            <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-5">
                                Choose which events trigger admin notifications.
                            </p>
                            <div>
                                {[
                                    { key: 'newOrders',       label: 'New Orders',          sub: 'Alert when a new order is placed' },
                                    { key: 'lowStock',        label: 'Low Stock Alerts',     sub: 'Alert when products fall below 10 units' },
                                    { key: 'newUsers',        label: 'New User Registrations', sub: 'Alert when a new customer registers' },
                                    { key: 'paymentFailed',   label: 'Payment Failures',     sub: 'Alert when a payment fails or is declined' },
                                    { key: 'orderDelivered',  label: 'Order Delivered',      sub: 'Alert when an order is marked delivered' },
                                    { key: 'weeklyReport',    label: 'Weekly Summary Report', sub: 'Receive weekly performance digest' },
                                ].map(n => (
                                    <Toggle
                                        key={n.key}
                                        label={n.label}
                                        sub={n.sub}
                                        checked={notifs[n.key]}
                                        onChange={() => setNotifs(s => ({ ...s, [n.key]: !s[n.key] }))}
                                    />
                                ))}
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => toast.success('Notification preferences saved')}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Save Preferences
                                </button>
                            </div>
                        </SectionCard>
                    )}

                    {activeTab === 'security' && (
                        <SectionCard icon={Shield} title="Security Settings">
                            <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-5">
                                Manage admin access security options.
                            </p>
                            <div>
                                {[
                                    { key: 'twoFactor',      label: 'Two-Factor Authentication', sub: 'Require 2FA for admin login' },
                                    { key: 'sessionTimeout', label: 'Auto Session Timeout',      sub: 'Expire session after 30 minutes of inactivity' },
                                    { key: 'activityLog',    label: 'Activity Logging',           sub: 'Log all admin actions for audit trail' },
                                ].map(s => (
                                    <Toggle
                                        key={s.key}
                                        label={s.label}
                                        sub={s.sub}
                                        checked={security[s.key]}
                                        onChange={() => setSecurity(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                                    />
                                ))}
                            </div>

                            <div className="mt-5 p-4 bg-amber-50 border border-amber-200">
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                                    Note: Some security features require backend configuration. Contact your developer to enable server-side enforcement.
                                </p>
                            </div>

                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => toast.success('Security settings saved')}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Save Settings
                                </button>
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </PageShell>
    );
};

Settings.propTypes = { token: PropTypes.string };

export default Settings;
