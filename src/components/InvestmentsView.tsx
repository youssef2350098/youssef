/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Layers, Plus, Trash2, Edit2, 
  X, Check, DollarSign, PieChart, Coins, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Language, Investment, TRANSLATIONS } from '../types';

interface InvestmentsViewProps {
  language: Language;
  investments: Investment[];
  onAddInvestment: (item: Omit<Investment, 'id'>) => void;
  onUpdateInvestment: (item: Investment) => void;
  onDeleteInvestment: (id: string) => void;
  onPlaySound: (type?: 'click' | 'success' | 'warn') => void;
}

export function InvestmentsView({
  language,
  investments,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment,
  onPlaySound
}: InvestmentsViewProps) {
  const isAr = language === 'ar';
  
  // Format monetary value according to preferred active display currency in localStorage
  const formatValue = (usdAmount: number) => {
    const activeCurrency = (localStorage.getItem('default_display_currency') as 'USD' | 'EUR' | 'MAD' | null) || 'USD';
    const rateUsdToMad = parseFloat(localStorage.getItem('rate_usd_to_mad') || '10.02');
    const rateEurToMad = parseFloat(localStorage.getItem('rate_eur_to_mad') || '10.85');
    
    if (activeCurrency === 'MAD') {
      const converted = usdAmount * rateUsdToMad;
      return `${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`;
    } else if (activeCurrency === 'EUR') {
      const converted = usdAmount * (rateUsdToMad / rateEurToMad);
      return `€${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      return `$${usdAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };
  
  // Tab/view state
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Investment | null>(null);

  // Form state for ADD
  const [projName, setProjName] = useState('');
  const [invValue, setInvValue] = useState(1000);
  const [expReturn, setExpReturn] = useState(2500);
  const [actReturn, setActReturn] = useState(0);
  const [status, setStatus] = useState<Investment['status']>('active');
  const [notes, setNotes] = useState('');

  // Form state for EDIT
  const [editProjName, setEditProjName] = useState('');
  const [editInvValue, setEditInvValue] = useState(1000);
  const [editExpReturn, setEditExpReturn] = useState(2500);
  const [editActReturn, setEditActReturn] = useState(0);
  const [editStatus, setEditStatus] = useState<Investment['status']>('active');
  const [editNotes, setEditNotes] = useState('');

  // Sorter / Filter state
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Submit ADD
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    onAddInvestment({
      projectName: projName,
      investmentValue: invValue,
      expectedReturn: expReturn,
      actualReturn: actReturn,
      status,
      notes
    });

    // Reset Form
    setProjName('');
    setInvValue(1000);
    setExpReturn(2500);
    setActReturn(0);
    setStatus('active');
    setNotes('');
    setIsAdding(false);
    onPlaySound('success');
  };

  // Start EDIT
  const startEdit = (item: Investment) => {
    onPlaySound('click');
    setEditingItem(item);
    setEditProjName(item.projectName);
    setEditInvValue(item.investmentValue);
    setEditExpReturn(item.expectedReturn);
    setEditActReturn(item.actualReturn);
    setEditStatus(item.status);
    setEditNotes(item.notes);
  };

  // Submit EDIT
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editProjName.trim()) return;

    onUpdateInvestment({
      id: editingItem.id,
      projectName: editProjName,
      investmentValue: editInvValue,
      expectedReturn: editExpReturn,
      actualReturn: editActReturn,
      status: editStatus,
      notes: editNotes
    });

    setEditingItem(null);
    onPlaySound('success');
  };

  // Cumulative Metrics
  const totalInvested = investments.reduce((sum, item) => sum + item.investmentValue, 0);
  const totalExpected = investments.reduce((sum, item) => sum + item.expectedReturn, 0);
  const totalActual = investments.reduce((sum, item) => sum + item.actualReturn, 0);
  
  // Realized profit or loss (For matured or completed, or active progress overall)
  // Let's compute profit/loss based on: Actual return minus original investment
  const totalResult = totalActual - totalInvested;

  // Filtered investments
  const filtered = investments.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-white/5 gap-3">
        <div className="header-dir">
          <h3 className="font-sans font-bold text-sm text-white">
            {isAr ? 'محفظة الأنشطة المالية والاستثمارية' : 'FINANCIAL INVESTMENTS & PORTFOLIO'}
          </h3>
          <p className="font-mono text-[9px] text-slate-500 uppercase">
            {isAr ? 'تسجيل وتقييم العوائد الرأسمالية وصافي الأرباح والخسائر' : 'ASSET CAPEX TRACKING & DYNAMIC ROI YIELD MATRIX'}
          </p>
        </div>

        <button
          onClick={() => { setIsAdding(!isAdding); setEditingItem(null); onPlaySound('click'); }}
          className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[11px] rounded-lg flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/30"
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAr ? 'استثمار جديد' : 'Record Asset'}</span>
        </button>
      </div>

      {/* METRICS LEVEL STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL INVESTED */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 shadow-md">
          <div className="flex justify-between items-center text-slate-400">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              {isAr ? 'إجمالي المبالغ المستثمرة' : 'Capital Outlay'}
            </span>
            <Coins className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-white mt-1 font-sans">
            {formatValue(totalInvested)}
          </h3>
          <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
            {isAr ? 'رأس المال الملتزم به' : 'Accumulated cost basis'}
          </div>
        </div>

        {/* TARGET / EXPECTED */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 shadow-md">
          <div className="flex justify-between items-center text-slate-400">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              {isAr ? 'العوائد المستهدفة' : 'Expected Targets'}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-purple-400 mt-1 font-sans">
            {formatValue(totalExpected)}
          </h3>
          <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
            {isAr ? 'المتوقع تحصيله' : 'Target return profile'}
          </div>
        </div>

        {/* ACTUAL REALIZED */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 shadow-md">
          <div className="flex justify-between items-center text-slate-400">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              {isAr ? 'العوائد المحققة فعلياً' : 'Realized Cash-In'}
            </span>
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-cyan-400 mt-1 font-sans">
            {formatValue(totalActual)}
          </h3>
          <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
            {isAr ? 'الأموال المستردة' : 'Actual payout to date'}
          </div>
        </div>

        {/* COMBINED INTERMEDIATIVE RESULT */}
        <div className={`p-4 rounded-xl bg-slate-950/80 border transition-all duration-300 ${
          totalResult >= 0 ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
        }`}>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isAr ? 'صافي نتيجة الاستثمار' : 'Net Financial Yield'}
            </span>
            {totalResult >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
          <h3 className={`text-lg font-bold mt-1 font-sans ${totalResult >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalResult >= 0 ? '+' : '-'}{formatValue(Math.abs(totalResult))}
          </h3>
          <div className="text-[9px] font-mono mt-1 uppercase">
            {totalResult >= 0 ? (
              <span className="text-emerald-500 font-bold">{isAr ? 'مكاسب رأسمالية محققة' : 'ROI Profit Margin'}</span>
            ) : (
              <span className="text-rose-500 font-bold">{isAr ? 'عجز مالي مؤقت' : 'Net deficit balance'}</span>
            )}
          </div>
        </div>
      </div>

      {/* ERROR / SUCCESS MODAL FALLBACK INLINE NOTIFIER */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-2xl bg-slate-900/40 border border-purple-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="font-sans font-bold text-purple-400 uppercase text-xs tracking-wider">
              {isAr ? 'تسجيل استثمار أو مشروع مالي جديد' : 'RECORD NEW ADVISEMENT CAPITAL ALLOCATION'}
            </h4>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Initiative */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'اسم المشروع المالي / الاستثماري' : 'Project Initiative Name *'}</label>
              <input
                type="text"
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder={isAr ? 'مثال: خوادم نظام دورات الماستركلاس' : 'e.g. Masterclass Online Server Clusters'}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
              />
            </div>

            {/* Capital value */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'قيمة الاستثمار الكلي' : 'Capital investment value ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={invValue}
                onChange={(e) => setInvValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* expectedReturn */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'العائد المتوقع كهدف مالي' : 'Target return index ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={expReturn}
                onChange={(e) => setExpReturn(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* actualReturn */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'العائد المحقق الفعلي' : 'Actual return payout ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={actReturn}
                onChange={(e) => setActReturn(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* status */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'الحالة الحالية' : 'Operational status'}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white focus:border-purple-400 outline-none"
              >
                <option value="planning">{isAr ? 'تخطيط وترقب' : 'Planning'}</option>
                <option value="active">{isAr ? 'نشط ويعمل' : 'Active Strategy'}</option>
                <option value="matured">{isAr ? 'مستحق جزئياً' : 'Matured'}</option>
                <option value="completed">{isAr ? 'منجز ومكتمل' : 'Completed Successfully'}</option>
              </select>
            </div>

            {/* notes */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'تعليمات وملاحظات الصفقة مدمجة' : 'Audit and performance details'}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={isAr ? 'التحليلات التفصيلية، نسبة الشريك، المراحل الهامة...' : 'Detailed analytics, partner percentage, milestones...'}
                className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)} 
              className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            >
              {isAr ? 'تسجيل كعملية مالية' : 'Save Investment'}
            </button>
          </div>
        </form>
      )}

      {/* EDIT MODAL FALLBACK INLINE ACTION */}
      {editingItem && (
        <form onSubmit={handleEditSubmit} className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="font-sans font-bold text-cyan-400 uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'تعديل بيانات الاستثمار الحالي' : 'UPDATE CAPEX ASSET METRIC RECORD'}</span>
            </h4>
            <button type="button" onClick={() => setEditingItem(null)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Initiative */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'اسم الاستثمار' : 'Project Initiative Name *'}</label>
              <input
                type="text"
                required
                value={editProjName}
                onChange={(e) => setEditProjName(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-bold"
              />
            </div>

            {/* Capital value */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'رأس المال المقترن' : 'Capital investment value ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={editInvValue}
                onChange={(e) => setEditInvValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* expectedReturn */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'أهداف عوائد الأرباح' : 'Target return index ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={editExpReturn}
                onChange={(e) => setEditExpReturn(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* actualReturn */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'العائد الفعلي المحصل' : 'Actual return payout ($)'}</label>
              <input
                type="number"
                min="0"
                required
                value={editActReturn}
                onChange={(e) => setEditActReturn(Number(e.target.value))}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans"
              />
            </div>

            {/* status */}
            <div className="space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'حالة التفعيل' : 'Operational status'}</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white focus:border-cyan-400 outline-none"
              >
                <option value="planning">{isAr ? 'تخطيط وترقب' : 'Planning'}</option>
                <option value="active">{isAr ? 'نشط ويعمل' : 'Active Strategy'}</option>
                <option value="matured">{isAr ? 'مستحق جزئياً' : 'Matured'}</option>
                <option value="completed">{isAr ? 'منجز ومكتمل' : 'Completed Successfully'}</option>
              </select>
            </div>

            {/* notes */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-slate-400 block font-bold">{isAr ? 'موصفات وبيانات الأرباح' : 'Audit and performance details'}</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setEditingItem(null)} 
              className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              {isAr ? 'تحديث العملية' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* FILTER & DATA LEDGER */}
      <div className="space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-2">
          <h4 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-wider pl-1 header-dir">
            {isAr ? 'جدول ومعاملات الاستثمارات الآمنة' : 'Active Investment Allocations Ledger'}
          </h4>

          {/* FILTER TAB SELECTOR */}
          <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            {['all', 'planning', 'active', 'matured', 'completed'].map(st => {
              const active = filterStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => { setFilterStatus(st); onPlaySound('click'); }}
                  className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded transition-all ${
                    active 
                      ? 'bg-purple-950/45 text-purple-300 border border-purple-500/20'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {st === 'all' ? (isAr ? 'الكل' : 'All') : 
                   st === 'planning' ? (isAr ? 'تخطيط' : 'Planning') :
                   st === 'active' ? (isAr ? 'نشط' : 'Active') :
                   st === 'matured' ? (isAr ? 'مستحق' : 'Matured') :
                   (isAr ? 'مكتمل' : 'Completed')}
                </button>
              );
            })}
          </div>
        </div>

        {/* DATA GRID OR EMPTY */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-white/5">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-mono text-xs text-slate-400">
              {isAr ? 'لم يتم العثور على أي عمليات استثمارية مطابقة.' : 'No active investment logs matched this category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(item => {
              const itemYield = item.actualReturn - item.investmentValue;
              const isProfit = itemYield >= 0;
              const returnRatio = item.investmentValue > 0 
                ? Math.round(((item.expectedReturn - item.investmentValue) / item.investmentValue) * 100) 
                : 0;

              return (
                <div 
                  key={item.id} 
                  className="p-4 bg-slate-950/75 border border-white/5 rounded-xl hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.04)] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5 text-left font-mono">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <h4 className="font-sans font-bold text-white text-sm">{item.projectName}</h4>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${
                          item.status === 'completed'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'active'
                            ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/20'
                            : item.status === 'matured'
                            ? 'bg-purple-950/60 text-purple-400 border border-purple-500/20'
                            : 'bg-zinc-900 text-slate-400 border border-white/5'
                        }`}>
                          {isAr ? (
                            item.status === 'completed' ? 'مكتمل' :
                            item.status === 'active' ? 'نشط' :
                            item.status === 'matured' ? 'مستحق' : 'تخطيط'
                          ) : item.status}
                        </span>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-cyan-400 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/30 rounded-lg transition-colors"
                          title="Edit transaction parameters"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { onDeleteInvestment(item.id); onPlaySound('warn'); }}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/50 border border-transparent hover:border-rose-500/30 rounded-lg transition-colors"
                          title="Delete asset record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 h-8 leading-relaxed">
                      {item.notes || (isAr ? 'لا توجد ملاحظات إضافية.' : 'No additional annotations provided.')}
                    </p>
                  </div>

                  {/* MINI MATRIX VALUES */}
                  <div className="border-t border-white/5 pt-3 grid grid-cols-3 gap-2 text-center font-mono py-1">
                    <div className="text-left">
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">{isAr ? 'المستثمر' : 'Invested'}</span>
                      <span className="text-xs font-bold text-white font-sans">{formatValue(item.investmentValue)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">{isAr ? 'المتوقع' : 'Target'}</span>
                      <span className="text-xs font-bold text-purple-400 font-sans">{formatValue(item.expectedReturn)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-500 block uppercase font-bold">{isAr ? 'المحصل' : 'Realized'}</span>
                      <span className="text-xs font-bold text-cyan-400 font-sans">{formatValue(item.actualReturn)}</span>
                    </div>
                  </div>

                  {/* BOTTOM RECONCILED YIELD STATUS BAR */}
                  <div className={`p-2 rounded-lg flex justify-between items-center text-[10px] font-mono ${
                    isProfit ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/10' : 'bg-rose-950/30 text-rose-400 border border-rose-500/10'
                  }`}>
                    <span>{isProfit ? (isAr ? 'صافي أرباح محققة' : 'Net Profits Yield') : (isAr ? 'عجز العائد المعلق' : 'Pending Return Deficit')}</span>
                    <span className="font-bold">
                      {isProfit ? '+' : '-'}{formatValue(Math.abs(itemYield))} ({returnRatio >= 0 ? `+${returnRatio}%` : `${returnRatio}%`})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
