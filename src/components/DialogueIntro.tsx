import React, { useState } from 'react';
import { DIALOGUE_TOPICS } from '../data/dialogueData';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  BookOpen,
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const topic = DIALOGUE_TOPICS[currentTopicIdx];
  const isLastTopic = currentTopicIdx === DIALOGUE_TOPICS.length - 1;

  // Optional text-to-speech for elderly / computer school students
  const speakCurrentMessages = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const allText = topic.messages
      .map((m) => `${m.speakerName}。「${m.text}」`)
      .join(' ');
    const utterance = new SpeechSynthesisUtterance(allText);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    if (currentTopicIdx < DIALOGUE_TOPICS.length - 1) {
      setCurrentTopicIdx((prev) => prev + 1);
    } else {
      onStartPractice();
    }
  };

  const handlePrev = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    if (currentTopicIdx > 0) {
      setCurrentTopicIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Intro Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76A1ED]/20 text-[#352C21] font-bold text-sm mb-2 border border-[#76A1ED]">
          <BookOpen className="w-4 h-4 text-[#76A1ED]" />
          <span>教室 入門レッスン</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#352C21] tracking-tight">
          行政・試験のフォーム入力で困らないために
        </h1>
        <p className="text-sm sm:text-base text-[#352C21]/80 mt-1">
          先生と生徒さんの会話で、よくある失敗の原因と対処法をわかりやすく解説します。
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
              onClick={() => {
                if (isPlayingAudio) window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
                setCurrentTopicIdx(idx);
              }}
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
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#9D4895] text-white mr-2">
            STEP {currentTopicIdx + 1} / {DIALOGUE_TOPICS.length}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#352C21] inline align-middle">
            {topic.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#352C21]/70 mt-0.5">
            {topic.shortDesc}
          </p>
        </div>

        {/* Speech Audio Toggle */}
        <button
          onClick={speakCurrentMessages}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#352C21] text-xs font-bold transition-colors ${
            isPlayingAudio 
              ? 'bg-[#FFB5B8] text-[#352C21] animate-pulse' 
              : 'bg-white hover:bg-gray-100 text-[#352C21]'
          }`}
          title="音声を再生します"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4 text-red-600" />
              <span>停止</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#76A1ED]" />
              <span className="hidden sm:inline">音声で聴く</span>
            </>
          )}
        </button>
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
                {/* Tag if available */}
                {msg.tag && (
                  <span
                    className={`inline-block text-[11px] font-black px-2 py-0.5 rounded-full mb-1.5 ${
                      isTeacher
                        ? 'bg-[#FFBE34] text-[#352C21]'
                        : 'bg-[#FFB5B8] text-[#352C21]'
                    }`}
                  >
                    {msg.tag}
                  </span>
                )}

                <p className="leading-relaxed whitespace-pre-line font-medium text-[#352C21]">
                  {msg.text}
                </p>

                {/* Highlight callout if emphasis */}
                {msg.emphasis && (
                  <div className="mt-2 pt-2 border-t border-[#352C21]/15 text-xs font-bold text-[#352C21] flex items-center gap-1 bg-white/70 p-2 rounded-lg">
                    <Sparkles className="w-4 h-4 text-[#FFBE34] shrink-0" />
                    <span>ここがポイント：{msg.emphasis}</span>
                  </div>
                )}
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
                  <span>❌ 小文字（半角）入力</span>
                  <span className="text-[10px] bg-[#FFB5B8] text-[#352C21] px-1 rounded">エラー原因</span>
                </div>
                <div className="text-xl font-mono font-black text-red-700 my-1 bg-white p-1 rounded border border-red-200 text-center">
                  1-1
                </div>
                <p className="text-[11px] text-[#352C21]/80">
                  半角は文字幅が半分。コンピューターは「英数字」と見なすため、「住所は大文字で」と指定されていると弾かれます。
                </p>
              </div>

              <div className="bg-green-50 p-2.5 rounded-lg border-2 border-[#91DF42]">
                <div className="font-bold text-[#5cb312] flex items-center gap-1">
                  <span>⭕ 大文字（全角）入力</span>
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
            <span>前の解説に戻る</span>
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
                <span>次のポイントを見る</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Direct Shortcuts to Patterns below */}
      <div className="mt-8 pt-6 border-t border-[#352C21]/20">
        <h3 className="text-sm font-black text-[#352C21] text-center mb-3">
          解説を読まずに今すぐ練習にトライする方はこちら：
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => onSelectPatternDirectly('pattern1')}
            className="p-3 text-left rounded-xl border-2 border-[#352C21] bg-white hover:bg-[#FFB5B8]/20 transition-all shadow-xs group"
          >
            <div className="text-[11px] font-bold text-[#FFB5B8] bg-[#352C21] px-1.5 py-0.5 rounded w-fit mb-1">
              一番多い！
            </div>
            <div className="font-black text-sm text-[#352C21] group-hover:text-red-700">
              パターン①に挑戦
            </div>
            <div className="text-xs text-[#352C21]/70 mt-0.5">
              「次へ」を押した後に一括で赤い警告文が出るタイプ
            </div>
          </button>

          <button
            onClick={() => onSelectPatternDirectly('pattern2')}
            className="p-3 text-left rounded-xl border-2 border-[#352C21] bg-white hover:bg-[#FFBE34]/20 transition-all shadow-xs group"
          >
            <div className="text-[11px] font-bold text-[#FFBE34] bg-[#352C21] px-1.5 py-0.5 rounded w-fit mb-1">
              勘違いしやすい！
            </div>
            <div className="font-black text-sm text-[#352C21] group-hover:text-amber-700">
              パターン②に挑戦
            </div>
            <div className="text-xs text-[#352C21]/70 mt-0.5">
              最初からうっすら入力例が入っているタイプ
            </div>
          </button>

          <button
            onClick={() => onSelectPatternDirectly('pattern3')}
            className="p-3 text-left rounded-xl border-2 border-[#352C21] bg-white hover:bg-[#91DF42]/20 transition-all shadow-xs group"
          >
            <div className="text-[11px] font-bold text-[#91DF42] bg-[#352C21] px-1.5 py-0.5 rounded w-fit mb-1">
              親切・モダン
            </div>
            <div className="font-black text-sm text-[#352C21] group-hover:text-green-700">
              パターン③に挑戦
            </div>
            <div className="text-xs text-[#352C21]/70 mt-0.5">
              枠を離れた瞬間にピンク色に変わる即時判定タイプ
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
