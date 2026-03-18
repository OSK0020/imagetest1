'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trash2, Key, Shield, AlertTriangle, AlertOctagon, UserX, LogOut, CheckCircle2, 
  User as UserIcon, RefreshCw, ChevronRight, Gem, Info, ExternalLink, ShieldCheck,
  Zap, BarChart3, Maximize2, Globe, Eye, EyeOff, Edit3, Check, Lock, Loader2
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useUserDashboard } from './UserContext';
import { KeyAnalysis, ImageItem } from '@/hooks/usePollinations';
import { translations, Language } from '@/lib/translations';
import { cn } from '@/lib/utils';
import ConfirmModal from './ConfirmModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
  keyAnalysis: KeyAnalysis | null;
  usageCount: number;
  history: ImageItem[];
  onViewArchive: () => void;
  language: Language;
  onApiKeyChange: (key: string) => Promise<boolean>;
  onClearHistory: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLogout: () => void;
  onResetKey: () => void;
  side?: 'left' | 'right';
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  apiKey,
  keyAnalysis, 
  usageCount, 
  history, 
  onViewArchive,
  language,
  onApiKeyChange,
  onClearHistory,
  onDeleteAccount,
  onLogout,
  onResetKey,
  side = 'right'
}: SidebarProps) {
  const { user, logout, signIn } = useAuth();
  const { profile, balance } = useUserDashboard();
  const t = translations[language];
  const isRTL = language === 'he';
  
  const [isEditingKey, setIsEditingKey] = React.useState(false);
  const [newKey, setNewKey] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [confirmModal, setConfirmModal] = React.useState<{
    type: 'clear' | 'delete' | 'resetKey',
    isOpen: boolean
  }>({ type: 'clear', isOpen: false });

  const triggerClearHistory = () => {
    setConfirmModal({ type: 'clear', isOpen: true });
  };

  const triggerDeleteAccount = () => {
    setConfirmModal({ type: 'delete', isOpen: true });
  };

  const triggerResetKey = () => {
    setConfirmModal({ type: 'resetKey', isOpen: true });
  };

  const handleSaveKey = async () => {
    if (!showConfirm && apiKey) {
      setShowConfirm(true);
      return;
    }
    setIsSaving(true);
    const success = await onApiKeyChange(newKey);
    if (success) {
      setIsEditingKey(false);
      setNewKey('');
      setShowConfirm(false);
    }
    setIsSaving(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.aside
              initial={{ x: side === 'right' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: side === 'right' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-80 max-w-[90vw] bg-white dark:bg-[#0D0D0D] z-[101] shadow-2xl flex flex-col text-slate-900 dark:text-white",
                side === 'right' ? "right-0 border-l border-slate-200 dark:border-white/10" : "left-0 border-r border-slate-200 dark:border-white/10"
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.profileAndLabs}</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                  <X className={cn("w-5 h-5 text-slate-400", isRTL && "rotate-180")} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 dark:from-purple-600/10 dark:to-blue-600/10 border border-slate-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden">
                  <div className="relative z-10 flex items-center gap-4 mb-4">
                    {profile?.image || user?.photoURL ? (
                      <img src={profile?.image || user?.photoURL || ''} alt="" className="w-14 h-14 rounded-2xl border-2 border-purple-500 shadow-2xl bg-purple-500/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-white/10 flex items-center justify-center">
                        <UserIcon className="w-7 h-7 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-black text-xl leading-tight dark:text-white text-slate-900">
                        {profile?.username || user?.displayName?.split(' ')[0] || t.guestBuilder}
                      </h3>
                      {profile?.tier && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 shadow-sm">
                            {profile.tier === 'Seed' && '🌱'} 
                            {profile.tier === 'Flower' && '🌸'}
                            {profile.tier === 'Nectar' && '🍯'}
                            {' '}{profile.tier} Tier
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {balance && (
                    <div className="space-y-3 mt-6 p-4 bg-black/20 rounded-2xl border border-white/5 shadow-inner">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-black tracking-widest">Pollen Balance</span>
                          <div className="flex items-center gap-1">
                             <span className="text-lg font-black text-purple-500">{balance.totalBalance.toFixed(2)}</span>
                             <Gem className="w-4 h-4 text-purple-400" />
                          </div>
                       </div>
                       <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((balance.totalBalance / 20) * 100, 100)}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                          />
                       </div>
                    </div>
                  )}

                  {!user && (
                    <button 
                      onClick={signIn}
                      className="w-full py-3 bg-slate-900 dark:bg-white/10 hover:opacity-90 text-white rounded-2xl font-bold transition-all text-sm mb-2"
                    >
                      {language === 'he' ? 'התחבר לשמירת היסטוריה' : 'Sign in to save history'}
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 leading-none">{t.labResources}</h4>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5 ml-4" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <Zap className="w-4 h-4 text-purple-500 mb-2" />
                      <div className="text-sm font-bold leading-none">{usageCount}</div>
                      <div className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 uppercase font-black">{t.usage}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <BarChart3 className="w-4 h-4 text-blue-500 mb-2" />
                      <div className="text-sm font-bold leading-none">{history.length}</div>
                      <div className="text-[10px] text-slate-400 dark:text-gray-500 mt-1 uppercase font-black">{t.archive}</div>
                    </div>
                  </div>

                  <button 
                    onClick={onViewArchive}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-white/5 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Maximize2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-black uppercase tracking-widest">{t.viewFullArchive}</span>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors", isRTL && "rotate-180")} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 leading-none">{t.secretKey}</h4>
                    <a href="https://enter.pollinations.ai" target="_blank" className="text-[10px] font-bold text-purple-500 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Get Key
                    </a>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20">
                        {apiKey ? <Shield className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <input 
                        type={isEditingKey ? "text" : "password"} 
                        value={isEditingKey ? newKey : (apiKey ? '••••••••••••••••' : '')}
                        readOnly={!isEditingKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="sk_..."
                        className={cn(
                          "w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm outline-none transition-all",
                          isEditingKey && "border-purple-500/50 ring-2 ring-purple-500/10"
                        )}
                      />
                      <button 
                        onClick={() => {
                          if (!isEditingKey) {
                            setIsEditingKey(true);
                            setNewKey('');
                          } else if (newKey) {
                            handleSaveKey();
                          } else {
                            setIsEditingKey(false);
                          }
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400 p-1 rounded-lg"
                      >
                        {isEditingKey ? (isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />) : <Edit3 className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showConfirm && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-4"
                        >
                          <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-red-500">{t.changeKeyWarning}</p>
                              <p className="text-[10px] text-red-500/70">{t.changeKeyDesc}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={handleSaveKey}
                              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all"
                            >
                              {t.confirmChange}
                            </button>
                            <button 
                              onClick={() => setShowConfirm(false)}
                              className="flex-1 py-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-lg text-xs font-bold"
                            >
                              {t.cancelText}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
                       <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] font-medium text-slate-500 dark:text-blue-200/60 leading-relaxed">
                          {isRTL 
                            ? 'הנתונים מוגנים ומגיעים ישירות מ-Pollinations.ai. המפתח שלך נשמר מקומית בלבד ובצורה מאובטחת.' 
                            : 'Data is protected and retrieved directly from Pollinations.ai. Your key is stored locally and securely.'}
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent space-y-3">
                <div className={cn("grid gap-2", user ? "grid-cols-2" : "grid-cols-1")}>
                  {/* Guests: 'Clear & Reset' wipes key + returns to splash. Logged-in: only clears history. */}
                  <button 
                    onClick={user ? triggerClearHistory : triggerResetKey}
                    className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-xl font-bold transition-all text-[10px] border border-slate-200 dark:border-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {user 
                       ? (language === 'he' ? 'נקה היסטוריה' : 'Clear History')
                       : (language === 'he' ? 'נקה וחזור להתחלה' : 'Clear & Reset')}
                  </button>
                  {user && (
                    <button 
                      onClick={triggerDeleteAccount}
                      className="flex items-center justify-center gap-2 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl font-bold transition-all text-[10px] border border-red-500/10"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      {language === 'he' ? 'מחק חשבון' : 'Delete Account'}
                    </button>
                  )}
                </div>
                {/* Reset Secret Key button — for ALL users — clears key and sends to splash */}
                <button
                  onClick={triggerResetKey}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl font-bold transition-all text-[10px] border border-amber-500/10"
                >
                  <Key className="w-3.5 h-3.5" />
                  {language === 'he' ? 'מחק מפתח סודי וחזור לפתיחה' : 'Reset Secret Key'}
                </button>
                {user && (
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold transition-all text-[10px] border border-slate-200 dark:border-white/5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t.signOut}
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(p => ({ ...p, isOpen: false }))}
        onConfirm={async () => {
          if (confirmModal.type === 'clear') {
            await onClearHistory?.();
          } else if (confirmModal.type === 'delete') {
            await onDeleteAccount?.();
          } else if (confirmModal.type === 'resetKey') {
            onResetKey();
          }
        }}
        title={
          confirmModal.type === 'clear' 
            ? (language === 'he' ? 'ניקוי היסטוריה' : 'Clear History') 
            : confirmModal.type === 'delete'
              ? (language === 'he' ? 'מחיקה לצמיתות' : 'Permanent Deletion')
              : (language === 'he' ? 'איפוס מפתח סודי' : 'Reset Secret Key')
        }
        message={
          confirmModal.type === 'clear'
            ? (language === 'he' 
                ? 'האם אתה בטוח שברצונך למחוק את כל נתוני התמונות וההיסטוריה? פעולה זו תימחק הכל ללא אפשרות לשחזר.' 
                : 'Are you sure you want to clear all history and images? This will remove everything without the possibility of recovery.')
            : confirmModal.type === 'delete'
              ? (language === 'he'
                  ? 'אזהרה קריטית: מחיקת החשבון תסיר את כל הגדרות המעבדה שלך, היסטוריית הענן והגישה לשירותים. הכל הולך לאיבוד.'
                  : 'CRITICAL WARNING: Deleting your account will remove all your lab settings, cloud history, and service access. Everything goes to waste.')
              : (language === 'he'
                  ? 'פעולה זו תמחק את המפתח הסודי שלך ותחזיר אותך למסך הפתיחה. תצטרך להזין מחדש מפתח כדי להמשיך.'
                  : 'This will delete your secret key and return you to the splash screen. You will need to enter a key again to continue.')
        }
        confirmText={
          confirmModal.type === 'clear'
            ? (language === 'he' ? 'נקה הכל עכשיו' : 'Clear Everything Now')
            : confirmModal.type === 'delete'
              ? (language === 'he' ? 'כן, מחק לצמיתות' : 'Yes, Delete Permanently')
              : (language === 'he' ? 'כן, אפס מפתח' : 'Yes, Reset Key')
        }
        cancelText={language === 'he' ? 'ביטול' : 'Cancel'}
        type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        dir={language === 'he' ? 'rtl' : 'ltr'}
      />
    </>
  );
}
