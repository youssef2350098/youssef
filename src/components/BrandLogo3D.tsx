/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sliders, RefreshCw, Zap, Maximize2, ShieldAlert,
  Sun, Compass, Palette, Scissors, Activity, Eye, Play, Pause
} from 'lucide-react';

interface BrandLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactiveControls?: boolean;
  onPlaySound?: (type: 'click' | 'success' | 'warn' | 'lock') => void;
  language?: 'en' | 'ar';
}

export function BrandLogo3D({ 
  size = 'md', 
  interactiveControls = false, 
  onPlaySound,
  language = 'en'
}: BrandLogo3DProps) {
  // Sizing styles
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-14 sm:h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56',
    xl: 'w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72'
  };

  const isAr = language === 'ar';

  // State controls for illuminated frame
  const [glowIntensity, setGlowIntensity] = useState<number>(75); // 0-100
  const [glowMode, setGlowMode] = useState<'pulse' | 'static' | 'breathing' | 'cycle'>('breathing');
  const [colorTheme, setColorTheme] = useState<'gold' | 'neon' | 'cyber' | 'emerald'>('gold');
  const [parallaxEnabled, setParallaxEnabled] = useState<boolean>(true);
  const [logoSource, setLogoSource] = useState<'asset' | 'vector'>('asset');
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Parallax tilt angles
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sound feedback assistant
  const triggerBeep = (type: 'click' | 'success' | 'warn' | 'lock') => {
    if (onPlaySound) onPlaySound(type);
  };

  // 3D Parallax effect tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallaxEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt limit to ±15 degrees
    const factor = size === 'xl' ? 14 : 18;
    const rx = -(y / (rect.height / 2)) * factor;
    const ry = (x / (rect.width / 2)) * factor;
    
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  // Color theme definitions mapped to Tailwind & inline styles
  const getGlowStyles = () => {
    const opacityVal = glowIntensity / 100;
    const spread = Math.floor((glowIntensity / 100) * (size === 'xl' ? 45 : 30));
    
    let colorHex = 'rgba(217, 119, 6, '; // Amber/Gold base
    let gradientText = 'from-amber-400 via-yellow-200 to-amber-500';
    let ringClass = 'border-amber-400/40 shadow-amber-500/30';
    let pulseBg = 'bg-amber-500';

    if (colorTheme === 'cyber') {
      colorHex = 'rgba(168, 85, 247, '; // Purple
      gradientText = 'from-purple-400 via-pink-400 to-blue-500';
      ringClass = 'border-purple-400/40 shadow-purple-500/30';
      pulseBg = 'bg-purple-500';
    } else if (colorTheme === 'neon') {
      colorHex = 'rgba(6, 182, 212, '; // Cyan
      gradientText = 'from-cyan-400 via-sky-200 to-indigo-500';
      ringClass = 'border-cyan-400/40 shadow-cyan-500/30';
      pulseBg = 'bg-cyan-500';
    } else if (colorTheme === 'emerald') {
      colorHex = 'rgba(16, 185, 129, '; // Emerald
      gradientText = 'from-emerald-400 via-teal-200 to-cyan-500';
      ringClass = 'border-emerald-400/40 shadow-emerald-500/30';
      pulseBg = 'bg-emerald-500';
    }

    return {
      boxShadow: `0 0 ${spread}px ${colorHex}${opacityVal * 0.4}), inset 0 0 15px ${colorHex}${opacityVal * 0.15})`,
      borderNeon: `1px solid ${colorHex}${opacityVal * 0.5})`,
      gradientText,
      ringClass,
      pulseBg,
      colorHex
    };
  };

  const styles = getGlowStyles();

  // Animation variants
  const getAnimationDuration = () => {
    if (glowMode === 'pulse') return '1.5s';
    if (glowMode === 'breathing') return '3.5s';
    return '0s'; // Static
  };

  return (
    <div className="flex flex-col items-center justify-center p-1 w-full max-w-md mx-auto">
      
      {/* 3D CANVAS PORTAL */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing preserve-3d"
        style={{ perspective: 1000 }}
      >
        {/* Layer A: Dynamic Outer Ambient Glow Halo (Stretches back) */}
        <div 
          className={`absolute rounded-full transition-all duration-300 pointer-events-none filter blur-xl ${
            glowMode === 'pulse' ? 'animate-pulse' : glowMode === 'breathing' ? 'animate-pulse' : ''
          }`}
          style={{
            width: '90%',
            height: '90%',
            opacity: glowIntensity / 100,
            background: `radial-gradient(circle, ${styles.colorHex}0.4) 0%, transparent 70%)`,
            animationDuration: getAnimationDuration(),
            transform: 'translateZ(-40px) scale(1.1)'
          }}
        />

        {/* Layer B: Custom 3D Metallic Beveled Outer Ring */}
        <div 
          className={`rounded-full p-1.5 transition-all duration-300 border bg-gradient-to-tr from-slate-900/90 via-slate-950/85 to-slate-900/90 ${
            sizeClasses[size]
          }`}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0px)`,
            boxShadow: styles.boxShadow,
            border: styles.borderNeon,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Layer C: Dynamic Laser Ring Accent (Inner Halo) */}
          <div 
            className="absolute inset-0 rounded-full border border-white/5 pointer-events-none"
            style={{ transform: 'translateZ(10px) scale(0.99)' }}
          />

          {/* Layer D: Main Image Cylinder Stage Wrapper */}
          <div 
            className="w-full h-full rounded-full overflow-hidden relative bg-black flex items-center justify-center"
            style={{ transform: 'translateZ(15px)' }}
          >
            {/* SVG Vector Fallback Mode */}
            {logoSource === 'vector' ? (
              <div className="w-full h-full p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-950 text-center relative">
                {/* Sewing Machine Vector Icon in High Contrast Gold */}
                <span className="text-[10px] text-slate-500 font-mono absolute top-2 tracking-[0.2em] font-extrabold">FOXNEX</span>
                
                <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 text-amber-400 fill-none stroke-current stroke-3 pr-1 sm:pr-2">
                  {/* Styled Sewing Machine silhouette */}
                  <path d="M15 80 L85 80" strokeLinecap="round" strokeWidth="4" />
                  <path d="M25 80 L25 40 Q25 30, 40 30 L70 30 Q80 30, 80 40 L80 50 Q80 55, 75 55 L65 55 L65 80" strokeLinecap="round" strokeWidth="4" />
                  <circle cx="78" cy="45" r="7" className="stroke-2 fill-slate-900" />
                  <line x1="38" y1="30" x2="38" y2="80" strokeDasharray="3,3" />
                  <path d="M48 20 Q55 25, 62 20" strokeWidth="2" />
                </svg>

                <div className="absolute bottom-2.5 flex items-center gap-1 font-sans font-bold text-[10px] sm:text-xs text-amber-400">
                  <Scissors className="w-2.5 h-2.5 spin-slow" />
                  <span className="tracking-widest uppercase">TAILORED v3</span>
                </div>
              </div>
            ) : (
              /* Generated 3D Asset Image Block */
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src="/src/assets/images/foxnex_logo_1781647786238.jpg" 
                  alt="Foxnex High Fidelity 3D Logo" 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isRotating ? 'animate-spin' : 'hover:scale-105'
                  }`}
                  style={{ animationDuration: '24s' }}
                />
                
                {/* Micro shadow overlay to blend image seamlessly with the glass container */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/0 to-black/30 pointer-events-none" />
                <div className="absolute inset-0 border border-black/30 pointer-events-none rounded-full" />
              </div>
            )}

            {/* Glass Flare/Highlight Layer (gives visual curvature and depth) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none rounded-full" />
            
            {/* Spinning/pulsating radial ring representing dynamic state */}
            {glowMode === 'cycle' && (
              <motion.div 
                className="absolute inset-0 border border-dashed rounded-full pointer-events-none"
                style={{ borderColor: styles.colorHex + '0.4)' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              />
            )}
          </div>

          {/* Layer E: Dynamic status beam pin */}
          <div 
            className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full border border-slate-950 flex items-center justify-center ${styles.pulseBg} text-[6px] sm:text-[8px] text-black font-extrabold text-center tracking-tighter shadow-md animate-bounce`}
            style={{ transform: 'translateZ(25px)' }}
            title="System Active"
          >
            F
          </div>
        </div>
      </div>

      {/* 4. OPTIONAL COMPACT INTERACTIVE LOGO LABORATORY CONTROLLER */}
      {interactiveControls && (
        <div className="w-full mt-6 bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="font-sans font-bold text-xs text-slate-200 tracking-wider flex items-center gap-1.5 uppercase">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              {isAr ? 'متحكم الرنين الضوئي الرقمي' : 'LOGO ILLUMINATION LAB'}
            </h4>
            <span className="font-mono text-[9px] text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
              {colorTheme}-{glowMode}
            </span>
          </div>

          {/* Controller parameters */}
          <div className="space-y-3 font-mono text-[10px] sm:text-xs text-slate-300">
            {/* Tuning A: Glow brightness slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-yellow-400" />
                  {isAr ? 'شدة الإضاءة المتوهجة' : 'Glow Beam Intensity'}
                </span>
                <span className="text-yellow-400 font-sans font-bold">{glowIntensity}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={glowIntensity}
                onChange={(e) => {
                  setGlowIntensity(Number(e.target.value));
                  if (Number(e.target.value) % 15 === 0) triggerBeep('click');
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Tuning B: Spectrum thematic layout */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                onClick={() => { setColorTheme('gold'); triggerBeep('click'); }}
                className={`py-1.5 rounded-lg border text-[9px] font-bold text-center transition-all ${
                  colorTheme === 'gold' 
                    ? 'bg-amber-950 text-amber-300 border-amber-500' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                {isAr ? 'ذهبي' : 'LUX GOLD'}
              </button>
              <button
                onClick={() => { setColorTheme('cyber'); triggerBeep('click'); }}
                className={`py-1.5 rounded-lg border text-[9px] font-bold text-center transition-all ${
                  colorTheme === 'cyber' 
                    ? 'bg-purple-950 text-purple-300 border-purple-500' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                {isAr ? 'بفسجي' : 'CYBER'}
              </button>
              <button
                onClick={() => { setColorTheme('neon'); triggerBeep('click'); }}
                className={`py-1.5 rounded-lg border text-[9px] font-bold text-center transition-all ${
                  colorTheme === 'neon' 
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                {isAr ? 'سماوي' : 'NEON'}
              </button>
              <button
                onClick={() => { setColorTheme('emerald'); triggerBeep('click'); }}
                className={`py-1.5 rounded-lg border text-[9px] font-bold text-center transition-all ${
                  colorTheme === 'emerald' 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500' 
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
              >
                {isAr ? 'زمرد' : 'PRISM'}
              </button>
            </div>

            {/* Tuning C: Pulse state parameters */}
            <div className="space-y-1.5">
              <span className="text-slate-400 block mb-1">
                {isAr ? 'نمط وحالة الموجة الضوئية' : 'Illumination State Signal'}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => { setGlowMode('breathing'); triggerBeep('success'); }}
                  className={`py-1 rounded border text-[9px] ${
                    glowMode === 'breathing' ? 'bg-slate-900 border-cyan-400 text-white' : 'bg-black/30 border-white/5 text-slate-400'
                  }`}
                >
                  {isAr ? 'تنفس هادئ' : 'BREATHING'}
                </button>
                <button
                  onClick={() => { setGlowMode('pulse'); triggerBeep('success'); }}
                  className={`py-1 rounded border text-[9px] ${
                    glowMode === 'pulse' ? 'bg-slate-900 border-pink-400 text-white' : 'bg-black/30 border-white/5 text-slate-400'
                  }`}
                >
                  {isAr ? 'نبض طاقة' : 'RAPID PULSE'}
                </button>
                <button
                  onClick={() => { setGlowMode('static'); triggerBeep('click'); }}
                  className={`py-1 rounded border text-[9px] ${
                    glowMode === 'static' ? 'bg-slate-900 border-white/20 text-white' : 'bg-black/30 border-white/5 text-slate-400'
                  }`}
                >
                  {isAr ? 'ثابت مريح' : 'STATIC GLOW'}
                </button>
              </div>
            </div>

            {/* Tuning D: Advance toggles */}
            <div className="flex gap-4 justify-between items-center pt-2 border-t border-white/5">
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400 hover:text-slate-200">
                <input 
                  type="checkbox" 
                  checked={parallaxEnabled} 
                  onChange={(e) => {
                    setParallaxEnabled(e.target.checked);
                    triggerBeep('click');
                  }}
                  className="rounded border-white/10 text-purple-500 focus:ring-0 bg-slate-900 w-3 h-3 cursor-pointer"
                />
                <span>{isAr ? 'تأثير العمق التفاعلي (3D)' : '3D Mouse Parallax'}</span>
              </label>

              <button
                onClick={() => {
                  setLogoSource(prev => prev === 'asset' ? 'vector' : 'asset');
                  triggerBeep('success');
                }}
                className="text-[9px] underline text-cyan-400 font-bold hover:text-cyan-300"
              >
                {logoSource === 'asset' 
                  ? (isAr ? 'الانتقال للرسم الـ Vector' : 'SWITCH TO CRISP VECTOR') 
                  : (isAr ? 'تفعيل شعار الـ 3D الحقيقي' : 'SWITCH TO REAL 3D ASSET')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
