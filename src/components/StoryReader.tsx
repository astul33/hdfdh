/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Moon,
  Sun,
  Coffee,
  Heart,
  ArrowRight,
  Sparkles,
  Gamepad2,
  BookmarkCheck,
  ShieldCheck,
  ShieldAlert,
  Headphones,
  Settings2,
  Check,
  Type
} from 'lucide-react';
import { Story, PlayerProfile } from '../types';
import { soundEffects, speechNarrator } from '../utils/audio';

interface StoryReaderProps {
  story: Story;
  player: PlayerProfile;
  autoPlayOnMount?: boolean;
  onBack: () => void;
  onStoryCompleted: (storyId: string, rewards: { xp: number; coins: number; stars: number }) => void;
  onLaunchGame: (story: Story) => void;
  onToggleFavorite: (storyId: string) => void;
  onUpdateLastPosition: (storyId: string, paragraphIndex: number) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  player,
  autoPlayOnMount = false,
  onBack,
  onStoryCompleted,
  onLaunchGame,
  onToggleFavorite,
  onUpdateLastPosition
}) => {
  const initialParagraph = Math.min(
    Math.max(0, player.lastReadPositions[story.id] || 0),
    story.paragraphs.length - 1
  );

  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(initialParagraph);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(player.settings.speechRate || 1.0);
  const [volume, setVolume] = useState<number>(player.settings.speechVolume || 1.0);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(player.settings.fontSize || 'md');
  const [fontFamily, setFontFamily] = useState<'naskh' | 'amiri' | 'tajawal'>('naskh');
  const [theme, setTheme] = useState<'night' | 'warm' | 'day'>(player.settings.readingTheme || 'night');
  const [softenSpooky, setSoftenSpooky] = useState<boolean>(player.settings.softenSpooky ?? true);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState<boolean>(false);

  // Available Arabic & system voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const isAlreadyCompleted = player.completedStoryIds.includes(story.id);
  const isFav = player.favoriteStoryIds.includes(story.id);

  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load available speech voices
  useEffect(() => {
    const updateVoices = () => {
      const arabic = speechNarrator.getArabicVoices();
      const all = speechNarrator.getVoices();
      const list = arabic.length > 0 ? arabic : all;
      setAvailableVoices(list);
      const best = speechNarrator.getBestArabicVoice();
      if (best) {
        setSelectedVoiceURI(best.voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      speechNarrator.stop();
    };
  }, []);

  // Handle auto-play on mount if requested
  useEffect(() => {
    if (autoPlayOnMount) {
      const timer = setTimeout(() => {
        playCurrentSentence(0, 0);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPlayOnMount]);

  // Clean stop when unmounting
  useEffect(() => {
    return () => {
      speechNarrator.stop();
    };
  }, []);

  const handleParagraphFocus = (index: number) => {
    setActiveParagraphIndex(index);
    onUpdateLastPosition(story.id, index);
  };

  const playCurrentSentence = (pIndex: number, sIndex: number) => {
    if (pIndex >= story.paragraphs.length) {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      handleFinishStory();
      return;
    }

    const currentParagraph = story.paragraphs[pIndex];
    if (sIndex >= currentParagraph.sentences.length) {
      const nextP = pIndex + 1;
      if (nextP < story.paragraphs.length) {
        setActiveParagraphIndex(nextP);
        setActiveSentenceIndex(0);
        handleParagraphFocus(nextP);
        soundEffects.playPageTurn();
        playCurrentSentence(nextP, 0);
      } else {
        setIsPlayingAudio(false);
        setIsAudioPaused(false);
        handleFinishStory();
      }
      return;
    }

    const textToSpeak = currentParagraph.sentences[sIndex];
    setActiveParagraphIndex(pIndex);
    setActiveSentenceIndex(sIndex);
    handleParagraphFocus(pIndex);

    // Smooth scroll to the active paragraph
    if (paragraphRefs.current[pIndex]) {
      paragraphRefs.current[pIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    speechNarrator.speak(
      textToSpeak,
      speechRate,
      volume,
      () => {
        setIsPlayingAudio(true);
        setIsAudioPaused(false);
      },
      () => {
        playCurrentSentence(pIndex, sIndex + 1);
      }
    );
  };

  const handleToggleListening = () => {
    soundEffects.playClick();
    if (isPlayingAudio && !isAudioPaused) {
      speechNarrator.pause();
      setIsAudioPaused(true);
    } else if (isAudioPaused) {
      speechNarrator.resume();
      setIsAudioPaused(false);
    } else {
      setIsPlayingAudio(true);
      playCurrentSentence(activeParagraphIndex, activeSentenceIndex);
    }
  };

  const handleStopListening = () => {
    soundEffects.playClick();
    speechNarrator.stop();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  const handleStepSentence = (direction: 'prev' | 'next') => {
    soundEffects.playClick();
    speechNarrator.stop();
    const currentParagraph = story.paragraphs[activeParagraphIndex];
    if (direction === 'next') {
      if (activeSentenceIndex + 1 < currentParagraph.sentences.length) {
        playCurrentSentence(activeParagraphIndex, activeSentenceIndex + 1);
      } else if (activeParagraphIndex + 1 < story.paragraphs.length) {
        playCurrentSentence(activeParagraphIndex + 1, 0);
      }
    } else {
      if (activeSentenceIndex > 0) {
        playCurrentSentence(activeParagraphIndex, activeSentenceIndex - 1);
      } else if (activeParagraphIndex > 0) {
        const prevPIndex = activeParagraphIndex - 1;
        const prevLastSentence = story.paragraphs[prevPIndex].sentences.length - 1;
        playCurrentSentence(prevPIndex, prevLastSentence);
      }
    }
  };

  const handleSentenceClick = (pIndex: number, sIndex: number) => {
    soundEffects.playClick();
    speechNarrator.stop();
    playCurrentSentence(pIndex, sIndex);
  };

  const handleCycleSpeed = () => {
    soundEffects.playClick();
    const speeds = [0.8, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(speechRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx] || 1.0;
    setSpeechRate(newSpeed);
    if (isPlayingAudio && !isAudioPaused) {
      speechNarrator.stop();
      playCurrentSentence(activeParagraphIndex, activeSentenceIndex);
    }
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    speechNarrator.setSelectedVoice(uri);
    if (isPlayingAudio && !isAudioPaused) {
      speechNarrator.stop();
      playCurrentSentence(activeParagraphIndex, activeSentenceIndex);
    }
  };

  const handleTestVoice = () => {
    soundEffects.playClick();
    speechNarrator.speak(
      'مرحباً بك في عالم القصص والمغامرات! هذا نموذج لقراءة النصوص باللغة العربية الفصحى بخط النسخ.',
      speechRate,
      volume
    );
  };

  const handleFinishStory = () => {
    soundEffects.playFanfare();
    setShowCompletionModal(true);
    onStoryCompleted(story.id, {
      xp: story.game.rewardXp,
      coins: story.game.rewardCoins,
      stars: story.game.rewardStars
    });
  };

  // Font family styles with Naskh as default
  const fontFamilyStyles = {
    naskh: 'font-naskh',
    amiri: 'font-story',
    tajawal: 'font-ui'
  };

  // Typographic font sizes with generous Naskh leading
  const fontSizes = {
    sm: 'text-base sm:text-lg leading-[2.1] sm:leading-[2.2]',
    md: 'text-lg sm:text-xl leading-[2.2] sm:leading-[2.4]',
    lg: 'text-xl sm:text-2xl leading-[2.3] sm:leading-[2.5]',
    xl: 'text-2xl sm:text-3xl leading-[2.4] sm:leading-[2.6]'
  };

  // Themes
  const themeStyles = {
    night: 'bg-slate-950 text-slate-100',
    warm: 'bg-[#241c15] text-[#f7e6d0]',
    day: 'bg-[#faf6ee] text-[#1c1917]'
  };

  const cardBorderTheme = {
    night: 'border-slate-800 bg-slate-900/60',
    warm: 'border-[#423326] bg-[#2d231a]/80',
    day: 'border-[#e6ded2] bg-[#f2ecdf]'
  };

  const headerTheme = {
    night: 'bg-slate-950/95 border-slate-800 text-slate-100',
    warm: 'bg-[#1e1711]/95 border-[#423326] text-[#f7e6d0]',
    day: 'bg-[#f5f0e6]/95 border-[#e2d8c7] text-[#1c1917]'
  };

  const paragraphHighlightTheme = {
    night: 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5',
    warm: 'bg-amber-600/15 border-amber-600/50 shadow-lg shadow-amber-600/5',
    day: 'bg-amber-200/50 border-amber-400/80 shadow-md shadow-amber-900/5'
  };

  // Calculate reading progress
  const totalSentences = story.paragraphs.reduce((sum, p) => sum + p.sentences.length, 0);
  const currentSentenceTotal =
    story.paragraphs.slice(0, activeParagraphIndex).reduce((sum, p) => sum + p.sentences.length, 0) +
    activeSentenceIndex +
    1;
  const progressPercent = Math.min(100, Math.round((currentSentenceTotal / totalSentences) * 100));

  return (
    <div className={`min-h-screen ${themeStyles[theme]} transition-colors duration-300 pb-28`}>
      {/* Top Header Sticky Controls with Progress Bar */}
      <div className={`sticky top-0 z-30 ${headerTheme} backdrop-blur-md border-b shadow-sm`}>
        {/* Story Reading Progress Strip */}
        <div className="w-full bg-slate-800/40 h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={() => {
              speechNarrator.stop();
              soundEffects.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer bg-slate-900/70 hover:bg-slate-800 text-slate-200 border-slate-700/80"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">العودة للمكتبة</span>
          </button>

          {/* Center Story Title Snippet */}
          <div className="flex-1 text-center truncate px-2">
            <span className="text-xs sm:text-sm font-bold font-naskh text-amber-400 truncate block">
              {story.title}
            </span>
          </div>

          {/* Reader Preferences Bar */}
          <div className="flex items-center gap-1.5">
            {story.category === 'mystery' && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setSoftenSpooky(!softenSpooky);
                }}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-xl text-xs font-bold flex items-center gap-1 border cursor-pointer ${
                  softenSpooky
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="تخفيف أجواء الغموض للأطفال"
              >
                {softenSpooky ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">أجواء هادئة</span>
              </button>
            )}

            {/* Font family selector (Naskh focus!) */}
            <div className="flex items-center bg-slate-900/80 border border-slate-700/80 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setFontFamily('naskh');
                }}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                  fontFamily === 'naskh' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="خط النسخ المعتمد"
              >
                نسخ
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setFontFamily('amiri');
                }}
                className={`px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                  fontFamily === 'amiri' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
                title="خط النسخ الأميري"
              >
                أميري
              </button>
            </div>

            {/* Font size adjuster */}
            <div className="flex items-center bg-slate-900/80 border border-slate-700/80 rounded-xl p-0.5 text-xs font-bold text-slate-300">
              {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => {
                    soundEffects.playClick();
                    setFontSize(size);
                  }}
                  className={`px-1.5 sm:px-2 py-1 rounded-lg cursor-pointer transition-colors ${
                    fontSize === size ? 'bg-amber-500 text-slate-950' : 'hover:text-white'
                  }`}
                >
                  {size === 'sm' ? 'ص' : size === 'md' ? 'م' : size === 'lg' ? 'ك' : 'ض'}
                </button>
              ))}
            </div>

            {/* Theme switcher */}
            <div className="flex items-center bg-slate-900/80 border border-slate-700/80 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setTheme('night')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'night' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'}`}
                title="الوضع الليلي"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('warm')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'warm' ? 'bg-[#3d2f23] text-amber-300' : 'text-slate-400'}`}
                title="الوضع العاجي الدافئ"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('day')}
                className={`p-1.5 rounded-lg cursor-pointer ${theme === 'day' ? 'bg-slate-200 text-amber-700' : 'text-slate-400'}`}
                title="الوضع النهاري"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Favorite toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleFavorite(story.id);
              }}
              className={`p-2 rounded-xl border cursor-pointer ${
                isFav
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:text-white'
              }`}
              title="المفضلة"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Audio Floating Player Controls Bar */}
        <div className="max-w-4xl mx-auto px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleListening}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                isPlayingAudio && !isAudioPaused
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/40 ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isPlayingAudio && !isAudioPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isAudioPaused ? 'استكمال الاستماع' : 'استمع إلى القصة'}</span>
                </>
              )}
            </button>

            {/* Animated Audio Sound Wave Visualizer */}
            {isPlayingAudio && !isAudioPaused && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-950/90 rounded-xl border border-amber-500/40 h-8">
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '14px' }} />
                <span className="w-1 bg-amber-300 rounded-full animate-bounce" style={{ height: '22px', animationDelay: '0.15s' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '12px', animationDelay: '0.3s' }} />
                <span className="w-1 bg-amber-500 rounded-full animate-bounce" style={{ height: '20px', animationDelay: '0.45s' }} />
                <span className="w-1 bg-amber-400 rounded-full animate-pulse" style={{ height: '15px', animationDelay: '0.2s' }} />
                <span className="text-[11px] text-amber-300 font-naskh mr-1 font-semibold">صوت فصيح</span>
              </div>
            )}

            {isPlayingAudio && (
              <button
                onClick={handleStopListening}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                إيقاف كامل
              </button>
            )}

            <button
              onClick={() => handleStepSentence('prev')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="الجملة السابقة"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleStepSentence('next')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="الجملة التالية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-naskh hidden sm:inline">
              الفقرة {activeParagraphIndex + 1} من {story.paragraphs.length} (الجملة {activeSentenceIndex + 1})
            </span>

            <button
              onClick={handleCycleSpeed}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold cursor-pointer hover:border-amber-500/40"
              title="سرعة القراءة"
            >
              {speechRate}x
            </button>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Volume2 className="w-3.5 h-3.5" />
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-16 accent-amber-500 cursor-pointer"
                title="مستوى الصوت"
              />
            </div>

            {/* Voice Settings Trigger */}
            <button
              onClick={() => setIsVoiceSettingsOpen(!isVoiceSettingsOpen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isVoiceSettingsOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="إعدادات الصوت والنطق"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dropdown Voice Selector Bar */}
        {isVoiceSettingsOpen && (
          <div className="max-w-4xl mx-auto px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-semibold shrink-0">اختيار صوت الراوي:</span>
              <select
                value={selectedVoiceURI || ''}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="">الصوت العربي التلقائي الافتراضي</option>
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestVoice}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 cursor-pointer"
              >
                اختبار الصوت 🔊
              </button>
              <button
                onClick={() => setIsVoiceSettingsOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Reading View Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {/* Story Moving Cover and Metadata Header */}
        <div className="mb-8">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-amber-500/30 relative shadow-2xl mb-6 bg-slate-950 group">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover animate-ken-burns scale-105"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${story.coverGradient} flex flex-col items-center justify-center p-6 text-center`}>
                <span className="text-7xl mb-2 drop-shadow-md">{story.coverIcon}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-amber-200 font-bold text-xs bg-slate-950/85 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-amber-500/30 font-naskh">
                العِبرة: {story.moralLesson}
              </span>
              <span className="text-emerald-300 text-xs bg-slate-950/85 px-3 py-1.5 rounded-xl backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 font-naskh">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>قراءة صوتية فصيحة متزامنة بالنسخ</span>
              </span>
            </div>
          </div>

          <div className="text-right">
            {/* Arabic Decorative Heading Ornament */}
            <div className="flex items-center justify-center gap-3 my-3 text-amber-500/60">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
              <span className="text-base select-none">❖ ﷽ ❖</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 font-naskh leading-tight text-center sm:text-right">
              {story.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed font-naskh">
              {story.synopsis}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pb-6 border-b border-slate-800/80 font-naskh">
              <span>الفئة: {story.category}</span>
              <span aria-hidden="true">·</span>
              <span>الصعوبة: {story.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{story.ageGroup}</span>
              <span aria-hidden="true">·</span>
              <span>الخط: {fontFamily === 'naskh' ? 'خط النسخ (نوتو)' : fontFamily === 'amiri' ? 'النسخ الأميري' : 'تجوال'}</span>
              {isAlreadyCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-bold">✓ قرأتها مسبقاً</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Story Text Paragraphs with Sentence-by-Sentence Synchronized Highlighting */}
        <div className={`space-y-8 ${fontFamilyStyles[fontFamily]}`}>
          {story.paragraphs.map((paragraph, pIdx) => {
            const isActiveP = activeParagraphIndex === pIdx;

            return (
              <div
                key={paragraph.id}
                ref={(el) => {
                  paragraphRefs.current[pIdx] = el;
                }}
                className={`p-5 sm:p-7 rounded-3xl transition-all duration-300 border ${
                  isActiveP
                    ? paragraphHighlightTheme[theme]
                    : `${cardBorderTheme[theme]} hover:border-amber-500/30`
                }`}
              >
                {/* Paragraph Index Bookmark Tag */}
                <div className="flex items-center justify-between mb-3 text-[11px] text-amber-500/70 border-b border-amber-500/10 pb-2">
                  <span className="font-naskh font-bold">
                    الفقرة رقم {pIdx + 1} من {story.paragraphs.length}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    اضغط على أي جملة للاستماع إليها مباشرة 👆
                  </span>
                </div>

                <p className={`${fontSizes[fontSize]} select-text text-justify`}>
                  {paragraph.sentences.map((sentence, sIdx) => {
                    const isSpokenSentence = isActiveP && activeSentenceIndex === sIdx && isPlayingAudio;
                    return (
                      <span
                        key={sIdx}
                        onClick={() => handleSentenceClick(pIdx, sIdx)}
                        className={`transition-all duration-200 inline rounded-lg px-1 py-0.5 cursor-pointer ${
                          isSpokenSentence
                            ? 'bg-amber-400/35 text-amber-200 ring-2 ring-amber-400/60 font-bold shadow-sm'
                            : 'hover:bg-amber-500/15 hover:text-amber-300'
                        }`}
                        title="انقر للاستماع إلى هذه الجملة"
                      >
                        {sentence}{' '}
                      </span>
                    );
                  })}
                </p>
              </div>
            );
          })}
        </div>

        {/* End of Story Action Area */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 mb-3 shadow-inner">
            <BookmarkCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white mb-2 font-naskh">
            وصلت إلى نهاية الحكاية المباركة!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 font-naskh leading-relaxed">
            اضغط على الزر أدناه لتسجيل إتمام القصة، وحصد مكافآتك من النجوم والعملات وفتح التحدي واللعبة المصغرة!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleFinishStory}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>أنهيت القراءة وافتح التحدي!</span>
            </button>

            {isAlreadyCompleted && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onLaunchGame(story);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>العب اللعبة المصغرة فوراً</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Completion & Rewards Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative animate-float-gentle">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
              🎉
            </div>
            <h3 className="text-2xl font-black text-white mb-2 font-naskh">
              مبارك! أتممت قراءة الحكاية
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 font-naskh leading-relaxed">
              لقد أحسنت يا بطل! تم إضافة مكافأتك إلى رصيدك وفُتحت لك لعبة القصة الخاصة:
              <span className="block mt-1 font-bold text-amber-400">«{story.game.title}»</span>
            </p>

            {/* Rewards Breakdown */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-lg">⭐</span>
                <span className="text-xs text-slate-400">نجوم</span>
                <span className="text-sm font-bold text-amber-400 font-mono">+{story.game.rewardStars}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">🪙</span>
                <span className="text-xs text-slate-400">عملات</span>
                <span className="text-sm font-bold text-yellow-400 font-mono">+{story.game.rewardCoins}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg">⚡</span>
                <span className="text-xs text-slate-400">خبرة XP</span>
                <span className="text-sm font-bold text-purple-400 font-mono">+{story.game.rewardXp}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  soundEffects.playClick();
                  onLaunchGame(story);
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>العب التحدي الآن واحصد المزيد!</span>
              </button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  soundEffects.playClick();
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                العودة إلى مكتبة القصص
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
