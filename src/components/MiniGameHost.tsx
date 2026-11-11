/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, XCircle, KeyRound, Search, Gamepad2 } from 'lucide-react';
import { Story, PlayerProfile } from '../types';
import { soundEffects } from '../utils/audio';

interface MiniGameHostProps {
  story: Story;
  player: PlayerProfile;
  onBack: () => void;
  onGameWon: (gameId: string, rewards: { xp: number; coins: number; stars: number }) => void;
}

export const MiniGameHost: React.FC<MiniGameHostProps> = ({
  story,
  player,
  onBack,
  onGameWon
}) => {
  const game = story.game;
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const triggerVictory = (stars: number = 3) => {
    soundEffects.playFanfare();
    setEarnedStars(stars);
    setGameWon(true);
    onGameWon(story.id, {
      xp: game.rewardXp,
      coins: game.rewardCoins,
      stars: stars
    });
  };

  /* 1. TIMELINE GAME */
  const TimelineGame = () => {
    const rawEvents = game.timeline || [];
    const [userOrder, setUserOrder] = useState<typeof rawEvents>(() =>
      [...rawEvents].sort(() => Math.random() - 0.5)
    );
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const handleSelectEvent = (idx: number) => {
      soundEffects.playClick();
      if (selectedIndices.length === 0) {
        setSelectedIndices([idx]);
      } else if (selectedIndices.length === 1) {
        const firstIdx = selectedIndices[0];
        const newOrder = [...userOrder];
        const temp = newOrder[firstIdx];
        newOrder[firstIdx] = newOrder[idx];
        newOrder[idx] = temp;
        setUserOrder(newOrder);
        setSelectedIndices([]);
      }
    };

    const handleVerify = () => {
      const isCorrect = userOrder.every((item, index) => item.order === index + 1);
      if (isCorrect) {
        setFeedbackMessage('ترتيب صحيح ومبهر! لقد حفظت أحداث القصة بامتياز.');
        triggerVictory(3);
      } else {
        soundEffects.playWrong();
        setFeedbackMessage('الترتيب ليس دقيقاً تماماً، اضغط على بطاقتين لمبادلة موقعهما.');
      }
    };

    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-300">
          اضغط على بطاقتين لمبادلة موقعهما، ورتب الأحداث من البداية إلى النهاية:
        </p>

        <div className="space-y-3">
          {userOrder.map((ev, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <div
                key={ev.id}
                onClick={() => handleSelectEvent(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 scale-[1.02]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 font-bold text-amber-400 flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    {ev.title}
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">اضغط للتبديل</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-transform active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          تحقق من الترتيب
        </button>
      </div>
    );
  };

  /* 2. QUIZ GAME */
  const QuizGame = () => {
    const questions = game.quiz || [];
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    const q = questions[currentQIndex];

    const handleAnswer = (idx: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(idx);
      setShowExplanation(true);

      if (idx === q.correctIndex) {
        soundEffects.playSuccess();
        setCorrectCount(c => c + 1);
      } else {
        soundEffects.playWrong();
      }
    };

    const handleNext = () => {
      soundEffects.playClick();
      setSelectedOption(null);
      setShowExplanation(false);

      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(currentQIndex + 1);
      } else {
        const finalScore = correctCount + (selectedOption === q.correctIndex ? 1 : 0);
        const stars = finalScore === questions.length ? 3 : finalScore >= 1 ? 2 : 1;
        triggerVictory(stars);
      }
    };

    if (!q) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>السؤال {currentQIndex + 1} من {questions.length}</span>
          <span className="text-amber-400 font-bold font-mono">الإجابات الصحيحة: {correctCount}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-900 border-slate-800 hover:border-amber-500/50 text-slate-200';
            if (selectedOption !== null) {
              if (idx === q.correctIndex) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
              } else {
                btnStyle = 'opacity-50 bg-slate-900 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 rounded-xl border text-right text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && idx === q.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {selectedOption !== null && idx === selectedOption && idx !== q.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400 block mb-1">توضيح:</span>
            {q.explanation}
          </div>
        )}

        {selectedOption !== null && (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm cursor-pointer"
          >
            {currentQIndex + 1 < questions.length ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
          </button>
        )}
      </div>
    );
  };

  /* 3. MEMORY MATCH GAME */
  const MemoryGame = () => {
    const rawCards = game.memoryCards || [];
    const [deck, setDeck] = useState<Array<{ id: string; uniqueId: number; label: string; icon: string; matched: boolean }>>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
      const duplicated = [...rawCards, ...rawCards].map((card, idx) => ({
        ...card,
        uniqueId: idx,
        matched: false
      }));
      setDeck(duplicated.sort(() => Math.random() - 0.5));
    }, []);

    const handleFlip = (index: number) => {
      if (flippedIndices.length === 2 || deck[index].matched || flippedIndices.includes(index)) {
        return;
      }
      soundEffects.playClick();
      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        const [first, second] = newFlipped;
        if (deck[first].id === deck[second].id) {
          soundEffects.playCoin();
          const newDeck = [...deck];
          newDeck[first].matched = true;
          newDeck[second].matched = true;
          setDeck(newDeck);
          setFlippedIndices([]);

          if (newDeck.every(c => c.matched)) {
            triggerVictory(3);
          }
        } else {
          setTimeout(() => {
            setFlippedIndices([]);
          }, 900);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>طابق جميع البطاقات المتشابهة</span>
          <span className="font-mono text-amber-400 font-bold">المحاولات: {moves}</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {deck.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || card.matched;
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleFlip(idx)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all cursor-pointer ${
                  isFlipped
                    ? 'bg-slate-850 border-amber-500/60 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isFlipped ? (
                  <>
                    <span className="text-3xl mb-1">{card.icon}</span>
                    <span className="text-[11px] font-bold text-slate-200 text-center line-clamp-1">{card.label}</span>
                  </>
                ) : (
                  <span className="text-2xl text-slate-600">❓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* 4. WHO IS IT GAME */
  const WhoIsItGame = () => {
    const data = game.whoIsIt;
    const [revealedClues, setRevealedClues] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    if (!data) return null;

    const handleGuess = (option: string) => {
      setSelectedAnswer(option);
      if (option === data.characterName) {
        soundEffects.playSuccess();
        const stars = revealedClues === 1 ? 3 : revealedClues === 2 ? 2 : 1;
        triggerVictory(stars);
      } else {
        soundEffects.playWrong();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>التلميحات المكشوفة: {revealedClues} من {data.clues.length}</span>
          {revealedClues < data.clues.length && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setRevealedClues(r => r + 1);
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              اكشف تلميحاً إضافياً
            </button>
          )}
        </div>

        <div className="space-y-3">
          {data.clues.slice(0, revealedClues).map((clue, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-amber-500/20 text-slate-200 text-sm flex items-start gap-3">
              <span className="text-amber-400 font-bold">💡 التلميح {idx + 1}:</span>
              <span>{clue}</span>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-bold text-slate-300 pt-2">من تعتقد أنها الشخصية الحقيقية؟</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.options.map((opt, idx) => {
            const isCorrect = opt === data.characterName;
            const isChosen = opt === selectedAnswer;
            let style = 'bg-slate-900 border-slate-800 hover:border-amber-500 text-slate-200';
            if (selectedAnswer) {
              if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
              else if (isChosen) style = 'bg-rose-500/20 border-rose-500 text-rose-300';
              else style = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
            }

            return (
              <button
                key={idx}
                disabled={selectedAnswer !== null}
                onClick={() => handleGuess(opt)}
                className={`p-4 rounded-xl border text-right text-sm transition-all cursor-pointer ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* 5. TREASURE CHEST */
  const TreasureChestGame = () => {
    const riddles = game.treasure || [];
    const [currentStep, setCurrentStep] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const r = riddles[currentStep];

    const handleCheckAnswer = () => {
      if (!userInput.trim()) return;
      const cleanAnswer = userInput.trim().toLowerCase();
      const expected = r.codeAnswer.toLowerCase();

      if (cleanAnswer === expected || cleanAnswer.includes(expected)) {
        soundEffects.playCoin();
        setErrorMsg(null);
        setUserInput('');
        setShowHint(false);

        if (currentStep + 1 < riddles.length) {
          setCurrentStep(currentStep + 1);
        } else {
          soundEffects.playChestOpen();
          triggerVictory(3);
        }
      } else {
        soundEffects.playWrong();
        setErrorMsg('الإجابة ليست دقيقة، اقرأ اللغز بتأنٍ واستعن بالتلميح إذا أردت.');
      }
    };

    if (!r) return null;

    return (
      <div className="space-y-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl">
          <KeyRound className="w-8 h-8 text-amber-400" />
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 text-right">
          <span className="text-xs text-amber-400 font-bold block mb-2">
            اللغز {currentStep + 1} من {riddles.length}:
          </span>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            «{r.riddleText}»
          </p>

          {showHint && (
            <p className="mt-3 text-xs text-amber-300/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              💡 تلميح: {r.hint}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
            placeholder="اكتب حل اللغز..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-center font-bold text-base focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={handleCheckAnswer}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm cursor-pointer"
          >
            فك القفل
          </button>
        </div>

        {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-slate-400 hover:text-amber-400 underline cursor-pointer"
          >
            أحتاج إلى تلميح بسيط
          </button>
        )}
      </div>
    );
  };

  /* 6. DETECTIVE GAME */
  const DetectiveGame = () => {
    const data = game.detective;
    const [inspectedClueIds, setInspectedClueIds] = useState<string[]>([]);
    const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);

    if (!data) return null;

    const toggleClue = (id: string) => {
      soundEffects.playClick();
      if (!inspectedClueIds.includes(id)) {
        setInspectedClueIds([...inspectedClueIds, id]);
      }
    };

    const handleAccuse = (suspectId: string) => {
      setSelectedSuspectId(suspectId);
      const suspect = data.suspects.find(s => s.id === suspectId);
      if (suspect?.isGuilty) {
        soundEffects.playSuccess();
        triggerVictory(3);
      } else {
        soundEffects.playWrong();
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-amber-400 mb-3">1. تفحص أدلة مسرح القضية:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.clues.map(c => {
              const isSeen = inspectedClueIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleClue(c.id)}
                  className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                    isSeen
                      ? 'bg-slate-850 border-amber-500/40 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{c.title}</span>
                    <Search className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-amber-400 mb-3">2. قائمة المشتبه بهم:</h4>
          <div className="space-y-3">
            {data.suspects.map(s => {
              const isChosen = selectedSuspectId === s.id;
              let style = 'bg-slate-900 border-slate-800 hover:border-amber-500/40';
              if (selectedSuspectId) {
                if (s.isGuilty) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                else if (isChosen) style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                else style = 'opacity-40 bg-slate-900 border-slate-800';
              }

              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${style}`}
                >
                  <div>
                    <span className="font-bold text-white text-base">{s.name}</span>
                    <span className="text-xs text-amber-400 mr-2">({s.role})</span>
                    <p className="text-xs text-slate-400 mt-1">حجته: {s.alibi}</p>
                  </div>

                  {!selectedSuspectId && (
                    <button
                      onClick={() => handleAccuse(s.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      توجيه الاتهام
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* 7. TRUE / FALSE GAME */
  const TrueFalseGame = () => {
    const list = game.trueFalse || [];
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState<boolean | null>(null);

    const item = list[idx];
    if (!item) return null;

    const handleChoice = (val: boolean) => {
      setAnswered(val);
      const isCorrect = val === item.isTrue;
      if (isCorrect) {
        soundEffects.playSuccess();
        setScore(s => s + 1);
      } else {
        soundEffects.playWrong();
      }
    };

    const handleNext = () => {
      soundEffects.playClick();
      setAnswered(null);
      if (idx + 1 < list.length) {
        setIdx(idx + 1);
      } else {
        triggerVictory(score >= 2 ? 3 : 2);
      }
    };

    return (
      <div className="space-y-6 text-center max-w-lg mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>العبارة {idx + 1} من {list.length}</span>
          <span className="text-amber-400 font-bold font-mono">النقاط: {score}</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-base sm:text-lg font-bold text-white leading-relaxed">
          «{item.statement}»
        </div>

        {answered === null ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              ✓ صح
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg cursor-pointer shadow-lg shadow-rose-600/20"
            >
              ✗ خطأ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl text-sm ${answered === item.isTrue ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
              <span className="font-bold block mb-1">
                {answered === item.isTrue ? 'إجابة صحيحة وممتازة!' : 'إجابة غير صحيحة!'}
              </span>
              <span>{item.explanation}</span>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm cursor-pointer"
            >
              {idx + 1 < list.length ? 'العبارة التالية' : 'إنهاء التحدي'}
            </button>
          </div>
        )}
      </div>
    );
  };

  /* 8. WORD SEARCH GAME */
  const WordSearchGame = () => {
    const data = game.wordSearch;
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [selectedLetters, setSelectedLetters] = useState<string>('');

    if (!data) return null;

    const handleLetterClick = (letter: string) => {
      soundEffects.playClick();
      const newWord = selectedLetters + letter;
      setSelectedLetters(newWord);

      if (data.words.includes(newWord) && !foundWords.includes(newWord)) {
        soundEffects.playSuccess();
        const updated = [...foundWords, newWord];
        setFoundWords(updated);
        setSelectedLetters('');

        if (updated.length === data.words.length) {
          triggerVictory(3);
        }
      }
    };

    return (
      <div className="space-y-6 text-center max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>الكلمات المطلوبة:</span>
          <div className="flex gap-2">
            {data.words.map(w => (
              <span
                key={w}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  foundWords.includes(w) ? 'bg-emerald-500/20 text-emerald-300 line-through' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="h-10 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm font-bold text-amber-400">
          <span>الكلمة:</span>
          <span className="font-mono tracking-widest text-base">{selectedLetters || 'اضغط الحروف'}</span>
          {selectedLetters && (
            <button
              onClick={() => setSelectedLetters('')}
              className="text-xs text-rose-400 hover:text-rose-300 mr-2 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {data.grid.map((row, rIdx) =>
            row.map((letter, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleLetterClick(letter)}
                className="aspect-square rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-lg sm:text-xl font-bold text-white flex items-center justify-center cursor-pointer"
              >
                {letter}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  /* 9. CHOOSE ENDING */
  const ChooseEndingGame = () => {
    const data = game.branching;
    const [currentNodeId, setCurrentNodeId] = useState<string>(data?.startNodeId || 'node-start');

    if (!data) return null;
    const node = data.nodes[currentNodeId];
    if (!node) return null;

    const handleChoice = (nextId: string) => {
      soundEffects.playClick();
      setCurrentNodeId(nextId);
      const nextNode = data.nodes[nextId];
      if (nextNode?.isEnding) {
        soundEffects.playSuccess();
        triggerVictory(3);
      }
    };

    return (
      <div className="space-y-6 max-w-lg mx-auto text-right">
        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 text-white leading-relaxed text-base">
          {node.text}
        </div>

        {node.isEnding ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
            <span className="text-amber-400 font-bold block mb-1">🎉 وصلت لنهاية مسارك:</span>
            <p className="text-emerald-300 font-semibold">{node.outcome}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs text-slate-400 font-bold block">ماذا تختار أن يفعل البطل؟</span>
            {node.choices?.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(c.nextNodeId)}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-400 text-right text-sm font-semibold text-slate-100 transition-all cursor-pointer"
              >
                ← {c.text}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
        <button
          onClick={() => {
            soundEffects.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للقصة</span>
        </button>

        <div className="text-center">
          <span className="text-xs text-amber-400 font-bold">تحدي القصة المفتوح</span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-story">
            {game.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>المكافأة:</span>
          <span>+{game.rewardCoins} 🪙</span>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {feedbackMessage && !gameWon && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm text-center">
            {feedbackMessage}
          </div>
        )}

        {/* Switch Game Type */}
        {game.type === 'timeline' && <TimelineGame />}
        {game.type === 'quiz' && <QuizGame />}
        {game.type === 'memory_match' && <MemoryGame />}
        {game.type === 'who_is_it' && <WhoIsItGame />}
        {game.type === 'treasure_chest' && <TreasureChestGame />}
        {game.type === 'detective_clues' && <DetectiveGame />}
        {game.type === 'true_false' && <TrueFalseGame />}
        {game.type === 'word_search' && <WordSearchGame />}
        {game.type === 'choose_ending' && <ChooseEndingGame />}
      </div>

      {/* Victory Celebration Modal */}
      {gameWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-3xl">
              🏆
            </div>
            <h3 className="text-2xl font-black text-white mb-2 font-story">
              أحسنت صنعاً! فزت بالتحدي
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              تم إنجاز التحدي بنجاح وإضافة النجوم والعملات الذهبية إلى حسابك!
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < earnedStars ? '⭐' : '☆'}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-6">
              <div>
                <span className="text-xs text-slate-400 block">العملات المكتسبة</span>
                <span className="text-lg font-bold text-yellow-400 font-mono">+{game.rewardCoins} 🪙</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">نقاط الخبرة</span>
                <span className="text-lg font-bold text-purple-400 font-mono">+{game.rewardXp} XP</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setGameWon(false);
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
              >
                العب مجدداً ↺
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onBack();
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
              >
                العودة للمغامرة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
