/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Percent, TrendingUp, Scissors, Users, PlaySquare, 
  Settings, DollarSign, ArrowUpRight, ArrowDownRight, Search, Plus, 
  Trash2, ShieldCheck, RefreshCw, LogOut, Lock, Globe2, Target, Database
} from 'lucide-react';

import { Language, AppTheme, TRANSLATIONS, Revenue, Expense, Client, SewingPattern, Goal, ContentItem, ServiceItem, Investment, Task } from './types';
import { DB } from './dbMock';
import { ThreeHQ } from './components/ThreeHQ';
import { BrandLogo3D } from './components/BrandLogo3D';
import { PinLock } from './components/PinLock';
import { playSynthBeep } from './components/AudioSynthesizer';

// Modular Child Views
import { DashboardView } from './components/DashboardView';
import { SewingPatternsView } from './components/SewingPatternsView';
import { CRMView } from './components/CRMView';
import { ContentAndGoalsView } from './components/ContentAndGoalsView';
import { BackupsAndReportsView } from './components/BackupsAndReportsView';
import { InvestmentsView } from './components/InvestmentsView';
import { GoalsAndTasksView } from './components/GoalsAndTasksView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [currentUserLang, setCurrentUserLang] = useState<Language>('ar'); // default to Arabic for premium feel, can switch instantly
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('glass');
  const [activeModule, setActiveModule] = useState<string>('3dhq'); // '3dhq' is the interactive 3D command center!
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Clock state
  const [currentTimeText, setCurrentTimeText] = useState<string>('');
  
  // Database states
  const [stats, setStats] = useState(DB.getStats());
  const [revenues, setRevenues] = useState<Revenue[]>(DB.revenues);
  const [expenses, setExpenses] = useState<Expense[]>(DB.expenses);
  const [investments, setInvestments] = useState(DB.investments);
  const [clients, setClients] = useState<Client[]>(DB.clients);
  const [services, setServices] = useState<ServiceItem[]>(DB.services);
  const [projects, setProjects] = useState(DB.projects);
  const [content, setContent] = useState<ContentItem[]>(DB.content);
  const [patterns, setPatterns] = useState<SewingPattern[]>(DB.patterns);
  const [goals, setGoals] = useState<Goal[]>(DB.goals);
  const [tasks, setTasks] = useState<Task[]>(DB.tasks);
  const [social, setSocial] = useState(DB.social);
  const [backups, setBackups] = useState(DB.backups);
  const [pinCode, setPinCode] = useState<string>(DB.pinCode);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'MAD'>('USD');

  // CRUD Modal states
  const [isAddingRev, setIsAddingRev] = useState(false);
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Revenue Form input
  const [revTitle, setRevTitle] = useState('');
  const [revAmount, setRevAmount] = useState(150);
  const [revCategory, setRevCategory] = useState('Pattern Licensing');
  const [revNotes, setRevNotes] = useState('');

  // Expense Form input
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState(85);
  const [expCategory, setExpCategory] = useState('Sewing Materials');
  const [expSupplier, setExpSupplier] = useState('');
  const [expNotes, setExpNotes] = useState('');

  // Sync clock time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeText(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync language visual preference
  useEffect(() => {
    document.documentElement.dir = currentUserLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentUserLang;
  }, [currentUserLang]);

  // Load state from DB Core on init
  useEffect(() => {
    setCurrentUserLang(DB.language);
    setCurrentTheme(DB.theme as any);
    const savedCurrency = localStorage.getItem('default_display_currency') as 'USD' | 'EUR' | 'MAD' | null;
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const handleCurrencyChange = (curr: 'USD' | 'EUR' | 'MAD') => {
    setSelectedCurrency(curr);
    localStorage.setItem('default_display_currency', curr);
  };

  const formatValue = (usdAmount: number) => {
    const rateUsdToMad = parseFloat(localStorage.getItem('rate_usd_to_mad') || '10.02');
    const rateEurToMad = parseFloat(localStorage.getItem('rate_eur_to_mad') || '10.85');
    
    if (selectedCurrency === 'MAD') {
      const converted = usdAmount * rateUsdToMad;
      return `${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} MAD`;
    } else if (selectedCurrency === 'EUR') {
      const converted = usdAmount * (rateUsdToMad / rateEurToMad);
      return `€${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    } else {
      return `$${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    }
  };

  const triggerPlaySound = (type: 'click' | 'success' | 'warn' | 'lock' = 'click') => {
    playSynthBeep(type);
  };

  // Switch Languages
  const toggleLanguage = () => {
    const nextLang: Language = currentUserLang === 'ar' ? 'en' : 'ar';
    setCurrentUserLang(nextLang);
    DB.language = nextLang;
    DB.commitToStorage();
    triggerPlaySound('click');
  };

  // Lock Application Action
  const handleLockConsole = () => {
    setIsLocked(true);
    triggerPlaySound('lock');
  };

  const handleUnlockConsole = () => {
    setIsLocked(false);
    triggerPlaySound('success');
  };

  const handleUpdatePin = (newPin: string) => {
    DB.pinCode = newPin;
    setPinCode(newPin);
    DB.commitToStorage();
    triggerPlaySound('success');
  };

  // Switch Themes
  const handleThemeChange = (theme: AppTheme) => {
    setCurrentTheme(theme);
    DB.theme = theme;
    DB.commitToStorage();
    triggerPlaySound('click');
  };

  // --- REVENUE CRUD ---
  const handleSaveRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle || revAmount <= 0) return;

    DB.addRevenue({
      title: revTitle,
      amount: revAmount,
      category: revCategory,
      date: new Date().toISOString().substring(0, 10),
      notes: revNotes
    });

    // Refresh states and shut modal
    setRevenues([...DB.revenues]);
    setStats(DB.getStats());
    setRevTitle('');
    setRevNotes('');
    setIsAddingRev(false);
    triggerPlaySound('success');
  };

  const handleDeleteRevenue = (id: string) => {
    DB.deleteRevenue(id);
    setRevenues([...DB.revenues]);
    setStats(DB.getStats());
    triggerPlaySound('warn');
  };

  // --- EXPENSE CRUD ---
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName || expAmount <= 0) return;

    DB.addExpense({
      title: expName, // maps internally or title / name interchangeable
      name: expName,
      amount: expAmount,
      category: expCategory,
      date: new Date().toISOString().substring(0, 10),
      supplier: expSupplier,
      notes: expNotes
    } as any);

    setExpenses([...DB.expenses]);
    setStats(DB.getStats());
    setExpName('');
    setExpSupplier('');
    setExpNotes('');
    setIsAddingExp(false);
    triggerPlaySound('success');
  };

  const handleDeleteExpense = (id: string) => {
    DB.deleteExpense(id);
    setExpenses([...DB.expenses]);
    setStats(DB.getStats());
    triggerPlaySound('warn');
  };

  // --- RESET DATABASE ---
  const handleResetDBCommand = () => {
    if (window.confirm(currentUserLang === 'ar' ? 'هل أنت متأكد من شطب وتهيئة قاعدة البيانات كاملة؟' : 'Are you sure you want to restore the entire operating database to defaults?')) {
      DB.forceResetToDefault();
      window.location.reload();
    }
  };

  // Translate lookup helper
  const t = TRANSLATIONS[currentUserLang];
  const isAr = currentUserLang === 'ar';

  // Search filtering logic
  const filteredRevenues = revenues.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenses.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen grid-bg transition-colors duration-300 ${
      currentTheme === 'cyber' ? 'bg-[#0b031c]/60' : currentTheme === 'neon' ? 'bg-[#020a0f]/60' : 'bg-transparent'
    }`}>
      
      {/* FULL WRAPPER EMBRACING APPLE VISION PRO & TESLA HYBRID DESKTOP SHELL */}
      <div className="max-w-7xl mx-auto p-3 sm:p-5 flex flex-col min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden">
        
        {/* PREMIUM SIMULATED WINDOW HEADPLATE HEADER WITH TELEMETRY */}
        <header className="flex flex-wrap justify-between items-center bg-slate-950/75 backdrop-blur-xl border border-white/5 rounded-2xl p-4 mb-4 gap-3 shrink-0">
          
          {/* WINDOW DECALS MOCKUP (TESLA / ELECTRON LOOK) */}
          <div className="flex items-center gap-3">
            {/* Round dot lights */}
            <div className="flex gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
            </div>

            <div className={`border-r border-white/10 ${isAr ? 'mr-1 ml-3' : 'ml-1 mr-3'} h-5 hidden sm:block`} />

            {/* Glowing Brand Logo element built dynamically */}
            <div className="scale-75 sm:scale-90 md:scale-95 transition-all">
              <BrandLogo3D size="sm" interactiveControls={false} onPlaySound={triggerPlaySound} language={currentUserLang} />
            </div>

            <div className="text-left leading-tight header-dir">
              <h1 className="font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-300 text-sm sm:text-lg tracking-widest flex items-center gap-2">
                {t.appTitle}
                <span className="animate-pulse bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded tracking-tighter">OFFICIAL</span>
              </h1>
              <p className="font-mono text-[9px] text-slate-400 tracking-wider hidden xs:block">
                THE FASHION & SEWING ENTERPRISE COMMANDER v3.5
              </p>
            </div>
          </div>

          {/* TELEMETRY DIGITAL SYSTEM CLOCK */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Live UTC time */}
            <div className="bg-[#030712]/90 border border-white/5 px-3 py-1.5 rounded-lg text-cyan-400/90 hidden md:block text-[10px] tracking-widest text-shadow">
              SYSTEM_SECURE_CLOCK // <span className="font-bold text-white">{currentTimeText}</span>
            </div>

            {/* Language Switch button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all cursor-pointer text-[11px]"
              title="Switch language directionality"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'English (LTR)' : 'العربية (RTL)'}</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE MIDDLE STAGE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0 pb-1">
          
          {/* QUICK CHANNELS CONTROL NAVIGATION (SIDEBAR) */}
          <aside className="lg:col-span-1 p-4 rounded-2xl bg-slate-950/65 backdrop-blur-xl border border-white/5 flex flex-col justify-between space-y-4 lg:h-full lg:overflow-y-auto">
            
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-mono uppercase text-purple-400 tracking-widest pl-1">
                  {isAr ? 'وحدات المنظومة النشطة' : 'WORKSPACE ENVIRONMENT'}
                </span>
                <div className="h-0.5 bg-gradient-to-r from-purple-500/30 to-transparent mt-1" />
              </div>

              {/* NAVIGATION BUTTONS CATALOG */}
              <nav className="space-y-1.5">
                {[
                  { id: '3dhq', label: isAr ? 'مركز قيادة ثلاثي الأبعاد' : '3D Command HQ', icon: Building2 },
                  { id: 'dashboard', label: t.dashboard, icon: Percent },
                  { id: 'revenue', label: t.revenue, icon: ArrowUpRight },
                  { id: 'expenses', label: t.expenses, icon: ArrowDownRight },
                  { id: 'investments', label: isAr ? 'الاستثمارات والمالية' : 'Investments & Finance', icon: TrendingUp },
                  { id: 'patterns', label: t.patterns, icon: Scissors },
                  { id: 'clients', label: t.clients, icon: Users },
                  { id: 'content', label: isAr ? 'السيناريو المحتوى' : 'Content & Scripts', icon: PlaySquare },
                  { id: 'goals-tasks', label: isAr ? 'الأهداف وسجل المهام' : 'Goals & Task Log', icon: Target },
                  { id: 'backups', label: isAr ? 'النسخ والتقارير' : 'Backups & Reports', icon: Database },
                  { id: 'settings', label: isAr ? 'الإعدادات والعملة' : 'System & Currency', icon: Settings },
                ].map(mod => {
                  const Icon = mod.icon;
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => { setActiveModule(mod.id); triggerPlaySound('click'); }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border text-xs font-mono transition-all duration-200 outline-none ${
                        isActive 
                          ? 'bg-purple-950/25 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.1)]' 
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                        <span>{mod.label}</span>
                      </div>
                      
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SEWING EDUCATION CONNOTATIVE STATUS FOOTER */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between text-[10px]">
                <span>{isAr ? 'سجل الباتورنات' : 'Pattern Catalog'}</span>
                <span className="text-white font-bold">{stats.patternCount}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>{isAr ? 'الأهداف المنجزة' : 'Goals Finished'}</span>
                <span className="text-emerald-400 font-bold">{stats.goalsAchieved} / {stats.goalsTotal}</span>
              </div>
              
              <div className="border-t border-white/5 pt-2 flex justify-between gap-1 text-[9px]">
                <button 
                  onClick={handleResetDBCommand}
                  className="hover:text-red-400 cursor-pointer text-slate-500 uppercase flex items-center gap-1"
                  title="Wipe database cache clean"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isAr ? 'تصفير وعياري' : 'FACTORY WIPE'}</span>
                </button>
                <span className="text-cyan-400">OFFLINE SECURE</span>
              </div>
            </div>

          </aside>

          {/* ACTIVE SCREEN WORK ENVIRONMENT PANEL */}
          <main className="lg:col-span-3 p-4 sm:p-6 rounded-2xl bg-slate-950/65 backdrop-blur-xl border border-white/5 overflow-y-auto h-auto lg:h-full lg:max-h-full">
            
            {/* DYNAMIC COMPONENT SHIFT ROUTER */}
            {activeModule === '3dhq' && (
              <div className="space-y-4">
                <ThreeHQ
                  stats={stats}
                  language={currentUserLang}
                  onSelectModule={(id) => {
                    setActiveModule(id);
                    triggerPlaySound('click');
                  }}
                  revenues={revenues}
                  expenses={expenses}
                  clients={clients}
                  services={services}
                  goals={goals}
                  tasks={tasks}
                  selectedCurrency={selectedCurrency}
                  onPlaySound={triggerPlaySound}
                />
              </div>
            )}

            {activeModule === 'dashboard' && (
              <DashboardView
                language={currentUserLang}
                stats={stats}
                revenues={revenues}
                expenses={expenses}
                investments={investments}
                social={social}
                selectedCurrency={selectedCurrency}
              />
            )}

            {/* REVENUE CRUD SCREEN */}
            {activeModule === 'revenue' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-white/5 gap-2">
                  <div>
                    <h3 className="font-sans font-bold text-sm text-white">
                      {isAr ? 'مسجل المقبوضات وصافي التدفقات' : 'INCOME AND REVENUE LEDGER DATABASE'}
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 uppercase">
                      {isAr ? 'قائمة المبيعات والنسب الإيرادية المتراكمة' : 'COMPREHENSIVE LEDGER CREDITS WITH FILTERS'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Search frame */}
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAr ? 'ابحث هنا...' : 'Search logs...'}
                        className="bg-slate-950 border border-white/10 p-1.5 pl-7 rounded-lg text-white font-mono text-[11px] w-28 sm:w-40 focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => { setIsAddingRev(true); triggerPlaySound('click'); }}
                      className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تسجيل إيراد' : 'Add Inflow'}</span>
                    </button>
                  </div>
                </div>

                {isAddingRev && (
                  <form onSubmit={handleSaveRevenue} className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3 font-mono text-xs text-left">
                    <h4 className="font-sans font-bold text-cyan-400 uppercase text-[11px] pb-1 border-b border-white/5 text-shadow">
                      {isAr ? 'حساب إيراد محلي جديد' : 'REGISTER DETAILED TRANSACTION INFLOW'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'عنوان العملية' : 'Transaction Reference'}</label>
                        <input
                          type="text"
                          required
                          value={revTitle}
                          onChange={(e) => setRevTitle(e.target.value)}
                          placeholder="e.g. Caftan Course Dubai Sales"
                          className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'قيمة المبلغ بالدولار' : 'Amount ($)'}</label>
                        <input
                          type="number"
                          required
                          value={revAmount}
                          onChange={(e) => setRevAmount(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'التصنيف' : 'Ledger Category'}</label>
                        <select
                          value={revCategory}
                          onChange={(e) => setRevCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white outline-none"
                        >
                          <option value="Online Courses">{isAr ? 'دورات عبر الإنترنت' : 'Online Courses'}</option>
                          <option value="3D Cartoon Videos">{isAr ? 'فيديوهات كرتون ثلاثية الأبعاد' : '3D Cartoon Videos'}</option>
                          <option value="Pattern Licensing">{isAr ? 'ترخيص وتوثيق الباترونات' : 'Pattern Licensing'}</option>
                          <option value="Voice Over">{isAr ? 'التعليق الصوتي والسرد قصصي' : 'Voice Over'}</option>
                          <option value="Sourcing / Materials">{isAr ? 'التوريد واستيراد الأقمشة والخامات' : 'Sourcing / Materials'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? 'بيان وملاحظات الصفقة' : 'Transaction Notes & Attachment Simulation'}</label>
                      <textarea
                        value={revNotes}
                        onChange={(e) => setRevNotes(e.target.value)}
                        rows={2}
                        placeholder={isAr ? 'مثال: شهادة ترخيص قفطان كفتانيا الصادرة للعميل...' : 'Licensing certificate of Caftan Caftania issued to client.'}
                        className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsAddingRev(false)} className="py-1 px-3 border border-white/10 hover:bg-slate-950 rounded text-slate-300">
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="py-1 px-4 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">
                        {isAr ? 'حفظ العملية' : 'Save Inflow'}
                      </button>
                    </div>
                  </form>
                )}

                {/* REVENUE LIST LEDGER */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                        <th className="py-2 px-2">{isAr ? 'البيان' : 'Transaction title'}</th>
                        <th className="py-2 px-2">{isAr ? 'التصنيف' : 'Category'}</th>
                        <th className="py-2 px-2">{isAr ? 'التاريخ' : 'Date'}</th>
                        <th className="py-2 px-2">{isAr ? 'المبلغ الكلي' : 'Total Net'}</th>
                        <th className="py-2 px-2">{isAr ? 'ملاحظات' : 'Annotations'}</th>
                        <th className="py-2 px-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRevenues.map(rev => (
                        <tr key={rev.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-2 text-white font-semibold">{rev.title}</td>
                          <td className="py-2.5 px-2 text-cyan-400">{rev.category}</td>
                          <td className="py-2.5 px-2 text-slate-400 text-[10px]">{rev.date}</td>
                          <td className="py-2.5 px-2 text-emerald-400 font-sans font-bold">{formatValue(rev.amount)}</td>
                          <td className="py-2.5 px-2 text-[11px] text-slate-400 truncate max-w-xs">{rev.notes || '-'}</td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              onClick={() => handleDeleteRevenue(rev.id)}
                              className="p-1 text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 rounded transition-colors"
                              title="Delete inflow record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* EXPENSES CRUD SCREEN */}
            {activeModule === 'expenses' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-white/5 gap-2">
                  <div>
                    <h3 className="font-sans font-bold text-sm text-white">
                      {isAr ? 'مسجل التكاليف ومصاريف الإنتاج' : 'OPERATIONAL OUTFLOWS LEDGER DATABASE'}
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 uppercase">
                      {isAr ? 'قائمة الفواتير وتكاليف إنتاج تصاميم وثري دي' : 'COMPREHENSIVE LEDGER DEBITS WITH SUPPLIERS'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAr ? 'ابحث هنا...' : 'Search logs...'}
                        className="bg-slate-950 border border-white/10 p-1.5 pl-7 rounded-lg text-white font-mono text-[11px] w-28 sm:w-40 focus:border-pink-400 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => { setIsAddingExp(true); triggerPlaySound('click'); }}
                      className="py-1.5 px-3 bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تسجيل مصروف' : 'Add Outflow'}</span>
                    </button>
                  </div>
                </div>

                {isAddingExp && (
                  <form onSubmit={handleSaveExpense} className="p-4 rounded-xl bg-slate-900/80 border border-pink-500/20 space-y-3 font-mono text-xs text-left">
                    <h4 className="font-sans font-bold text-pink-400 uppercase text-[11px] pb-1 border-b border-white/5 text-shadow">
                      {isAr ? 'حساب مصروف محلي تشغيلي جديد' : 'REGISTER OPERATIONAL EXPENSE RECORD'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'البيان الكلي' : 'Expense Title Name'}</label>
                        <input
                          type="text"
                          required
                          value={expName}
                          onChange={(e) => setExpName(e.target.value)}
                          placeholder="e.g. Silk Gold Threading yarns"
                          className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'المبلغ ($)' : 'Amount'}</label>
                        <input
                          type="number"
                          required
                          value={expAmount}
                          onChange={(e) => setExpAmount(Number(e.target.value))}
                          className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'الشركة الموردة' : 'Sourcing Vendor'}</label>
                        <input
                          type="text"
                          value={expSupplier}
                          onChange={(e) => setExpSupplier(e.target.value)}
                          placeholder={isAr ? 'مصنع الحرير بـالدار البيضاء' : 'Casablanca Silk Mill'}
                          className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block">{isAr ? 'التصنيف' : 'Sourcing Category'}</label>
                        <select
                          value={expCategory}
                          onChange={(e) => setExpCategory(e.target.value)}
                          className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white outline-none"
                        >
                          <option value="Sewing Materials">{isAr ? 'خامات وأدوات الخياطة والأقمشة' : 'Sewing Materials'}</option>
                          <option value="Digital Tools">{isAr ? 'خدمات السيرفرات والرندرة الرقمية' : 'Digital Computing'}</option>
                          <option value="Software Subscriptions">{isAr ? 'اشتراكات برمجيات التصميم والتسيير' : 'Software Licences'}</option>
                          <option value="Content Equipment">{isAr ? 'معدات استوديو التصوير والصوت' : 'Studio Cameras & Mics'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block">{isAr ? 'مواصفات العملية وتفاصيل المشتريات' : 'Expense Details & Sourcing comments'}</label>
                      <textarea
                        value={expNotes}
                        onChange={(e) => setExpNotes(e.target.value)}
                        rows={2}
                        placeholder={isAr ? 'تفاصيل كود التحقق من الفاتورة ومستندات الاستلام...' : 'Purchase code verification...'}
                        className="w-full bg-slate-955 border border-white/10 p-2 rounded text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsAddingExp(false)} className="py-1 px-3 border border-white/10 hover:bg-slate-955 rounded text-slate-300">
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="py-1 px-4 bg-pink-600 hover:bg-pink-500 rounded text-white font-bold">
                        {isAr ? 'حفظ المصروف' : 'Save Expense'}
                      </button>
                    </div>
                  </form>
                )}

                {/* EXPENSES LIST LEDGER */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                        <th className="py-2 px-2">{isAr ? 'البيان' : 'Expense Name'}</th>
                        <th className="py-2 px-2">{isAr ? 'المورد' : 'Supplier'}</th>
                        <th className="py-2 px-2">{isAr ? 'التصنيف' : 'Category'}</th>
                        <th className="py-2 px-2">{isAr ? 'التاريخ' : 'Date'}</th>
                        <th className="py-2 px-2">{isAr ? 'المبلغ' : 'Amount'}</th>
                        <th className="py-2 px-2">{isAr ? 'ملاحظات' : 'Notes'}</th>
                        <th className="py-2 px-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map(ex => (
                        <tr key={ex.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-2 text-white font-semibold">{ex.name}</td>
                          <td className="py-2.5 px-2 text-slate-300">{ex.supplier || 'Generic'}</td>
                          <td className="py-2.5 px-2 text-pink-400">{ex.category}</td>
                          <td className="py-2.5 px-2 text-slate-400 text-[10px]">{ex.date}</td>
                          <td className="py-2.5 px-2 text-pink-400 font-sans font-bold">{formatValue(ex.amount)}</td>
                          <td className="py-2.5 px-2 text-[11px] text-slate-400 truncate max-w-xs">{ex.notes || '-'}</td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              onClick={() => handleDeleteExpense(ex.id)}
                              className="p-1 text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 rounded transition-colors"
                              title="Delete outflow record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* INVESTMENTS AND FINANCIAL ACTIVITIES SCREEN */}
            {activeModule === 'investments' && (
              <InvestmentsView
                language={currentUserLang}
                investments={investments}
                onAddInvestment={(item) => {
                  DB.addInvestment(item);
                  setInvestments([...DB.investments]);
                  setStats(DB.getStats());
                }}
                onUpdateInvestment={(item) => {
                  DB.updateInvestment(item);
                  setInvestments([...DB.investments]);
                  setStats(DB.getStats());
                }}
                onDeleteInvestment={(id) => {
                  DB.deleteInvestment(id);
                  setInvestments([...DB.investments]);
                  setStats(DB.getStats());
                }}
                onPlaySound={(type) => triggerPlaySound(type)}
              />
            )}

            {/* SEWING PATTERNS SCREEN */}
            {activeModule === 'patterns' && (
              <SewingPatternsView
                language={currentUserLang}
                patterns={patterns}
                onAddPattern={(item) => {
                  const newId = DB.addPattern(item);
                  setPatterns([...DB.patterns]);
                  setStats(DB.getStats());
                  triggerPlaySound('success');
                }}
                onDeletePattern={(id) => {
                  DB.deletePattern(id);
                  setPatterns([...DB.patterns]);
                  setStats(DB.getStats());
                  triggerPlaySound('warn');
                }}
                onPlaySound={() => triggerPlaySound('click')}
              />
            )}

            {/* CRM SCREEN */}
            {activeModule === 'clients' && (
              <CRMView
                language={currentUserLang}
                clients={clients}
                services={services}
                onAddClient={(item) => {
                  DB.addClient(item);
                  setClients([...DB.clients]);
                  setStats(DB.getStats());
                }}
                onUpdateClient={(item) => {
                  DB.updateClient(item);
                  setClients([...DB.clients]);
                }}
                onDeleteClient={(id) => {
                  DB.deleteClient(id);
                  setClients([...DB.clients]);
                  setStats(DB.getStats());
                }}
                onUpdateService={(item) => {
                  DB.updateService(item);
                  setServices([...DB.services]);
                  setStats(DB.getStats());
                }}
                onPlaySound={() => triggerPlaySound('click')}
              />
            )}

            {/* SCRIPT CONTENT & TARGET GOALS TRACKER SCREEN */}
            {activeModule === 'content' && (
              <ContentAndGoalsView
                language={currentUserLang}
                content={content}
                goals={goals}
                onAddContent={(item) => {
                  DB.addContent(item);
                  setContent([...DB.content]);
                  triggerPlaySound('success');
                }}
                onUpdateContent={(item) => {
                  DB.updateContent(item);
                  setContent([...DB.content]);
                }}
                onDeleteContent={(id) => {
                  DB.deleteContent(id);
                  setContent([...DB.content]);
                }}
                onAddGoal={(item) => {
                  DB.addGoal(item);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onUpdateGoal={(item) => {
                  DB.updateGoal(item);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onDeleteGoal={(id) => {
                  DB.deleteGoal(id);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onPlaySound={() => triggerPlaySound('click')}
              />
            )}

            {/* GOALS AND TASK LOG SCREEN */}
            {activeModule === 'goals-tasks' && (
              <GoalsAndTasksView
                language={currentUserLang}
                goals={goals}
                tasks={tasks}
                onAddGoal={(item) => {
                  DB.addGoal(item);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onUpdateGoal={(item) => {
                  DB.updateGoal(item);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onDeleteGoal={(id) => {
                  DB.deleteGoal(id);
                  setGoals([...DB.goals]);
                  setStats(DB.getStats());
                }}
                onAddTask={(item) => {
                  DB.addTask(item);
                  setTasks([...DB.tasks]);
                  setStats(DB.getStats());
                }}
                onUpdateTask={(item) => {
                  DB.updateTask(item);
                  setTasks([...DB.tasks]);
                  setStats(DB.getStats());
                }}
                onDeleteTask={(id) => {
                  DB.deleteTask(id);
                  setTasks([...DB.tasks]);
                  setStats(DB.getStats());
                }}
                onPlaySound={(type) => triggerPlaySound(type)}
              />
            )}

            {/* ADVISORY COOP ADMIN AND INTEGRATORS DATABASE Snapshots */}
            {activeModule === 'backups' && (
              <BackupsAndReportsView
                language={currentUserLang}
                backups={backups}
                revenues={revenues}
                expenses={expenses}
                clients={clients}
                onTriggerBackup={() => {
                  const fName = DB.performManualBackup();
                  setBackups([...DB.backups]);
                  triggerPlaySound('success');
                }}
                onRestoreBackup={(id) => {
                  const ok = DB.restoreBackup(id);
                  return ok;
                }}
                onGenerateSQLDump={() => {
                  return DB.generateSQLDump();
                }}
                onPlaySound={() => triggerPlaySound('click')}
              />
            )}

            {/* DEDICATED SYSTEM PREFERENCES & CURRENCY INTEGRATION CONTROL */}
            {activeModule === 'settings' && (
              <SettingsView
                language={currentUserLang}
                onLanguageChange={(lang) => {
                  setCurrentUserLang(lang);
                  DB.language = lang;
                  DB.commitToStorage();
                }}
                theme={currentTheme}
                onThemeChange={(th) => {
                  setCurrentTheme(th);
                  DB.theme = th;
                  DB.commitToStorage();
                }}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={handleCurrencyChange}
                pinCode={pinCode}
                onUpdatePin={handleUpdatePin}
                onFactoryReset={() => {
                  DB.forceResetToDefault();
                  setCurrentUserLang(DB.language);
                  setCurrentTheme(DB.theme as any);
                  setStats(DB.getStats());
                  setRevenues(DB.revenues);
                  setExpenses(DB.expenses);
                  setInvestments(DB.investments);
                  setClients(DB.clients);
                  setServices(DB.services);
                  setProjects(DB.projects);
                  setContent(DB.content);
                  setPatterns(DB.patterns);
                  setGoals(DB.goals);
                  setTasks(DB.tasks);
                  setSocial(DB.social);
                  setBackups(DB.backups);
                  setPinCode(DB.pinCode);
                  setSelectedCurrency('USD');
                  localStorage.setItem('default_display_currency', 'USD');
                  triggerPlaySound('success');
                }}
                onPlaySound={(type) => triggerPlaySound(type)}
              />
            )}

          </main>
        </div>

        {/* PRINT HIDDEN ELEMENT COMPONENT FOR GRAPHIC STYLED PDF REPORTING */}
        <div id="print-area" className="hidden printable-report text-black p-8 font-sans">
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider font-sans">FOXNEX PLATFORM - OFFICIAL STATEMENT REPORT</h1>
            <p className="text-xs text-gray-500 font-mono">Date: {currentTimeText} | Sourcing Secure System File</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-xs text-stone-700">
            <div>
              <span className="font-bold block text-[10px] text-gray-400">TOTAL COMBINED INFLOWS</span>
              <span className="text-lg font-bold text-green-700">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-bold block text-[10px] text-gray-400">OPERATIONAL EXPENSES</span>
              <span className="text-lg font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-bold block text-[10px] text-gray-400">NET RETAINED BALANCE</span>
              <span className="text-lg font-bold text-indigo-700">${stats.netProfit.toLocaleString()}</span>
            </div>
          </div>

          {/* Table index representing Inflow ledger */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase border-b pb-1 mb-2">Reconciled Revenues Logs</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-[10px] uppercase">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Date</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {revenues.map(rev => (
                  <tr key={rev.id} className="border-b">
                    <td className="p-2 font-bold">{rev.title}</td>
                    <td className="p-2">{rev.category}</td>
                    <td className="p-2">{rev.date}</td>
                    <td className="p-2 text-right">${rev.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table index representing Outflow ledger */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase border-b pb-1 mb-2">Reconciled Project Expenses</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-[10px] uppercase">
                  <th className="p-2">Expense Name</th>
                  <th className="p-2">Supplier Vendor</th>
                  <th className="p-2">Date</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(ex => (
                  <tr key={ex.id} className="border-b">
                    <td className="p-2 font-bold">{ex.name}</td>
                    <td className="p-2">{ex.supplier}</td>
                    <td className="p-2">{ex.date}</td>
                    <td className="p-2 text-right">${ex.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex justify-between text-[11px] text-gray-500 pt-6 border-t border-dashed">
            <div>
              <p>Auditor Signature: __________________</p>
            </div>
            <div>
              <p>Business Operations Coordinator: nhyoussef704@gmail.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
