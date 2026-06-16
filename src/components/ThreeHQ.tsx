/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Building2, Percent, TrendingUp, ArrowUpRight, 
  DollarSign, Activity, Settings, Calendar, Scissors, Users, PlaySquare, Target,
  Shield, Volume2, Database, Cpu, Layers, ListTodo, CheckCircle, RefreshCw, Zap, Bell, Clock, ChevronRight, Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { BrandLogo3D } from './BrandLogo3D';

interface ThreeHQProps {
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    growthPercentage: number;
    clientCount: number;
    patternCount: number;
    goalsAchieved: number;
    goalsTotal: number;
  };
  language: Language;
  onSelectModule: (moduleId: string) => void;
  revenues?: any[];
  expenses?: any[];
  clients?: any[];
  services?: any[];
  goals?: any[];
  tasks?: any[];
  selectedCurrency?: 'USD' | 'EUR' | 'MAD';
  onPlaySound?: (type: 'click' | 'success' | 'warn' | 'lock') => void;
}

export function ThreeHQ({ 
  stats, 
  language, 
  onSelectModule,
  revenues = [],
  expenses = [],
  clients = [],
  services = [],
  goals = [],
  tasks = [],
  selectedCurrency = 'USD',
  onPlaySound
}: ThreeHQProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [systemIntegrity, setSystemIntegrity] = useState<number>(99.8);
  const [dbSyncSec, setDbSyncSec] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  const isAr = language === 'ar';

  // Format currency helper matching active settings
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

  // Sound synthesis test trigger
  const triggerBeep = (type: 'click' | 'success' | 'warn' | 'lock') => {
    if (onPlaySound) {
      onPlaySound(type);
    }
  };

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Simulate subtle environment metric fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemIntegrity(prev => {
        const delta = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.min(100, Math.max(98.5, prev + delta)).toFixed(2));
      });
      setDbSyncSec(Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Portals layout configuration for 3D coordinate mapping
  const portals = [
    { id: 'dashboard', label: isAr ? 'لوحة القيادة والمؤشرات' : 'Dashboard & Stats', color: '#10b981', pos: [-3, 1, 1], icon: Activity },
    { id: 'revenue', label: isAr ? 'الإيرادات والمقبوضات' : 'Revenues Ledger', color: '#06b6d4', pos: [-1.8, 2.2, -2], icon: ArrowUpRight },
    { id: 'expenses', label: isAr ? 'المصاريف التشغيلية' : 'Expenses Outflow', color: '#ec4899', pos: [1.8, 2.2, -2], icon: DollarSign },
    { id: 'investments', label: isAr ? 'المشاريع الاستثمارية' : 'Investment Portfolios', color: '#eab308', pos: [0, 3.2, -1], icon: TrendingUp },
    { id: 'patterns', label: isAr ? 'كتالوج الباترونات' : 'Tailor blueprints', color: '#f97316', pos: [3, 1, 1], icon: Scissors },
    { id: 'clients', label: isAr ? 'العملاء ومتابعة العمل' : 'Customer CRM Hub', color: '#a855f7', pos: [2.2, -1.2, 2], icon: Users },
    { id: 'content', label: isAr ? 'المحتوى والسيناريوهات' : 'Production Scripts', color: '#3b82f6', pos: [-2.2, -1.2, 2], icon: PlaySquare },
    { id: 'goals-tasks', label: isAr ? 'الأهداف وسجل المهام' : 'Target Goals Log', color: '#c084fc', pos: [0, -1.2, 3], icon: Target },
    { id: 'backups', label: isAr ? 'النسخ الاحتياطي والتقارير' : 'System backups', color: '#f43f5e', pos: [0, -2.4, 0], icon: Settings },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 450;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02020a, 0.08);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 7.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- ENVIRONMENT NEON LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x06b6d4, 3, 20);
    blueLight.position.set(-4, 3, 2);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xec4899, 3, 20);
    pinkLight.position.set(4, -3, -2);
    scene.add(pinkLight);

    const coreLight = new THREE.PointLight(0xa855f7, 4, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // --- CYBERPUNK FLOOR GRID ---
    const gridHelper = new THREE.GridHelper(24, 24, 0xa855f7, 0x1e293b);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // --- COHESIVE CENTERPIECE HOLOGRAM ---
    const coreGeometry = new THREE.TorusKnotGeometry(1.1, 0.35, 120, 16, 2, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer glow dynamic ring
    const outerRingGeometry = new THREE.RingGeometry(1.9, 2.05, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });
    const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMat);
    scene.add(outerRing);

    // --- FLOATING SPARK PARTICLES FIELD ---
    const particlesCount = 140;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0xa855f7,
      transparent: true,
      opacity: 0.9
    });
    const starField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(starField);

    // --- FLOATING OMNI-PORTAL NODES ---
    const portalGroup = new THREE.Group();
    const portalSpheres: THREE.Mesh[] = [];

    portals.forEach((p, idx) => {
      const geo = new THREE.SphereGeometry(0.42, 32, 32);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(p.color),
        emissive: new THREE.Color(p.color),
        emissiveIntensity: 0.4,
        shininess: 100,
        transparent: true,
        opacity: 0.85
      });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(p.pos[0], p.pos[1], p.pos[2]);
      sphere.userData = { id: p.id, label: p.label, color: p.color };
      portalSpheres.push(sphere);
      portalGroup.add(sphere);

      // Add rotating wireframe shell around each portal
      const shellGeo = new THREE.OctahedronGeometry(0.6, 1);
      const shellMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color),
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      shell.name = `shell-${p.id}`;
      sphere.add(shell);
    });
    scene.add(portalGroup);

    // --- INTERACTIVE RAYCASTER ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(portalSpheres);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setHoveredPortal(hit.userData.id);
        document.body.style.cursor = 'pointer';
        hit.scale.set(1.25, 1.25, 1.25);
      } else {
        setHoveredPortal(null);
        document.body.style.cursor = 'default';
        portalSpheres.forEach(s => s.scale.set(1, 1, 1));
      }
    };

    const onViewportClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(portalSpheres);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        onSelectModule(hit.userData.id);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onViewportClick);

    // --- ANIMATION LOOP ---
    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin centerpiece
      coreMesh.rotation.y = elapsed * 0.4;
      coreMesh.rotation.x = elapsed * 0.2;
      outerRing.rotation.z = -elapsed * 0.15;
      
      // Sway particle field
      starField.rotation.y = Math.sin(elapsed * 0.05) * 0.08;
      starField.rotation.x = Math.cos(elapsed * 0.05) * 0.04;

      // Animate floating orbit of the portals
      portalGroup.children.forEach((sphere, index) => {
        sphere.position.y = portals[index].pos[1] + Math.sin(elapsed * 1.5 + index) * 0.15;
        const shell = sphere.getObjectByName(`shell-${portals[index].id}`);
        if (shell) {
          shell.rotation.y += 0.015;
          shell.rotation.x += 0.008;
        }
      });

      // Camera orbital movement with pointer
      const targetCamX = mouse.x * 1.2;
      const targetCamY = 1.4 + mouse.y * 0.8;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mountRef.current);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onViewportClick);
      resizeObserver.disconnect();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [language, onSelectModule]);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. VISUALLY POLISHED HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-950/40 p-4 rounded-xl border border-white/5 gap-4">
        <div>
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-wider">
            {isAr ? 'لوحة تحكم مركز القيادة الرئيسي' : 'COMMAND CENTER REAL-TIME DECKS'}
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-slate-400">
            {isAr ? 'مراقبة مركزية نشطة للمؤشرات وصناديق المال ومخرجات الإنتاج ثلاثية الأبعاد' : 'ACTIVE CORE TELEMETRY // 3D PORTAL ENGINE OVERVIEW'}
          </p>
        </div>
        <div className="flex items-center gap-3.5 bg-black/60 px-4 py-2 rounded-xl border border-white/5 self-start sm:self-auto">
          <Clock className="w-4 h-4 text-cyan-400" />
          <div className="text-right">
            <span className="block font-mono text-xs text-slate-200 font-bold">{currentTime || '14:05:12'}</span>
            <span className="block font-mono text-[9px] text-cyan-500 uppercase tracking-widest">{isAr ? 'نظام زمني متزامن' : 'UTC REAL TIME SYNC'}</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL MAIN WORKSPACE GRIDS: 3D SIMULATOR & COMPREHENSIVE FINANCIAL SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT: 3D ORBIT COMMAND SIMULATOR */}
        <div className="lg:col-span-8 flex flex-col justify-between relative rounded-3xl overflow-hidden bg-slate-950/75 border border-[rgba(168,85,247,0.22)] shadow-[0_0_35px_rgba(168,85,247,0.04)] min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
          
          {/* Virtual Three.js Stage Mount */}
          <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

          {/* Floated Top HUD Glass Overlay */}
          <div className="relative z-10 flex justify-between items-center bg-slate-950/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5 mx-3 mt-3 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <div>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-100 tracking-wider">
                  {isAr ? 'شاشه ثلاثية الأبعاد التفاعلية' : '3D GEOMETRIC ENGINE MONITOR'}
                </h4>
                <p className="font-mono text-[9px] text-cyan-400/80">
                  KERNEL // SPHERE LOGIC SECURE
                </p>
              </div>
            </div>
            
            <span className="font-mono text-[10px] text-slate-400 hidden sm:inline bg-slate-900/60 px-2 py-1 rounded border border-white/5">
              {isAr ? 'انقر على الكرات للاختصار السريع' : 'INTERACTIVE CLICK OR BITMAP ORB'}
            </span>
          </div>

          {/* Heavy Stats Center Plate */}
          <div className="relative z-10 pointer-events-none self-center text-center select-none py-10 max-w-xs transform translate-y-6">
            <div className="bg-slate-950/85 backdrop-blur-xl px-5 py-3.5 rounded-2xl border border-purple-500/20 shadow-[0_0_35px_rgba(147,51,234,0.18)]">
              <span className="font-mono text-[9px] tracking-widest text-purple-400 font-extrabold uppercase">
                {isAr ? 'صافي أرباح الأعمال المجمعة' : 'CUMULATIVE OPERATING MARGIN'}
              </span>
              <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1 tracking-tight">
                {formatCurrency(stats.netProfit)}
              </h2>
              <div className="flex gap-4 justify-center mt-2.5 pt-2 border-t border-white/5 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[8px]">{isAr ? 'الإيرادات' : 'REVENUE'}</span>
                  <span className="text-emerald-400 font-bold font-sans">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="border-r border-white/10 h-5 self-center" />
                <div>
                  <span className="text-slate-400 block text-[8px]">{isAr ? 'المصاريف' : 'OUTFLOW'}</span>
                  <span className="text-pink-400 font-bold font-sans">{formatCurrency(stats.totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Core Portal Selector Overlays */}
          <div className="relative z-10 bg-slate-950/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/5 mx-3 mb-3 shrink-0">
            <span className="block font-mono text-[9px] text-slate-400 mb-1.5 uppercase tracking-widest text-center">
              {isAr ? 'روابط الاختصار والملاحة المباشرة' : 'DIRECT WORKSPACE HOT-LINKS PORTAL'}
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {portals.map(p => {
                const Icon = p.icon;
                const isHovered = hoveredPortal === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectModule(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all duration-200 ${
                      isHovered 
                        ? 'bg-slate-900 border-white/40 text-white scale-102 font-semibold' 
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                    style={{
                      borderColor: isHovered ? p.color : undefined,
                      boxShadow: isHovered ? `0 0 12px ${p.color}35` : undefined
                    }}
                  >
                    <Icon className="w-3 h-3" style={{ color: p.color }} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT: DETAILED SYSTEM MONITOR & CORE KPI OVERVIEW */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* HIGH-FIDELITY INTERACTIVE BRAND LOGO SHOWCASE CARD */}
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-[rgba(217,119,6,0.3)] shadow-[0_0_30px_rgba(217,119,6,0.05)] space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                {isAr ? 'منصة توهج الهوية الذكية' : 'INTELLIGENT BRAND ENVELOPE'}
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/20 font-bold uppercase">
                FOXNEX 3D
              </span>
            </div>
            
            <BrandLogo3D 
              size="lg" 
              interactiveControls={true} 
              onPlaySound={onPlaySound} 
              language={language === 'ar' ? 'ar' : 'en'} 
            />
          </div>

          {/* Card A: Secure System Telemetry */}
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  {isAr ? 'مؤشرات سلامة النظام' : 'SECURITY TELEMETRY ENGINE'}
                </span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20 font-bold">
                  {isAr ? 'مؤمن' : 'SECURE'}
                </span>
              </div>
              
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    {isAr ? 'سلامة النواة' : 'Kernel Integrity'}
                  </span>
                  <span className="text-cyan-400 font-bold font-sans">{systemIntegrity}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1 rounded-full" style={{ width: `${systemIntegrity}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-300 mt-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    {isAr ? 'سجلات كاش التخزين المحلي' : 'Offline Cache Sync'}
                  </span>
                  <span className="text-emerald-400 font-bold">{isAr ? 'متزامن' : '0ms Latency'}</span>
                </div>
                
                <div className="flex justify-between items-center text-[11px] text-slate-300 mt-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-pink-400" />
                    {isAr ? 'حالة السيرفر والذاكرة' : 'HMR Sandbox Host'}
                  </span>
                  <span className="text-pink-400 font-bold">Port 3000 // Active</span>
                </div>
              </div>
            </div>

            {/* Quick Indicators Stats Matrix */}
            <div className="mt-4 pt-3.5 border-t border-white/5 space-y-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                {isAr ? 'إحصاءات قاعدة البيانات الكلية' : 'DATABASE DIRECT RECORDS INDEX'}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                  <span className="text-slate-400 block">{isAr ? 'مقبوضات مالية' : 'Revenues'}</span>
                  <span className="text-sm font-bold text-emerald-400 font-sans mt-0.5 block">{revenues.length}</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                  <span className="text-slate-400 block">{isAr ? 'مصاريف مسجلة' : 'Expenses'}</span>
                  <span className="text-sm font-bold text-pink-400 font-sans mt-0.5 block">{expenses.length}</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                  <span className="text-slate-400 block">{isAr ? 'الباترونات الفعالة' : 'Blueprints'}</span>
                  <span className="text-sm font-semibold text-orange-400 font-sans mt-0.5 block">{stats.patternCount}</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                  <span className="text-slate-400 block">{isAr ? 'إجمالي العملاء' : 'Total Clients'}</span>
                  <span className="text-sm font-semibold text-purple-400 font-sans mt-0.5 block">{stats.clientCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Quick Stats High Value Accent */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-purple-950/30 to-slate-950/60 border border-purple-500/10 flex items-center justify-between shadow-md">
            <div>
              <p className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-bold">
                {isAr ? 'معدل نمو الإيرادات' : 'OPERATIONAL EFFICIENCY RATE'}
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                +{stats.growthPercentage}%
              </h3>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                {isAr ? 'زيادة التدفقات النقدية مقارنة بالخسائر' : 'Return relative to operational cost'}
              </p>
            </div>
            <div className="p-3 bg-purple-950/50 border border-purple-500/25 rounded-2xl text-purple-400">
              <TrendingUp className="w-6 h-6 animate-pulse" />
            </div>
          </div>

        </div>

      </div>

      {/* 3. TRIPLE BENTO GRID SECTIONS: ACTIVE MISSIONS, CLIENT FLOW, ACOUSTIC SYNTH MIXER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BENTO CARD 1: ACTIVE MISSION GOALS & PIPELINE PROGRESS */}
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold font-sans text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                {isAr ? 'الأهداف الإستراتيجية النشطة' : 'ACTIVE STRATEGIC MISSION GOALS'}
              </h3>
              <span className="font-mono text-[10px] text-cyan-400 font-bold">
                {stats.goalsAchieved} / {stats.goalsTotal}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {goals.length === 0 ? (
                <p className="font-mono text-xs text-slate-500 italic py-2">
                  {isAr ? 'لا توجد أهداف نشطة حالياً' : 'No active goals recorded.'}
                </p>
              ) : (
                goals.map((g) => {
                  const perc = Math.min(100, Math.round((g.current / g.target) * 100));
                  return (
                    <div key={g.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-200 font-medium truncate max-w-[150px]" title={g.title}>{g.title}</span>
                        <span className={`${g.completed ? 'text-emerald-400' : 'text-slate-400'} font-bold`}>
                          {g.current}/{g.target} {g.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${g.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500'}`} 
                          style={{ width: `${perc}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="pt-3 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={() => onSelectModule('goals-tasks')}
              className="text-[10px] text-slate-400 hover:text-cyan-400 font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{isAr ? 'تحديث وتعديل الأهداف' : 'MANAGE MISSION GOALS'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="font-mono text-[9px] text-slate-500">
              {goals.filter(item => !item.completed).length} {isAr ? 'معلق' : 'PENDING'}
            </span>
          </div>
        </div>

        {/* BENTO CARD 2: REAL-TIME CLIENT PIPELINE SUMMARY */}
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold font-sans text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                {isAr ? 'علاقات واتصالات العملاء' : 'CRM PIPELINE FLOW WORKSPACE'}
              </h3>
              <span className="font-mono text-[10px] text-slate-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                {clients.length} {isAr ? 'عملاء' : 'Leads'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {clients.slice(0, 4).map((cli) => (
                <div key={cli.id} className="flex justify-between items-center text-xs font-mono p-1.5 border-b border-white/[0.02]">
                  <div className="truncate max-w-[140px]">
                    <span className="text-slate-200 block font-sans font-medium">{cli.fullName}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{cli.service || (isAr ? 'طلب تفصيل' : 'Digital craft')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold block">{formatCurrency(cli.dealValue)}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold capitalize ${
                      cli.status === 'active' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                        : cli.status === 'completed' 
                          ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/10' 
                          : 'bg-yellow-950/60 text-yellow-500 border border-yellow-500/10'
                    }`}>
                      {cli.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-between items-center">
            <button 
              onClick={() => onSelectModule('clients')}
              className="text-[10px] text-slate-400 hover:text-purple-400 font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>{isAr ? 'فتح لوحة متابعة العملاء الكاملة' : 'OPEN CUSTOMER CRM HUB'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="font-mono text-[9px] text-slate-500">
              {clients.filter(curr => curr.status === 'active').length} {isAr ? 'مستمر' : 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* BENTO CARD 3: ACOUSTIC OSCILLATOR SOUND BOARD */}
        <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold font-sans text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                {isAr ? 'وحدة الرنين والصوت التوافقية' : 'ACOUSTIC OSCILLATOR SYNTH SYSTEM'}
              </h3>
              <span className="font-mono text-[9px] text-cyan-400">
                O-SYNTH // LIVE
              </span>
            </div>
            
            <p className="font-mono text-[10px] text-slate-400 mb-3 leading-relaxed">
              {isAr 
                ? 'اختبار إشارات التنبيه ومخرجات الصوت المصنعة في المتصفح باستخدام اهتزار التردد الأساسي للهاتف والكمبيوتر' 
                : 'Interactive frequency audio synthesis board. Trigger and test real-time soundscapes using raw browser oscillators.'}
            </p>

            {/* Tap Grid Sound Activators */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => triggerBeep('click')}
                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-left hover:border-emerald-500/40 text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-emerald-400 font-bold font-sans">CLICK</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span className="text-[9px] text-slate-500 mt-2 block font-mono">900Hz Sine</span>
              </button>

              <button
                onClick={() => triggerBeep('success')}
                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-left hover:border-cyan-500/40 text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-cyan-400 font-bold font-sans">SUCCESS</span>
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <span className="text-[9px] text-slate-500 mt-2 block font-mono">520/1040Hz Tri</span>
              </button>

              <button
                onClick={() => triggerBeep('warn')}
                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-left hover:border-yellow-500/40 text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-yellow-500 font-bold font-sans">WARNING</span>
                  <Bell className="w-3.5 h-3.5 text-yellow-500" />
                </div>
                <span className="text-[9px] text-slate-500 mt-2 block font-mono">180Hz Saw</span>
              </button>

              <button
                onClick={() => triggerBeep('lock')}
                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-left hover:border-purple-500/40 text-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-purple-400 font-bold font-sans">LOCKED</span>
                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <span className="text-[9px] text-slate-500 mt-2 block font-mono">360/180Hz Sine</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>{isAr ? 'إنتاج الصوت مباشر' : 'SYNTH AUDIO: POWERED'}</span>
            <span className="text-emerald-400">● 4 CHANNELS</span>
          </div>
        </div>

      </div>

    </div>
  );
}
