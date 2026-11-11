/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Award, User, Settings, Check, Sparkles, Flame, Volume2, ShieldCheck, X } from 'lucide-react';
import { PlayerProfile, ShopItem } from '../types';
import { SHOP_ITEMS, LEVEL_TIERS } from '../data/stories';
import { soundEffects } from '../utils/audio';

interface ShopProps {
  player: PlayerProfile;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (item: ShopItem) => void;
}

export const RewardsShop: React.FC<ShopProps> = ({ player, onBuyItem, onEquipItem }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-story mb-1">
            متجر المكافآت والأزياء
          </h1>
          <p className="text-sm text-slate-400">
            استبدل العملات الذهبية التي كسبتها من القراءة وحل الألعاب بأزياء وألقاب أسطورية!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/30 px-4 py-2 rounded-2xl text-yellow-400 font-bold text-sm">
          <span>رصيدك الحالي:</span>
          <span className="font-mono text-base">{player.coins} 🪙</span>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
          const isOwned = player.inventory.includes(item.name);
          const isEquipped =
            player.selectedAvatar === item.name ||
            player.selectedTitle === item.name ||
            player.inventory.includes(item.name) && player.selectedAvatar === item.name;
          const canAfford = player.coins >= item.price;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mb-4 mx-auto">
                  {item.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-yellow-400 font-mono">
                  {item.price} 🪙
                </span>

                {isOwned ? (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onEquipItem(item);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      isEquipped
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isEquipped ? 'مُفعّل ✓' : 'تفعيل'}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundEffects.playCoin();
                      onBuyItem(item);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    شراء الآن
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ProfileModalProps {
  player: PlayerProfile;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ player, onClose }) => {
  const currentTier = LEVEL_TIERS.find(t => t.level === player.level) || LEVEL_TIERS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
            {currentTier.badge}
          </div>
          <h2 className="text-2xl font-black text-white font-story">{player.name}</h2>
          <p className="text-xs text-amber-400 font-bold mt-1">{player.selectedTitle} · {currentTier.title}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl mb-6 text-center">
          <div>
            <span className="text-xs text-slate-400 block">النجوم</span>
            <span className="text-base font-bold text-amber-400 font-mono">⭐ {player.stars}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">العملات</span>
            <span className="text-base font-bold text-yellow-400 font-mono">🪙 {player.coins}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">قصص مقروءة</span>
            <span className="text-base font-bold text-emerald-400 font-mono">📖 {player.completedStoryIds.length}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">ألعاب مكتملة</span>
            <span className="text-base font-bold text-purple-400 font-mono">🎮 {player.completedGameIds.length}</span>
          </div>
        </div>

        {/* Achievements list */}
        <h3 className="text-xs font-bold text-slate-400 mb-3">شارات الإنجاز:</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌱</span>
              <div>
                <span className="text-xs font-bold text-white block">بداية المشوار</span>
                <span className="text-[10px] text-slate-400">قراءة أول قصة بنجاح</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">مكتمل ✓</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔥</span>
              <div>
                <span className="text-xs font-bold text-white block">شعلة القراءة اليومية</span>
                <span className="text-[10px] text-slate-400">سلسلة قراءة لمدة يومين متتاليين</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">مكتمل ✓</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <span className="text-xs font-bold text-white block">بطل الحكايات</span>
                <span className="text-[10px] text-slate-400">قراءة 5 قصص والفوز بألعابها</span>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-mono">
              {player.completedStoryIds.length}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  player: PlayerProfile;
  onUpdateSettings: (settings: PlayerProfile['settings']) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ player, onUpdateSettings, onClose }) => {
  const settings = player.settings;

  const toggleSound = () => {
    soundEffects.playClick();
    onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects });
  };

  const toggleSpooky = () => {
    soundEffects.playClick();
    onUpdateSettings({ ...settings, softenSpooky: !settings.softenSpooky });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 font-story">إعدادات اللعبة والقراءة</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">المؤثرات الصوتية للألعاب</span>
              <span className="text-xs text-slate-400">أصوات الفوز والعملات والنقر</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEffects ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.soundEffects ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">تخفيف أجواء الغموض للأطفال</span>
              <span className="text-xs text-slate-400">إبقاء الأجواء لطيفة وممتعة</span>
            </div>
            <button
              onClick={toggleSpooky}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.softenSpooky ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.softenSpooky ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-sm font-bold text-white block mb-2">سرعة القارئ الصوتي الافتراضية:</span>
            <div className="flex gap-2">
              {[0.8, 1.0, 1.25].map(rate => (
                <button
                  key={rate}
                  onClick={() => {
                    soundEffects.playClick();
                    onUpdateSettings({ ...settings, speechRate: rate });
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono cursor-pointer ${
                    settings.speechRate === rate ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm cursor-pointer"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
};
