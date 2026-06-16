/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, UserPlus, Phone, Mail, Award, Scissors, 
  Layers, Circle, Play, HelpCircle, Save, Trash2, Edit 
} from 'lucide-react';
import { Language, Client, ServiceItem, TRANSLATIONS } from '../types';

interface CRMProps {
  language: Language;
  clients: Client[];
  services: ServiceItem[];
  onAddClient: (item: Omit<Client, 'id'>) => void;
  onUpdateClient: (item: Client) => void;
  onDeleteClient: (id: string) => void;
  onUpdateService: (item: ServiceItem) => void;
  onPlaySound: () => void;
}

export function CRMView({ language, clients, services, onAddClient, onUpdateClient, onDeleteClient, onUpdateService, onPlaySound }: CRMProps) {
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
  
  const t = TRANSLATIONS[language];

  const [activeTab, setActiveTab] = useState<'crm' | 'services'>('crm');
  const [isAdding, setIsAdding] = useState(false);

  // Client Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('3D Cartoon Videos');
  const [dealValue, setDealValue] = useState(1500);
  const [status, setStatus] = useState<'lead' | 'contacted' | 'negotiating' | 'active' | 'completed' | 'on-hold'>('lead');
  const [notes, setNotes] = useState('');

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    onAddClient({
      fullName,
      phone,
      email,
      service,
      dealValue,
      status,
      notes,
      lastFollowUp: new Date().toISOString().substring(0, 10)
    });

    onPlaySound();
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setIsAdding(false);
  };

  const incrementOrders = (ser: ServiceItem) => {
    const updated = {
      ...ser,
      activeOrders: ser.activeOrders + 1,
      totalEarned: ser.totalEarned + ser.basePrice
    };
    onUpdateService(updated);
    onPlaySound();
  };

  return (
    <div className="space-y-6">
      {/* NAVIGATION TABS FOR SUBFIELDS */}
      <div className="flex gap-2.5 border-b border-white/5 pb-2">
        <button
          onClick={() => { setActiveTab('crm'); onPlaySound(); }}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all rounded-lg border ${
            activeTab === 'crm' 
              ? 'bg-purple-950/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          {isAr ? 'قائمة العملاء CRM' : 'CLIENT PIPELINE & CRM'}
        </button>
        <button
          onClick={() => { setActiveTab('services'); onPlaySound(); }}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all rounded-lg border ${
            activeTab === 'services' 
              ? 'bg-purple-950/20 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          {isAr ? 'كتالوج الخدمات والإنتاج' : 'BUSINESS SERVICES CATALOG'}
        </button>
      </div>

      {activeTab === 'crm' ? (
        /* CRM WORKSPACE */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-white/5">
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                {isAr ? 'لوحة المتابعة والمبيعات النشطة' : 'CUSTOMER CONVERSION MATRIX'}
              </h3>
              <p className="font-mono text-[9px] text-slate-500">
                CRM_NODE // SYSTEM CAPEX AUDITING ACTIVE
              </p>
            </div>

            <button
              onClick={() => { setIsAdding(true); onPlaySound(); }}
              className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إدراج عميل جديد' : 'Acquire Deal'}</span>
            </button>
          </div>

          {/* CLIENT MODAL FORM */}
          {isAdding && (
            <form onSubmit={handleSaveClient} className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/25 space-y-4">
              <h4 className="font-sans text-xs uppercase font-extrabold text-purple-400 tracking-wider">
                {isAr ? 'حجز مسار عميل جديد بالمنظومة' : 'DISCOVER AND AUDIT NEW CRM RECORD'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'الاسم الثلاثي للعميل' : 'Full Surnames'}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'مثال: فاطمة الزهراء' : 'e.g. Fatima Zahra'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'هاتف الاتصال' : 'Mobile Interface'}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isAr ? 'مثال: 123456-666 212+' : 'e.g. +212 666-123456'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'مثال: fatima@caftan.ma' : 'e.g. fatima@caftan.ma'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'الخدمة المطلوبة' : 'Sought Utility Service'}</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white outline-none"
                  >
                    <option value="3D Cartoon Videos">{isAr ? 'فيديوهات كرتون ثلاثية الأبعاد' : '3D Cartoon Videos'}</option>
                    <option value="Voice Over">{isAr ? 'مسارات التعليق الصوتي' : 'Voice Over Narrations'}</option>
                    <option value="Pattern Design">{isAr ? 'تصميم قوالب وباترونات الأزياء' : 'Garment Pattern Design'}</option>
                    <option value="Social Media Content">{isAr ? 'صناعة محتوى للتواصل الاجتماعي' : 'Social Media Content Creation'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'قيمة الصفقة الإجمالية' : 'Deal Contract Value ($)'}</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'حالة الصفقة الحالية' : 'Current Conversion Phase'}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white outline-none"
                  >
                    <option value="lead">{isAr ? 'عميل محتمل مرشح' : 'Lead Prospect'}</option>
                    <option value="contacted">{isAr ? 'تم الاتصال وبدء التواصل' : 'Contacted'}</option>
                    <option value="negotiating">{isAr ? 'مرحلة التفاوض والاتفاق' : 'Negotiating'}</option>
                    <option value="active">{isAr ? 'حيز التنفيذ والعمل الفعلي' : 'Active Strategy'}</option>
                    <option value="completed">{isAr ? 'مكتمل بنجاح صفقة رابحة' : 'Closed Won'}</option>
                    <option value="on-hold">{isAr ? 'معلق ومحفوظ مؤقتاً' : 'On Hold'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <label className="text-slate-400 block">{isAr ? 'ملاحظات وتفاصيل الصفقة مدمجة' : 'CRM Annotations Layer'}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={isAr ? 'مثال: طلب قوالب قفطان بدانتيل ذهبي ملكي، دقة 4k...' : 'Requests caftan closeups in royal gold lace, 4k resolution...'}
                  className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="py-1.5 px-3 border border-white/5 hover:bg-slate-900 text-slate-300 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
                >
                  {isAr ? 'حفظ العميل' : 'Commit CRM Record'}
                </button>
              </div>
            </form>
          )}

          {/* PIPELINE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map(cli => (
              <div key={cli.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-4 hover:border-purple-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-white leading-tight">
                        {cli.fullName}
                      </h4>
                      <span className="text-[9px] font-mono text-purple-400 select-all uppercase">
                        {isAr ? (
                          cli.service === '3D Cartoon Videos' ? 'فيديوهات كرتون ثلاثية الأبعاد' :
                          cli.service === 'Voice Over' ? 'مسارات التعليق الصوتي' :
                          cli.service === 'Pattern Design' ? 'تصميم قوالب وباترونات الأزياء' :
                          cli.service === 'Social Media Content' ? 'صناعة محتوى للتواصل الاجتماعي' : cli.service
                        ) : cli.service}
                      </span>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono ${
                      cli.status === 'completed' 
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/10' 
                        : cli.status === 'active'
                        ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/10'
                        : 'bg-slate-900 text-slate-400 border border-white/5'
                    }`}>
                      {isAr ? (
                        cli.status === 'lead' ? 'عميل محتمل' :
                        cli.status === 'contacted' ? 'تم الاتصال' :
                        cli.status === 'negotiating' ? 'تفاوض' :
                        cli.status === 'active' ? 'نشط' :
                        cli.status === 'completed' ? 'صفقة رابحة' : 'معلق'
                      ) : cli.status}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs font-mono text-slate-400 border-t border-white/5 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{cli.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{cli.email || 'N/A'}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] font-sans text-slate-300 line-clamp-2 bg-black/20 p-2 rounded border border-white/5">
                    {cli.notes || (isAr ? 'لا توجد ملاحظات.' : 'No notes written.')}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">{isAr ? 'التعاقد' : 'Deal Value'}</span>
                    <span className="text-white font-bold font-sans text-xs">{formatValue(cli.dealValue)}</span>
                  </div>

                  <button
                    onClick={() => { onDeleteClient(cli.id); onPlaySound(); }}
                    className="p-1 px-1.5 bg-red-950/20 hover:bg-red-900/60 border border-red-500/10 rounded transition-colors text-red-400 font-mono text-[9px]"
                  >
                    {isAr ? 'شطب' : 'DELETE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SERVICES CATALOGUE AND INCOME COUNTER */
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 md:flex md:justify-between md:items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-white">
                {isAr ? 'كتالوج أسعار خدمات 3D والأزياء الرقمية' : 'ACTIVE UTILITIES CATALOG & REVENUE METERS'}
              </h3>
              <p className="font-mono text-[9px] text-slate-500 uppercase">
                {isAr ? 'الخدمات الحالية تدعم التشغيل 100% بدون إنترنت' : 'V2 CORE AND INCUBATED FUTURE SERVICES'}
              </p>
            </div>
            
            <div className="text-right text-xs font-mono max-md:mt-2">
              <span className="text-slate-400">{isAr ? 'الخدمات المسجلة' : 'Registered Catalog Assets'}: </span>
              <span className="text-purple-400 font-bold">{services.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((ser) => (
              <div 
                key={ser.id} 
                className={`p-4 rounded-xl border ${
                  ser.isFuture 
                    ? 'border-dashed border-white/10 bg-slate-950/30' 
                    : 'border-white/5 bg-slate-950/70 hover:border-purple-500/20 transition-all'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-2.5">
                    <div className={`p-2.5 rounded-lg border ${
                      ser.isFuture 
                        ? 'bg-slate-900 border-white/5 text-slate-500' 
                        : 'bg-purple-950/40 border-purple-500/20 text-purple-400'
                    }`}>
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-white leading-snug">
                        {isAr ? (
                          ser.name === '3D Cartoon Videos' ? 'فيديوهات كرتون ثلاثية الأبعاد' :
                          ser.name === 'Voice Over Narrations' ? 'مسارات التعليق الصوتي والسرد' :
                          ser.name === 'Garment Pattern Design' ? 'تصميم قوالب وباترونات الأزياء' :
                          ser.name === 'Social Media Content Creation' ? 'صناعة محتوى للتواصل الاجتماعي' : ser.name
                        ) : ser.name}
                      </h4>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-slate-500">
                        {ser.isFuture ? (isAr ? 'مسار مستقبلي معلق' : 'PROJECTED REVENUE SOURCE') : (isAr ? 'خدمة حالية مفعلة' : 'OPERATING INCOME STREAM')}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${
                    ser.isFuture 
                      ? 'bg-rose-950/30 text-rose-400 border border-rose-500/10' 
                      : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/10'
                  }`}>
                    {ser.isFuture ? (isAr ? 'قريباً' : 'INCUBATING') : (isAr ? 'نشط' : 'OPERATIONAL')}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                  <div className="font-mono text-xs text-slate-400">
                    <div>
                      <span>{isAr ? 'السعر الأساسي' : 'Base Rate'}: </span>
                      <span className="text-white font-sans font-bold">{formatValue(ser.basePrice)}</span>
                    </div>
                    {!ser.isFuture && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        <span>{isAr ? 'إجمالي الدخل المحسوب' : 'Reconciled Earnings'}: </span>
                        <span className="text-emerald-400 font-sans font-bold">{formatValue(ser.totalEarned)}</span>
                      </div>
                    )}
                  </div>

                  {!ser.isFuture && (
                    <button
                      onClick={() => incrementOrders(ser)}
                      className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-purple-500/30 text-[10px] font-mono text-purple-400 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>+ {isAr ? 'تسجيل طلب' : 'LOG SALE ORDER'}</span>
                      <span className="bg-purple-500/20 px-1 rounded text-purple-300 font-sans">{ser.activeOrders}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
