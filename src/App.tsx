/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryReader } from './components/StoryReader';
import { MiniGameHost } from './components/MiniGameHost';
import { StagesMap } from './components/StagesMap';
import { CustomStoryCreator } from './components/CustomStoryCreator';
import { RewardsShop, ProfileModal, SettingsModal } from './components/ShopAndProfile';
import { STORIES, INITIAL_PLAYER_PROFILE, LEVEL_TIERS } from './data/stories';
import { Story, PlayerProfile, ShopItem } from './types';
import { soundEffects } from './utils/audio';

export default function App() {
  // Load player from localStorage with fallback
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem('story_realm_player_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PLAYER_PROFILE;
  });

  // Story collection with ability to inject custom stories
  const [stories, setStories] = useState<Story[]>(STORIES);

  // Active navigation view state
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'map' | 'custom_story' | 'shop' | 'profile'>('home');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [autoPlayAudioOnOpen, setAutoPlayAudioOnOpen] = useState<boolean>(false);
  const [activeGameStory, setActiveGameStory] = useState<Story | null>(null);
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<string | undefined>(undefined);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Quick listen handler
  const handleQuickListen = (story: Story) => {
    setAutoPlayAudioOnOpen(true);
    setSelectedStory(story);
  };

  // Persist player profile whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('story_realm_player_profile', JSON.stringify(player));
    } catch {
      // ignore
    }
    soundEffects.setEnabled(player.settings.soundEffects);
  }, [player]);

  // Toggle Sound Effects
  const handleToggleSound = () => {
    setPlayer(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEffects: !prev.settings.soundEffects
      }
    }));
  };

  // Toggle Favorites
  const handleToggleFavorite = (storyId: string) => {
    setPlayer(prev => {
      const isFav = prev.favoriteStoryIds.includes(storyId);
      const updated = isFav
        ? prev.favoriteStoryIds.filter(id => id !== storyId)
        : [...prev.favoriteStoryIds, storyId];
      return { ...prev, favoriteStoryIds: updated };
    });
  };

  // Toggle Offline Reading Storage
  const handleToggleOffline = (storyId: string) => {
    setPlayer(prev => {
      const isOffline = prev.offlineSavedStoryIds.includes(storyId);
      const updated = isOffline
        ? prev.offlineSavedStoryIds.filter(id => id !== storyId)
        : [...prev.offlineSavedStoryIds, storyId];
      return { ...prev, offlineSavedStoryIds: updated };
    });
  };

  // Update last read position in paragraph
  const handleUpdateLastPosition = (storyId: string, paragraphIndex: number) => {
    setPlayer(prev => ({
      ...prev,
      lastReadPositions: {
        ...prev.lastReadPositions,
        [storyId]: paragraphIndex
      }
    }));
  };

  // Story completed callback (Unlocks the connected game!)
  const handleStoryCompleted = (storyId: string, rewards: { xp: number; coins: number; stars: number }) => {
    setPlayer(prev => {
      const completedList = prev.completedStoryIds.includes(storyId)
        ? prev.completedStoryIds
        : [...prev.completedStoryIds, storyId];

      const unlockedGames = prev.unlockedGameIds.includes(storyId)
        ? prev.unlockedGameIds
        : [...prev.unlockedGameIds, storyId];

      const newXp = prev.xp + rewards.xp;
      const newCoins = prev.coins + rewards.coins;
      const newStars = prev.stars + rewards.stars;

      // Calculate level
      const matchingTier = [...LEVEL_TIERS].reverse().find(t => newXp >= t.minXp);
      const newLevel = matchingTier ? matchingTier.level : prev.level;

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        stars: newStars,
        level: newLevel,
        completedStoryIds: completedList,
        unlockedGameIds: unlockedGames
      };
    });
  };

  // Mini-game completed callback
  const handleGameWon = (gameId: string, rewards: { xp: number; coins: number; stars: number }) => {
    setPlayer(prev => {
      const completedGames = prev.completedGameIds.includes(gameId)
        ? prev.completedGameIds
        : [...prev.completedGameIds, gameId];

      const newXp = prev.xp + rewards.xp;
      const newCoins = prev.coins + rewards.coins;
      const newStars = prev.stars + rewards.stars;

      const matchingTier = [...LEVEL_TIERS].reverse().find(t => newXp >= t.minXp);
      const newLevel = matchingTier ? matchingTier.level : prev.level;

      return {
        ...prev,
        xp: newXp,
        coins: newCoins,
        stars: newStars,
        level: newLevel,
        completedGameIds: completedGames
      };
    });
  };

  // Buy Shop Item
  const handleBuyItem = (item: ShopItem) => {
    if (player.coins < item.price) return;
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      inventory: [...prev.inventory, item.name]
    }));
  };

  // Equip Shop Item
  const handleEquipItem = (item: ShopItem) => {
    setPlayer(prev => {
      if (item.type === 'avatar') {
        return { ...prev, selectedAvatar: item.name };
      } else if (item.type === 'title') {
        return { ...prev, selectedTitle: item.name };
      }
      return prev;
    });
  };

  // Add Custom Story
  const handleCustomStoryCreated = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
    setSelectedStory(newStory);
    setAutoPlayAudioOnOpen(false);
  };

  // If in Reader mode
  if (selectedStory) {
    return (
      <StoryReader
        story={selectedStory}
        player={player}
        autoPlayOnMount={autoPlayAudioOnOpen}
        onBack={() => {
          setSelectedStory(null);
          setAutoPlayAudioOnOpen(false);
        }}
        onStoryCompleted={handleStoryCompleted}
        onLaunchGame={(story) => {
          setSelectedStory(null);
          setAutoPlayAudioOnOpen(false);
          setActiveGameStory(story);
        }}
        onToggleFavorite={handleToggleFavorite}
        onUpdateLastPosition={handleUpdateLastPosition}
      />
    );
  }

  // If in Mini-Game mode
  if (activeGameStory) {
    return (
      <MiniGameHost
        story={activeGameStory}
        player={player}
        onBack={() => setActiveGameStory(null)}
        onGameWon={handleGameWon}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-ui selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'profile') {
            setIsProfileOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        player={player}
        toggleSound={handleToggleSound}
      />

      {/* Main Tab Screen Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeHero
            player={player}
            stories={stories}
            onStartAdventure={() => {
              setAutoPlayAudioOnOpen(false);
              setSelectedStory(stories[0]);
            }}
            onOpenLibrary={(categoryFilter) => {
              setLibraryCategoryFilter(categoryFilter);
              setCurrentTab('library');
            }}
            onOpenGames={() => {
              setCurrentTab('map');
            }}
            onOpenAchievements={() => {
              setIsProfileOpen(true);
            }}
            onOpenProfile={() => {
              setIsProfileOpen(true);
            }}
            onOpenSettings={() => {
              setIsSettingsOpen(true);
            }}
            onSelectStory={(story) => {
              setAutoPlayAudioOnOpen(false);
              setSelectedStory(story);
            }}
            onQuickListen={handleQuickListen}
          />
        )}

        {currentTab === 'library' && (
          <StoryLibrary
            stories={stories}
            player={player}
            initialCategory={libraryCategoryFilter}
            onSelectStory={(story) => {
              setAutoPlayAudioOnOpen(false);
              setSelectedStory(story);
            }}
            onToggleFavorite={handleToggleFavorite}
            onToggleOffline={handleToggleOffline}
            onQuickListen={handleQuickListen}
          />
        )}

        {currentTab === 'map' && (
          <StagesMap
            stories={stories}
            player={player}
            onSelectStory={(story) => {
              setSelectedStory(story);
            }}
            onLaunchGame={(story) => {
              setActiveGameStory(story);
            }}
          />
        )}

        {currentTab === 'custom_story' && (
          <CustomStoryCreator onStoryCreated={handleCustomStoryCreated} />
        )}

        {currentTab === 'shop' && (
          <RewardsShop
            player={player}
            onBuyItem={handleBuyItem}
            onEquipItem={handleEquipItem}
          />
        )}
      </main>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          player={player}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          player={player}
          onUpdateSettings={(newSettings) => {
            setPlayer(prev => ({ ...prev, settings: newSettings }));
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Minimalist Human Footer (Adhering to Anti-Slop Guidelines) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>عالم القصص والمغامرات · منصة الحكايات التفاعلية للأجيال العربية</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                soundEffects.playClick();
                setCurrentTab('library');
              }}
              className="hover:text-amber-400 cursor-pointer"
            >
              مكتبة القصص
            </button>
            <span>·</span>
            <button
              onClick={() => {
                soundEffects.playClick();
                setCurrentTab('map');
              }}
              className="hover:text-amber-400 cursor-pointer"
            >
              خريطة الألعاب
            </button>
            <span>·</span>
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsSettingsOpen(true);
              }}
              className="hover:text-amber-400 cursor-pointer"
            >
              الإعدادات
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
