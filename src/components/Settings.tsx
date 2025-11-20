import React from 'react';
import { Trash2, Moon, Bell, Shield } from 'lucide-react';

interface SettingsProps {
    currentTheme?: 'dark' | 'light';
    onThemeChange?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentTheme = 'dark', onThemeChange }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Settings
                </h2>
                <p className="text-muted-foreground">Manage your preferences and application data.</p>
            </div>

            <div className="grid gap-6">
                {/* Appearance */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                        <Moon className="mr-2" size={20} /> Appearance
                    </h3>
                    <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-white">Theme Mode</p>
                                <p className="text-sm text-muted-foreground">Switch between dark and light themes</p>
                            </div>
                            <button
                                onClick={onThemeChange}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <span className={`${currentTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data & Privacy */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                        <Shield className="mr-2" size={20} /> Data & Privacy
                    </h3>
                    <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-white">Clear API Cache</p>
                                <p className="text-sm text-muted-foreground">Remove locally stored data from DefiLlama & CoinGecko</p>
                            </div>
                            <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center text-sm font-medium">
                                <Trash2 size={16} className="mr-2" />
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                        <Bell className="mr-2" size={20} /> Notifications
                    </h3>
                    <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-white">Risk Alerts</p>
                                <p className="text-sm text-muted-foreground">Get notified when protocol risk levels change</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
