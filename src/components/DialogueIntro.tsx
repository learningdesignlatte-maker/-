import React, { useState } from 'react';
import { DIALOGUE_TOPICS } from '../data/dialogueData';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface DialogueIntroProps {
  onStartPractice: () => void;
  onSelectPatternDirectly: (patternId: 'pattern1' | 'pattern2' | 'pattern3' | 'patternExam') => void;
}

export const DialogueIntro: React.FC<DialogueIntroProps> = ({
  onStartPractice,
  onSelectPatternDirectly,
}) => {
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);

  const topic = DIALOGUE_TOPICS[currentTopicIdx];
  const isLastTopic = currentTopicIdx === DIALOGUE_TOPICS.length - 1;

  const handleNext = () => {
    if (currentTopicIdx < DIALOGUE_TOPICS.length - 1) {
      setCurrentTopicIdx((prev) => prev + 1);
    } else {
      onStartPractice();
    }
  };

  const handlePrev = () => {
    if (currentTopicIdx > 0) {
      setCurrentTopicIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Intro Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#352C21] tracking-tight">
          PC・スマホの入力フォームで困らないために
        </h1>
        <p className="text-sm sm:text-base text-[#352C21]/80 mt-1">
          よくある失敗の原因と対処法を会話形式で解説！
        </p>
      </div>

      {/* Progress Tabs */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1">
        {DIALOGUE_TOPICS.map((t, idx) => {
          const isActive = idx === currentTopicIdx;
          const isDone = idx < currentTopicIdx;
          return (
            <button
              key={t.id}
              onClick={() => setCurrentTopicIdx(idx)}
              className={`flex-1 min-w-[70px] py-2 px-2 text-center rounded-lg border-2 transition-all text-xs font-bold ${
                isActive
                  ? 'border-[#352C21] bg-[#FFBE34] text-[#352C21] shadow-sm scale-102'
                  : isDone
                  ? 'border-[#91DF42] bg-[#91DF42]/20 text-[#352C21]'
                  : 'border-[#352C21]/20 bg-white text-[#352C21]/60 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5cb312]" />
                ) : (
                  <span>第{idx + 1}話</span>
                )}
              </div>
              <div className="truncate hidden sm:block mt-0.5">{t.title.split('「')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Topic Title Card */}
      <div className="flex items-center justify-between bg-white border-2 border-[#352C21] rounded-t-xl p-3 sm:p-4 border-b-0">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#352C21]">
            第{currentTopicIdx + 1}話 {topic.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#352C21]/70 mt-0.5">
            {topic.shortDesc}
          </p>
        </div>
      </div>

      {/* Conversation Chat Bubbles Area */}
      <div className="bg-white border-2 border-[#352C21] rounded-b-xl p-4 sm:p-6 shadow-sm space-y-5">
        {topic.messages.map((msg, index) => {
          const isTeacher = msg.speaker === 'teacher';

          return (
            <div
              key={index}
              className={`flex items-start gap-3 sm:gap-4 ${
                isTeacher ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Avatar Photo */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 overflow-hidden shadow-xs ${
                    isTeacher ? 'border-[#76A1ED]' : 'border-[#9D4895]'
                  }`}
                >
                  <img
                    src={msg.avatarUrl}
                    alt={msg.speakerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                    isTeacher
                      ? 'bg-[#76A1ED]/20 text-[#352C21]'
                      : 'bg-[#9D4895]/20 text-[#352C21]'
                  }`}
                >
                  {msg.speakerName}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-sm sm:text-base border-2 shadow-2xs relative ${
                  isTeacher
                    ? 'bg-blue-50/40 border-[#76A1ED] rounded-tl-none text-[#352C21]'
                    : 'bg-purple-50/40 border-[#9D4895] rounded-tr-none text-[#352C21]'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line font-medium text-[#352C21]">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* Special visual explanation card for Topic 2 (Zen vs Han) */}
        {topic.id === 'zen_vs_han' && (
          <div className="mt-4 p-4 rounded-xl border-2 border-[#FFBE34] bg-amber-50/80">
            <h4 className="text-sm font-black text-[#352C21] mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBE34]" />
              実物比較：なぜ住所の「1-1」で怒られるの？
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-red-50 p-2.5 rounded-lg border-2 border-[#FFB5B8]">
                <div className="font-bold text-red-600 flex items-center gap-1">
                  <span>❌ 半角入力</span>
                  <span className="text-[10px] bg-[#FFB5B8] text-[#352C21] px-1 rounded">エラー原因</span>
                </div>
                <div className="text-xl font-mono font-black text-red-700 my-1 bg-white p-1 rounded border border-red-200 text-center">
                  1-1
                </div>
                <p className="text-[11px] text-[#352C21]/80">
                  半角は文字幅が半分。コンピューターは「英数字」と見なすため、「住所は全角で」と指定されていると弾かれます。
                </p>
              </div>

              <div className="bg-green-50 p-2.5 rounded-lg border-2 border-[#91DF42]">
                <div className="font-bold text-[#5cb312] flex items-center gap-1">
                  <span>⭕ 全角入力</span>
                  <span className="text-[10px] bg-[#91DF42] text-[#352C21] px-1 rounded">正解</span>
                </div>
                <div className="text-xl font-mono font-black text-[#352C21] my-1 bg-white p-1 rounded border border-green-200 text-center">
                  １－１
                </div>
                <p className="text-[11px] text-[#352C21]/80">
                  全角は漢字と同じ正方形の幅。行政や資格試験の住所欄で求められる正式な文字です。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#352C21]/15">
          <button
            onClick={handlePrev}
            disabled={currentTopicIdx === 0}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 border-[#352C21] transition-all ${
              currentTopicIdx === 0
                ? 'opacity-40 cursor-not-allowed bg-gray-100'
                : 'bg-white hover:bg-gray-100 text-[#352C21]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentTopicIdx > 0 ? `第${currentTopicIdx}話へ戻る` : '前へ戻る'}</span>
          </button>

          <button
            onClick={handleNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black border-2 border-[#352C21] bg-[#FFBE34] text-[#352C21] hover:bg-[#FFBE34]/80 shadow-md active:scale-98 transition-all"
          >
            {isLastTopic ? (
              <>
                <Sparkles className="w-4 h-4 text-[#352C21]" />
                <span>それではやってみましょう！（パターンを選ぶ）</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>第{currentTopicIdx + 2}話へ</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Direct Shortcut to Practice below */}
      <div className="mt-8 pt-6 border-t border-[#352C21]/20 text-center">
        <button
          onClick={onStartPractice}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#352C21] bg-[#FFBE34] hover:bg-[#FFBE34]/80 text-[#352C21] font-black text-sm sm:text-base shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          <span>解説は読まず、まずは練習にトライしたい方はこちら！</span>
          <ArrowRight className="w-4 h-4 text-[#352C21]" />
        </button>
      </div>
    </div>
  );
};
