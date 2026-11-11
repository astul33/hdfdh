/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Heart, CheckCircle2, ArrowLeft, Download, Check, Headphones, Play } from 'lucide-react';
import { Story, StoryCategory, PlayerProfile } from '../types';
import { CATEGORIES } from '../data/stories';
import { soundEffects } from '../utils/audio';

interface StoryLibraryProps {
  stories: Story[];
  player: PlayerProfile;
  initialCategory?: string;
  onSelectStory: (story: Story) => void;
  onToggleFavorite: (storyId: string) => void;
  onToggleOffline: (storyId: string) => void;
  onQuickListen?: (story: Story) => void;
}

export const StoryLibrary: React.FC<StoryLibraryProps> = ({
  stories,
  player,
  initialCategory,
  onSelectStory,
  onToggleFavorite,
  onToggleOffline,
  onQuickListen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'completed' | 'recommended'>('all');

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      // Tab filter
      if (activeTab === 'favorites' && !player.favoriteStoryIds.includes(story.id)) {
        return false;
      }
      if (activeTab === 'completed' && !player.completedStoryIds.includes(story.id)) {
        return false;
      }
      if (activeTab === 'recommended') {
        if (player.completedStoryIds.includes(story.id)) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && story.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = story.title.toLowerCase().includes(query);
        const matchesSynopsis = story.synopsis.toLowerCase().includes(query);
        const matchesTags = story.tags.some(t => t.toLowerCase().includes(query));
        const matchesMoral = story.moralLesson.toLowerCase().includes(query);
        return matchesTitle || matchesSynopsis || matchesTags || matchesMoral;
      }

      return true;
    });
  }, [stories, searchQuery, selectedCategory, selectedDifficulty, activeTab, player]);

  const getCategoryName = (catId: StoryCategory) => {
    return CATEGORIES.find(c => c.id === catId)?.name || catId;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-naskh mb-2">
            مكتبة القصص والحكايات
          </h1>
          <p className="text-sm text-slate-400 font-naskh">
            تصفح مكتبتنا الشاملة بخط النسخ العربي الأصيل، واستمع بأصوات فصيحة، وافتح الألعاب المصغرة مع كل قصة
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:text-white'
            }`}
          >
            جميع القصص ({stories.length})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('favorites');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'favorites' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:text-white'
            }`}
          >
            المفضلة ({player.favoriteStoryIds.length})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('completed');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'completed' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:text-white'
            }`}
          >
            المقروءة ({player.completedStoryIds.length})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('recommended');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'recommended' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'hover:text-white'
            }`}
          >
            توصيات لك ✨
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، الكلمات المفتاحية، أو العِبرة..."
              className="w-full pl-4 pr-11 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">جميع مستويات الصعوبة</option>
            <option value="سهل">سهل</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            جميع الأقسام
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="text-lg font-bold text-white mb-1">لم يتم العثور على أي قصص تطابق بحثك</h3>
          <p className="text-sm text-slate-400 mb-4">جرب تغيير كلمات البحث أو اختيار قسم مختلف.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setActiveTab('all');
            }}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const isFav = player.favoriteStoryIds.includes(story.id);
            const isCompleted = player.completedStoryIds.includes(story.id);
            const isGameUnlocked = player.unlockedGameIds.includes(story.id);
            const isOffline = player.offlineSavedStoryIds.includes(story.id);

            return (
              <div
                key={story.id}
                className="group flex flex-col bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Moving Cover Header Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${story.coverGradient} flex flex-col items-center justify-center p-6 text-center`}>
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                        {story.coverIcon}
                      </div>
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top action overlays: Favorite & Offline save */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playClick();
                        onToggleFavorite(story.id);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
                        isFav ? 'bg-rose-500 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-white'
                      }`}
                      title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playClick();
                        onToggleOffline(story.id);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
                        isOffline ? 'bg-emerald-600 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-white'
                      }`}
                      title={isOffline ? 'محفوظة للقراءة دون اتصال' : 'تحميل للقراءة دون اتصال'}
                    >
                      {isOffline ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Badges on bottom of image */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs z-10">
                    <span className="text-amber-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-800">
                      {getCategoryName(story.category)}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-emerald-400 bg-slate-950/80 px-2 py-1 rounded-md backdrop-blur-sm font-semibold border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تمت قراءتها</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                      <span>⏱️ {story.readTimeMinutes} دقائق</span>
                      <span aria-hidden="true">·</span>
                      <span>مستوى: {story.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.ageGroup}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2 font-naskh line-clamp-1">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4 font-naskh">
                      {story.synopsis}
                    </p>
                  </div>

                  {/* Dual Action Controls: Read & Listen directly! */}
                  <div className="pt-3 border-t border-slate-850 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      {isGameUnlocked ? (
                        <span className="text-purple-400 font-bold flex items-center gap-1 font-naskh">
                          <span>🎮 التحدي مفتوح</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-naskh">🔒 يُفتح التحدي بعد القراءة</span>
                      )}
                      <span className="text-amber-400 font-mono">⭐ 3 نجوم</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onSelectStory(story);
                        }}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-transform active:scale-95 cursor-pointer font-naskh"
                      >
                        <span>اقرأ القصة</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      {onQuickListen && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            onQuickListen(story);
                          }}
                          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md shadow-purple-600/15 font-naskh"
                          title="استمع إلى القصة بصوت فصيح"
                        >
                          <Headphones className="w-4 h-4 text-purple-200" />
                          <span className="hidden sm:inline">استمع الآن 🎧</span>
                        </button>
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
  );
};
