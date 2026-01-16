import React, { useState, useEffect } from 'react';
import { VDIResource, SessionStatus, ConnectionQuality } from '../types';
import { Minimize2, Maximize2, Wifi, Power, Settings, Keyboard, MousePointer2, X, Check, Signal, SignalLow, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';

interface VDIViewerProps {
  resource: VDIResource;
  onClose: () => void;
}

const VDIViewer: React.FC<VDIViewerProps> = ({ resource, onClose }) => {
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.CONNECTING);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<ConnectionQuality>(ConnectionQuality.EXCELLENT);
  const [latency, setLatency] = useState(45);
  
  // Input Settings State
  const [showInputSettings, setShowInputSettings] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState('US QWERTY');
  const [mouseSensitivity, setMouseSensitivity] = useState(50);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    // Simulate connection sequence
    const connectTimer = setTimeout(() => {
      setStatus(SessionStatus.CONNECTED);
    }, 2000);

    // Simulate network quality fluctuations
    const networkInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.85) {
        setQuality(ConnectionQuality.POOR);
        setLatency(Math.floor(Math.random() * 100) + 150); // 150-250ms
      } else if (rand > 0.65) {
        setQuality(ConnectionQuality.GOOD);
        setLatency(Math.floor(Math.random() * 50) + 80); // 80-130ms
      } else {
        setQuality(ConnectionQuality.EXCELLENT);
        setLatency(Math.floor(Math.random() * 30) + 20); // 20-50ms
      }
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(networkInterval);
    };
  }, []);

  // Reset modal state when closed or opened
  useEffect(() => {
    if (showInputSettings) {
      setSettingsError(null);
      setSettingsSuccess(false);
      setIsSavingSettings(false);
    }
  }, [showInputSettings]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleDisconnect = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  const handleApplySettings = () => {
    setIsSavingSettings(true);
    setSettingsError(null);
    setSettingsSuccess(false);

    // Simulate network operation to apply settings
    setTimeout(() => {
        // Mock failure if sensitivity is > 90 (simulating a validation error or timeout) 
        // OR a random chance of network failure
        const isNetworkFailure = Math.random() > 0.7; // 30% chance of failure
        
        if (isNetworkFailure) {
            setSettingsError("Connection timed out: Unable to sync settings with remote host.");
            setIsSavingSettings(false);
        } else if (mouseSensitivity > 90) {
             setSettingsError("Invalid configuration: Sensitivity too high for current protocol.");
             setIsSavingSettings(false);
        } else {
            setSettingsSuccess(true);
            setIsSavingSettings(false);
            // Auto close after success
            setTimeout(() => {
                setShowInputSettings(false);
            }, 1000);
        }
    }, 1500);
  };

  // Helper to determine styles based on connection quality
  const getQualityStyles = () => {
    switch (quality) {
      case ConnectionQuality.EXCELLENT:
        return {
          icon: Wifi,
          containerClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          textClass: 'text-emerald-400'
        };
      case ConnectionQuality.GOOD:
        return {
          icon: Signal,
          containerClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
          textClass: 'text-yellow-400'
        };
      case ConnectionQuality.POOR:
        return {
          icon: AlertTriangle,
          containerClass: 'bg-red-500/10 border-red-500/20 text-red-400',
          textClass: 'text-red-400'
        };
      default:
        return {
          icon: Wifi,
          containerClass: 'bg-slate-800 border-slate-700 text-slate-400',
          textClass: 'text-slate-400'
        };
    }
  };

  const { icon: QualityIcon, containerClass, textClass } = getQualityStyles();

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      {/* Top Bar - VDI Controls */}
      <div className={`h-10 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 transition-transform duration-300 z-[60] relative ${isFullscreen && !showInputSettings ? '-translate-y-full hover:translate-y-0' : ''}`}>
        <div className="flex items-center space-x-4">
          <span className="text-slate-200 text-sm font-semibold flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${status === SessionStatus.CONNECTED ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
            {resource.name}
          </span>
          
          {/* Dynamic Connection Indicator */}
          <div className={`flex items-center gap-2 px-2 py-0.5 border rounded transition-colors duration-500 ${containerClass}`}>
            <QualityIcon size={12} />
            <span className={`text-xs font-medium uppercase tracking-wider ${textClass}`}>{quality}</span>
            <span className="text-slate-600 text-[10px]">•</span>
            <span className="text-slate-400 text-xs font-mono w-10 text-right">{latency}ms</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
           <button 
             onClick={() => setShowInputSettings(!showInputSettings)}
             className={`p-1.5 rounded transition-colors ${showInputSettings ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} 
             title="Input Settings"
           >
            <Keyboard size={16} />
          </button>
           <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Pointer Settings">
            <MousePointer2 size={16} />
          </button>
          <div className="h-4 w-px bg-slate-700 mx-2"></div>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            onClick={handleDisconnect}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded flex items-center gap-1 text-xs font-medium"
          >
            <Power size={14} />
            Disconnect
          </button>
        </div>
      </div>

      {/* Input Settings Modal Overlay */}
      {showInputSettings && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-80 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Settings size={14} className="text-indigo-400"/> Input Configuration
                    </h3>
                    <button onClick={() => setShowInputSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                
                <div className="p-5 space-y-5">
                    {/* Status Feedback */}
                    {settingsError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span>{settingsError}</span>
                        </div>
                    )}
                    
                    {settingsSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs text-emerald-400 animate-in fade-in slide-in-from-top-2">
                            <Check size={14} />
                            <span>Configuration applied successfully.</span>
                        </div>
                    )}

                    {/* Keyboard Section */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-wider">
                            <Keyboard size={12} /> Keyboard Layout
                        </label>
                        <select 
                            value={keyboardLayout}
                            onChange={(e) => setKeyboardLayout(e.target.value)}
                            disabled={isSavingSettings}
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="US QWERTY">US QWERTY</option>
                            <option value="UK Extended">UK Extended</option>
                            <option value="AZERTY">AZERTY</option>
                            <option value="QWERTZ">QWERTZ</option>
                            <option value="DVORAK">DVORAK</option>
                        </select>
                    </div>

                    {/* Mouse Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-wider">
                                <MousePointer2 size={12} /> Mouse Sensitivity
                            </label>
                            <span className="text-xs text-indigo-400 font-mono font-medium bg-indigo-500/10 px-2 py-0.5 rounded">{mouseSensitivity}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={mouseSensitivity}
                            disabled={isSavingSettings}
                            onChange={(e) => setMouseSensitivity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                         <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                            <span>Precision</span>
                            <span>Speed</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-slate-800/30 border-t border-slate-800 flex justify-end">
                    <button 
                        onClick={handleApplySettings}
                        disabled={isSavingSettings || settingsSuccess}
                        className={`px-4 py-2 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg ${
                            isSavingSettings 
                                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                                : settingsSuccess
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                        }`}
                    >
                        {isSavingSettings ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Saving...
                            </>
                        ) : settingsSuccess ? (
                            <>
                                <Check size={14} /> Saved
                            </>
                        ) : (
                            <>
                                <Check size={14} /> Apply Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Viewport Area */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-800 overflow-hidden">
        {status === SessionStatus.CONNECTING && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <h3 className="text-xl text-white font-medium">Establishing Secure Tunnel...</h3>
            <p className="text-slate-400 text-sm mt-2">Negotiating protocol encryption</p>
          </div>
        )}

        {status === SessionStatus.CONNECTED && (
          <div className="w-full h-full bg-cover bg-center relative group cursor-none" style={{ backgroundImage: `url('https://picsum.photos/seed/${resource.id}/1920/1080')` }}>
            {/* Overlay to catch cursor for demo feeling */}
            <div className="absolute inset-0 bg-transparent cursor-default"></div>
            
            {/* Simulated Desktop Taskbar/OS UI element for realism */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/90 backdrop-blur-md border-t border-slate-700/50 flex items-center px-4 justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">W</div>
                  <div className="w-64 h-8 bg-slate-700/50 rounded flex items-center px-3 text-xs text-slate-400">Search...</div>
               </div>
               <div className="text-xs text-slate-400">
                 {new Date().toLocaleTimeString()}
               </div>
            </div>
            
            {/* Simulated Window inside the VDI */}
            <div className="absolute top-20 left-20 w-1/2 h-1/2 bg-slate-800 rounded-lg shadow-2xl border border-slate-600 flex flex-col overflow-hidden">
                <div className="h-8 bg-slate-700 flex items-center px-3 justify-between">
                    <span className="text-xs text-white">Document - Word Processor</span>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="flex-1 bg-white p-8 text-slate-900">
                    <h1 className="text-2xl font-bold mb-4">Project Nebula</h1>
                    <p className="text-sm text-gray-600">This is a simulated view of a remote desktop session. In a production environment, this canvas would render a WebRTC stream or an HTML5 Canvas drawing raw pixel data from the RDP/PCoIP protocol.</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VDIViewer;