/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, CheckSquare, Plus, Video, Trash2, 
  Settings, Play, Disc, ArrowRight, Award, Compass 
} from 'lucide-react';
import { Language, ContentItem, Goal, TRANSLATIONS } from '../types';

interface ContentAndGoalsProps {
  language: Language;
  content: ContentItem[];
  goals: Goal[];
  onAddContent: (item: Omit<ContentItem, 'id'>) => void;
  onUpdateContent: (item: ContentItem) => void;
  onDeleteContent: (id: string) => void;
  onAddGoal: (item: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (item: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onPlaySound: () => void;
}

export function ContentAndGoalsView({ 
  language, content, goals, 
  onAddContent, onUpdateContent, onDeleteContent,
  onAddGoal, onUpdateGoal, onDeleteGoal, onPlaySound 
}: ContentAndGoalsProps) {
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const [activeSegment, setActiveSegment] = useState<'content' | 'goals'>('content');
  const [contentAdding, setContentAdding] = useState(false);
  const [goalAdding, setGoalAdding] = useState(false);

  // Content Input state
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [voiceNotes, setVoiceNotes] = useState('');
  const [productionStatus, setProductionStatus] = useState<any>('idea');
  const [platform, setPlatform] = useState<any>('TikTok');

  // Goal Input state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<any>('daily');
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState('Videos');

  // Add Content
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddContent({
      title,
      script,
      productionStatus,
      publishingDate: new Date().toISOString().substring(0, 10),
      voiceNotes,
      platform
    });

    onPlaySound();
    setTitle('');
    setScript('');
    setVoiceNotes('');
    setContentAdding(false);
  };

  // Add Goal
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle) return;

    onAddGoal({
      title: goalTitle,
      type: goalType,
      target,
      current: 0,
      unit,
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      completed: false
    });

    onPlaySound();
    setGoalTitle('');
    setGoalAdding(false);
  };

  // Transition status of content forwards
  const advanceContentStatus = (item: ContentItem) => {
    const sequence: ('idea' | 'writing' | 'production' | 'editing' | 'published')[] = [
      'idea', 'writing', 'production', 'editing', 'published'
    ];
    const currentIndex = sequence.indexOf(item.productionStatus);
    if (currentIndex < sequence.length - 1) {
      const updated = {
        ...item,
        productionStatus: sequence[currentIndex + 1]
      };
      onUpdateContent(updated);
      onPlaySound();
    }
  };

  const incrementGoal = (g: Goal) => {
    const nextCurrent = g.current + 1;
    const isCompletedNow = nextCurrent >= g.target;
    onUpdateGoal({
      ...g,
      current: nextCurrent,
      completed: isCompletedNow
    });
    onPlaySound();
  };

  return (
    <div className="space-y-6">
      {/* SELECTION BAR */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => { setActiveSegment('content'); onPlaySound(); }}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-lg border transition-all ${
            activeSegment === 'content'
              ? 'bg-blue-950/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          {isAr ? 'تقويم نشر المحتوى وسيناريوهات الفيديوهات' : 'SOCIAL CONTENT SCHEDULER & SCRIPTS'}
        </button>

        <button
          onClick={() => { setActiveSegment('goals'); onPlaySound(); }}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-lg border transition-all ${
            activeSegment === 'goals'
              ? 'bg-blue-950/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          {isAr ? 'مركز الأهداف ومؤشرات التميز' : 'BUSINESS TARGETS & GENERAL GOALS'}
        </button>
      </div>

      {activeSegment === 'content' ? (
        /* CONTENT PRODUCTION SCRIPTS BOARD */
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                <span>{isAr ? 'لوحة تتبع الفيديوهات والسيناريوهات' : 'MEDIA CONTENT AND DIGITAL SCRIPT TRACKING'}</span>
              </h3>
              <p className="font-mono text-[9px] text-slate-500 uppercase">
                {isAr ? 'دورة حياة الفيديو: فكرة، كتابة، تصوير، مونتاج، نشر' : 'Track from Idea to Released Broadcast'}
              </p>
            </div>

            <button
              onClick={() => { setContentAdding(true); onPlaySound(); }}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إدراج فكرة فيديو' : 'Draft Script'}</span>
            </button>
          </div>

          {/* ADD MODULE CONTAINER */}
          {contentAdding && (
            <form onSubmit={handleSaveContent} className="p-5 rounded-2xl bg-slate-950/80 border border-blue-500/25 space-y-4">
              <h4 className="font-sans text-xs uppercase font-extrabold text-blue-400">
                {isAr ? 'تسجيل فكرة فيديو سينمائي جديد لتعليم الخياطة' : 'CATALOGUE NEW SHORT-FORM VIDEO SCRIPT'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'موضوع الفيديو الرئيسي' : 'Core Theme Title'}</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={isAr ? 'مثال: درس ياقة القفطان الاحترافي' : 'e.g. Caftan Collar Drafting tutorial'}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'منصة النشر الأساسية' : 'Publishing Hub'}</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded text-white' outline-none"
                  >
                    <option value="TikTok">TikTok Short-reel</option>
                    <option value="YouTube">YouTube HD Video</option>
                    <option value="Instagram">Instagram Stories</option>
                    <option value="Facebook">Facebook Feed Page</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'مستوى الإنتاج' : 'Workflow Stage'}</label>
                  <select
                    value={productionStatus}
                    onChange={(e) => setProductionStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded text-white outline-none"
                  >
                    <option value="idea">{isAr ? 'مرحلة الفكرة' : 'Idea Stage'}</option>
                    <option value="writing">{isAr ? 'كتابة السيناريو' : 'Scripting'}</option>
                    <option value="production">{isAr ? 'التصوير السينمائي' : 'Camera Filming'}</option>
                    <option value="editing">{isAr ? 'المونتاج ومراجعة' : 'Video Editing'}</option>
                    <option value="published">{isAr ? 'جاهز / تم النشر' : 'Ready/Published'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'السيناريو والملخص' : 'Audio Script & Pacing Content'}</label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={3}
                    placeholder={isAr ? 'اكتب مقدمة الفيديو، خطوات الدرس التعليمي، والحديث الختامي...' : 'Provide hook, tutorial steps, and closing CTA...'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white font-sans outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'ملاحظات المعلق الصوتي' : 'Narrations & Sound overlays'}</label>
                  <textarea
                    value={voiceNotes}
                    onChange={(e) => setVoiceNotes(e.target.value)}
                    rows={3}
                    placeholder={isAr ? 'ملاحظة مثل: صوت دافئ تشجيعي، موسيقى عود مغربي كخلفية...' : 'Warm encouraging vocal overlay, classical Oud backing tracks...'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white font-sans outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setContentAdding(false)}
                  className="py-1.5 px-3 border border-white/5 hover:bg-slate-900 text-slate-300 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded"
                >
                  {isAr ? 'حفظ وحقن بالجدول' : 'Commit Script'}
                </button>
              </div>
            </form>
          )}

          {/* SCRIPT CARDS MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.map(con => (
              <div key={con.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-4 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/10">
                        {con.platform}
                      </span>
                      <h4 className="font-sans font-bold text-xs text-white leading-tight mt-1.5">
                        {con.title}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono text-slate-400 bg-slate-900 border border-white/5 font-bold">
                      {isAr ? (
                        con.productionStatus === 'idea' ? 'فكرة محتوى' :
                        con.productionStatus === 'writing' ? 'كتابة السيناريو' :
                        con.productionStatus === 'production' ? 'التصوير السينمائي' :
                        con.productionStatus === 'editing' ? 'المونتاج ومراجعة' : 'تم البث والنشير'
                      ) : con.productionStatus}
                    </span>
                  </div>

                  <p className="mt-3.5 text-[11px] font-sans text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded border border-white/5">
                    <span className="block font-mono text-[9px] text-slate-500 mb-0.5 uppercase">{isAr ? 'السيناريو المكتوب' : 'Active Script Body'}:</span>
                    {con.script || (isAr ? 'لم يكتب سيناريو لهذا المحتوى بعد.' : 'No script outline recorded.')}
                  </p>

                  {con.voiceNotes && (
                    <div className="mt-2 text-[10px] font-mono text-blue-300 bg-blue-950/20 p-2 rounded border border-blue-500/10">
                      <span className="font-bold block uppercase text-[8px] mb-0.5">{isAr ? 'ملاحظات التعليق الصوتي' : 'Vocal Layer Notes'}:</span>
                      {con.voiceNotes}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                  <span className="text-[9px] font-mono text-slate-500 block">
                    {con.publishingDate}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {con.productionStatus !== 'published' && (
                      <button
                        onClick={() => advanceContentStatus(con)}
                        className="py-1 px-2 bg-blue-900/30 hover:bg-blue-900/80 text-blue-400 hover:text-white border border-blue-500/20 text-[9px] font-mono rounded flex items-center gap-1 text-xs"
                      >
                        <span>{isAr ? 'تقدم المرحلة' : 'ADVANCE'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => { onDeleteContent(con.id); onPlaySound(); }}
                      className="p-1 px-1.5 bg-red-950/20 hover:bg-red-900/60 border border-red-500/10 rounded text-red-400 transition-colors"
                      title="Delete script"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* GOALS TRACKER CENTER */
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                <span>{isAr ? 'أهداف الأعمال ومؤشرات المراقبة' : 'BUSINESS PERFORMANCE MILESTONES'}</span>
              </h3>
              <p className="font-mono text-[9px] text-slate-500 uppercase">
                {isAr ? 'التميز يأتي بتتبع إتمام الأهداف اليومية والأسبوعية والسنوية' : 'Incremental targeting for online courses & pattern design sales'}
              </p>
            </div>

            <button
              onClick={() => { setGoalAdding(true); onPlaySound(); }}
              className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إدراج هدف جديد' : 'New Goal'}</span>
            </button>
          </div>

          {/* ADD PORTAL GOAL */}
          {goalAdding && (
            <form onSubmit={handleSaveGoal} className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/25 space-y-4">
              <h4 className="font-sans text-xs uppercase font-extrabold text-cyan-400">
                {isAr ? 'تأطير هدف جديد قفطان/محتوى' : 'ESTABLISH TIME-BOUND GOAL'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'الهدف المرجو إتمامه' : 'Sought Goal Objective'}</label>
                  <input
                    type="text"
                    required
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder={isAr ? 'مثال: إتمام مسودة فيديو خياطة القفطان' : 'e.g. Complete caftan sewing video draft'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'نظام المتابعة الزمنية' : 'Frequency Cadence'}</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white outline-none"
                  >
                    <option value="daily">{isAr ? 'هدف يومي تكراري' : 'Daily Target'}</option>
                    <option value="weekly">{isAr ? 'هدف أسبوعي تكراري' : 'Weekly Target'}</option>
                    <option value="monthly">{isAr ? 'مستهدف شهري استراتيجي' : 'Monthly Milestone'}</option>
                    <option value="yearly">{isAr ? 'خطة سنوية كبرى' : 'Yearly Strategic Objective'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'القيمة المستهدفة' : 'Numerical Target Value'}</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'الوحدة القياسية' : 'Standard Metric Unit'}</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder={isAr ? 'فيديوهات / درهم / باترونات' : 'Videos / USD / Patterns'}
                    className="w-full bg-slate-900 border border-white/10 p-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setGoalAdding(false)}
                  className="py-1.5 px-3 border border-white/5 hover:bg-slate-900 text-slate-300 rounded"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
                >
                  {isAr ? 'حفظ الهدف' : 'Commit Goal'}
                </button>
              </div>
            </form>
          )}

          {/* GOALS METRIC ITERATORS */}
          <div className="space-y-3">
            {goals.map(g => {
              const fraction = Math.min((g.current / g.target) * 100, 100);
              const progressPct = Math.round(fraction);
              
              return (
                <div key={g.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3 hover:border-cyan-500/20 transition-all">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[8px] font-mono uppercase text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/10 font-bold">
                        {isAr ? (
                          g.type === 'daily' ? 'يومي' :
                          g.type === 'weekly' ? 'أسبوعي' :
                          g.type === 'monthly' ? 'شهري' : 'سنوي'
                        ) : g.type}
                      </span>
                      <h4 className="font-sans font-bold text-xs text-white mt-1.5 leading-tight">
                        {g.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => { onDeleteGoal(g.id); onPlaySound(); }}
                      className="p-1 text-red-400 bg-red-950/20 hover:bg-red-900/60 border border-red-500/10 rounded transition-colors"
                      title="Remove goal"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Progressive track row */}
                  <div className="flex items-center gap-3.5 pt-1.5">
                    <div className="flex-1">
                      <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded transition-all duration-300" 
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                        <span>{isAr ? 'نسبة الإنجاز المحققة' : 'Milestone progress'}</span>
                        <span className="font-bold text-slate-200">{progressPct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-white font-sans font-bold">{g.current}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-cyan-400 font-sans font-bold">{g.target} {g.unit}</span>
                    </div>

                    {g.current < g.target ? (
                      <button
                        onClick={() => incrementGoal(g)}
                        className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-cyan-400 text-[10px] rounded hover:border-cyan-500/35 flex items-center gap-1 font-bold font-mono text-xs"
                      >
                        + {isAr ? 'تقدم' : 'STEP'}
                      </button>
                    ) : (
                      <span className="px-2 py-1 bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold uppercase font-mono tracking-widest flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>OK</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
