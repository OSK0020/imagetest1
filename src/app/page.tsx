'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import SplashScreen from '@/components/SplashScreen';
import BentoGallery from '@/components/BentoGallery';
import GenerationBar from '@/components/GenerationBar';
import Sidebar from '@/components/Sidebar';
import { usePollinations } from '@/hooks/usePollinations';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { X, Aperture, Sun, Moon, Menu, Loader2, Globe, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translations, Language } from '@/lib/translations';
import { MODELS } from '@/lib/models';
import { UserProvider, useUserDashboard } from '@/components/UserContext';

// --- Lab Core: Combined Header Center Element (Ideas 1 + 2 + 4) ---
const LabCore = ({ isGenerating }: { isGenerating: boolean }) => {
  const pulseCount = 8;
  return (
    <div className="hidden lg:flex items-center gap-5 pointer-events-none select-none">
      {/* Idea 4: Lab Identity Badge */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-white/30">AI Models</span>
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: isGenerating ? [0.4, 1, 0.4] : [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: isGenerating ? 0.6 : 2 }}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isGenerating ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-emerald-500"
            )}
          />
          <span className={cn(
            "text-[8px] font-black uppercase tracking-widest",
            isGenerating ? "text-emerald-400" : "text-emerald-500"
          )}>LIVE</span>
        </div>
      </div>

      {/* Idea 1: Orbital Core + Idea 2: Pulse line */}
      <div className="relative flex items-center justify-center w-[140px] h-10">
        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: isGenerating ? 1.5 : 4, ease: 'linear' }}
            className="absolute w-8 h-8 border border-purple-500/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: isGenerating ? 2.5 : 7, ease: 'linear' }}
            className="absolute w-5 h-5 border border-blue-400/50 rounded-full"
          />
          {/* Center core glow */}
          <motion.div
            animate={{ scale: isGenerating ? [0.8, 1.3, 0.8] : [0.9, 1.1, 0.9], opacity: isGenerating ? [0.6,1,0.6] : [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: isGenerating ? 0.7 : 2.5 }}
            className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_4px_rgba(168,85,247,0.5)]"
          />
        </div>

        {/* Idea 2: Reactive pulse waveform (right side) */}
        <div className="absolute right-0 flex items-center gap-[2px] h-full">
          {Array.from({ length: pulseCount }).map((_, i) => {
            const isCenter = i === 3 || i === 4;
            const baseDuration = isGenerating ? 0.25 + i * 0.05 : 0.6 + i * 0.1;
            const baseHeight = isCenter ? (isGenerating ? 28 : 14) : (isGenerating ? 14 : 6);
            return (
              <motion.div
                key={i}
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: baseDuration, delay: i * 0.07, ease: 'easeInOut' }}
                style={{ height: baseHeight }}
                className={cn(
                  "w-[2px] rounded-full",
                  isGenerating ? "bg-purple-400" : "bg-purple-500/50"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Right label */}
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-white/30">Laboratory</span>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-[0.15em]",
          isGenerating ? "text-purple-400" : "text-slate-300 dark:text-white/20"
        )}>{isGenerating ? 'GENERATING...' : 'STANDBY'}</span>
      </div>
    </div>
  );
};

const Hero = ({ language, selectedModelId, onSelectModel }: { language: Language, selectedModelId: string, onSelectModel: (id: string) => void }) => {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-20 px-6 mt-12 mb-8">
       <motion.h1 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none"
       >
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            {language === 'en' ? 'AI Models Laboratory' : 'מעבדת מודלי בינה מלאכותית'}
          </span>
       </motion.h1>
       
       <motion.p
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="text-slate-500 dark:text-gray-400 max-w-2xl text-lg font-medium"
       >
         {language === 'en' 
           ? "Enter a description below and see in real-time how the world's leading AI models interpret it."
           : "הכניסו תיאור למטה וראו בזמן אמת כיצד מודלי הבינה המלאכותית המובילים בעולם מפרשים אותו."}
       </motion.p>
       
       <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl pt-4">
         {MODELS.filter(m => m.id !== 'all').map((model, idx) => (
            <motion.button
              key={model.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.05) }}
              onClick={() => onSelectModel(model.id)}
              className={cn(
                "px-5 py-2.5 rounded-full border transition-all text-[13px] font-bold",
                selectedModelId === model.id 
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25" 
                  : "border-slate-200 dark:border-white/10 bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400"
              )}
            >
              {model.name}
            </motion.button>
         ))}
       </div>
    </div>
  );
};

function HomeContent() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'generator' | 'archive'>('generator');
  const [language, setLanguage] = useState<Language>('en');
  const [showHebrewWarning, setShowHebrewWarning] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  
  const t = translations[language];
  const { user, signIn, logout: firebaseLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { profile, balance, refreshUserData, clearUserData: clearDashboard } = useUserDashboard();
  
  const [recentModel, setRecentModel] = useState<string>('all');
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);

  const { 
    images, 
    history,
    isGenerating, 
    isTranslating, 
    keyAnalysis, 
    generateImage, 
    verifyKey, 
    fetchHistory,
    stopGeneration,
    clearHistory
  } = usePollinations(apiKey, user?.uid || null);

  const onGenerate = (p: string, m: string) => {
    setRecentModel(m);
    generateImage(p, m);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('pollinations_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      refreshUserData(savedKey);
    }
  }, [refreshUserData]);

  useEffect(() => {
    if (user && apiKey) {
      fetchHistory();
    }
  }, [user, apiKey, fetchHistory]);

  const handleConnect = async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    const isValid = await verifyKey(key);
    
    if (isValid) {
      setApiKey(key);
      localStorage.setItem('pollinations_api_key', key);
      await refreshUserData(key);
      setNotification({
        message: language === 'he' 
          ? 'שים לב: נתוני החשבון שלך מגיעים ישירות מ-Pollinations.ai בצורה מאובטחת.' 
          : 'Note: Your account data is retrieved securely from Pollinations.ai.',
        type: 'success'
      });
      setTimeout(() => setNotification(null), 8000);
    }
    
    setIsVerifying(false);
    return !!isValid;
  };

  const handleLogout = () => {
    setApiKey(null);
    localStorage.removeItem('pollinations_api_key');
    clearDashboard();
    firebaseLogout();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await clearHistory();
      await user.delete();
      handleLogout();
    } catch (err) {
      handleLogout();
    }
  };

  // Clears API key, dashboard data, localStorage → returns to splash screen
  const handleResetKey = () => {
    setApiKey(null);
    localStorage.removeItem('pollinations_api_key');
    clearDashboard();
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'he' : 'en';
    setLanguage(newLang);
    if (newLang === 'he') {
      setShowHebrewWarning(true);
      setTimeout(() => setShowHebrewWarning(false), 6000);
    }
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'Seed') return '🌱';
    if (tier === 'Flower') return '🌸';
    if (tier === 'Nectar') return '🍯';
    return '💎';
  };

  return (
    <main className="min-h-screen text-slate-950 dark:text-white overflow-x-hidden selection:bg-purple-500/30">
      <ThreeBackground />
      
      <AnimatePresence mode="wait">
        {!apiKey ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
             <SplashScreen 
               onConnect={handleConnect} 
               isVerifying={isVerifying} 
               language={language}
             />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 pt-24 pb-40"
          >
            {/* Header */}
            <div className={cn(
               "fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center transition-all duration-500 relative",
               "bg-white/80 dark:bg-black/20 backdrop-blur-xl border-b border-white/5",
               language === 'he' && "flex-row-reverse"
            )} dir={language === 'he' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-all border border-slate-200 dark:border-white/5"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/10 p-0.5">
                    <div className="w-full h-full rounded-xl border border-white/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                      <Aperture className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block">
                    {language === 'en' ? (
                      <>AI Models <span className="text-purple-500">Laboratory</span></>
                    ) : (
                      <><span className="text-purple-500">בינה מלאכותית</span> מעבדת מודלי</>
                    )}
                    {view === 'archive' && <span className={cn(
                      "text-xs opacity-50 font-medium bg-white/10 px-2 py-1 rounded-lg",
                      language === 'he' ? "mr-3" : "ml-3"
                    )}>{t.archive.toUpperCase()}</span>}
                  </h1>
                </div>
              </div>

              {/* ===== HEADER CENTER: Lab Core ===== */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <LabCore isGenerating={isGenerating} />
              </div>

              <div className="flex items-center gap-3">
                 {view === 'archive' && (
                   <button
                     onClick={() => setView('generator')}
                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                   >
                     {t.backToGen}
                   </button>
                 )}

                 {view === 'generator' && images.length > 0 && (
                   <button
                     onClick={() => clearHistory()}
                     className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm transition-all text-slate-600 dark:text-gray-400"
                   >
                     <Trash2 className="w-4 h-4" />
                     {language === 'he' ? 'נקה מסך' : 'Clear Screen'}
                   </button>
                 )}
                
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-all"
                  title={t.language}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-xs font-bold hidden md:inline">{language.toUpperCase()}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-2xl transition-all"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                 {(user || profile) && (
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="flex items-center gap-3 p-1.5 pr-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold text-sm shadow-2xl relative group"
                    >
                      <img 
                        src={profile?.image || user?.photoURL || ''} 
                        className="w-9 h-9 rounded-full border border-purple-500 bg-purple-500/10" 
                        alt="" 
                      />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="hidden md:inline text-white truncate max-w-[100px]">
                          {profile?.username || user?.displayName?.split(' ')[0] || 'Anonymous'}
                        </span>
                        {profile?.tier && (
                          <span className="text-[9px] uppercase tracking-widest text-purple-400 font-black">
                            {getTierIcon(profile.tier)} {profile.tier} Tier
                          </span>
                        )}
                      </div>
                      
                      {balance && (
                         <div className="absolute top-full right-0 mt-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1A1A] border border-white/10 p-4 rounded-3xl shadow-3xl pointer-events-none min-w-[200px]">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Pollen Balance</span>
                               <span className="text-sm font-black text-purple-500">{balance.totalBalance.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${Math.min((balance.totalBalance / 100) * 100, 100)}%` }}
                                 className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                               />
                            </div>
                         </div>
                      )}
                    </button>
                 )}

                 {!user && !profile && (
                  <button
                    onClick={signIn}
                    className="flex items-center gap-2 px-6 py-3 google-btn-live rounded-2xl transition-all text-sm font-black text-white shadow-xl shadow-blue-500/20"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t.signIn}
                  </button>
                 )}
              </div>
            </div>

            {/* Notifications */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-28 left-1/2 z-[100] bg-green-500 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md w-[90vw]"
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                  <p className="text-sm font-bold text-white leading-tight">
                    {notification.message}
                  </p>
                  <button onClick={() => setNotification(null)} className={cn("text-white/60 hover:text-white", language === 'he' ? "mr-auto" : "ml-auto")}>
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showHebrewWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-28 left-1/2 z-[100] bg-orange-500/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md w-[90vw]"
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <AlertCircle className="w-6 h-6 text-white shrink-0" />
                  <p className="text-sm font-bold text-white leading-tight">
                    {t.hebrewWarning}
                  </p>
                  <button onClick={() => setShowHebrewWarning(false)} className={cn("text-white/60 hover:text-white", language === 'he' ? "mr-auto" : "ml-auto")}>
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Translation Progress Toast */}
            <AnimatePresence>
              {isTranslating && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-28 left-1/2 z-[100] bg-blue-600/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-sm font-bold text-white tracking-wide">{t.translateToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Main Content */}
             {view === 'generator' && images.length === 0 && (
               <Hero 
                 language={language} 
                 selectedModelId={selectedModelId} 
                 onSelectModel={setSelectedModelId} 
               />
             )}
             
             <BentoGallery 
               images={view === 'generator' ? images : history} 
               onOpenImage={setSelectedImage} 
               isUniform={recentModel === 'all' && view === 'generator'}
             />
             
             {view === 'generator' && (
               <GenerationBar 
                 onGenerate={onGenerate} 
                 onStop={stopGeneration}
                 isGenerating={isGenerating} 
                 language={language} 
                 selectedModelId={selectedModelId}
                 onModelChange={setSelectedModelId}
               />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        apiKey={apiKey}
        keyAnalysis={keyAnalysis}
        usageCount={images.length}
        history={history}
        onViewArchive={() => setView('archive')}
        language={language}
        onApiKeyChange={handleConnect}
        onClearHistory={clearHistory}
        onDeleteAccount={handleDeleteAccount}
        onLogout={handleLogout}
        onResetKey={handleResetKey}
        side={language === 'he' ? 'right' : 'left'}
      />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              src={selectedImage}
              className="max-w-full max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
