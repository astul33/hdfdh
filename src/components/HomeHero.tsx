/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, BookOpen, Gamepad2, Award, User, Settings, ArrowLeft, Flame, Headphones, Volume2 } from 'lucide-react';
import { PlayerProfile, Story } from '../types';
import { CATEGORIES, LEVEL_TIERS } from '../data/stories';
import { soundEffects } from '../utils/audio';

interface HomeHeroProps {
  player: PlayerProfile;
  stories: Story[];
  onStartAdventure: () => void;
  onOpenLibrary: (categoryFilter?: string) => void;
  onOpenGames: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onSelectStory: (story: Story) => void;
  onQuickListen?: (story: Story) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  player,
  stories,
  onStartAdventure,
  onOpenLibrary,
  onOpenGames,
  onOpenAchievements,
  onOpenProfile,
  onOpenSettings,
  onSelectStory,
  onQuickListen
}) => {
  const currentTier = LEVEL_TIERS.find(t => t.level === player.level) || LEVEL_TIERS[0];
  const nextTier = LEVEL_TIERS.find(t => t.level === player.level + 1);
  const xpNeeded = nextTier ? nextTier.minXp - currentTier.minXp : 100;
  const currentLevelXp = player.xp - currentTier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / xpNeeded) * 100)));

  const featuredStory = stories.find(s => s.id === 'story-prophets-ark') || stories[0];

  return (
    <div className="relative overflow-hidden">
      {/* Moving Artwork Background with Ken Burns Animation & Cosmic Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/src/assets/images/hero_magical_castle_library_1794394324322.jpg"
          alt="مكتبة سحرية مضيئة"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] animate-ken-burns scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

        {/* Floating Animated Books & Magic Orbs */}
        <div className="absolute top-20 right-12 text-3xl animate-float-book opacity-70 hidden md:block">
          📖✨
        </div>
        <div className="absolute top-44 left-16 text-2xl animate-float-gentle opacity-60 hidden md:block" style={{ animationDelay: '2s' }}>
          📜⭐
        </div>
        <div className="absolute bottom-28 right-1/4 text-2xl animate-float-book opacity-60 hidden lg:block" style={{ animationDelay: '3.5s' }}>
          🕯️✨
        </div>

        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Top Floating Player Status Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-amber-500/30 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="text-3xl animate-float-gentle">{currentTier.badge}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">{currentTier.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">المستوى {player.level}</span>
              </div>
              <div className="w-36 sm:w-48 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-300 font-mono tabular-nums">
              {player.xp} XP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-500/20" />
              <span>سلسلة القراءة: {player.streakDays} أيام</span>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenSettings();
              }}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="الإعدادات"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title and Subtitle with Floating Elements */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4 animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابتك التفاعلية إلى حكايات الشجاعة والحكمة والمرح</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 font-naskh">
            عالم القصص والمغامرات
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto font-naskh">
            اقرأ القصص باللغة العربية الفصحى بخط النسخ الأصيل، استمع بنبرة طبيعية جذابة، وافتح ألعاباً مصغرة حماسية مع كل إنجاز تحققه!
          </p>
        </div>

        {/* The 6 Core Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartAdventure();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="text-sm">ابدأ المغامرة</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenLibrary();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white font-bold transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <BookOpen className="w-6 h-6 text-amber-400 group-hover:-translate-y-1 transition-transform" />
            <span className="text-sm">مكتبة القصص</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenGames();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-white font-bold transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <Gamepad2 className="w-6 h-6 text-purple-400 group-hover:rotate-6 transition-transform" />
            <span className="text-sm">ألعابي</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenAchievements();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-yellow-500/40 text-white font-bold transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <Award className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm">إنجازاتي وجوائزي</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenProfile();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-white font-bold transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <User className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm">الملف الشخصي</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-white font-bold transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <Settings className="w-6 h-6 text-slate-400 group-hover:rotate-45 transition-transform" />
            <span className="text-sm">الإعدادات</span>
          </button>
        </div>

        {/* Featured Story Spotlight Card with Moving Animated Image & Audio Action */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-right">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-2">
                <span>قصة الأسبوع المميزة</span>
                <span aria-hidden="true">·</span>
                <span>قصص الأنبياء</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>مدعومة بالصوت بالكامل</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 font-naskh">
                {featuredStory.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-naskh">
                {featuredStory.synopsis}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectStory(featuredStory);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>اقرأ القصة الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {onQuickListen && (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onQuickListen(featuredStory);
                    }}
                    className="px-5 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Headphones className="w-4 h-4" />
                    <span>استمع إلى الحكاية بصوت فصيح 🎧</span>
                  </button>
                )}

                <div className="text-xs text-slate-400 flex items-center gap-2 mr-auto sm:mr-0">
                  <span>⏱️ {featuredStory.readTimeMinutes} دقائق</span>
                  <span>·</span>
                  <span>⭐ 3 نجوم مكافأة</span>
                </div>
              </div>
            </div>

            {/* Featured Image with Moving Ken Burns Effect and Floating Badge */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-amber-500/40 relative shadow-2xl bg-slate-950 group">
                {featuredStory.coverImage ? (
                  <img
                    src={featuredStory.coverImage}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover animate-ken-burns transition-transform duration-700"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${featuredStory.coverGradient} flex items-center justify-center text-7xl`}>
                    {featuredStory.coverIcon}
                  </div>
                )}
                {/* Light reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs">
                  <span className="text-amber-200 font-bold bg-slate-950/80 px-3 py-1.5 rounded-xl backdrop-blur-md border border-amber-500/20">
                    {featuredStory.moralLesson}
                  </span>
                  <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold animate-pulse">
                    ✨ مشوقة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Categories Grid (10 required categories) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-naskh">
                أقسام وعوالم القصص
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-naskh">
                اختر القسم الذي يثير فضولك وانطلق في مغامرتك القادمة
              </p>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenLibrary();
              }}
              className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>عرض كل القصص</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundEffects.playClick();
                  onOpenLibrary(cat.id);
                }}
                className="flex flex-col text-right p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all hover:-translate-y-1 text-slate-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-2xl">
                  {cat.icon}
                </div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
