import React, { useState, useEffect } from 'react';
import { Monitor, AppWindow, Play, Clock, MoreVertical, Star, X, Cpu, Zap, Globe, Server, Info, History, Power, PlugZap, Search, Signal, Wifi, Laptop, Command, PowerOff, RotateCcw, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { VDIResource, ResourceType, ActivityLogEntry } from '../types';
import { MOCK_RESOURCES, MOCK_ACTIVITY_LOG } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onLaunch: (resource: VDIResource) => void;
  category: 'all' | 'desktops' | 'apps';
  searchQuery: string;
}

interface ModalProps {
  resource: VDIResource;
  onClose: () => void;
  onLaunch: (resource: VDIResource) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

// Power Confirmation Modal
interface ConfirmationModalProps {
    isOpen: boolean;
    type: 'shutdown' | 'force_off' | null;
    resourceName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const PowerConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, type, resourceName, onConfirm, onCancel }) => {
    if (!isOpen || !type) return null;

    const isForce = type === 'force_off';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onCancel}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isForce ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500'}`}>
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {isForce ? 'Force Power Off?' : 'Shutdown Virtual Machine?'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {isForce 
                        ? `Are you sure you want to cut power to "${resourceName}"? Any unsaved data will be lost immediately. This is equivalent to pulling the plug.`
                        : `Are you sure you want to shut down "${resourceName}"? Please ensure all work is saved.`
                    }
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-lg ${
                            isForce 
                            ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' 
                            : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                        }`}
                    >
                        {isForce ? 'Force Stop' : 'Shutdown'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResourceDetailsModal: React.FC<ModalProps> = ({ resource, onClose, onLaunch, isFavorite, onToggleFavorite }) => {
  const { t } = useLanguage();
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image Area */}
        <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url('https://picsum.photos/seed/${resource.id}/600/400')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    className={`p-2 rounded-full transition-all backdrop-blur-md border border-slate-200 dark:border-white/10 ${
                        isFavorite 
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' 
                        : 'bg-white/60 dark:bg-black/40 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                >
                    <Star size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "scale-110" : ""} />
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 bg-white/60 dark:bg-black/40 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors backdrop-blur-md border border-slate-200 dark:border-white/10"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="absolute bottom-4 left-6">
                 <div className="flex items-center gap-2 mb-1">
                    {resource.type === ResourceType.DESKTOP ? <Monitor size={16} className="text-indigo-600 dark:text-indigo-400"/> : <AppWindow size={16} className="text-pink-600 dark:text-pink-400"/>}
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{resource.type}</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{resource.name}</h2>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
            
            {/* Status Section */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('modal.status')}</span>
                <div className="flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${resource.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-500'}`}></div>
                     <span className={`text-sm font-medium ${resource.status === 'running' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} uppercase`}>
                        {resource.status === 'running' ? t('dash.running') : t('dash.stopped')}
                     </span>
                </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Cpu size={14} />
                        <span className="text-xs uppercase font-bold tracking-wider">vCPU</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{resource.cpu} Cores</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Zap size={14} />
                        <span className="text-xs uppercase font-bold tracking-wider">Memory</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{resource.ram} GB</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Server size={14} />
                        <span className="text-xs uppercase font-bold tracking-wider">OS</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={resource.os}>{resource.os}</div>
                </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                        <Globe size={14} />
                        <span className="text-xs uppercase font-bold tracking-wider">{t('dash.region')}</span>
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={resource.region}>{resource.region.split(' ')[0]}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
                 <button 
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                    {t('modal.close')}
                </button>
                 <button 
                    onClick={() => {
                        onLaunch(resource);
                        onClose();
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Play size={16} fill="currentColor" /> {t('modal.launch')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onLaunch, category, searchQuery }) => {
  const [resources, setResources] = useState<VDIResource[]>(MOCK_RESOURCES);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  // Power Management States
  const [confirmationState, setConfirmationState] = useState<{ isOpen: boolean, resourceId: string, resourceName: string, type: 'shutdown' | 'force_off' | null }>({
      isOpen: false, resourceId: '', resourceName: '', type: null
  });
  const [processingResources, setProcessingResources] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'info' }>({ show: false, message: '', type: 'info' });

  // Get selected resource object from ID
  const selectedResource = resources.find(r => r.id === selectedResourceId) || null;

  // Favorites State with LocalStorage Persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('nebula_favorites');
        return saved ? JSON.parse(saved) : ['res-1'];
    } catch (e) {
        return ['res-1'];
    }
  });

  const { t } = useLanguage();

  useEffect(() => {
    localStorage.setItem('nebula_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (toast.show) {
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
        prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
      setToast({ show: true, message, type });
  };

  const executePowerAction = (resourceId: string, action: 'start' | 'shutdown' | 'force_off') => {
    // Add to processing state
    setProcessingResources(prev => new Set(prev).add(resourceId));
    
    // Simulate Network Delay
    setTimeout(() => {
        setResources(prev => prev.map(r => {
            if (r.id !== resourceId) return r;
            
            if (action === 'start') return { ...r, status: 'running' };
            if (action === 'shutdown') return { ...r, status: 'stopped' };
            if (action === 'force_off') return { ...r, status: 'stopped' };
            
            return r;
        }));

        // Remove from processing state
        setProcessingResources(prev => {
            const next = new Set(prev);
            next.delete(resourceId);
            return next;
        });

        // Show Success Toast
        const actionText = action === 'start' ? 'Started' : action === 'shutdown' ? 'Shutdown' : 'Force Stopped';
        showToast(`${actionText} successfully`, 'success');

    }, 1500); // 1.5s simulated delay
  };

  const handlePowerRequest = (e: React.MouseEvent, resource: VDIResource, action: 'start' | 'shutdown' | 'force_off') => {
    e.stopPropagation();
    
    if (action === 'start') {
        executePowerAction(resource.id, 'start');
    } else {
        // Open Confirmation for destructive actions
        setConfirmationState({
            isOpen: true,
            resourceId: resource.id,
            resourceName: resource.name,
            type: action
        });
    }
  };

  const handleConfirmPowerAction = () => {
      if (confirmationState.resourceId && confirmationState.type) {
          executePowerAction(confirmationState.resourceId, confirmationState.type);
      }
      setConfirmationState(prev => ({ ...prev, isOpen: false }));
  };

  // Helper to filter resources based on search query
  const filterResources = (resList: VDIResource[]) => {
    if (!searchQuery) return resList;
    const lowerQuery = searchQuery.toLowerCase();
    return resList.filter(res => 
        res.name.toLowerCase().includes(lowerQuery) || 
        res.os.toLowerCase().includes(lowerQuery) ||
        res.region.toLowerCase().includes(lowerQuery)
    );
  };

  const desktops = resources.filter(r => r.type === ResourceType.DESKTOP);
  const apps = resources.filter(r => r.type === ResourceType.APPLICATION);
  
  // Filter based on selected category from sidebar
  let baseResources = resources;
  if (category === 'desktops') baseResources = desktops;
  if (category === 'apps') baseResources = apps;

  // Apply search filtering
  const visibleResources = filterResources(baseResources);
  const runningResources = filterResources(resources.filter(r => r.status === 'running'));

  const ResourceCard: React.FC<{ resource: VDIResource, large?: boolean }> = ({ resource, large = false }) => {
    const isFavorite = favorites.includes(resource.id);
    const isDesktop = resource.type === ResourceType.DESKTOP;
    const isRunning = resource.status === 'running';
    const isProcessing = processingResources.has(resource.id);
    
    // Simulate connection signal strength based on running status
    const signalStrength = isRunning ? 4 : 0;
    
    return (
        <div 
          onClick={() => !isProcessing && setSelectedResourceId(resource.id)}
          className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 overflow-hidden flex flex-col cursor-pointer ${large ? 'col-span-1 md:col-span-2 row-span-2' : ''} ${isProcessing ? 'pointer-events-none opacity-90' : ''}`}
        >
          {/* Header / Preview Area */}
          <div className={`relative w-full ${large ? 'h-56' : 'h-40'} overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-slate-800`}>
            
            {/* Loading Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 size={24} className="text-white animate-spin" />
                        <span className="text-xs font-medium text-white shadow-sm">Processing...</span>
                    </div>
                </div>
            )}

            {/* Desktop: Screen Preview Style */}
            {isDesktop && (
                <>
                    <div 
                        className="absolute inset-x-2 top-2 bottom-0 bg-cover bg-center rounded-t-lg shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] origin-bottom"
                        style={{ backgroundImage: `url('https://picsum.photos/seed/${resource.id}/600/400')` }}
                    />
                     {/* Simulated Taskbar inside preview */}
                     <div className="absolute inset-x-2 bottom-0 h-3 bg-slate-900/80 backdrop-blur-sm rounded-b-none z-10 flex items-center justify-center gap-0.5 opacity-80">
                         <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                         <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                     </div>
                </>
            )}

            {/* App: Icon Tile Style */}
            {!isDesktop && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-slate-800 transition-colors">
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                     <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
                        <Command size={32} className="text-pink-500" />
                     </div>
                </div>
            )}
            
            {/* Status Badge (Top Right) */}
            <div className="absolute top-3 right-3 z-20">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                     isRunning 
                     ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                     : resource.status === 'maintenance'
                         ? 'bg-amber-500/90 border-amber-400 text-white'
                         : 'bg-slate-600/90 border-slate-500 text-slate-100'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${isRunning ? 'animate-pulse' : ''}`}></div>
                    {resource.status === 'running' && t('dash.running')}
                    {resource.status === 'stopped' && t('dash.stopped')}
                    {resource.status === 'maintenance' && t('dash.maintenance')}
                </div>
            </div>

            {/* Favorite Button (Top Left) */}
             <button 
                className={`absolute top-3 left-3 p-1.5 rounded-lg backdrop-blur-md transition-all duration-200 z-20 border ${
                    isFavorite 
                    ? 'bg-yellow-400/90 border-yellow-400 text-yellow-900 shadow-sm' 
                    : 'bg-slate-900/40 border-white/10 text-white/70 hover:bg-slate-900/60 hover:text-white opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleFavorite(resource.id);
                }}
            >
                <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            {/* Hover Overlay with Operations */}
            <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center z-30 gap-3 ${isProcessing ? 'hidden' : ''}`}>
                 {/* Desktop Operations */}
                 {isDesktop && (
                     <>
                        {resource.status === 'running' && (
                            <>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onLaunch(resource);
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full shadow-xl transform scale-95 group-hover:scale-100 transition-all"
                                >
                                    <Play size={16} fill="currentColor" /> 
                                    {t('dash.launch')}
                                </button>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => handlePowerRequest(e, resource, 'shutdown')}
                                        className="p-2.5 bg-white/10 hover:bg-amber-500/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/20"
                                        title="Shutdown"
                                    >
                                        <Power size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => handlePowerRequest(e, resource, 'force_off')}
                                        className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/20"
                                        title="Force Power Off"
                                    >
                                        <PlugZap size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                        {resource.status === 'stopped' && (
                             <button 
                                onClick={(e) => handlePowerRequest(e, resource, 'start')}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full shadow-xl transform scale-95 group-hover:scale-100 transition-all"
                            >
                                <Power size={18} /> 
                                Power On
                            </button>
                        )}
                        {resource.status === 'maintenance' && (
                            <span className="text-white/80 font-medium px-4 py-1.5 bg-white/10 rounded-full backdrop-blur">
                                Maintenance
                            </span>
                        )}
                     </>
                 )}

                 {/* App Operations (Usually just Launch) */}
                 {!isDesktop && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onLaunch(resource);
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-all"
                    >
                        <Play size={16} fill="currentColor" /> 
                        {t('dash.launch')}
                    </button>
                 )}
            </div>
          </div>
    
          {/* Card Body */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-2">
                <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {resource.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                         {isDesktop ? <Laptop size={12} /> : <AppWindow size={12} />}
                         <span className="truncate">{resource.os}</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                {/* Tech Specs */}
                <div className="flex gap-2">
                    <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/50 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1" title="CPU">
                        <Cpu size={10} /> {resource.cpu}
                    </div>
                    <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/50 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1" title="Memory">
                        <Zap size={10} /> {resource.ram}G
                    </div>
                </div>
                
                {/* Connection Quality Indicator */}
                <div className="flex items-center gap-1 text-slate-400" title="Connection Quality">
                    {signalStrength > 0 ? (
                        <Wifi size={14} className="text-emerald-500" />
                    ) : (
                        <Wifi size={14} className="text-slate-300 dark:text-slate-600" />
                    )}
                    <span className="text-[10px] font-mono">{resource.region.includes('US') ? '24ms' : '110ms'}</span>
                </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="relative space-y-8 animate-fade-in pb-20">
      {/* Toast Notification */}
      {toast.show && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-4 py-2 bg-slate-900/90 dark:bg-slate-800/90 text-white rounded-full shadow-2xl backdrop-blur animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-xs font-medium">{toast.message}</span>
          </div>
      )}

      {/* Confirmation Modal */}
      <PowerConfirmationModal 
          isOpen={confirmationState.isOpen}
          type={confirmationState.type}
          resourceName={confirmationState.resourceName}
          onConfirm={handleConfirmPowerAction}
          onCancel={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Modal Render */}
      {selectedResource && (
          <ResourceDetailsModal 
            resource={selectedResource} 
            onClose={() => setSelectedResourceId(null)}
            onLaunch={onLaunch}
            isFavorite={favorites.includes(selectedResource.id)}
            onToggleFavorite={() => toggleFavorite(selectedResource.id)}
          />
      )}
      
      {/* Activity Log Sidebar */}
      <div 
        className={`fixed top-14 right-0 bottom-8 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${showActivityLog ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <History size={16} className="text-indigo-600 dark:text-indigo-400"/> {t('dash.recent_activity')}
                </h3>
                <button onClick={() => setShowActivityLog(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                    <X size={16} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {MOCK_ACTIVITY_LOG.map((log) => (
                    <div key={log.id} className="p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 mt-1">
                                {log.type === ResourceType.DESKTOP ? <Monitor size={14} /> : <AppWindow size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-slate-800 dark:text-white truncate">{log.resourceName}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {log.action === 'LAUNCHED' && <Play size={10} className="text-emerald-500 dark:text-emerald-400" />}
                                    {log.action === 'STOPPED' && <Power size={10} className="text-slate-400" />}
                                    {log.action === 'DISCONNECTED' && <PlugZap size={10} className="text-amber-500 dark:text-amber-400" />}
                                    <span className={`text-xs font-medium uppercase ${
                                        log.action === 'LAUNCHED' ? 'text-emerald-600 dark:text-emerald-400' :
                                        log.action === 'DISCONNECTED' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {log.action}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-right">
                             <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <button className="w-full py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 transition-colors">
                    {t('dash.view_full')}
                </button>
            </div>
        </div>
      </div>

      {/* Welcome / Quick Access Section - Only show on 'all' view */}
      {category === 'all' && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600 dark:text-indigo-400" /> {t('dash.recent')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {runningResources.length > 0 ? (
                    runningResources.map(res => <ResourceCard key={res.id} resource={res} />)
                ) : (
                    <div className="col-span-full h-32 bg-white dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 text-sm">
                        {searchQuery ? t('dash.no_results') : t('dash.no_active')}
                    </div>
                )}
            </div>
          </div>
      )}

      {/* Main Library Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2">
                {category === 'all' && t('dash.all')}
                {category === 'desktops' && t('dash.desktops')}
                {category === 'apps' && t('dash.apps')}
                <span className="text-xs font-normal text-slate-500 ml-2 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {visibleResources.length}
                </span>
            </h2>
            
            {/* Filter/Sort Controls */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowActivityLog(!showActivityLog)}
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md border transition-colors ${
                        showActivityLog 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <History size={14} /> {t('dash.history')}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md px-2 py-1 outline-none focus:border-indigo-500">
                    <option>{t('dash.sort.name')}</option>
                    <option>{t('dash.sort.status')}</option>
                    <option>{t('dash.sort.usage')}</option>
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleResources.length > 0 ? (
                visibleResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))
            ) : (
                <div className="col-span-full py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                        <Search size={32} />
                    </div>
                    <h3 className="text-slate-700 dark:text-white font-medium">{t('dash.empty_search')}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('dash.empty_hint')}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;