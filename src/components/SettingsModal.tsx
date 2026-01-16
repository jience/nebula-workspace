import React, { useState, useEffect } from 'react';
import { X, Globe, Monitor, Smartphone, Laptop, Bell, Moon, Sun, Check, Info, Speaker, Mic, Camera, Keyboard, Cpu, Zap, Wifi } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Reusable Toggle Switch Component
const Toggle = ({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
    <div>
      <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
      {description && <div className="text-xs text-slate-500 mt-1">{description}</div>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

// Reusable Select Component
const Select = ({ label, options, value, onChange }: { label: string, options: {label: string, value: string}[], value: string, onChange: (v: string) => void }) => (
  <div className="py-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const GeneralSettings = () => {
  const [launchOnStartup, setLaunchOnStartup] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const langOptions = [
    { label: 'English (US)', value: 'en-US' },
    { label: '中文 (简体)', value: 'zh-CN' },
    { label: '日本語', value: 'ja-JP' },
  ];

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{t('settings.general.title')}</h3>
      <Toggle 
        label={t('settings.general.launch_startup')}
        description={t('settings.general.launch_startup_desc')}
        checked={launchOnStartup}
        onChange={setLaunchOnStartup}
      />
      <Toggle 
        label={t('settings.general.auto_connect')}
        description={t('settings.general.auto_connect_desc')}
        checked={autoConnect}
        onChange={setAutoConnect}
      />
      <Select 
        label={t('settings.general.language')}
        options={langOptions}
        value={language}
        onChange={(v) => setLanguage(v as any)}
      />
    </div>
  );
};

const DisplaySettings = () => {
  const [resolution, setResolution] = useState('Match Client');
  const [multiMonitor, setMultiMonitor] = useState(false);
  const [highDPI, setHighDPI] = useState(true);
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const resOptions = [
    { label: 'Match Client', value: 'Match Client' },
    { label: '1920x1080', value: '1920x1080' },
    { label: '2560x1440', value: '2560x1440' },
    { label: '3840x2160', value: '3840x2160' },
    { label: 'Native (Retina)', value: 'Native (Retina)' }
  ];

  const ThemeButton = ({ id, icon: Icon, label }: { id: Theme, icon: any, label: string }) => {
    const isActive = theme === id;
    return (
      <button 
        onClick={() => setTheme(id)}
        className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
          isActive 
            ? 'border-2 border-indigo-600 bg-indigo-50 dark:bg-slate-800 shadow-sm' 
            : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
        <span className={`text-xs font-medium ${isActive ? 'text-indigo-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{t('settings.display.title')}</h3>
      <Select 
        label={t('settings.display.resolution')}
        options={resOptions}
        value={resolution}
        onChange={setResolution}
      />
      <Toggle 
        label={t('settings.display.monitors')}
        description={t('settings.display.monitors_desc')}
        checked={multiMonitor}
        onChange={setMultiMonitor}
      />
      <Toggle 
        label={t('settings.display.high_dpi')}
        description={t('settings.display.high_dpi_desc')}
        checked={highDPI}
        onChange={setHighDPI}
      />
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
         <h4 className="text-sm font-medium text-slate-400 mb-3">{t('settings.display.theme')}</h4>
         <div className="grid grid-cols-3 gap-3">
             <ThemeButton id="dark" icon={Moon} label={t('settings.display.theme.dark')} />
             <ThemeButton id="light" icon={Sun} label={t('settings.display.theme.light')} />
             <ThemeButton id="system" icon={Laptop} label={t('settings.display.theme.system')} />
         </div>
      </div>
    </div>
  );
};

const DeviceSettings = () => {
  const [micAccess, setMicAccess] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(true);
  const [usbRedirection, setUsbRedirection] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-2 animate-in fade-in duration-300">
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{t('settings.devices.title')}</h3>
      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
         <div className="flex items-center gap-3 mb-2">
            <Speaker size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-slate-900 dark:text-white">{t('settings.devices.audio')}</span>
         </div>
         <div className="text-xs text-slate-500 dark:text-slate-400 pl-8">{t('settings.devices.audio_default')}</div>
      </div>

      <Toggle 
        label={t('settings.devices.mic')}
        description={t('settings.devices.mic_desc')}
        checked={micAccess}
        onChange={setMicAccess}
      />
      <Toggle 
        label={t('settings.devices.webcam')}
        description={t('settings.devices.webcam_desc')}
        checked={cameraAccess}
        onChange={setCameraAccess}
      />
      <Toggle 
        label={t('settings.devices.usb')}
        description={t('settings.devices.usb_desc')}
        checked={usbRedirection}
        onChange={setUsbRedirection}
      />
    </div>
  );
};

const AboutSettings = () => {
  const { t } = useLanguage();
  return (
    <div className="animate-in fade-in duration-300 text-center pt-8">
       <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6">
          <Cpu size={40} className="text-white" />
       </div>
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nebula Client</h2>
       <p className="text-slate-500 dark:text-slate-400 mt-2">{t('settings.about.version')} 2.4.0 (Build 9821)</p>
       
       <div className="mt-8 max-w-sm mx-auto space-y-3">
          <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-white transition-colors flex items-center justify-center gap-2">
             <Check size={16} className="text-emerald-500" /> {t('settings.about.uptodate')}
          </button>
          <button className="w-full py-2.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 transition-colors">
             {t('settings.about.release_notes')}
          </button>
       </div>
       
       <div className="mt-12 text-xs text-slate-500 dark:text-slate-600 space-y-1">
          <p>© 2024 Nebula Systems Inc. {t('settings.about.rights')}</p>
          <p>Nebula VDI is a trademark of Nebula Systems Inc.</p>
       </div>
    </div>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: t('settings.tab.general'), icon: Globe },
    { id: 'display', label: t('settings.tab.display'), icon: Monitor },
    { id: 'devices', label: t('settings.tab.devices'), icon: Zap },
    { id: 'about', label: t('settings.tab.about'), icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-slate-900 dark:text-slate-200">
      <div 
        className={`absolute inset-0 bg-slate-500/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />
      <div className={`relative w-full max-w-4xl h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex overflow-hidden transition-all duration-300 transform ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <div className="p-1 bg-indigo-500/10 dark:bg-indigo-500/20 rounded">
                        <Monitor size={16} className="text-indigo-600 dark:text-indigo-500" /> 
                    </div>
                    {t('settings.title')}
                </h2>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id 
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-600/10 dark:text-indigo-400' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        AC
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-slate-800 dark:text-white truncate">Alex Chen</div>
                        <div className="text-[10px] text-slate-500 truncate">alex.chen@nebula.corp</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col relative">
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
            >
                <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'display' && <DisplaySettings />}
                {activeTab === 'devices' && <DeviceSettings />}
                {activeTab === 'about' && <AboutSettings />}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-20">
                <button onClick={handleClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">{t('settings.cancel')}</button>
                <button onClick={handleClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all active:scale-95">{t('settings.save')}</button>
            </div>
        </div>
      </div>
    </div>
  );
};