/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Unlock, Play, Gamepad2, CheckCircle2, Sparkles } from 'lucide-react';
import { Story, PlayerProfile } from '../types';
import { soundEffects } from '../utils/audio';

interface StagesMapProps {
  stories: Story[];
  player: PlayerProfile;
  onSelectStory: (story: Story) => void;
  onLaunchGame: (story: Story) => void;
}

export const StagesMap: React.FC<StagesMapProps> = ({
  stories,
  player,
  onSelectStory,
  onLaunchGame
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Roadmap Intro */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خريطة المراحل وتدرج القراءة والألعاب</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white font-naskh mb-2">
          طريق المغامر وخريطة المراحل
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto font-naskh">
          أكمل قراءة كل قصة لفك قفل اللعبة التفاعلية الخاصة بها وحصد النجوم الذهبية للارتقاء في المستويات!
        </p>
      </div>

      {/* Vertical Story Nodes Road */}
      <div className="relative">
        {/* Connecting central road line */}
        <div className="absolute right-6 sm:right-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-amber-500 via-purple-600 to-indigo-700 -translate-x-1/2 rounded-full opacity-40 hidden sm:block" />

        <div className="space-y-8 sm:space-y-12">
          {stories.map((story, idx) => {
            const isCompleted = player.completedStoryIds.includes(story.id);
            const isGameUnlocked = player.unlockedGameIds.includes(story.id);
            const isGameWon = player.completedGameIds.includes(story.id);
            const isEven = idx % 2 === 0;

            return (
              <div
                key={story.id}
                className={`flex flex-col sm:flex-row items-center gap-6 ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Story Stage Card */}
                <div className="w-full sm:w-[45%] bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all hover:scale-[1.01]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400">
                      المرحلة {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs">
                      {isCompleted ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مقروءة</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">بانتظار القراءة</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${story.coverGradient} flex items-center justify-center text-2xl shrink-0 shadow-md`}>
                      {story.coverIcon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base font-naskh line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-naskh">
                        {story.synopsis}
                      </p>
                    </div>
                  </div>

                  {/* Actions for Story and Game */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onSelectStory(story);
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'إعادة القراءة' : 'ابدأ القراءة'}</span>
                    </button>

                    {isGameUnlocked ? (
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onLaunchGame(story);
                        }}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          isGameWon
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
                        }`}
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>{isGameWon ? 'العب مجدداً ⭐' : 'تحدي اللعبة! 🎮'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <Lock className="w-3 h-3" />
                        <span>اللعبة مقفلة</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Central Milestone Node Badge */}
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold z-10 shrink-0 font-mono">
                  {isGameWon ? '⭐' : isCompleted ? '📖' : idx + 1}
                </div>

                {/* Empty Spacer Column for Desktop */}
                <div className="w-full sm:w-[45%] hidden sm:block" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
