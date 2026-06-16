/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  Layers, Milestone, Users, Trophy, ChevronRight
} from 'lucide-react';
import { Language, Revenue, Expense, Investment, SocialMediaStats } from '../types';

interface DashboardViewProps {
  language: Language;
  stats: any;
  revenues: Revenue[];
  expenses: Expense[];
  investments: Investment[];
  social: SocialMediaStats[];
  selectedCurrency?: 'USD' | 'EUR' | 'MAD';
}

export function DashboardView({ language, stats, revenues, expenses, investments, social, selectedCurrency }: DashboardViewProps) {
  const isAr = language === 'ar';

  // Format currencies nicely based on preferred settings
  const formatCurrency = (val: number) => {
    const activeCurrency = selectedCurrency || (localStorage.getItem('default_display_currency') as 'USD' | 'EUR' | 'MAD' | null) || 'USD';
    const rateUsdToMad = parseFloat(localStorage.getItem('rate_usd_to_mad') || '10.02');
    const rateEurToMad = parseFloat(localStorage.getItem('rate_eur_to_mad') || '10.85');
    
    if (activeCurrency === 'MAD') {
      const converted = val * rateUsdToMad;
      return `${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD`;
    } else if (activeCurrency === 'EUR') {
      const converted = val * (rateUsdToMad / rateEurToMad);
      return `€${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // SVG Line Chart calculations
  const maxVal = Math.max(...revenues.map(r => r.amount), 5000) || 5000;
  const padding = 40;
  const chartHeight = 160;
  const chartWidth = 500;

  // Render up to 5 points
  const lastFiveRevenues = [...revenues].slice(0, 6).reverse();
  const pointCoordinates = lastFiveRevenues.map((r, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / Math.max(lastFiveRevenues.length - 1, 1);
    const y = chartHeight - padding - (r.amount / maxVal) * (chartHeight - padding * 2);
    return { x, y, label: r.title, amount: r.amount, date: r.date };
  });

  const svgPolylinePoints = pointCoordinates.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER STATEMENT */}
      <div>
        <h2 className="font-sans text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider">
          {isAr ? 'مركز الرصد والمؤشرات العامة' : 'ANALYTICS DECK // REALTIME BUSINESS PERFORMANCE'}
        </h2>
        <p className="font-mono text-[10px] text-slate-400">
          SYS_METRIC // TELEMETRY RECONCILIATION ACTIVE
        </p>
      </div>

      {/* THREE MAIN BENTO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* REVENUE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/10 hover:border-emerald-500/30 transition-all shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
                {isAr ? 'إجمالي المقبوضات' : 'ACCUMULATED REVENUE'}
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-sans">
                {formatCurrency(stats.totalRevenue)}
              </h2>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">{isAr ? 'النمو الشهري الكلي' : 'Overall Compound Growth'}</span>
            <span className="text-emerald-400 font-bold">+{stats.growthPercentage}%</span>
          </div>
        </div>

        {/* EXPENSES */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-pink-500/10 hover:border-pink-500/30 transition-all shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-[10px] sm:text-[11px] text-pink-400 uppercase tracking-widest font-bold">
                {isAr ? 'إجمالي المصاريف' : 'OPERATIONAL OUTFLOWS'}
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-sans">
                {formatCurrency(stats.totalExpenses)}
              </h2>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-pink-950/50 border border-pink-500/20 text-pink-400">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">{isAr ? 'مستلزمات الإنتاج والترخيص' : 'Materials & Licensing'}</span>
            <span className="text-pink-400 font-bold">-${formatCurrency(stats.totalExpenses)}</span>
          </div>
        </div>

        {/* NET PROFIT WITH GLOW */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-[0_0_30px_rgba(168,85,247,0.06)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-[10px] sm:text-[11px] text-purple-400 uppercase tracking-widest font-bold">
                {isAr ? 'صافي الأرباح المحلية' : 'NET PROFIT MARGIN'}
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mt-1 font-sans">
                {formatCurrency(stats.netProfit)}
              </h2>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-purple-950/50 border border-purple-500/20 text-purple-400">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">{isAr ? 'العائد على المصاريف' : 'Expense ROI Efficiency'}</span>
            <span className="text-purple-400 font-bold">
              {stats.totalExpenses > 0 ? `${Math.round((stats.netProfit / stats.totalExpenses) * 100)}%` : '100%'}
            </span>
          </div>
        </div>
      </div>

      {/* INLINE CHART AND STATS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* LINE CHART CARD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/5">
          <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wide mb-3">
            {isAr ? 'منحنى الإيرادات الأخير (نموذج محاكاة)' : 'REVENUE STREAM ANALYTICS'}
          </h3>
          <div className="text-[10px] font-mono text-slate-400 mb-2">
            {isAr ? 'مخطط زمني لأخر العمليات المالية المسجلة' : 'Timeline representation of point-in-time transactions'}
          </div>

          <div className="w-full h-44 border border-white/5 rounded-xl bg-black/40 overflow-hidden relative flex items-center justify-center p-2">
            {pointCoordinates.length < 2 ? (
              <div className="text-xs font-mono text-slate-500">{isAr ? 'بحاجة لمزيد من السجلات لعرض الرسم البياني' : 'Awaiting more transactions to render vector graphics'}</div>
            ) : (
              <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.1)" />

                {/* Vector Line path */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  points={svgPolylinePoints}
                  className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                />

                {/* Glow under line */}
                <path
                  d={`M ${pointCoordinates[0].x} ${chartHeight - padding} L ${svgPolylinePoints} L ${pointCoordinates[pointCoordinates.length - 1].x} ${chartHeight - padding} Z`}
                  fill="url(#chartGlow)"
                  opacity="0.15"
                />

                {/* Point Circles */}
                {pointCoordinates.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#a855f7"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#fff"
                      fontSize="8"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {formatCurrency(pt.amount)}
                    </text>
                  </g>
                ))}

                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* SOCIAL PERFORMANCE BENCHMARKS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/5">
          <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wide mb-3">
            {isAr ? 'عائدات منصات التواصل الاجتماعي' : 'SOCIAL MARKETING TRAFFIC OUTLET'}
          </h3>
          <div className="space-y-4">
            {social.map(sc => (
              <div key={sc.platform} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{sc.platform}</span>
                  <span className="text-cyan-400">{sc.followers.toLocaleString()} {isAr ? 'متابع' : 'Followers'}</span>
                </div>
                
                {/* Cyber Progress bar */}
                <div className="w-full h-2 rounded bg-slate-900 overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded" 
                    style={{ width: `${Math.min((sc.followers / 60000) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                  <span>{isAr ? `تفاعل: ${sc.engagement}%` : `Engagement: ${sc.engagement}%`}</span>
                  <span className="text-emerald-400 font-bold">{isAr ? 'الأرباح' : 'Gain'}: {formatCurrency(sc.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INVESTMENT ROI FORECAST WORKSPACE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wide">
            {isAr ? 'مراقبة العوائد الاستثمارية والتنبؤات' : 'INVESTMENT ROI MONITOR & FORECASTS'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-2">{isAr ? 'المشروع الاستثماري' : 'Project Initiative'}</th>
                <th className="py-2.5 px-2">{isAr ? 'القيمة الرأسمالية' : 'CapEx Investment'}</th>
                <th className="py-2.5 px-2">{isAr ? 'العائد المتوقع' : 'Target Return'}</th>
                <th className="py-2.5 px-2">{isAr ? 'العائد المحقق' : 'Return Realized'}</th>
                <th className="py-2.5 px-2">{isAr ? 'حالة التفعيل' : 'Operation Status'}</th>
                <th className="py-2.5 px-2 text-right">ROI %</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => {
                const roi = inv.investmentValue > 0 
                  ? Math.round(((inv.expectedReturn - inv.investmentValue) / inv.investmentValue) * 100) 
                  : 0;
                return (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-white font-medium">{inv.projectName}</td>
                    <td className="py-3 px-2 text-slate-300 font-sans">{formatCurrency(inv.investmentValue)}</td>
                    <td className="py-3 px-2 text-emerald-400 font-sans">{formatCurrency(inv.expectedReturn)}</td>
                    <td className="py-3 px-2 text-cyan-400 font-sans">{formatCurrency(inv.actualReturn)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                        inv.status === 'completed' 
                          ? 'bg-emerald-900/40 border border-emerald-500/20 text-emerald-400' 
                          : inv.status === 'active'
                          ? 'bg-cyan-900/40 border border-cyan-500/20 text-cyan-400'
                          : 'bg-slate-900 border border-slate-700 text-slate-400'
                      }`}>
                        {isAr ? (
                          inv.status === 'completed' ? 'مكتمل' :
                          inv.status === 'active' ? 'نشط' :
                          inv.status === 'planning' ? 'تخطيط' : 'مستحق'
                        ) : inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-purple-400 font-bold">+{roi}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
