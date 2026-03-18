'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type?: 'warning' | 'danger';
  dir?: 'ltr' | 'rtl';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'warning',
  dir = 'ltr'
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" dir={dir}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[440px] bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="p-8 pb-4">
              {/* Header Icon */}
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-all animate-pulse",
                  type === 'danger' 
                    ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/20" 
                    : "bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-orange-500/20"
                )}>
                  {type === 'danger' ? <AlertOctagon className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight leading-none uppercase">
                  {title}
                </h2>
                <p className="text-slate-400 dark:text-gray-400 font-medium text-base leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Warning Banner (The "Everything goes to waste" part) */}
            <div className={cn(
                "mx-8 mb-8 p-4 rounded-2xl flex items-start gap-3 bg-red-500/5 border border-red-500/10",
                dir === 'rtl' ? "text-right" : "text-left"
            )}>
                <Trash2 className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-500/80 leading-snug">
                   {dir === 'rtl' 
                     ? "שים לב: פעולה זו היא בלתי הפיכה. ברגע שתאשר, כל המידע שלך ימחק לצמיתות מהשרתים שלנו ומהמכשיר הזה. לא ניתן יהיה לשחזר דבר."
                     : "Warning: This action is irreversible. Once confirmed, all your data will be permanently removed from our servers and this device. Nothing can be restored."}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 p-8 pt-0">
               <button
                 onClick={() => {
                   onConfirm();
                   onClose();
                 }}
                 className={cn(
                   "w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                   type === 'danger' ? "bg-red-500 text-white shadow-red-500/20" : "bg-purple-600 text-white shadow-purple-500/20"
                 )}
               >
                 {confirmText}
               </button>
               <button
                 onClick={onClose}
                 className="w-full py-4 rounded-2xl font-bold text-sm text-slate-500 dark:text-gray-400 hover:bg-white/5 transition-all"
               >
                 {cancelText}
               </button>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
