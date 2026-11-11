/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Gamepad2, Sparkles, ShoppingBag, User, Compass, Volume2, VolumeX } from 'lucide-react';
import { PlayerProfile } from '../types';
import { soundEffects } from '../utils/audio';

interface NavbarProps {
  currentTab: 'home' | 'library' | 'map' | 'custom_story' | 'shop' | 'profile';
  setCurrentTab: (tab: 'home' | 'library' | 'map' | 'custom_story' | 'shop' | 'profile') => void;
  player: PlayerProfile;
  toggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, player, toggleSound }) => {
  const handleNavClick = (tab: typeof currentTab) => {
    soundEffects.playClick();
    setCurrentTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-right group cursor-pointer focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10 text-white font-bold group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              عالم القصص والمغامرات
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              اقرأ، استمع، والعب التحديات
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (concise, single-line) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>الرئيسية</span>
          </button>

          <button
            onClick={() => handleNavClick('library')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'library'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>مكتبة القصص</span>
          </button>

          <button
            onClick={() => handleNavClick('map')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'map'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>ألعابي وخريطة المراحل</span>
          </button>

          <button
            onClick={() => handleNavClick('custom_story')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'custom_story'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>صانع القصص</span>
          </button>

          <button
            onClick={() => handleNavClick('shop')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentTab === 'shop'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>المتجر والجوائز</span>
          </button>
        </nav>

        {/* Zone 3: HUD Stats & Sound / Profile action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Stars & Coins counters */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-200">
            <div className="flex items-center gap-1 text-amber-400" title="النجوم">
              <span>⭐</span>
              <span className="tabular-nums font-mono">{player.stars}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-yellow-400" title="العملات الذهبية">
              <span>🪙</span>
              <span className="tabular-nums font-mono">{player.coins}</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-rose-400" title="أيام القراءة المتتالية">
              <span>🔥</span>
              <span className="tabular-nums font-mono">{player.streakDays}</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={player.settings.soundEffects ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            {player.settings.soundEffects ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Profile CTA */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-700/80 text-amber-300 hover:border-amber-500/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{player.name}</span>
            <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300 font-mono">
              م.{player.level}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-850 bg-slate-950/95 px-2 py-1.5 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => handleNavClick('home')}
          className={`px-2 py-1 rounded cursor-pointer ${currentTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => handleNavClick('library')}
          className={`px-2 py-1 rounded cursor-pointer ${currentTab === 'library' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          المكتبة
        </button>
        <button
          onClick={() => handleNavClick('map')}
          className={`px-2 py-1 rounded cursor-pointer ${currentTab === 'map' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          ألعابي
        </button>
        <button
          onClick={() => handleNavClick('custom_story')}
          className={`px-2 py-1 rounded cursor-pointer ${currentTab === 'custom_story' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          صانع القصص
        </button>
        <button
          onClick={() => handleNavClick('shop')}
          className={`px-2 py-1 rounded cursor-pointer ${currentTab === 'shop' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          المتجر
        </button>
      </div>
    </header>
  );
};
