import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, User, Mail, Link as LinkIcon, Bell, Shield, HelpCircle, Plus, Trash2, Moon, Sun, Monitor } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

const Settings = () => {
    const navigate = useNavigate();
    const { user: userProfile, updateProfile } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    const [form, setForm] = useState({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        linkedinUrl: userProfile?.profile?.linkedinUrl || "",
        bio: userProfile?.profile?.bio || "",
        skills: userProfile?.profile?.skills?.join(", ") || "",
        experience: userProfile?.profile?.experience || [],
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemTheme);
        }
    }, [theme]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedProfile = {
                name: form.name,
                email: form.email,
                profile: {
                    bio: form.bio,
                    linkedinUrl: form.linkedinUrl,
                    skills: form.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
                    experience: form.experience
                }
            };
            await updateProfile(updatedProfile);
            alert("Settings saved successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="pb-32 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 px-5 py-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <h1 className="text-xl font-black tracking-tight">Account Settings</h1>
                </div>
            </div>

            <div className="px-5 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="size-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                            <img
                                src={userProfile?.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 size-9 bg-primary text-white rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg active:scale-90 transition-all">
                            <Camera className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Profile Info Form */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
                        Personal Information
                    </h2>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 p-5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Full Name
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <User className="size-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <Mail className="size-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                LinkedIn URL
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <LinkIcon className="size-5 text-slate-400" />
                                <input
                                    type="url"
                                    value={form.linkedinUrl}
                                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Professional Info */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
                        Professional Background
                    </h2>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 p-5 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Professional Bio
                            </label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                placeholder="Describe your experience and goals..."
                                className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold resize-none shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Top Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                placeholder="React, TypeScript, UI/UX..."
                                className="w-full h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold shadow-inner"
                            />
                        </div>

                        {/* Experience Array Editor */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Work Experience
                                </label>
                                <button
                                    onClick={() => setForm({
                                        ...form,
                                        experience: [...form.experience, { company: "", role: "", period: "" }]
                                    })}
                                    className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest active:scale-95 transition-all"
                                >
                                    <Plus className="size-3" />
                                    Add New
                                </button>
                            </div>
                            {form.experience.map((exp, index) => (
                                <div key={index} className="relative group p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3">
                                    <button
                                        onClick={() => {
                                            const newExp = form.experience.filter((_, i) => i !== index);
                                            setForm({ ...form, experience: newExp });
                                        }}
                                        className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                                    >
                                        <Trash2 className="size-3" />
                                    </button>
                                    <input
                                        type="text"
                                        value={exp.role}
                                        placeholder="Job Role"
                                        onChange={(e) => {
                                            const newExp = [...form.experience];
                                            newExp[index].role = e.target.value;
                                            setForm({ ...form, experience: newExp });
                                        }}
                                        className="w-full bg-transparent text-sm font-black focus:outline-none placeholder:text-slate-400"
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={exp.company}
                                            placeholder="Company"
                                            onChange={(e) => {
                                                const newExp = [...form.experience];
                                                newExp[index].company = e.target.value;
                                                setForm({ ...form, experience: newExp });
                                            }}
                                            className="flex-1 bg-transparent text-[11px] font-bold text-primary focus:outline-none uppercase tracking-widest placeholder:text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            value={exp.period}
                                            placeholder="Period"
                                            onChange={(e) => {
                                                const newExp = [...form.experience];
                                                newExp[index].period = e.target.value;
                                                setForm({ ...form, experience: newExp });
                                            }}
                                            className="w-24 bg-transparent text-[11px] font-bold text-slate-400 focus:outline-none text-right uppercase tracking-widest placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
                        Preferences
                    </h2>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        {/* Notification Toggle */}
                        <button
                            onClick={() => setPushEnabled(!pushEnabled)}
                            className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Bell className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Notifications</p>
                                    <p className="text-[10px] font-bold text-slate-400">Manage alerts</p>
                                </div>
                            </div>
                            <div className={`w-12 h-7 rounded-full transition-all relative ${pushEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}>
                                <div className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${pushEnabled ? 'left-6' : 'left-1'}`} />
                            </div>
                        </button>

                        {/* Theme Selection */}
                        <div className="p-5 border-b border-slate-100 dark:border-white/5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Monitor className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Appearance</p>
                                    <p className="text-[10px] font-bold text-slate-400">Choose your theme</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', icon: Sun, label: 'Light' },
                                    { id: 'dark', icon: Moon, label: 'Dark' },
                                    { id: 'system', icon: Monitor, label: 'System' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${theme === t.id
                                            ? 'bg-primary/5 border-primary text-primary'
                                            : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-400'}`}
                                    >
                                        <t.icon className="size-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => alert("Security settings coming soon!")}
                            className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                    <Shield className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Security</p>
                                    <p className="text-[10px] font-bold text-slate-400">Password & Auth</p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => alert("Support ticket system coming soon!")}
                            className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <HelpCircle className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Help & Support</p>
                                    <p className="text-[10px] font-bold text-slate-400">FAQ & Contact</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
