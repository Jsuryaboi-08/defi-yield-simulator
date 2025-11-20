import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calculator, Settings, Activity, PieChart } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'simulator' | 'settings' | 'risk-reports';
    onTabChange: (tab: 'dashboard' | 'simulator' | 'settings' | 'risk-reports') => void;
}

const SidebarItem = ({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: any,
    label: string,
    active: boolean,
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`relative flex items-center w-full p-3 mb-2 rounded-xl transition-all duration-300 group overflow-hidden ${active
            ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]'
            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
    >
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300 ${active ? 'opacity-100' : 'group-hover:opacity-50'}`} />
        <Icon size={20} className={`mr-3 relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-medium relative z-10">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}
    </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl p-6 flex flex-col z-20 relative">
                <div className="flex items-center mb-12 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 mr-4 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
                        <Activity size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
                            YieldSim
                        </h1>
                        <p className="text-xs text-primary font-medium tracking-wider uppercase opacity-80">Pro Analytics</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-8">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3 opacity-50">
                            Main Menu
                        </p>
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            active={activeTab === 'dashboard'}
                            onClick={() => onTabChange('dashboard')}
                        />
                        <SidebarItem
                            icon={Calculator}
                            label="Simulator"
                            active={activeTab === 'simulator'}
                            onClick={() => onTabChange('simulator')}
                        />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3 opacity-50">
                            Analysis
                        </p>
                        <SidebarItem
                            icon={PieChart}
                            label="Risk Reports"
                            active={activeTab === 'risk-reports'}
                            onClick={() => onTabChange('risk-reports')}
                        />
                        <SidebarItem
                            icon={Settings}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => onTabChange('settings')}
                        />
                    </div>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={() => onTabChange('settings')}
                        className="flex items-center w-full p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 mr-3 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                            <Settings size={20} className="text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Settings</p>
                            <p className="text-xs text-muted-foreground">App Preferences</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto z-10 custom-scrollbar">
                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
