import React, { useState, useEffect } from 'react';
import { Monitor, AppWindow, Play, Clock, MoreVertical, Star, X, Cpu, Zap, Globe, Server, Info, History, Power, PlugZap, Search } from 'lucide-react';
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
  const [selectedResource, setSelectedResource] = useState<VDIResource | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  
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

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
        prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Helper to filter resources based on search query
  const filterResources = (resources: VDIResource[]) => {
    if (!searchQuery) return resources;
    const lowerQuery = searchQuery.toLowerCase();
    return resources.filter(res => 
        res.name.toLowerCase().includes(lowerQuery) || 
        res.os.toLowerCase().includes(lowerQuery) ||
        res.region.toLowerCase().includes(lowerQuery)
    );
  };

  const desktops = MOCK_RESOURCES.filter(r => r.type === ResourceType.DESKTOP);
  const apps = MOCK_RESOURCES.filter(r => r.type === ResourceType.APPLICATION);
  
  // Filter based on selected category from sidebar
  let baseResources = MOCK_RESOURCES;
  if (category === 'desktops') baseResources = desktops;
  if (category === 'apps') baseResources = apps;

  // Apply search filtering
  const visibleResources = filterResources(baseResources);
  const runningResources = filterResources(MOCK_RESOURCES.filter(r => r.status === 'running'));

  const ResourceCard = ({ resource, large = false }: { resource: VDIResource, large?: boolean }) => {
    const isFavorite = favorites.includes(resource.id);
    
    return (
        <div 
          onClick={() => setSelectedResource(resource)}
          className={`group relative bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-sm dark:shadow-none ${large ? 'col-span-2 row-span-2' : ''}`}
        >
          {/* Card Header / Image Placeholder */}
          <div className={`relative w-full ${large ? 'h-48' : 'h-32'} bg-slate-100 dark:bg-slate-900 overflow-hidden`}>
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity duration-300"
                style={{ backgroundImage: `url('https://picsum.photos/seed/${resource.id}/600/400')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
            
            {/* Status Indicator */}
            <div className="absolute top-3 right-3 flex gap-2">
                {resource.status === 'running' && (
                    <span className="px-2 py-1 rounded-md bg-white/80 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {t('dash.running')}
                    </span>
                )}
                 {resource.status === 'stopped' && (
                    <span className="px-2 py-1 rounded-md bg-white/80 dark:bg-slate-500/20 backdrop-blur-md border border-slate-500/30 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {t('dash.stopped')}
                    </span>
                )}
                {resource.status === 'maintenance' && (
                    <span className="px-2 py-1 rounded-md bg-white/80 dark:bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {t('dash.maintenance')}
                    </span>
                )}
            </div>
            
            {/* Icon Overlay */}
            <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 shadow-lg">
                {resource.type === ResourceType.DESKTOP ? <Monitor size={20} /> : <AppWindow size={20} />}
            </div>
            
            {/* Info Icon (Hover only) */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 rounded-full bg-black/40 backdrop-blur text-white/90 border border-white/20">
                    <Info size={14} />
                </div>
            </div>
          </div>
    
          {/* Card Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-slate-800 dark:text-white font-medium truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{resource.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.os}</p>
                </div>
                <button 
                    className={`p-1.5 rounded-full transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                        isFavorite 
                        ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                        : 'text-slate-300 dark:text-slate-600 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleFavorite(resource.id);
                    }}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Star size={18} fill={isFavorite ? "currentColor" : "none"} className={`transition-transform duration-300 ${isFavorite ? 'scale-110' : 'scale-100'}`} />
                </button>
            </div>
    
            <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{t('dash.region')}</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{resource.region.split(' ')[0]}</span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onLaunch(resource);
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Play size={12} fill="currentColor" /> {t('dash.launch')}
                </button>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="relative space-y-8 animate-fade-in pb-20">
      {/* Modal Render */}
      {selectedResource && (
          <ResourceDetailsModal 
            resource={selectedResource} 
            onClose={() => setSelectedResource(null)}
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