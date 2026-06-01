import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../components/ui/use-toast'
import api from '../services/api'
import {
    User, Lock, Shield, ChevronRight,
    Eye, EyeOff, Check, X, Sparkles, LogOut, Mail, Bell,
    Pencil
} from 'lucide-react'
import './SettingsPage.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'


/* ─── Tab definitions ─── */
const TABS = [
    { id: 'profile',       icon: User,       label: 'Profile' },
    { id: 'security',      icon: Lock,       label: 'Security' },
    { id: 'notifications', icon: Bell,       label: 'Notifications' },
]

/* ─── Default notification prefs ─── */
const DEFAULT_NOTIFS = {
    trainingComplete:  true,
    trainingFailed:    true,
    datasetUploaded:   false,
    securityAlerts:    true,
}

const NOTIF_ITEMS = [
    { key: 'trainingComplete', label: 'Training completed',       desc: 'Get notified when a model finishes training.' },
    { key: 'trainingFailed',   label: 'Training failed',          desc: 'Alert me if a training job encounters an error.' },
    { key: 'datasetUploaded',  label: 'Dataset uploaded',         desc: 'Notify when a dataset upload succeeds.' },
    { key: 'securityAlerts',   label: 'Security alerts',          desc: 'Get alerts for unusual sign-ins or password changes.' },
]

/* camelCase (frontend) ↔ snake_case (backend) mapping */
const KEY_TO_API = {
    trainingComplete: 'training_completed',
    trainingFailed:   'training_failed',
    datasetUploaded:  'dataset_uploaded',
    securityAlerts:   'security_alerts',
}
const API_TO_KEY = Object.fromEntries(Object.entries(KEY_TO_API).map(([k, v]) => [v, k]))


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const { user, logout, checkAuth } = useAuthStore()
    const { toast } = useToast()
    const navigate = useNavigate()

    /* ── Username edit state ── */
    const [editingUsername, setEditingUsername] = useState(false)
    const [newUsername, setNewUsername] = useState(user?.username || '')
    const [savingUsername, setSavingUsername] = useState(false)

    /* ── Password change state ── */
    const [currentPwd, setCurrentPwd] = useState('')
    const [newPwd, setNewPwd] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [changingPwd, setChangingPwd] = useState(false)


    /* ── Notification prefs (server-synced) ── */
    const [notifs, setNotifs] = useState(DEFAULT_NOTIFS)
    const [notifsLoading, setNotifsLoading] = useState(false)

    /* Fetch prefs from backend when notifications tab is active */
    useEffect(() => {
        if (activeTab !== 'notifications') return
        let cancelled = false
        const fetchPrefs = async () => {
            setNotifsLoading(true)
            try {
                const res = await api.get('/notifications/preferences')
                if (!cancelled && res.data) {
                    const mapped = {}
                    for (const [apiKey, val] of Object.entries(res.data)) {
                        const uiKey = API_TO_KEY[apiKey]
                        if (uiKey) mapped[uiKey] = val
                    }
                    setNotifs(prev => ({ ...prev, ...mapped }))
                }
            } catch (err) {
                console.warn('Failed to load notification prefs:', err)
            } finally {
                if (!cancelled) setNotifsLoading(false)
            }
        }
        fetchPrefs()
        return () => { cancelled = true }
    }, [activeTab])

    const toggleNotif = async (key) => {
        const newVal = !notifs[key]
        /* Optimistic UI update */
        setNotifs(prev => ({ ...prev, [key]: newVal }))
        toast({
            title: newVal ? 'Enabled' : 'Disabled',
            description: `${NOTIF_ITEMS.find(n => n.key === key)?.label || key} ${newVal ? 'enabled' : 'disabled'}.`
        })
        try {
            await api.put('/notifications/preferences', { [KEY_TO_API[key]]: newVal })
        } catch (err) {
            /* Revert on failure */
            setNotifs(prev => ({ ...prev, [key]: !newVal }))
            toast({ title: 'Error', description: 'Failed to save preference.', variant: 'destructive' })
        }
    }



    /* ─────────── handlers ─────────── */

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (newPwd !== confirmPwd) {
            toast({ title: 'Mismatch', description: 'New passwords do not match.', variant: 'destructive' })
            return
        }
        setChangingPwd(true)
        try {
            await api.post('/auth/change-password', {
                current_password: currentPwd,
                new_password: newPwd
            })
            toast({ title: 'Success', description: 'Password changed successfully.' })
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
        } catch (err) {
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to change password.',
                variant: 'destructive'
            })
        } finally {
            setChangingPwd(false)
        }
    }



    const handleSaveUsername = async () => {
        const trimmed = newUsername.trim()
        if (!trimmed || trimmed === user?.username) {
            setEditingUsername(false)
            setNewUsername(user?.username || '')
            return
        }
        setSavingUsername(true)
        try {
            const res = await api.put('/auth/update-username', { username: trimmed })
            // Update the user in zustand store
            useAuthStore.setState({ user: res.data.user })
            toast({ title: 'Success', description: 'Username updated.' })
            setEditingUsername(false)
        } catch (err) {
            toast({
                title: 'Error',
                description: err.response?.data?.error || 'Failed to update username.',
                variant: 'destructive'
            })
        } finally {
            setSavingUsername(false)
        }
    }

    const handleLogout = () => { logout(); navigate('/login') }


    const trainingCount = user?.training_count || 0
    const trainingsRemaining = user?.trainings_remaining ?? (5 - trainingCount)

    /* ─────────── Profile Tab ─────────── */
    const renderProfile = () => {
        const percentUsed = Math.min(100, Math.max(0, (trainingCount / 5) * 100))
        return (
            <div className="st-section">
                <h2 className="st-section-title">Profile Information</h2>
                <p className="st-section-desc">Manage your workspace metadata and credentials.</p>

                <div className="st-profile-card">
                    <div className="st-avatar-wrap">
                        <div className="st-avatar-glow" />
                        <div className="st-avatar-inner">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="st-profile-fields">
                        <div className="st-field">
                            <label><User size={12} /> Username</label>
                            {editingUsername ? (
                                <div className="st-field-edit">
                                    <input
                                        className="st-field-input"
                                        value={newUsername}
                                        onChange={e => setNewUsername(e.target.value)}
                                        placeholder="New username"
                                        maxLength={32}
                                        autoFocus
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleSaveUsername()
                                            if (e.key === 'Escape') { setEditingUsername(false); setNewUsername(user?.username || '') }
                                        }}
                                    />
                                    <button
                                        className="st-btn-icon st-btn-save"
                                        onClick={handleSaveUsername}
                                        disabled={savingUsername}
                                        title="Save"
                                    >
                                        {savingUsername ? <span className="st-spinner" /> : <Check size={16} />}
                                    </button>
                                    <button
                                        className="st-btn-icon st-btn-cancel"
                                        onClick={() => { setEditingUsername(false); setNewUsername(user?.username || '') }}
                                        title="Cancel"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="st-field-value st-field-editable">
                                    <span className="st-username-text">{user?.username || '—'}</span>
                                    <button
                                        className="st-btn-icon st-btn-edit"
                                        onClick={() => { setNewUsername(user?.username || ''); setEditingUsername(true) }}
                                        title="Edit username"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="st-field">
                            <label><Mail size={12} /> Email Address</label>
                            <div className="st-field-value">{user?.email || '—'}</div>
                        </div>

                        <div className="st-field">
                            <label><Shield size={12} /> System Status</label>
                            <div className="st-field-value">
                                <span className="st-status-active">
                                    <span className="st-status-pulse"></span>
                                    Active Developer Node
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="st-usage-section">
                    <h3 className="st-usage-title">
                        <Sparkles size={14} className="text-emerald" />
                        Compute Allotment
                    </h3>
                    {user?.is_whitelisted ? (
                        <div className="st-unlimited-badge">
                            <Sparkles size={16} className="text-emerald animate-pulse" />
                            <span>Enterprise License: Unlimited Core Compute Enabled</span>
                        </div>
                    ) : (
                        <div className="st-usage-container">
                            <div className="st-usage-meta">
                                <span className="st-meta-label">Model Training Quota</span>
                                <span className="st-meta-value">{trainingCount} / 5 used</span>
                            </div>
                            <div className="st-usage-bar-track">
                                <div 
                                    className={`st-usage-bar-fill ${percentUsed >= 80 ? 'bar-warn' : ''}`} 
                                    style={{ width: `${percentUsed}%` }}
                                />
                            </div>
                            <p className="st-usage-hint">
                                Standard tier allows 5 concurrent model training runs. Upgrade to remove resource constraints.
                            </p>
                        </div>
                    )}
                </div>

                <div className="st-danger-zone">
                    <h3>Danger Zone</h3>
                    <button className="st-btn st-btn-danger" onClick={handleLogout}>
                        <LogOut size={16} /> Log out of this session
                    </button>
                </div>
            </div>
        )
    }

    /* ─────────── Security Tab ─────────── */
    const renderSecurity = () => (
        <div className="st-section">
            <h2 className="st-section-title">Change Password</h2>
            <p className="st-section-desc">
                Update your security keyphrase to authorize system credentials.
            </p>

            <form className="st-form" onSubmit={handleChangePassword}>
                <div className="st-input-group">
                    <label>Current Password</label>
                    <div className="st-input-wrap">
                        <Lock size={15} className="st-input-icon" />
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPwd}
                            onChange={e => setCurrentPwd(e.target.value)}
                            placeholder="Enter current password"
                            style={{ paddingLeft: '2.6rem' }}
                            required
                        />
                        <button type="button" className="st-eye" onClick={() => setShowCurrent(!showCurrent)}>
                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="st-input-group">
                    <label>New Password</label>
                    <div className="st-input-wrap">
                        <Shield size={15} className="st-input-icon" />
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPwd}
                            onChange={e => setNewPwd(e.target.value)}
                            placeholder="Enter new password"
                            style={{ paddingLeft: '2.6rem' }}
                            required
                        />
                        <button type="button" className="st-eye" onClick={() => setShowNew(!showNew)}>
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="st-input-group">
                    <label>Confirm New Password</label>
                    <div className="st-input-wrap">
                        <Shield size={15} className="st-input-icon" />
                        <input
                            type="password"
                            value={confirmPwd}
                            onChange={e => setConfirmPwd(e.target.value)}
                            placeholder="Re-enter new password"
                            style={{ paddingLeft: '2.6rem' }}
                            required
                        />
                    </div>
                </div>

                {/* Password strength hints */}
                <div className="st-pwd-hints">
                    <span className={newPwd.length >= 8 ? 'st-hint-ok' : ''}>
                        {newPwd.length >= 8 ? <Check size={12} /> : <X size={12} />} 8+ characters
                    </span>
                    <span className={/[A-Za-z]/.test(newPwd) ? 'st-hint-ok' : ''}>
                        {/[A-Za-z]/.test(newPwd) ? <Check size={12} /> : <X size={12} />} Letters
                    </span>
                    <span className={/\d/.test(newPwd) ? 'st-hint-ok' : ''}>
                        {/\d/.test(newPwd) ? <Check size={12} /> : <X size={12} />} Numbers
                    </span>
                    <span className={newPwd && newPwd === confirmPwd ? 'st-hint-ok' : ''}>
                        {newPwd && newPwd === confirmPwd ? <Check size={12} /> : <X size={12} />} Match
                    </span>
                </div>

                <button
                    type="submit"
                    className="st-btn st-btn-primary"
                    style={{ marginTop: '0.5rem' }}
                    disabled={changingPwd || !currentPwd || !newPwd || !confirmPwd}
                >
                    {changingPwd ? <><span className="st-spinner" /> Updating…</> : 'Update Password'}
                </button>
            </form>
        </div>
    )



    /* ─────────── Notifications Tab ─────────── */
    const renderNotifications = () => (
        <div className="st-section">
            <h2 className="st-section-title">Notifications</h2>
            <p className="st-section-desc">
                Choose which events trigger notification webhooks. Preferences sync globally.
            </p>

            {notifsLoading ? (
                <div className="st-notif-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>
                    <div className="st-spinner" style={{ borderTopColor: '#10b981', width: '22px', height: '22px' }}></div>
                    <span>Synchronizing with core engine...</span>
                </div>
            ) : (
                <div className="st-notif-list">
                    {NOTIF_ITEMS.map(item => (
                        <div className="st-notif-row" key={item.key}>
                            <div className="st-notif-info">
                                <span className="st-notif-label">{item.label}</span>
                                <span className="st-notif-desc">{item.desc}</span>
                            </div>
                            <button
                                className={`st-toggle ${notifs[item.key] ? 'st-toggle-on' : ''}`}
                                onClick={() => toggleNotif(item.key)}
                                aria-label={`Toggle ${item.label}`}
                            >
                                <span className="st-toggle-thumb" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    /* ─────────── RENDER ─────────── */
    return (
        <div className="st-page">
            {/* Global Page Background Grid & Floating Telemetry Orbs */}
            <div className="global-bg-grid" />
            <div className="global-orb global-orb-green" style={{ top: '5%', left: '-8%', width: '400px', height: '400px' }} />
            <div className="global-orb global-orb-orange" style={{ top: '45%', right: '-6%', width: '320px', height: '320px', animationDelay: '-6s' }} />
            <div className="global-orb global-orb-blue" style={{ top: '80%', left: '8%', width: '350px', height: '350px', animationDelay: '-12s' }} />

            <header className="st-page-header">
                <div className="st-page-badge">
                    <span className="badge-pulse"></span>
                    <span className="badge-text">CONTROL PANEL // GLOBAL CONFIG</span>
                </div>
                <h1 className="st-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Settings
                </h1>
                <p className="st-page-sub">Manage your account profile, telemetry parameters, and security credentials.</p>
                <div className="st-header-divider" />
            </header>

            <div className="st-layout">
                {/* Sidebar tabs */}
                <aside className="st-tabs">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`st-tab ${activeTab === t.id ? 'st-tab-active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            <t.icon size={18} className="tab-icon" />
                            <span>{t.label}</span>
                            <ChevronRight size={14} className="st-tab-arrow" />
                        </button>
                    ))}
                </aside>

                {/* Content panel */}
                <div className="st-panel">
                    {activeTab === 'profile'       && renderProfile()}
                    {activeTab === 'security'      && renderSecurity()}
                    {activeTab === 'notifications' && renderNotifications()}
                </div>
            </div>
        </div>
    )
}
