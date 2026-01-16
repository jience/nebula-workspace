import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, MapPin, Briefcase, Calendar, Shield, Edit2, Check, Camera, LogOut } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onLogout }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [status, setStatus] = useState<User['status']>(user.status);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
        setIsAnimating(true);
        setEditedUser(user); // Reset edits on open
        setStatus(user.status);
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setIsAnimating(false);
    setIsEditing(false);
    setTimeout(onClose, 200);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setIsEditing(false);
    // user = editedUser; // Optimistic update simulation would happen in parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white">
      <div 
        className={`absolute inset-0 bg-slate-500/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />
      
      <div className={`relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
        {/* Cover Image & Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 relative">
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
                <X size={18} />
            </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl">
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors shadow-lg">
                        <Camera size={16} />
                    </button>
                    {/* Status Indicator */}
                    <div className={`absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        status === 'online' ? 'bg-emerald-500' : 
                        status === 'away' ? 'bg-yellow-500' : 
                        status === 'dnd' ? 'bg-red-500' : 'bg-slate-500'
                    }`}></div>
                </div>
                
                <div className="flex gap-2 mb-2">
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
                        >
                            <Edit2 size={14} /> {t('profile.edit')}
                        </button>
                    ) : (
                        <button 
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                        >
                            <Check size={14} /> {t('profile.save')}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Info */}
            <div className="mb-6">
                 {isEditing ? (
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-bold text-xl focus:border-indigo-500 outline-none"
                            placeholder="Full Name"
                        />
                        <input 
                            type="text" 
                            value={editedUser.role}
                            onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 text-sm focus:border-indigo-500 outline-none"
                            placeholder="Job Title"
                        />
                    </div>
                 ) : (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {user.name}
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">{t('profile.pro')}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                 )}
            </div>

            {/* Status Selector */}
            <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('profile.availability')}</span>
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                >
                    <option value="online">🟢 {t('profile.status.online')}</option>
                    <option value="away">🟡 {t('profile.status.away')}</option>
                    <option value="dnd">🔴 {t('profile.status.dnd')}</option>
                    <option value="offline">⚪ {t('profile.status.offline')}</option>
                </select>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <Briefcase size={12} /> {t('profile.department')}
                    </div>
                    <div className="text-slate-900 dark:text-slate-200 text-sm font-medium">
                        {isEditing ? (
                            <input 
                                value={editedUser.department}
                                onChange={(e) => setEditedUser({...editedUser, department: e.target.value})}
                                className="bg-transparent border-b border-slate-300 dark:border-slate-600 w-full focus:outline-none focus:border-indigo-500"
                            />
                        ) : user.department}
                    </div>
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                     <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <MapPin size={12} /> {t('profile.location')}
                    </div>
                    <div className="text-slate-900 dark:text-slate-200 text-sm font-medium">
                        {isEditing ? (
                            <input 
                                value={editedUser.location}
                                onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                                className="bg-transparent border-b border-slate-300 dark:border-slate-600 w-full focus:outline-none focus:border-indigo-500"
                            />
                        ) : user.location}
                    </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                     <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <Mail size={12} /> {t('profile.email')}
                    </div>
                    <div className="text-slate-900 dark:text-slate-200 text-sm font-medium truncate" title={user.email}>{user.email}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                     <div className="flex items-center gap-2 mb-1 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <Calendar size={12} /> {t('profile.joined')}
                    </div>
                    <div className="text-slate-900 dark:text-slate-200 text-sm font-medium">{user.joinDate}</div>
                </div>
            </div>

            {/* Footer Stats / Logout */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-xl font-bold text-slate-900 dark:text-white">42</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('profile.sessions')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-slate-900 dark:text-white">128h</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('profile.usage')}</div>
                    </div>
                </div>
                
                <button 
                    onClick={() => {
                        handleClose();
                        onLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={16} /> {t('profile.signout')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};