/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Wand2, Play, BookOpen, ArrowLeft } from 'lucide-react';
import { Story, StoryParagraph } from '../types';
import { soundEffects } from '../utils/audio';

interface CustomStoryCreatorProps {
  onStoryCreated: (newStory: Story) => void;
}

export const CustomStoryCreator: React.FC<CustomStoryCreatorProps> = ({ onStoryCreated }) => {
  const [heroName, setHeroName] = useState('فارس الحكايات');
  const [genre, setGenre] = useState('مغامرات وفضاء');
  const [location, setLocation] = useState('جزيرة النجوم المضيئة');
  const [moral, setMoral] = useState('الصدق والتعاون يفتحان أصعب الأبواب');
  const [storyLength, setStoryLength] = useState<'قصيرة' | 'متوسطة'>('متوسطة');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    soundEffects.playClick();
    setIsGenerating(true);

    setTimeout(() => {
      soundEffects.playFanfare();
      setIsGenerating(false);

      const generatedParagraphs: StoryParagraph[] = [
        {
          id: 'cp1',
          text: `في عالم ${genre} الساحر، انطلق البطل الشجاع «${heroName}» نحو ${location} حاملاً في قلبه عزيمة لا تلين. كانت الرياح تهب محملة بأسرار قديمة، وتتلألأ الأفق بألوان الشفق الذهبي.`,
          sentences: [
            `في عالم ${genre} الساحر، انطلق البطل الشجاع ${heroName} نحو ${location}.`,
            'كانت الرياح تهب محملة بأسرار قديمة تدعو للاكتشاف والبحث.',
            'وتلألأ الأفق بألوان الشفق الذهبي مشعاً بالأمل والحيوية.'
          ]
        },
        {
          id: 'cp2',
          text: `واجه «${heroName}» لغزاً غامضاً عند مدخل الوادي، حيث كان الطريق مسدوداً بصخرة بلورية ضخمة تنبض بالضوء. لم يستسلم ولم يلجأ للقوة، بل جلس يفكر ويتأمل النقوش المحفورة، متذكراً أن الحكمة والصبر يحلان أعقد المسائل.`,
          sentences: [
            `واجه ${heroName} لغزاً غامضاً عند مدخل الوادي.`,
            'كان الطريق مسدوداً بصخرة بلورية ضخمة تنبض بالضوء الأرجواني.',
            'تأمل النقوش المحفورة متذكراً أن الحكمة والصبر يحلان أعقد المسائل.'
          ]
        },
        {
          id: 'cp3',
          text: `وبالفعل، ساعد كائناً صغيراً كان يحتاج العون، فدله على المفتاح السري الذي أنار المكان وفتح البوابة. وعاد «${heroName}» منتصراً وهو يدرك بعمق أن: ${moral}.`,
          sentences: [
            'ساعد كائناً صغيراً كان يحتاج العون بقلب رحيم ومحب.',
            'دله الكائن على المفتاح السري الذي أنار المكان وفتح البوابة العتيقة.',
            `عاد ${heroName} منتصراً وهو يدرك بعمق أن: ${moral}.`
          ]
        }
      ];

      const customStory: Story = {
        id: `custom-${Date.now()}`,
        title: `مغامرة ${heroName} في ${location}`,
        category: 'custom',
        coverGradient: 'from-amber-600 via-pink-600 to-purple-700',
        coverIcon: '🪄',
        synopsis: `قصة مشوقة من نسج خيالك، تروي بطولة «${heroName}» وكيف حقق هدفه في ${location} بروح الصدق والعزيمة.`,
        difficulty: 'سهل',
        readTimeMinutes: storyLength === 'قصيرة' ? 3 : 5,
        ageGroup: 'جميع الأعمار',
        moralLesson: moral,
        tags: ['قصة مخصصة', 'إبداع', heroName],
        paragraphs: generatedParagraphs,
        game: {
          type: 'quiz',
          title: `اختبار قصة: مغامرة ${heroName}`,
          instruction: 'أجب عن تفاصيل قصتك المخصصة التي نسجتها لتحصد النجوم والعملات!',
          quiz: [
            {
              question: `إلى أين اتجه البطل «${heroName}» في بداية الحكاية؟`,
              options: [location, 'المدينة الصاخبة', 'قاع المحيط المظلم', 'كهف الجليد'],
              correctIndex: 0,
              explanation: `توجه البطل مباشرة إلى ${location} بحثاً عن الحقيقة والمغامرة.`
            },
            {
              question: 'ما هي العبرة والقيمة الأساسية للقصة؟',
              options: [moral, 'السرعة هي كل شيء', 'الاعتماد على الحظ فقط', 'تجاهل الآخرين'],
              correctIndex: 0,
              explanation: moral
            }
          ],
          rewardXp: 150,
          rewardCoins: 70,
          rewardStars: 3
        }
      };

      onStoryCreated(customStory);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-3 border border-purple-500/20">
          <Wand2 className="w-3.5 h-3.5" />
          <span>مختبر نسج الحكايات التفاعلي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-story mb-2">
          اصنع قصتك الخاصة
        </h1>
        <p className="text-sm text-slate-400">
          حدد بطل القصة، ومكان المغامرة، والتحدي والعبرة التي ترغب في تعلمها لنصنع لك قصة تفاعلية متكاملة مع لعبة مصغرة فورية!
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-bold text-amber-400 mb-2">اسم بطل أو بطلة الحكاية:</label>
          <input
            type="text"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
            placeholder="مثال: الفارس طارق، الأميرة نور، المستكشف عمر..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-amber-400 mb-2">نوع الحكاية وعالمها:</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="مغامرات واستكشاف الكنوز">مغامرات واستكشاف الكنوز</option>
              <option value="فضاء وكواكب روبوتية">فضاء وكواكب روبوتية</option>
              <option value="عوالم خيالية وممالك سحرية">عوالم خيالية وممالك سحرية</option>
              <option value="حيوانات الغابة الحكيمة">حيوانات الغابة الحكيمة</option>
              <option value="تاريخ وأمجاد عربية وإسلامية">تاريخ وأمجاد عربية وإسلامية</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-400 mb-2">مكان المغامرة:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
              placeholder="مثال: واحة النخيل السرية، قصر البلور، مدار كوكب زحل..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-400 mb-2">العِبرة والقيمة الأخلاقية للقصة:</label>
          <input
            type="text"
            value={moral}
            onChange={(e) => setMoral(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-400"
            placeholder="مثال: مساعدة الآخرين، الصدق والأمانة، الشجاعة عند الصعاب..."
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs font-bold text-slate-300">طول القصة:</span>
          {(['قصيرة', 'متوسطة'] as const).map(len => (
            <button
              key={len}
              type="button"
              onClick={() => setStoryLength(len)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                storyLength === len ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {len}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !heroName.trim()}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 mt-6"
        >
          {isGenerating ? (
            <span>جاري نسج أحداث القصة واللعبة... ✨</span>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>أنشئ القصة واللعبة فوراً</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
