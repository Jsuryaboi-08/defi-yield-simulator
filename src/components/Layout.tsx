import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calculator, Settings, Activity } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'simulator';
    onTabChange: (tab: 'dashboard' | 'simulator') => void;
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
        className={`flex items-center w-full p-3 mb-2 rounded-lg transition-all duration-200 ${active
                ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
    >
        <Icon size={20} className="mr-3" />
        <span className="font-medium">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
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
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl p-6 flex flex-col z-10">
                <div className="flex items-center mb-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 mr-3 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Activity size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        YieldSim
                    </h1>
                </div>

                <nav className="flex-1">
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                            Menu
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
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                            Settings
                        </p>
                        <SidebarItem
                            icon={Settings}
                            label="Preferences"
                            active={false}
                            onClick={() => { }}
                        />
                    </div>
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 mr-3" />
                        <div>
                            <p className="text-sm font-medium">Demo User</p>
                            <p className="text-xs text-muted-foreground">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 p-8 max-w-7xl mx-auto">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
