import React, { useState } from 'react';
import { Cloud, Search, Bell, LogOut, Settings, Monitor, AppWindow, Home, HelpCircle, Wifi, Cpu, Shield, Loader2, Minus, Square, X } from 'lucide-react';
import Login from './Login';
import Dashboard from './Dashboard';
import VDIViewer from './VDIViewer';
import AssistantChat from './AssistantChat';
import { SettingsModal } from './SettingsModal';
import { UserProfileModal } from './UserProfileModal';
import { MOCK_USER } from '../constants';
import { VDIResource } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeResource, setActiveResource] = useState<VDIResource | null>(null);
  const [currentView, setCurrentView] = useState<'all' | 'desktops' | 'apps'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulate API call and state cleanup
    setTimeout(() => {
      setIsAuthenticated(false);
      setActiveResource(null);
      setCurrentView('all');
      setSearchQuery('');
      setIsSettingsOpen(false);
      setIsProfileOpen(false);
      setIsLoggingOut(false);
    }, 1000);
  };

  // If active resource is set, render the full screen VDI viewer
  if (activeResource) {
    return (
      <VDIViewer 
        resource={activeResource} 
        onClose={() => setActiveResource(null)} 
      />
    );
  }

  // If logging out, show loading screen
  if (isLoggingOut) {
    return (
        <div className="h-screen w-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center transition-colors duration-300">
             <div className="flex flex-col items-center animate-fade-in">
                <Loader2 size={48} className="text-indigo-600 dark:text-indigo-500 animate-spin mb-4" />
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">{t('login.logging_out')}</h2>
             </div>
        </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const NavItem = ({ id, icon: Icon, label, active }: { id: string, icon: any, label: string, active?: boolean }) => (
    <button 
        onClick={() => setCurrentView(id as any)}
        className={`w-full flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 group ${
            active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-[#020617] text-slate-700 dark:text-slate-200 flex overflow-hidden font-sans select-none transition-colors duration-300">
      
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={MOCK_USER}
        onLogout={handleLogout}
      />

      {/* Left Rail - App Navigation */}
      <aside className="w-20 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 z-20 shadow-xl transition-colors duration-300">
         {/* App Logo */}
         <div className="mb-8 p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
            <Cloud className="text-indigo-600 dark:text-indigo-500" size={28} />
         </div>

         {/* Nav Items */}
         <nav className="flex-1 w-full px-2 space-y-4">
            <NavItem id="all" icon={Home} label={t('nav.home')} active={currentView === 'all'} />
            <NavItem id="desktops" icon={Monitor} label={t('nav.desktops')} active={currentView === 'desktops'} />
            <NavItem id="apps" icon={AppWindow} label={t('nav.apps')} active={currentView === 'apps'} />
         </nav>

         {/* Bottom Actions */}
         <div className="w-full px-2 space-y-4 mb-4">
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={t('nav.settings')}
            >
                <Settings size={20} />
            </button>
            <button 
                onClick={handleLogout}
                className="w-full flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title={t('nav.signout')}
            >
                <LogOut size={20} />
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 relative transition-colors duration-300">
         
         {/* Custom Title Bar / Header */}
         <header className="h-14 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 drag-region transition-colors duration-300">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
               <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">{t('app.title')}</span>
               <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
               <div className="flex items-center gap-2 text-xs">
                   <Shield size={12} className="text-emerald-500" />
                   <span className="text-emerald-500">{t('app.encrypted')}</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Search Bar */}
               <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 w-48 transition-all focus:w-64"
                  />
               </div>

               {/* User Profile Trigger */}
               <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 pr-2 rounded-lg transition-colors cursor-pointer"
               >
                  <div className="text-right hidden sm:block">
                     <div className="text-xs font-bold text-slate-700 dark:text-white">{MOCK_USER.name}</div>
                     <div className="text-[10px] text-slate-500 uppercase">{MOCK_USER.role}</div>
                  </div>
                  <div className="relative">
                      <img 
                        src={MOCK_USER.avatarUrl} 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600" 
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
                  </div>
               </button>
               
               {/* Window Controls (Consistent with Login) */}
               <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Minimize">
                        <Minus size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Maximize">
                        <Square size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Close">
                        <X size={20} />
                    </button>
               </div>
            </div>
         </header>

         {/* Scrollable Content */}
         <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <Dashboard 
                onLaunch={setActiveResource} 
                category={currentView} 
                searchQuery={searchQuery}
            />
         </main>

         {/* Status Footer */}
         <footer className="h-8 bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <Wifi size={12} className="text-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300">{t('status.gateway')}: <span className="text-emerald-500">{t('status.connected')}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Cpu size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{t('status.cpu')}: 12%</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span>Version 2.4.0 (Build 9821)</span>
                <span>{t('status.latency')}: <span className="text-slate-600 dark:text-slate-300">24ms</span></span>
            </div>
         </footer>

         {/* AI Assistant Chat - Floating Panel */}
         <AssistantChat />
      </div>
    </div>
  );
};

export default App;