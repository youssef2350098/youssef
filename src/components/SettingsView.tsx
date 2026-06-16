/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, Globe2, RefreshCw, Smartphone, Key, DollarSign, 
  ArrowRightLeft, TrendingUp, ShieldCheck, Check, Info, Coins, Languages, Paintbrush
} from 'lucide-react';
import { Language, AppTheme } from '../types';

interface SettingsViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  selectedCurrency: 'USD' | 'EUR' | 'MAD';
  onCurrencyChange: (curr: 'USD' | 'EUR' | 'MAD') => void;
  pinCode: string;
  onUpdatePin: (newPin: string) => void;
  onFactoryReset: () => void;
  onPlaySound: (type?: 'click' | 'success' | 'warn') => void;
}

export function SettingsView({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  selectedCurrency,
  onCurrencyChange,
  pinCode,
  onUpdatePin,
  onFactoryReset,
  onPlaySound
}: SettingsViewProps) {
  const isAr = language === 'ar';

  // --- Exchange rates state ---
  // Default values
  // 1 USD = 10.02 MAD
  // 1 EUR = 10.85 MAD
  // Derived: 1 EUR = (10.85 / 10.02) USD = 1.0828 USD
  const [rateUsdToMad, setRateUsdToMad] = useState<number>(10.02);
  const [rateEurToMad, setRateEurToMad] = useState<number>(10.85);

  // Read saved rates on mount if appropriate
  useEffect(() => {
    const savedUsdRate = localStorage.getItem('rate_usd_to_mad');
    const savedEurRate = localStorage.getItem('rate_eur_to_mad');
    if (savedUsdRate) setRateUsdToMad(parseFloat(savedUsdRate));
    if (savedEurRate) setRateEurToMad(parseFloat(savedEurRate));
  }, []);

  const handleRateChange = (type: 'usd' | 'eur', val: number) => {
    if (val <= 0 || isNaN(val)) return;
    if (type === 'usd') {
      setRateUsdToMad(val);
      localStorage.setItem('rate_usd_to_mad', val.toString());
    } else {
      setRateEurToMad(val);
      localStorage.setItem('rate_eur_to_mad', val.toString());
    }
  };

  // --- Synchronized Converter Inputs ---
  const [usdVal, setUsdVal] = useState<string>('100');
  const [eurVal, setEurVal] = useState<string>('');
  const [madVal, setMadVal] = useState<string>('');

  // Sync calculations on changes
  // Formula structures:
  // MAD = USD * rateUsdToMad
  // MAD = EUR * rateEurToMad
  // USD = MAD / rateUsdToMad
  // EUR = MAD / rateEurToMad
  // USD = EUR * (rateEurToMad / rateUsdToMad)
  // EUR = USD * (rateUsdToMad / rateEurToMad)

  const handleConvertInput = (source: 'USD' | 'EUR' | 'MAD', valueString: string) => {
    if (valueString === '') {
      if (source === 'USD') {
        setUsdVal('');
        setEurVal('');
        setMadVal('');
      } else if (source === 'EUR') {
        setUsdVal('');
        setEurVal('');
        setMadVal('');
      } else {
        setUsdVal('');
        setEurVal('');
        setMadVal('');
      }
      return;
    }

    const valueNum = parseFloat(valueString);
    if (isNaN(valueNum)) {
      if (source === 'USD') setUsdVal(valueString);
      if (source === 'EUR') setEurVal(valueString);
      if (source === 'MAD') setMadVal(valueString);
      return;
    }

    if (source === 'USD') {
      setUsdVal(valueString);
      const convertedMad = valueNum * rateUsdToMad;
      const convertedEur = convertedMad / rateEurToMad;
      setMadVal(convertedMad.toFixed(2));
      setEurVal(convertedEur.toFixed(2));
    } else if (source === 'EUR') {
      setEurVal(valueString);
      const convertedMad = valueNum * rateEurToMad;
      const convertedUsd = convertedMad / rateUsdToMad;
      setMadVal(convertedMad.toFixed(2));
      setUsdVal(convertedUsd.toFixed(2));
    } else if (source === 'MAD') {
      setMadVal(valueString);
      const convertedUsd = valueNum / rateUsdToMad;
      const convertedEur = valueNum / rateEurToMad;
      setUsdVal(convertedUsd.toFixed(2));
      setEurVal(convertedEur.toFixed(2));
    }
  };

  // Recalculate if rates change
  useEffect(() => {
    const valueNum = parseFloat(usdVal);
    if (!isNaN(valueNum)) {
      const convertedMad = valueNum * rateUsdToMad;
      const convertedEur = convertedMad / rateEurToMad;
      setMadVal(convertedMad.toFixed(2));
      setEurVal(convertedEur.toFixed(2));
    }
  }, [rateUsdToMad, rateEurToMad]);

  // --- PIN Manager State ---
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  const submitNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinMessage(isAr ? 'يجب أن يتكون رمز المرور من 4 أرقام على الأقل!' : 'PIN must be at least 4 digits!');
      onPlaySound('warn');
      return;
    }
    onUpdatePin(newPin);
    setPinMessage(isAr ? 'تم تحديث رمز المرور بنجاح!' : 'Security PIN updated successfully!');
    setNewPin('');
    onPlaySound('success');
    setTimeout(() => setPinMessage(''), 3000);
  };

  // --- Factory Reset Warnings ---
  const [showResetWarning, setShowResetWarning] = useState(false);

  const performWipe = () => {
    onPlaySound('warn');
    onFactoryReset();
    setShowResetWarning(false);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-wrap justify-between items-center bg-slate-900/40 p-4.5 rounded-2xl border border-white/5 gap-3">
        <div className="text-left">
          <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400 animate-spin-slow" />
            <span>{isAr ? 'تفضيلات نظام تشغيل القيادة الكلي' : 'SYSTEM PREFERENCES & CALIBRATION'}</span>
          </h3>
          <p className="font-mono text-[9px] text-slate-500 uppercase">
            {isAr ? 'إجراء تعديلات على لغة الواجهة ومحاسبة العملات والسمة ونظام الحماية' : 'Configure display localizations, active currency parameters, styles, and master security sets'}
          </p>
        </div>
        
        {/* Status indicator */}
        <div className="py-1 px-3 bg-emerald-950/40 text-emerald-400 font-mono text-[9px] border border-emerald-500/15 rounded-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SYSTEM ONLINE • SECURE</span>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT TWO COLUMNS: CURRENCY CONVERTER & THEMES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CURRENCY CONVERSION AND CALIBRATION GLASS CONTROL */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/5 space-y-5 text-left font-mono">
            
            {/* Header sub */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-cyan-400" />
                <h4 className="font-sans font-bold text-xs uppercase text-white tracking-wider">
                  {isAr ? 'صراف العملات التفاعلي والأسعار' : 'Multi-Currency Conversion Engine'}
                </h4>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />
            </div>

            {/* Rate Calibration Inputs */}
            <div className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-3.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحديث أسعار الصرف الحية مقابل الدرهم المغربي (MAD)' : 'Calibrate Base Rates Against Moroccan Dirham (MAD)'}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* USD Rate Input */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 USD ({isAr ? 'دولار' : 'Dollar'}) =</span>
                    <span className="text-cyan-400 font-bold">MAD</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      value={rateUsdToMad}
                      onChange={(e) => handleRateChange('usd', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-white font-bold pl-8"
                    />
                    <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-500 font-bold">$</span>
                  </div>
                </div>

                {/* EUR Rate Input */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">1 EUR ({isAr ? 'يورو' : 'Euro'}) =</span>
                    <span className="text-cyan-400 font-bold">MAD</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      value={rateEurToMad}
                      onChange={(e) => handleRateChange('eur', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 p-2 rounded-lg text-white font-bold pl-8"
                    />
                    <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-500 font-bold">€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time sync Calculator */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                {isAr ? 'حاسبة المحول الفوري المتزامن (تحديث تبادلي)' : 'Live Interactive Cross-Currency Calculator'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* USD Box */}
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5 text-center">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    {isAr ? 'القيمة بالدولار الأمريكي' : 'Value in US Dollars'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 font-bold">$</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={usdVal}
                      onChange={(e) => handleConvertInput('USD', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 p-2.5 pl-7 rounded-lg text-white text-center font-bold text-sm"
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold mt-1.5 block">USD / $</span>
                </div>

                {/* EUR Box */}
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5 text-center">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    {isAr ? 'القيمة باليورو الأوروبي' : 'Value in Euros'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 font-bold">€</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={eurVal}
                      onChange={(e) => handleConvertInput('EUR', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 p-2.5 pl-7 rounded-lg text-white text-center font-bold text-sm"
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold mt-1.5 block">EUR / €</span>
                </div>

                {/* MAD Box */}
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5 text-center">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    {isAr ? 'القيمة بالدرهم المغربي' : 'Value in Moroccan Dirham'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 font-bold font-sans">DH</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={madVal}
                      onChange={(e) => handleConvertInput('MAD', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 p-2.5 pl-10 rounded-lg text-white text-center font-bold text-sm"
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 font-bold mt-1.5 block">MAD / د.م.</span>
                </div>
              </div>
            </div>

            {/* Global Preference setting for accounting displays */}
            <div className="pt-4 border-t border-white/5">
              <label className="text-[9px] text-slate-400 block uppercase font-bold mb-2">
                {isAr ? 'تحديد العملة الافتراضية لعرض الإيرادات وحسابات الأرباح بالمنصة:' : 'Select Default Display Currency for Enterprise Portals:'}
              </label>
              
              <div className="flex gap-2.5">
                {[
                  { code: 'USD', symbol: '$', name: isAr ? 'دولار أمريكي' : 'US Dollar' },
                  { code: 'EUR', symbol: '€', name: isAr ? 'يورو أوروبي' : 'Euro' },
                  { code: 'MAD', symbol: 'MAD', name: isAr ? 'درهم مغربي' : 'Moroccan Dirham' }
                ].map(curr => {
                  const isSelected = selectedCurrency === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => { onCurrencyChange(curr.code as any); onPlaySound('success'); }}
                      className={`flex-1 p-2.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-purple-950/40 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-100">{curr.symbol}</span>
                      <span className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase">{curr.code}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-900/30 p-2.5 mt-3 rounded-lg border border-white/5 text-[10px] text-slate-500 leading-relaxed text-center">
                {isAr 
                  ? 'سيتم تحويل إجمالي الأرباح وإحصاءات المقبوضات بمركز التشغيل ديناميكياً بناءً على العملة المفضلة وأسعار الصرف المقررة.' 
                  : 'Platform statistics, profitability indicators, and dashboard numbers will recalibrate dynamically using your active conversion rate overrides.'}
              </div>
            </div>

          </div>

          {/* APP STYLING AND GRAPHIC ENGINES */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4 text-left font-mono">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Paintbrush className="w-5 h-5 text-purple-400" />
              <h4 className="font-sans font-bold text-xs uppercase text-white tracking-wider">
                {isAr ? 'محرك المظهر والسمات البصرية' : 'Glassmorphism Style Engines'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'glass', title: isAr ? 'زجاج آبل الصافي' : 'Vision Pro Glass', desc: isAr ? 'شفافية طافية أنيقة' : 'Pure translucent premium layout' },
                { id: 'cyber', title: isAr ? 'الوهج السيبراني الأرجواني' : 'Cybernetic Purple', desc: isAr ? 'ألوان غامقة ونبض نيون' : 'Aesthetic violet and dark spaces' },
                { id: 'neon', title: isAr ? 'شبكة تسلا النيون' : 'Tesla Neon Grid', desc: isAr ? 'مستقبلية عالية التباين' : 'Glowing cyan grids with dark borders' }
              ].map(th => {
                const isSelected = theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => { onThemeChange(th.id as any); onPlaySound('success'); }}
                    className={`p-3.5 rounded-xl border font-mono text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                        : 'bg-black/35 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-100 block">{th.title}</span>
                    <span className="text-[8px] text-slate-500 font-bold block mt-1 tracking-tighter leading-snug">{th.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LOCALIZATION, SECURITY PIN, AND REFACTOR COMMANDS */}
        <div className="space-y-6">

          {/* LOCALIZATION & LANGUAGE CONSOLE */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4 text-left font-mono">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Languages className="w-5 h-5 text-emerald-400" />
              <h4 className="font-sans font-bold text-xs uppercase text-white tracking-wider">
                {isAr ? 'توطين اللغة والتوجيه' : 'Language Localization'}
              </h4>
            </div>

            <div className="space-y-2.5">
              {[
                { code: 'ar', label: 'العربية (RTL) • Premium Arabic Style' },
                { code: 'en', label: 'English (LTR) • Western Layout Direction' }
              ].map(ln => {
                const isSelected = language === ln.code;
                return (
                  <button
                    key={ln.code}
                    onClick={() => { onLanguageChange(ln.code as any); onPlaySound('success'); }}
                    className={`w-full p-2.5 rounded-lg border text-[11px] font-bold text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/45 text-emerald-300'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-100 hover:border-white/10'
                    }`}
                  >
                    <span>{ln.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECURITY PIN MANAGEMENT BOX */}
          <form onSubmit={submitNewPin} className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4 text-left font-mono">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Key className="w-5 h-5 text-amber-500" />
              <h4 className="font-sans font-bold text-xs uppercase text-white tracking-wider">
                {isAr ? 'إدارة رمز المرور الأمني للعمليات' : 'Security Passcode Management'}
              </h4>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              {isAr 
                ? 'قم بتهيئة رمز مرور PIN مخصص لتأمين الحسابات أو حماية النظام من التصفير غير المصرح به.' 
                : 'Modify your system 4-digit master passcode used to authorize administrative changes and wipes.'}
            </p>

            <div className="space-y-2">
              <label className="text-[9px] text-slate-400 block font-bold">{isAr ? 'رمز المرور الماجستير الجديد *' : 'Enter New PIN Code *'}</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="e.g. 0582"
                  maxLength={12}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white tracking-widest font-sans text-xs"
                />
              </div>
            </div>

            {pinMessage && (
              <div className="p-2 rounded bg-amber-950/20 text-amber-400 border border-amber-500/20 text-[10px] text-center font-bold">
                {pinMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-xs font-bold transition-all"
            >
              {isAr ? 'تحديث وتطبيق الرمز' : 'Apply Security PIN'}
            </button>
          </form>

          {/* FACTORY WIPE CONTAINER */}
          <div className="p-5 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-4 text-left font-mono">
            <div className="flex items-center gap-2 border-b border-rose-500/10 pb-3">
              <RefreshCw className="w-5 h-5 text-rose-500 animate-spin-slow" />
              <h4 className="font-sans font-bold text-xs uppercase text-rose-400 tracking-wider">
                {isAr ? 'تبييض قاعدة البيانات بالكامل' : 'Factory Data Purge'}
              </h4>
            </div>

            <p className="text-[10px] text-rose-300/70 leading-relaxed">
              {isAr 
                ? 'تحذير: سيقوم هذا الإجراء بمسح جميع بيانات الأرباح والعملاء والمهام الفردية المسجلة وإعادة ضبط الأوبن-سورس إلى تصفير الشركة.' 
                : 'Warning: This resets your database and mocks to default values. Existing custom records, CRM files, and tailoring logs will be permanently deleted.'}
            </p>

            {showResetWarning ? (
              <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-3">
                <span className="text-[9px] text-rose-400 font-bold block text-center">
                  {isAr ? 'هل أنت متأكد تماماً من تبييض النظام؟' : 'ARE YOU ABSOLUTELY SURE?'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetWarning(false)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] transition-colors"
                  >
                    {isAr ? 'خلّيك' : 'Cancel'}
                  </button>
                  <button
                    onClick={performWipe}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[10px] transition-colors"
                  >
                    {isAr ? 'نعم، مسح كلي' : 'Yes, Purge Now'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setShowResetWarning(true); onPlaySound('warn'); }}
                className="w-full py-2 bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-lg text-xs font-bold transition-all"
              >
                {isAr ? 'إعادة ضبط الشركة بالكامل' : 'Erase All Database Cash'}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
