/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckSquare, Award, Plus, Trash2, Edit2, X, Check, ArrowRight, CornerDownRight,
  TrendingUp, TrendingDown, Target, Zap, AlertTriangle, Calendar, ClipboardList, Minus
} from 'lucide-react';
import { Language, Goal, Task } from '../types';

interface GoalsAndTasksViewProps {
  language: Language;
  goals: Goal[];
  tasks: Task[];
  onAddGoal: (item: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (item: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onAddTask: (item: Omit<Task, 'id'>) => void;
  onUpdateTask: (item: Task) => void;
  onDeleteTask: (id: string) => void;
  onPlaySound: (type?: 'click' | 'success' | 'warn') => void;
}

export function GoalsAndTasksView({
  language,
  goals,
  tasks,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onPlaySound
}: GoalsAndTasksViewProps) {
  const isAr = language === 'ar';

  // Modal / Add state
  const [activeTab, setActiveTab] = useState<'goals' | 'tasks'>('goals');
  const [goalAdding, setGoalAdding] = useState(false);
  const [taskAdding, setTaskAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Goal Form state (Add)
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [targetVal, setTargetVal] = useState(10);
  const [currentVal, setCurrentVal] = useState(0);
  const [unitValue, setUnitValue] = useState('Videos');
  const [deadlineVal, setDeadlineVal] = useState(new Date(Date.now() + 7 * 86450000).toISOString().substring(0, 10));
  const [goalNotes, setGoalNotes] = useState('');

  // Goal Form state (Edit)
  const [editGoalTitle, setEditGoalTitle] = useState('');
  const [editGoalType, setEditGoalType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [editTargetVal, setEditTargetVal] = useState(10);
  const [editCurrentVal, setEditCurrentVal] = useState(0);
  const [editUnitValue, setEditUnitValue] = useState('Videos');
  const [editDeadlineVal, setEditDeadlineVal] = useState('');
  const [editGoalNotes, setEditGoalNotes] = useState('');

  // Task Form state (Add)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskStatus, setTaskStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [taskCategory, setTaskCategory] = useState('Sewing');
  const [taskNotes, setTaskNotes] = useState('');

  // Task Form state (Edit)
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editTaskStatus, setEditTaskStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  const [editTaskCategory, setEditTaskCategory] = useState('');
  const [editTaskNotes, setEditTaskNotes] = useState('');

  // Filter state
  const [goalFilter, setGoalFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  // Submit Goal Add
  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    onAddGoal({
      title: goalTitle,
      type: goalType,
      target: targetVal,
      current: currentVal,
      unit: unitValue,
      deadline: deadlineVal,
      completed: currentVal >= targetVal,
      notes: goalNotes
    });

    setGoalTitle('');
    setCurrentVal(0);
    setGoalNotes('');
    setGoalAdding(false);
    onPlaySound('success');
  };

  // Submit Goal Edit
  const handleGoalEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editGoalTitle.trim()) return;

    onUpdateGoal({
      id: editingGoal.id,
      title: editGoalTitle,
      type: editGoalType,
      target: editTargetVal,
      current: editCurrentVal,
      unit: editUnitValue,
      deadline: editDeadlineVal,
      completed: editCurrentVal >= editTargetVal,
      notes: editGoalNotes
    });

    setEditingGoal(null);
    onPlaySound('success');
  };

  // Init Goal Edit Mode
  const startEditGoal = (g: Goal) => {
    onPlaySound('click');
    setEditingGoal(g);
    setEditGoalTitle(g.title);
    setEditGoalType(g.type);
    setEditTargetVal(g.target);
    setEditCurrentVal(g.current);
    setEditUnitValue(g.unit);
    setEditDeadlineVal(g.deadline);
    setEditGoalNotes(g.notes || '');
  };

  // Submit Task Add
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle,
      status: taskStatus,
      priority: taskPriority,
      dueDate: taskDueDate,
      category: taskCategory,
      notes: taskNotes
    });

    setTaskTitle('');
    setTaskNotes('');
    setTaskAdding(false);
    onPlaySound('success');
  };

  // Submit Task Edit
  const handleTaskEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;

    onUpdateTask({
      id: editingTask.id,
      title: editTaskTitle,
      status: editTaskStatus,
      priority: editTaskPriority,
      dueDate: editTaskDueDate,
      category: editTaskCategory,
      notes: editTaskNotes
    });

    setEditingTask(null);
    onPlaySound('success');
  };

  // Init Task Edit Mode
  const startEditTask = (t: Task) => {
    onPlaySound('click');
    setEditingTask(t);
    setEditTaskTitle(t.title);
    setEditTaskPriority(t.priority);
    setEditTaskStatus(t.status);
    setEditTaskDueDate(t.dueDate);
    setEditTaskCategory(t.category);
    setEditTaskNotes(t.notes || '');
  };

  // Progress Goal (+ Increment)
  const adjustGoalProgress = (g: Goal, amount: number) => {
    const nextCurrent = Math.max(0, g.current + amount);
    const isCompleted = nextCurrent >= g.target;
    onUpdateGoal({
      ...g,
      current: nextCurrent,
      completed: isCompleted
    });
    onPlaySound(amount > 0 ? 'success' : 'warn');
  };

  // Toggle/Action Task easily
  const cycleTaskStatus = (t: Task) => {
    const sequence: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];
    const currIndex = sequence.indexOf(t.status);
    const nextStatus = sequence[(currIndex + 1) % sequence.length];
    
    onUpdateTask({
      ...t,
      status: nextStatus
    });
    onPlaySound('success');
  };

  // Counts and indicators
  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const totalTasksCount = tasks.length;

  // Filtered lists
  const filteredGoals = goals.filter(g => {
    if (goalFilter === 'all') return true;
    return g.type === goalFilter;
  });

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* GLAM HEADER */}
      <div className="flex flex-wrap justify-between items-center bg-slate-900/40 p-4.5 rounded-2xl border border-white/5 gap-3">
        <div className="header-dir">
          <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>{isAr ? 'مركز الأهداف الاستراتيجية وسجل المهام التكتيكية' : 'STRATEGIC GOALS & TASK WORKSPACE'}</span>
          </h3>
          <p className="font-mono text-[9px] text-slate-500 uppercase">
            {isAr ? 'تأطير خطة العمل وإثبات الإنجاز أو تسجيل التراجع والتعامل مع العقبات' : 'Calibrated roadmap planning, step-by-step task logs, and progress hedging'}
          </p>
        </div>

        {/* TABS TIE BAR */}
        <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5 font-mono text-[10px]">
          <button
            onClick={() => { setActiveTab('goals'); onPlaySound('click'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'goals'
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'الأهداف الذكية' : 'Goals Center'}
          </button>
          <button
            onClick={() => { setActiveTab('tasks'); onPlaySound('click'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'سجل المهام اليومية' : 'Task Logging'}
          </button>
        </div>
      </div>

      {/* METRIC BADGING PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* GOAL FINISH RATIO */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{isAr ? 'أهداف ذكية منجزة' : 'Goals Finalized'}</span>
            <span className="text-xl font-bold font-sans text-purple-400 mt-1 block">
              {completedGoalsCount} <span className="text-xs text-slate-500 font-mono">/ {totalGoalsCount}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-950/30 border border-purple-500/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        {/* PENDING TASKS COUNTER */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{isAr ? 'مهام تكتيكية جارية' : 'Open Tasks Logged'}</span>
            <span className="text-xl font-bold font-sans text-cyan-400 mt-1 block">
              {pendingTasksCount} <span className="text-xs text-slate-500 font-mono">/ {totalTasksCount}</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-950/30 border border-cyan-500/10 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* LOG AGILITY INDEX */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{isAr ? 'إنتاجية البلانر' : 'Planner Milestones'}</span>
            <span className="text-xl font-bold font-sans text-emerald-400 mt-1 block">
              {totalGoalsCount + totalTasksCount > 0 
                ? Math.round(((completedGoalsCount + (totalTasksCount - pendingTasksCount)) / (totalGoalsCount + totalTasksCount)) * 100) 
                : 100}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-950/30 border border-emerald-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* CORE WORKSPACE CONSOLE */}
      {activeTab === 'goals' ? (
        
        // --- GOALS VIEWPORT ---
        <div className="space-y-4">
          
          {/* HEADER CONTROLS WITH TRIGGER */}
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 font-bold uppercase">{isAr ? 'عرض الأهداف:' : 'Filter Goals:'}</span>
              <div className="flex gap-1 bg-black/30 p-0.5 rounded-lg border border-white/5">
                {['all', 'daily', 'weekly', 'monthly', 'yearly'].map(cadence => (
                  <button
                    key={cadence}
                    onClick={() => { setGoalFilter(cadence as any); onPlaySound('click'); }}
                    className={`px-2 py-1 text-[9px] font-mono uppercase rounded transition-all ${
                      goalFilter === cadence
                        ? 'bg-purple-950/40 text-purple-300 font-bold border border-purple-500/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cadence === 'all' ? (isAr ? 'الكل' : 'All') : cadence}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setGoalAdding(!goalAdding); setEditingGoal(null); onPlaySound('click'); }}
              className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[11px] rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] border border-purple-500/30"
            >
              {goalAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAr ? 'هدف ذكي جديد' : 'Establish Goal'}</span>
            </button>
          </div>

          {/* ADD GOAL COMPONENT */}
          {goalAdding && (
            <form onSubmit={handleGoalSubmit} className="p-5 rounded-2xl bg-slate-900/40 border border-purple-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in duration-300">
              <h4 className="font-sans font-bold text-xs uppercase text-purple-400 tracking-wider">
                {isAr ? 'تأسيس هدف ذكي مدروس المدى' : 'CONSTRUCT NEW QUANTIFIABLE GOAL'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'تعريف الهدف الرئيسي *' : 'Goal Title Objective *'}</label>
                  <input
                    type="text"
                    required
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder={isAr ? 'مثال: نشر باترون التطريز المغربي' : 'e.g. Publish Moroccan Brocade Sew Pattern'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الدورة الزمنية' : 'Temporal Cadence'}</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white outline-none"
                  >
                    <option value="daily">{isAr ? 'هدف يومي تكراري' : 'Daily'}</option>
                    <option value="weekly">{isAr ? 'هدف أسبوعي' : 'Weekly'}</option>
                    <option value="monthly">{isAr ? 'مستهدف شهري استراتيجي' : 'Monthly'}</option>
                    <option value="yearly">{isAr ? 'خطة سنوية كبرى' : 'Yearly'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'العدد المستهدف (Target)' : 'Numerical Target Value (e.g. 20)'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={targetVal}
                    onChange={(e) => setTargetVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'التقدم المنجز حالياً' : 'Initial Progress Value'}</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentVal}
                    onChange={(e) => setCurrentVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الوحدة القياسية' : 'Standard Metric Unit'}</label>
                  <input
                    type="text"
                    required
                    value={unitValue}
                    onChange={(e) => setUnitValue(e.target.value)}
                    placeholder={isAr ? 'مثال: دورات / درهم / باترونات' : 'e.g. Courses / USD / Patterns'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الموعد النهائي' : 'Commitment Deadline'}</label>
                  <input
                    type="date"
                    required
                    value={deadlineVal}
                    onChange={(e) => setDeadlineVal(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'ملاحظات وتفاصيل التتبع' : 'Strategy & Obstacles Notes'}</label>
                  <input
                    type="text"
                    value={goalNotes}
                    onChange={(e) => setGoalNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: التركيز على أوقات التفاعل العالية، الاستعانة بتعليق صوتي مغربي...' : 'e.g. Focusing on high engagement times, outsourcing voiceovers...'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setGoalAdding(false)}
                  className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg"
                >
                  {isAr ? 'حقن الهدف بالنظام' : 'Save Smart Goal'}
                </button>
              </div>
            </form>
          )}

          {/* EDIT GOAL POPUP / INLINE CONTROLLER */}
          {editingGoal && (
            <form onSubmit={handleGoalEditSubmit} className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in duration-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحديث وتعديل الهدف وصافي الإنجاز' : 'EDIT GOAL & REGRESSION CORRECTION'}</span>
                </h4>
                <button type="button" onClick={() => setEditingGoal(null)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'صياغة الهدف' : 'Goal Objective Title'}</label>
                  <input
                    type="text"
                    required
                    value={editGoalTitle}
                    onChange={(e) => setEditGoalTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الدورة الزمنية' : 'Cadence'}</label>
                  <select
                    value={editGoalType}
                    onChange={(e) => setEditGoalType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="daily">{isAr ? 'يومي' : 'Daily'}</option>
                    <option value="weekly">{isAr ? 'أسبوعي' : 'Weekly'}</option>
                    <option value="monthly">{isAr ? 'شهري' : 'Monthly'}</option>
                    <option value="yearly">{isAr ? 'سنوي' : 'Yearly'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'العدد المستهدف المطلوب' : 'Target Numeric'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editTargetVal}
                    onChange={(e) => setEditTargetVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'القيمة المحققة حالياً (Progress / Regression)' : 'Current Achieved Value'}</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editCurrentVal}
                    onChange={(e) => setEditCurrentVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans font-bold text-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الوحدة القياسية' : 'Standard Metric Unit'}</label>
                  <input
                    type="text"
                    required
                    value={editUnitValue}
                    onChange={(e) => setEditUnitValue(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الموعد النهائي' : 'Deadline Target'}</label>
                  <input
                    type="date"
                    required
                    value={editDeadlineVal}
                    onChange={(e) => setEditDeadlineVal(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'ملاحظات واستراتيجية التعافي' : 'Audit and performance notes'}</label>
                  <input
                    type="text"
                    value={editGoalNotes}
                    onChange={(e) => setEditGoalNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg"
                >
                  {isAr ? 'حفظ التحديثات' : 'Apply Calibration'}
                </button>
              </div>
            </form>
          )}

          {/* ACTIVE GOALS DISPATCH GRID */}
          {filteredGoals.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-white/5 font-mono text-xs">
              <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-pulse" />
              <p className="text-slate-400">
                {isAr ? 'لم تسجل أي أهداف ذكية في هذه الفئة بعد.' : 'No active goals recorded in this temporal category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGoals.map(g => {
                const fraction = Math.min((g.current / g.target) * 100, 100);
                const progressPct = Math.round(fraction);
                const isOverdue = new Date(g.deadline) < new Date() && !g.completed;

                return (
                  <div
                    key={g.id}
                    className={`p-4 rounded-xl bg-slate-950/75 border hover:shadow-[0_0_15px_rgba(168,85,247,0.03)] transition-all flex flex-col justify-between space-y-4 ${
                      g.completed 
                        ? 'border-emerald-500/20' 
                        : isOverdue 
                        ? 'border-rose-500/35' 
                        : 'border-white/5 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="space-y-2 text-left font-mono">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] font-bold uppercase text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/15 font-bold">
                              {isAr ? (
                                g.type === 'daily' ? 'يومي' :
                                g.type === 'weekly' ? 'أسبوعي' :
                                g.type === 'monthly' ? 'شهري' : 'سنوي'
                              ) : g.type}
                            </span>
                            {isOverdue && (
                              <span className="text-[8px] font-bold uppercase text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">
                                {isAr ? 'متأخر' : 'Overdue'}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-sans font-bold text-xs text-white leading-snug">
                            {g.title}
                          </h4>
                        </div>

                        {/* EDIT / DELETE */}
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => startEditGoal(g)}
                            className="p-1 px-1.5 text-cyan-400 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 rounded transition-colors"
                            title="Edit goal parameters"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { onDeleteGoal(g.id); onPlaySound('warn'); }}
                            className="p-1 px-1.5 text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/20 rounded transition-colors"
                            title="Wipe goal objective"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* GOAL NOTES OR STRATEGY DESCRIPTION */}
                      <p className="text-[11px] font-sans text-slate-400 leading-relaxed min-h-[1.5rem]">
                        {g.notes || (isAr ? 'لا توجد ملاحظات أو عراقيل تكتيكية مخصصة لهذا الهدف.' : 'No active caveats or strategic roadblocks annotated.')}
                      </p>
                    </div>

                    {/* PROGRESS SCALE AND INCREMENTAL / REGRESSIVE OPERATORS */}
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      
                      {/* Numeric values */}
                      <div className="flex justify-between items-baseline font-mono text-[11px]">
                        <span className="text-slate-500">{isAr ? 'التقدم المحقق' : 'Track record'}</span>
                        <div className="flex gap-1">
                          <span className={`${g.completed ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                            {g.current}
                          </span>
                          <span className="text-slate-600">/</span>
                          <span className="text-purple-400 font-bold">{g.target} {g.unit}</span>
                        </div>
                      </div>

                      {/* Visual bar */}
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            g.completed 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : progressPct > 60 
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-400' 
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      {/* Bottom row containing progress modifiers & deadline */}
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-slate-500 font-mono tracking-tighter flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-600" />
                          <span>{g.deadline}</span>
                        </span>

                        {/* REGRESSION AND PROGRESS OPERATORS */}
                        <div className="flex items-center gap-1.5 font-mono">
                          {/* Decrement / Regression Button */}
                          <button
                            onClick={() => adjustGoalProgress(g, -1)}
                            disabled={g.current === 0}
                            className={`p-1 bg-rose-950/20 border text-rose-500 hover:text-rose-400 rounded-md transition-all flex items-center justify-center ${
                              g.current === 0 
                                ? 'opacity-40 border-transparent cursor-not-allowed' 
                                : 'border-rose-500/25 hover:bg-rose-950/40 hover:border-rose-500/40'
                            }`}
                            title={isAr ? 'تراجع / تقليل التقدم' : 'Decrement / Regression'}
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          {/* Percent Indicator tag */}
                          <span className="px-1.5 py-0.5 bg-slate-900 text-[9px] font-bold text-slate-300 rounded border border-white/5">
                            {progressPct}%
                          </span>

                          {/* Increment / Progress Button */}
                          {g.current < g.target ? (
                            <button
                              onClick={() => adjustGoalProgress(g, 1)}
                              className="p-1 px-2.5 bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 text-[10px] rounded-md transition-all flex items-center gap-0.5 font-bold"
                              title={isAr ? 'خطوة تقدم' : 'Increment Progress'}
                            >
                              <Plus className="w-3 h-3" />
                              <span>{isAr ? 'تقدم' : 'Step'}</span>
                            </button>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-emerald-950/35 border border-emerald-500/30 text-emerald-400 font-bold rounded flex items-center gap-0.5 text-[8px]">
                              <Check className="w-3 h-3" />
                              <span>OK</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        
        // --- TASKS LOGGING ENVIRONMENT ---
        <div className="space-y-4">
          
          {/* HEADER CONTROLS WITH TRIGGER */}
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 font-bold uppercase">{isAr ? 'أولوية أو حالة المهام:' : 'Operational State:'}</span>
              <div className="flex gap-1 bg-black/30 p-0.5 rounded-lg border border-white/5">
                {['all', 'pending', 'in-progress', 'completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => { setTaskFilter(st as any); onPlaySound('click'); }}
                    className={`px-2 py-1 text-[9px] font-mono uppercase rounded transition-all ${
                      taskFilter === st
                        ? 'bg-cyan-950/40 text-cyan-300 font-bold border border-cyan-500/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {st === 'all' ? (isAr ? 'الكل' : 'All') : 
                     st === 'pending' ? (isAr ? 'قيد الانتظار' : 'Pending') :
                     st === 'in-progress' ? (isAr ? 'قيد التنفيذ' : 'In Progress') :
                     (isAr ? 'مكتملة' : 'Completed')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setTaskAdding(!taskAdding); setEditingTask(null); onPlaySound('click'); }}
              className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-[11px] rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] border border-cyan-500/30"
            >
              {taskAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isAr ? 'تسجيل مهمة عمل' : 'Record Task'}</span>
            </button>
          </div>

          {/* ADD TASK LOG PORTAL */}
          {taskAdding && (
            <form onSubmit={handleTaskSubmit} className="p-5 rounded-2xl bg-slate-900/40 border border-cyan-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in duration-300">
              <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">
                {isAr ? 'تسجيل مهمة جديدة بقائمة العمل' : 'LOG NEW WORKPLACE OPERATIVE TASK'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'اسم أو موضوع المهمة *' : 'Task Subject Statement *'}</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder={isAr ? 'مثال: رسم انحناءات الأكمام على قالب الباترون' : 'e.g. Draft sleeve curves on pattern template'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'مستويات الأولوية' : 'Priority Rank'}</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white outline-none font-bold"
                  >
                    <option value="low">{isAr ? 'أولوية منخفضة' : 'Low'}</option>
                    <option value="medium">{isAr ? 'أولوية متوسطة' : 'Medium'}</option>
                    <option value="high">{isAr ? 'أولوية قصوى' : 'High'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الحالة الأولية' : 'Task Launch Status'}</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white outline-none"
                  >
                    <option value="pending">{isAr ? 'بانتظار البدء' : 'Pending Start'}</option>
                    <option value="in-progress">{isAr ? 'قيد التنفيذ' : 'In Progress'}</option>
                    <option value="completed">{isAr ? 'مكتملة بنجاح' : 'Completed'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'الموعد المحدد' : 'Due Target Date'}</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'التصنيف / القسم' : 'Workgroup Category'}</label>
                  <input
                    type="text"
                    required
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    placeholder={isAr ? 'مثال: خياطة / إعلام / تصميم' : 'e.g. Sewing / Media / Render'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'تعليمات وخلاصات تيسيرية' : 'Specific execution notes'}</label>
                  <input
                    type="text"
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder={isAr ? 'اكتب تعليمات مفصلة أو قائمة مراجعة الملفات...' : 'Provide detailed instructions or files checklist...'}
                    className="w-full bg-slate-950 border border-white/10 p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTaskAdding(false)}
                  className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg"
                >
                  {isAr ? 'تسجيل المهمة' : 'Save Task Logs'}
                </button>
              </div>
            </form>
          )}

          {/* EDIT TASK POPUP PANEL */}
          {editingTask && (
            <form onSubmit={handleTaskEditSubmit} className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/30 space-y-4 font-mono text-xs text-left animate-in fade-in duration-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تعديل المهمة ونقاط التنفيذ' : 'UPDATE TASK ATTRIBUTE VALUES'}</span>
                </h4>
                <button type="button" onClick={() => setEditingTask(null)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'موضوع مهمة العمل' : 'Task title'}</label>
                  <input
                    type="text"
                    required
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'مستويات الأولوية' : 'Priority'}</label>
                  <select
                    value={editTaskPriority}
                    onChange={(e) => setEditTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white Outline-none font-bold text-cyan-400"
                  >
                    <option value="low">{isAr ? 'منخفضة' : 'Low'}</option>
                    <option value="medium">{isAr ? 'متوسطة' : 'Medium'}</option>
                    <option value="high">{isAr ? 'قصوى / عالية' : 'High'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'مستوى الحالة حالياً' : 'Execution Status'}</label>
                  <select
                    value={editTaskStatus}
                    onChange={(e) => setEditTaskStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                    <option value="in-progress">{isAr ? 'قيد التنفيذ' : 'In Progress'}</option>
                    <option value="completed">{isAr ? 'مكتملة' : 'Completed'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'موعد الاستحقاق' : 'Due Target Date'}</label>
                  <input
                    type="date"
                    required
                    value={editTaskDueDate}
                    onChange={(e) => setEditTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'القسم / التصنيف' : 'Category group'}</label>
                  <input
                    type="text"
                    required
                    value={editTaskCategory}
                    onChange={(e) => setEditTaskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                  <label className="text-slate-400 block font-bold">{isAr ? 'ملاحظات وتفاصيل التتبع' : 'Detailed notes'}</label>
                  <input
                    type="text"
                    value={editTaskNotes}
                    onChange={(e) => setEditTaskNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="py-1.5 px-3 border border-white/10 hover:bg-slate-950 rounded-lg text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg"
                >
                  {isAr ? 'حفظ التحديثات' : 'Apply Changes'}
                </button>
              </div>
            </form>
          )}

          {/* ACTIVE TASK LEDGER TABLE */}
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-white/5 font-mono text-xs">
              <ClipboardList className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-slate-400">
                {isAr ? 'لم يتم العثور على أي مهام مسجلة مطابقة للفئة.' : 'No operative task records matched this status.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(t => {
                const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'completed';

                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl bg-slate-950/75 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      t.status === 'completed'
                        ? 'border-emerald-500/20 opacity-75'
                        : isOverdue
                        ? 'border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.02)]'
                        : 'border-white/5 hover:border-cyan-500/20'
                    }`}
                  >
                    
                    {/* LEFT ROW PART (CHECKBOX & DETAILS) */}
                    <div className="flex items-start gap-3 flex-1 text-left">
                      
                      {/* Check toggle trigger button */}
                      <button
                        type="button"
                        onClick={() => cycleTaskStatus(t)}
                        className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center shrink-0 transition-all ${
                          t.status === 'completed'
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400'
                            : t.status === 'in-progress'
                            ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-400'
                            : 'bg-black/30 border-white/10 hover:border-cyan-500/30 text-transparent'
                        }`}
                        title={isAr ? 'تغيير حالة المهمة' : 'Toggle task status details'}
                      >
                        {t.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : t.status === 'in-progress' ? (
                          <CornerDownRight className="w-3.5 h-3.5 animate-pulse" />
                        ) : null}
                      </button>

                      <div className="space-y-1 font-mono">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className={`font-sans font-bold text-xs leading-snug ${
                            t.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                          }`}>
                            {t.title}
                          </h4>

                          {/* PRIORITY TAG */}
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            t.priority === 'high'
                              ? 'bg-rose-950/65 text-rose-400 border border-rose-500/10'
                              : t.priority === 'medium'
                              ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-500/10'
                              : 'bg-slate-900 text-slate-500 border border-white/5'
                          }`}>
                            {isAr ? (
                              t.priority === 'high' ? 'قصوى' :
                              t.priority === 'medium' ? 'متوسطة' : 'منخفضة'
                            ) : t.priority}
                          </span>

                          {/* CATEGORY TAG */}
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-slate-400 text-[8px]">
                            {t.category}
                          </span>
                        </div>

                        {/* NOTES */}
                        {t.notes && (
                          <p className="text-[10px] font-sans text-slate-400 leading-relaxed max-w-xl">
                            {t.notes}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* RIGHT ROW PART (DATES & CONTROLS) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0">
                      
                      {/* DUE DATE */}
                      <div className="text-right font-mono text-[10px]">
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">{isAr ? 'موعد الاستحقاق' : 'Due date'}</span>
                        <span className={`font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>
                          {t.dueDate}
                        </span>
                      </div>

                      {/* WORKFLOW PHASE BAR */}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold ${
                        t.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10'
                          : t.status === 'in-progress'
                          ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 animate-pulse'
                          : 'bg-zinc-900 text-slate-400 border border-white/5'
                      }`}>
                        {isAr ? (
                          t.status === 'completed' ? 'مكتملة' :
                          t.status === 'in-progress' ? 'قيد التنفيذ' : 'انتظار'
                        ) : t.status}
                      </span>

                      {/* EDIT AND REMOVE */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEditTask(t)}
                          className="p-1 px-1.5 text-cyan-400 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 rounded transition-colors"
                          title="Edit task log"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => { onDeleteTask(t.id); onPlaySound('warn'); }}
                          className="p-1 px-1.5 text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/20 rounded transition-colors"
                          title="Wipe task log"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
