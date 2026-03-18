'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Aperture, HelpCircle, Loader2, Lock, ShieldCheck, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { Language, translations } from '@/lib/translations';

interface SplashScreenProps {
  onConnect: (key: string) => Promise<boolean>;
  isVerifying: boolean;
  language?: Language;
}

export default function SplashScreen({ onConnect, isVerifying, language = 'en' }: SplashScreenProps) {
  const [key, setKey] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const { user, signIn } = useAuth();
  
  const t = translations[language];

  const handleStart = async () => {
    if (!key.trim()) {
      setErrorStatus(language === 'he' ? 'אנא הזן מפתח סודי כדי להמשיך.' : 'Please provide a secret key to proceed.');
      return;
    }
    
    if (!hasPermission) {
      setErrorStatus(language === 'he' ? 'עליך לאשר את הגישה לנתוני החשבון שלך.' : 'You must authorize access to your account data.');
      return;
    }

    setErrorStatus(null);
    const success = await onConnect(key);
    if (!success) {
      setErrorStatus(language === 'he' ? 'מפתח שגוי או לא פעיל. אנא בדוק את הפרטים.' : 'Invalid or inactive secret key. Please double-check your credentials.');
    }
  };

  useEffect(() => {
    if (errorStatus) {
      const timer = setTimeout(() => setErrorStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorStatus]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0F071A] transition-colors duration-500 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] mx-auto"
      >
        <AnimatePresence>
          {errorStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute -top-16 left-0 right-0 z-50 flex justify-center"
            >
              <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/20 backdrop-blur-md">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold tracking-tight">{errorStatus}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="backdrop-blur-[40px] border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col items-center bg-white/70 dark:bg-[#0F071A]/80">
          <div className="relative z-10 w-full flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl p-0.5 border border-white/20"
            >
              <Aperture className="w-10 h-10 text-white animate-spin-slow" />
            </motion.div>

            <h1 className="text-4xl font-black text-center mb-2 tracking-tighter dark:text-white text-slate-900">
              {language === 'he' ? <><span className="text-purple-500">בינה מלאכותית</span> מעבדת</> : <>AI Lab <span className="text-purple-500">Modern</span></>}
            </h1>
            
            <p className="text-slate-500 dark:text-gray-400 text-center mb-10 text-base font-medium leading-relaxed max-w-[280px]">
              {language === 'he' ? 'גישה מאובטחת לייצור תמונות בבינה מלאכותית.' : 'Securely access professional AI model generation.'}
            </p>

            <div className="w-full mb-8">
              <button
                onClick={signIn}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 border shadow-xl shadow-blue-500/20",
                  user 
                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 pointer-events-none" 
                    : "google-btn-live border-transparent text-white hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {user ? (
                  <>
                    <img src={user.photoURL || ''} className="w-6 h-6 rounded-full" alt="" />
                    Syncing as {user.displayName?.split(' ')[0]}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {language === 'he' ? 'התחבר עם גוגל' : 'Sign in with Google'}
                  </>
                )}
              </button>
              <p className="text-[10px] text-center mt-3 text-slate-400 uppercase font-black tracking-widest opacity-50">
                {language === 'he' ? 'או המשך עם מפתח סודי' : 'OR PROCEED WITH SECRET KEY'}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="relative w-full group/input">
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={language === 'he' ? 'הדבק את המפתח הסודי שלך (sk_...)' : 'Paste your Secret Key (sk_...)'}
                  className={cn(
                    "w-full border rounded-2xl py-4 pl-14 pr-6 bg-slate-50 dark:bg-black/40 outline-none transition-all text-lg font-medium",
                    "border-slate-200 dark:border-white/10 dark:text-white text-slate-900 focus:ring-2 focus:ring-purple-500/50",
                    key.startsWith('sk_') && "ring-2 ring-green-500/30 border-green-500/50"
                  )}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  {key.startsWith('sk_') ? (
                    <ShieldCheck className="w-5 h-5 text-green-500 animate-pulse" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within/input:text-purple-500 transition-colors" />
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                 <input 
                   type="checkbox" 
                   checked={hasPermission}
                   onChange={(e) => setHasPermission(e.target.checked)}
                   className="mt-1 accent-purple-600 w-4 h-4 rounded-lg"
                 />
                 <span className="text-[11px] font-medium text-slate-500 dark:text-gray-400 leading-tight">
                    {language === 'he' 
                      ? 'אני מאשר גישה מאובטחת שתציג את נתוני הפרופיל ויתרת ה-Pollen שלי מ-Pollinations.ai.' 
                      : 'I authorize secure access to display my profile data and Pollen balance from Pollinations.ai.'}
                 </span>
              </label>

              <button
                onClick={handleStart}
                disabled={isVerifying}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 group"
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {language === 'he' ? 'התחבר למעבדה' : 'Connect to Lab'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity w-fit"
                >
                  <HelpCircle className="w-4 h-4" />
                  {language === 'he' ? 'איך מוצאים את המפתח הסודי?' : 'How do I find my Secret Key?'}
                </button>
                
                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-purple-600/5 dark:bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 text-xs text-slate-600 dark:text-purple-200/90 space-y-3 mt-1 backdrop-blur-md">
                        <div className="flex gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg h-fit"><Info className="w-4 h-4 text-purple-500" /></div>
                          <div className="space-y-2">
                            <p className="font-bold text-purple-600 dark:text-purple-400">
                              {language === 'he' ? 'מדריך שלב אחר שלב:' : 'Step-by-Step Guide:'}
                            </p>
                            <ol className="list-decimal list-inside space-y-1 opacity-80 font-medium">
                              {language === 'he' ? (
                                <>
                                  <li>התחבר לאתר <a href="https://enter.pollinations.ai" target="_blank" className="underline font-bold text-purple-500">enter.pollinations.ai</a></li>
                                  <li>עבור למדור <b>API Management</b> מצד שמאל.</li>
                                  <li>לחץ על <b>Generate New Key</b> ושמור את המפתח שמתחיל ב- <code className="bg-white/10 px-1 rounded text-purple-500">sk_</code></li>
                                  <li>מפתח זה מאפשר לך להשתמש ב"פולין" (Pollen) שלך באפליקציות חיצוניות.</li>
                                </>
                              ) : (
                                <>
                                  <li>Log in to <a href="https://enter.pollinations.ai" target="_blank" className="underline font-bold text-purple-500">enter.pollinations.ai</a></li>
                                  <li>Go to the <b>API Management</b> section on the left sidebar.</li>
                                  <li>Click <b>Generate New Key</b> and copy the string starting with <code className="bg-white/10 px-1 rounded text-purple-500">sk_</code></li>
                                  <li>This key allows you to use your Pollen usage credits in this lab.</li>
                                </>
                              )}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
