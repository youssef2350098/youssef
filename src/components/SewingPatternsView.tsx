/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scissors, Ruler, FileText, Plus, Check, ChevronDown, Trash2 } from 'lucide-react';
import { Language, SewingPattern, TRANSLATIONS } from '../types';

interface SewingPatternsViewProps {
  language: Language;
  patterns: SewingPattern[];
  onAddPattern: (item: Omit<SewingPattern, 'id'>) => void;
  onDeletePattern: (id: string) => void;
  onPlaySound: () => void;
}

export function SewingPatternsView({ language, patterns, onAddPattern, onDeletePattern, onPlaySound }: SewingPatternsViewProps) {
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const [selectedPat, setSelectedPat] = useState<SewingPattern | null>(patterns[0] || null);
  const [isAdding, setIsAdding] = useState(false);

  // New Pattern Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'caftan' | 'jellaba' | 'dress' | 'shirt' | 'pants' | 'children'>('caftan');
  const [bust, setBust] = useState(100);
  const [waist, setWaist] = useState(80);
  const [hips, setHips] = useState(105);
  const [length, setLength] = useState(145);
  const [shoulder, setShoulder] = useState(40);
  const [sleeve, setSleeve] = useState(58);
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload = {
      name,
      category,
      measurements: { bust, waist, hips, length, shoulder, sleeve },
      notes,
      pdfName: `${name.toLowerCase().replace(/\s+/g, '_')}_spec.pdf`
    };

    onAddPattern(payload);
    onPlaySound();
    setName('');
    setNotes('');
    setIsAdding(false);
  };

  const handleSelectPat = (pat: SewingPattern) => {
    setSelectedPat(pat);
    onPlaySound();
  };

  const handleDelete = (id: string) => {
    onDeletePattern(id);
    onPlaySound();
    if (selectedPat?.id === id) {
      setSelectedPat(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* MODULE HEADER */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <h2 className="font-sans text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-orange-400" />
            <span>{isAr ? 'خزانة تصميم الباتورنات وخياطة القفاطين' : 'SEWING PATTERN LIBRARY'}</span>
          </h2>
          <p className="font-mono text-[10px] text-slate-400">
            CAD_ENGINE // SEWING PATTERNS MATRIX SYSTEM
          </p>
        </div>
        <button
          onClick={() => { setIsAdding(true); onPlaySound(); }}
          className="py-1.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إدراج باترون قياس' : 'Add Sew Design'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIZING CATALOG MENU */}
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest pl-1 header-dir">
            {isAr ? 'قائمة التصاميم المعتمدة' : 'Tailor Blueprint Catalog'}
          </h3>

          <div className="space-y-2 max-h-[380px] lg:max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                onClick={() => handleSelectPat(pat)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  selectedPat?.id === pat.id
                    ? 'bg-orange-950/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    : 'bg-slate-950/60 border-white/5 hover:border-white/10 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 h-9 w-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-white leading-tight">
                      {pat.name}
                    </h4>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-orange-400/80">
                      {isAr ? (
                        pat.category === 'caftan' ? 'قفطان' :
                        pat.category === 'jellaba' ? 'جلابة' :
                        pat.category === 'dress' ? 'فستان' :
                        pat.category === 'shirt' ? 'قميص' :
                        pat.category === 'pants' ? 'سروال' : 'أطفال'
                      ) : pat.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pat.id);
                  }}
                  className="p-1 px-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/10 transition-colors"
                  title="Remove pattern"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CAD WORKSPACE DETAILED BLUEPRINT CONFIGURATOR */}
        <div className="lg:col-span-2 space-y-4">
          {isAdding ? (
            /* NEW PATTERN FORM */
            <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-950/80 border border-orange-500/20 space-y-4">
              <h3 className="font-sans font-bold text-sm text-white tracking-wider pb-2 border-b border-white/5">
                {isAr ? 'تأطير باترون تفصيل جديد قفطان/جلابة' : 'CREATE INTEGRATED DIGITAL PATTERN'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'اسم الباترون المرجعي' : 'Pattern Identifier Name'}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: جلابة الدار البيضاء الملكية' : 'e.g. Royal Casablanca Jellaba'}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-white font-sans focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">{isAr ? 'التصنيف' : 'Garment Taxonomy'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-white outline-none focus:border-orange-500"
                  >
                    <option value="caftan">Caftan (قفطان)</option>
                    <option value="jellaba">Jellaba (جلابة)</option>
                    <option value="dress">Dress (فستان)</option>
                    <option value="shirt">Shirt (قميص)</option>
                    <option value="pants">Pants (سروال)</option>
                    <option value="children">Children Clothes (ملابس أطفال)</option>
                  </select>
                </div>
              </div>

              {/* RULER INTEGRATION (SLIDERS) */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <h4 className="font-sans text-xs text-orange-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{t.measurements}</span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Bust */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.bust}</span>
                      <span className="text-white font-sans">{bust}cm</span>
                    </div>
                    <input type="range" min="60" max="150" value={bust} onChange={(e) => setBust(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>

                  {/* Waist */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.waist}</span>
                      <span className="text-white font-sans">{waist}cm</span>
                    </div>
                    <input type="range" min="50" max="130" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>

                  {/* Hips */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.hips}</span>
                      <span className="text-white font-sans">{hips}cm</span>
                    </div>
                    <input type="range" min="70" max="160" value={hips} onChange={(e) => setHips(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>

                  {/* Length */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.length}</span>
                      <span className="text-white font-sans">{length}cm</span>
                    </div>
                    <input type="range" min="80" max="190" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>

                  {/* Shoulder */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.shoulder}</span>
                      <span className="text-white font-sans">{shoulder}cm</span>
                    </div>
                    <input type="range" min="30" max="60" value={shoulder} onChange={(e) => setShoulder(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>

                  {/* Sleeve */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t.sleeve}</span>
                      <span className="text-white font-sans">{sleeve}cm</span>
                    </div>
                    <input type="range" min="30" max="80" value={sleeve} onChange={(e) => setSleeve(Number(e.target.value))} className="w-full accent-orange-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <label className="text-slate-400 block">{t.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={isAr ? 'ملاحظات التطريز، مراجع سفيفة أو حرير الدانتيل الذهبي...' : 'Embroidery notes, gold silk lace references...'}
                  className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-lg text-white font-sans outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="py-2 px-3 hover:bg-slate-900 text-slate-300 border border-white/5 rounded-lg"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold"
                >
                  {isAr ? 'حفظ وحقن باللوحة' : 'Save Pattern Draft'}
                </button>
              </div>
            </form>
          ) : selectedPat ? (
            /* ACTIVE PATTERN VISUALIZER CARD */
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-5">
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-orange-400 font-bold">
                    CAD // DTM_SPEC_SHEET_V2
                  </span>
                  <h3 className="font-sans font-extrabold text-lg text-white mt-0.5">
                    {selectedPat.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-orange-950/30 px-3 py-1.5 rounded-xl border border-orange-500/20 text-xs font-mono text-orange-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{selectedPat.pdfName || 'draft-spec.pdf'}</span>
                </div>
              </div>

              {/* DOCKET RULER SCHEMATIC GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(selectedPat.measurements).map(([key, val]) => {
                  let label = key;
                  if (key === 'bust') label = isAr ? 'محيط الصدر' : 'Bust Width';
                  if (key === 'waist') label = isAr ? 'محيط الخصر' : 'Waist Width';
                  if (key === 'hips') label = isAr ? 'محيط الأوراك' : 'Hips';
                  if (key === 'length') label = isAr ? 'الطول الكلي' : 'Overall Length';
                  if (key === 'shoulder') label = isAr ? 'عرض لكتف' : 'Shoulders';
                  if (key === 'sleeve') label = isAr ? 'الأكمام' : 'Sleeves length';
                  
                  return (
                    <div key={key} className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-slate-400">
                        {label}
                      </span>
                      <span className="text-xl font-extrabold font-sans text-orange-400 mt-1">
                        {val} <span className="text-xs text-slate-500">cm</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* DESIGN SKETCH SCHEMATIC PREVIEW */}
              <div className="p-4 rounded-xl bg-orange-950/10 border border-orange-500/10">
                <h4 className="font-sans text-xs text-white font-bold mb-1 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isAr ? 'توصيات تفصيل وخياطة القفطان' : 'Tailor Sourcing Instructions'}</span>
                </h4>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {selectedPat.notes || (isAr ? 'لم تسجل ملاحظات خاصة بالخياطة لهذا التصميم بعد.' : 'No additional sewing annotations cataloged for this model.')}
                </p>
              </div>

              {/* HUD FOOTER WITH METRICS SPECIFICATION */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 text-[9px] font-mono text-slate-500 uppercase flex justify-between tracking-widest">
                <span>COORD // LOC_FAS_BLUE_388</span>
                <span>SYSTEM LOCAL // OFFLINE PROTECTED</span>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-500 font-mono text-xs">
              {isAr ? 'اختر باترون لعرض القياسات المسجلة' : 'Select a digital tailoring blueprint from the left registry'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
