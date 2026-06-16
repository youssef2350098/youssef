/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Eye, EyeOff, ShieldAlert, KeyRound, ArrowRight, Fingerprint } from 'lucide-react';
import { Language, TRANSLATIONS } from '../types';

interface PinLockProps {
  language: Language;
  correctPin: string;
  onUnlock: () => void;
  onSetNewPin: (newPin: string) => void;
}

export function PinLock({ language, correctPin, onUnlock, onSetNewPin }: PinLockProps) {
  const [pin, setPin] = useState<string>('');
  const [isSettingMode, setIsSettingMode] = useState<boolean>(false);
  const [newPinTentative, setNewPinTentative] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [animatingError, setAnimatingError] = useState<boolean>(false);
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);
  const [shuttleMessage, setShuttleMessage] = useState<string>('');

  const t = TRANSLATIONS[language];

  // If correct pin is empty or default, let's make sure it is ready
  useEffect(() => {
    if (!correctPin) {
      setIsSettingMode(true);
    }
  }, [correctPin]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const next = pin + num;
      setPin(next);
      
      // Auto verify on 4 digits if correctPin is 4 long, or wait until manually entered
      if (next === correctPin) {
        triggerSuccess();
      }
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const verifyManual = () => {
    if (pin === correctPin) {
      triggerSuccess();
    } else {
      triggerFailure();
    }
  };

  const triggerSuccess = () => {
    setShuttleMessage(language === 'ar' ? 'تم التصريح بالدخول ... جاري تهيئة الواجهة' : 'AUTHORIZED ACCESS ... INITIALIZING WORKSPACE');
    setTimeout(() => {
      onUnlock();
      setPin('');
      setErrorCount(0);
      setShuttleMessage('');
    }, 900);
  };

  const triggerFailure = () => {
    setAnimatingError(true);
    setErrorCount(prev => prev + 1);
    setPin('');
    setTimeout(() => {
      setAnimatingError(false);
    }, 600);
  };

  const handleCreatePin = () => {
    if (newPinTentative.length >= 4) {
      onSetNewPin(newPinTentative);
      setIsSettingMode(false);
      setNewPinTentative('');
      onUnlock();
    }
  };

  const simulateBiometric = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      triggerSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/95 grid-bg overflow-y-auto">
      <div 
        className={`w-full max-w-md p-8 rounded-3xl glass-panel border border-[rgba(6,182,212,0.3)] shadow-[0_0_60px_rgba(6,182,212,0.15)] text-center transition-all duration-300 ${
          animatingError ? 'border-red-500 animate-bounce' : ''
        }`}
      >
        {/* TOP COHESIVE SECURE SHIELD */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`p-4 rounded-full bg-slate-900 border ${
              errorCount > 0 ? 'border-red-500/40 text-red-400' : 'border-cyan-500/30 text-cyan-400'
            }`}>
              {biometricScanning ? (
                <Fingerprint className="w-10 h-10 animate-pulse text-cyan-400" />
              ) : isSettingMode ? (
                <KeyRound className="w-10 h-10 text-purple-400" />
              ) : (
                <Lock className="w-10 h-10" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 text-[9px] text-cyan-400">
              OK
            </div>
          </div>
        </div>

        {/* SET NEW PIN MODE */}
        {isSettingMode ? (
          <div>
            <h2 className="font-sans text-xl font-bold text-white tracking-widest mb-1">
              {t.setupPin}
            </h2>
            <p className="font-mono text-xs text-slate-400 mb-6">
              {language === 'ar' 
                ? 'الرجاء تعيين رمز مرور رقمي مكون من 4 إلى 6 أرقام لتشفير بياناتك.' 
                : 'Configure a secure 4 to 6 digit numerical PIN to authorize actions local-first.'}
            </p>

            <div className="mb-6">
              <input
                type="password"
                maxLength={6}
                value={newPinTentative}
                onChange={(e) => setNewPinTentative(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-2xl font-bold bg-slate-950/80 border border-purple-500/20 text-purple-400 p-3.5 rounded-xl outline-none focus:border-purple-400"
              />
            </div>

            <button
              onClick={handleCreatePin}
              disabled={newPinTentative.length < 4}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-sm tracking-widest rounded-xl transition-all font-bold disabled:opacity-40"
            >
              {language === 'ar' ? 'تهيئة النظام المحلي' : 'PROVISION ENCRYPTED REPO'}
            </button>
          </div>
        ) : (
          /* STANDARD UNLOCK MODE */
          <div>
            <h2 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-widest uppercase mb-1">
              {t.systemLocked}
            </h2>
            <p className="font-mono text-[10px] uppercase text-cyan-400/80 tracking-widest mb-4">
              {language === 'ar' ? 'مطلوب مصادقة الأجهزة' : 'SECURE DEVICE AUTHENTICATION REQUIRED'}
            </p>

            {/* DOTS / PIN VISUALIZER */}
            <div className="flex justify-center gap-3.5 my-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                    idx < pin.length
                      ? showPin 
                        ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center'
                        : 'bg-cyan-400 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                      : 'bg-slate-950 border-slate-700'
                  }`}
                >
                  {idx < pin.length && showPin ? pin[idx] : null}
                </div>
              ))}
            </div>

            {/* MESSAGE INDICATORS */}
            {shuttleMessage ? (
              <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 py-2.5 rounded-lg mb-4 animate-pulse">
                {shuttleMessage}
              </div>
            ) : errorCount > 0 ? (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/30 py-2.5 rounded-lg mb-4">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{t.incorrectPin} ({errorCount})</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-500 mb-4 h-5">
                {language === 'ar' ? 'رمز فك الحماية الافتراضي: 1234' : 'Default bypass code: 1234'}
              </div>
            )}

            {/* HIGH-END APPLE-STYLE GLASS GRAPHICAL KEYPAD */}
            <div className="grid grid-cols-3 gap-3.5 mb-6 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit)}
                  className="w-14 h-14 rounded-full bg-slate-900/60 hover:bg-slate-800/80 active:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 text-white font-sans text-xl font-medium transition-all duration-150 flex items-center justify-center max-sm:mx-auto"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="w-14 h-14 rounded-full bg-slate-950 text-slate-400 hover:text-white text-xs font-mono transition-colors flex items-center justify-center max-sm:mx-auto"
              >
                {language === 'ar' ? 'مسح' : 'CLEAR'}
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="w-14 h-14 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-white font-sans text-xl font-medium transition-all flex items-center justify-center max-sm:mx-auto"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="w-14 h-14 rounded-full bg-slate-950 text-slate-400 hover:text-white text-xs font-mono transition-colors flex items-center justify-center max-sm:mx-auto"
              >
                ⌫
              </button>
            </div>

            {/* FLOATING CONTROL ACTIONS */}
            <div className="flex justify-between items-center px-4 pt-3 border-t border-white/5 text-xs text-slate-400 font-mono">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1.5 hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? (language === 'ar' ? 'إخفاء' : 'HIDE') : (language === 'ar' ? 'إظهار' : 'SHOW')}</span>
              </button>

              <button
                onClick={verifyManual}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
              >
                <span>{language === 'ar' ? 'دخول' : 'ENTER'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* BIOMETRIC SIMULATOR ACCELERATOR */}
            <button
              onClick={simulateBiometric}
              disabled={biometricScanning}
              className="mt-6 w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 border border-cyan-400/20 text-cyan-400 font-mono text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4 animate-pulse text-cyan-400" />
              <span>
                {biometricScanning 
                  ? (language === 'ar' ? 'جاري التحقق من الهوية...' : 'SCANNING BIOMETRICS...') 
                  : (language === 'ar' ? 'محاكاة بصمة الإصبع' : 'SIMULATE ACCREDITED KEY')}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
