import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Server, ChevronUp, Globe, Activity, Check, Minus, Square, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: () => void;
}

interface Gateway {
  id: string;
  name: string;
  host: string;
  baseLatency: number;
}

const GATEWAYS: Gateway[] = [
  { id: 'us-east', name: 'US East (Virginia)', host: 'us-east-1.nebula.net', baseLatency: 20 },
  { id: 'us-west', name: 'US West (Oregon)', host: 'us-west-2.nebula.net', baseLatency: 65 },
  { id: 'eu-west', name: 'Europe (London)', host: 'eu-west-2.nebula.net', baseLatency: 110 },
  { id: 'ap-ne', name: 'Asia Pacific (Tokyo)', host: 'ap-northeast-1.nebula.net', baseLatency: 160 },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  
  // Gateway State
  const [showGateways, setShowGateways] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<Gateway>(GATEWAYS[0]);
  const [latencies, setLatencies] = useState<Record<string, number>>({});

  // Simulate pinging gateways
  useEffect(() => {
    const updateLatencies = () => {
      const newLatencies: Record<string, number> = {};
      GATEWAYS.forEach(gw => {
        // Add some jitter to the base latency
        const jitter = Math.floor(Math.random() * 10) - 5;
        newLatencies[gw.id] = Math.max(1, gw.baseLatency + jitter);
      });
      setLatencies(newLatencies);
    };

    updateLatencies();
    const interval = setInterval(updateLatencies, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 80) return 'text-emerald-500';
    if (ms < 150) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans select-none drag-region transition-colors duration-300">
      
      {/* Window Controls (Top Right) */}
      <div className="absolute top-0 right-0 p-4 flex items-center gap-1 z-50 no-drag">
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

      {/* Subtle Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-300/40 dark:bg-indigo-900/40 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-300/40 dark:bg-blue-900/40 blur-[120px]"></div>
      </div>

      <div className="w-[400px] z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="./logo.svg" 
            alt="Nebula Logo" 
            className="w-24 h-24 mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
          />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('login.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('login.subtitle')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">{t('login.email')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  defaultValue="alex.chen@nebula.corp"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">{t('login.password')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  defaultValue="password123"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs mt-2">
                 <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                    <input type="checkbox" className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-500 focus:ring-0" />
                    {t('login.remember')}
                 </label>
                 <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">{t('login.forgot')}</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group active:translate-y-0.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {t('login.connect')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info with Interactive Gateway Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 relative">
             <div className="relative">
                 <button 
                    type="button"
                    onClick={() => setShowGateways(!showGateways)}
                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                 >
                     <Server size={12} className="group-hover:scale-110 transition-transform" />
                     <span className="font-medium">{t('status.gateway')}:</span>
                     <span className="font-mono text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{selectedGateway.host}</span>
                     <ChevronUp size={10} className={`transition-transform duration-200 ${showGateways ? 'rotate-180' : ''}`} />
                 </button>

                 {/* Dropdown Menu */}
                 {showGateways && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowGateways(false)}></div>
                        <div className="absolute bottom-full left-0 mb-3 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Globe size={12} /> Select Access Point
                                </span>
                                <Activity size={12} className="text-slate-400" />
                            </div>
                            <div className="p-1">
                                {GATEWAYS.map(gw => (
                                    <button
                                        key={gw.id}
                                        onClick={() => {
                                            setSelectedGateway(gw);
                                            setShowGateways(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                                            selectedGateway.id === gw.id
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="font-semibold flex items-center gap-2">
                                                {gw.name}
                                                {selectedGateway.id === gw.id && <Check size={10} strokeWidth={4} />}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{gw.host}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 rounded px-1.5 py-0.5 border border-slate-200 dark:border-slate-700">
                                            <div className={`w-1.5 h-1.5 rounded-full ${latencies[gw.id] < 100 ? 'bg-emerald-500' : latencies[gw.id] < 150 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                            <span className={`font-mono font-medium ${getLatencyColor(latencies[gw.id] || 999)}`}>
                                                {latencies[gw.id] || '--'} ms
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                 )}
             </div>
             <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                 <ShieldCheck size={12} />
                 <span>{t('login.secure')}</span>
             </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-[10px] text-slate-500 dark:text-slate-600">
            &copy; 2024 Nebula Systems Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;