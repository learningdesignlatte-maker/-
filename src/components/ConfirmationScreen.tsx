import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FormValues, PersonaProfile, PracticePatternId } from '../types';
import { 
  CheckCircle2, 
  Award, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Home, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { teacherAvatar, studentAvatar } from '../assets';

interface ConfirmationScreenProps {
  formValues: FormValues;
  profile: PersonaProfile;
  patternId: PracticePatternId;
  onRetrySamePattern: () => void;
  onSelectAnotherPattern: () => void;
  onSwitchGenderAndRetry: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  formValues,
  profile,
  patternId,
  onRetrySamePattern,
  onSelectAnotherPattern,
  onSwitchGenderAndRetry,
}) => {
  // Fire celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB5B8', '#FFBE34', '#91DF42', '#76A1ED', '#9D4895'],
    });
  }, []);

  const getPatternName = () => {
    switch (patternId) {
      case 'pattern1': return 'パターン①：一括警告型';
      case 'pattern2': return 'パターン②：うっすら入力例型';
      case 'pattern3': return 'パターン③：即時ピンク変化型';
      case 'patternExam': return '本番シミュレーション';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Success Hero Banner */}
      <div className="bg-white rounded-3xl border-3 border-[#352C21] p-6 sm:p-8 text-center shadow-lg relative overflow-hidden mb-8">
        {/* Decorative corner ribbons */}
        <div className="absolute top-0 right-0 bg-[#91DF42] text-[#352C21] font-black text-xs px-4 py-1.5 rounded-bl-2xl border-l-2 border-b-2 border-[#352C21]">
          合格認定
        </div>

        <div className="w-20 h-20 mx-auto rounded-full bg-[#91DF42]/20 border-3 border-[#91DF42] flex items-center justify-center text-[#5cb312] mb-4">
          <Award className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-[#91DF42] text-[#352C21] mb-2 border border-[#352C21]">
          {getPatternName()} クリア！
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#352C21]">
          入力完了！完璧に合格できました！
        </h1>
        <p className="text-sm sm:text-base text-[#352C21]/80 max-w-xl mx-auto mt-2 leading-relaxed">
          行政や資格試験で最もつまずきやすい「住所の全角」ルールや各種フォーマットを正確に入力できました。
        </p>

        {/* Teacher & Student celebration speech */}
        <div className="mt-6 pt-6 border-t-2 border-[#352C21]/15 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Teacher */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border-2 border-[#76A1ED] flex items-start gap-3">
            <img
              src={teacherAvatar}
              alt="先生"
              className="w-12 h-12 rounded-full border-2 border-[#76A1ED] object-cover shrink-0"
            />
            <div className="text-xs">
              <span className="font-black text-[#76A1ED] block">先生</span>
              <p className="text-[#352C21] mt-0.5 font-medium leading-relaxed">
                お見事です！特に住所の「{formValues.addressBanchi}」がしっかりと全角で揃っていて素晴らしいです。本番の申請でもこの調子で落ち着いて確認すれば百点満点です！
              </p>
            </div>
          </div>

          {/* Student */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border-2 border-[#9D4895] flex items-start gap-3">
            <img
              src={studentAvatar}
              alt="生徒さん"
              className="w-12 h-12 rounded-full border-2 border-[#9D4895] object-cover shrink-0"
            />
            <div className="text-xs">
              <span className="font-black text-[#9D4895] block">生徒さん</span>
              <p className="text-[#352C21] mt-0.5 font-medium leading-relaxed">
                赤文字が出たときも、あわてずに「全角かな？半角かな？」と見直せば解決できることが実感できました！自信がつきました！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Data Review Card */}
      <div className="bg-white rounded-2xl border-2 border-[#352C21] p-5 sm:p-7 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#352C21]/15 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#91DF42]" />
            <h2 className="text-lg font-black text-[#352C21]">
              送信された申請内容の確認（見本）
            </h2>
          </div>
          <span className="text-xs font-bold text-[#5cb312] bg-[#91DF42]/20 px-2 py-0.5 rounded border border-[#91DF42]">
            検証通過済
          </span>
        </div>

        <dl className="divide-y divide-gray-100 text-xs sm:text-sm">
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">氏名（漢字）</dt>
            <dd className="col-span-2 font-black text-[#352C21]">{formValues.kanjiName}</dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">フリガナ（全角）</dt>
            <dd className="col-span-2 font-black text-[#352C21] flex items-center gap-2">
              <span>{formValues.kanaName}</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-bold">
                全角カタカナOK
              </span>
            </dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">生年月日</dt>
            <dd className="col-span-2 font-bold text-[#352C21]">
              {formValues.birthYear}年{formValues.birthMonth}月{formValues.birthDay}日
            </dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">郵便番号</dt>
            <dd className="col-span-2 font-bold font-mono text-[#352C21]">
              〒{formValues.postalCode}（半角7桁）
            </dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2 bg-amber-50/60 p-2 rounded-lg border border-[#FFBE34]">
            <dt className="text-[#352C21] font-black">ご住所（番地・建物）</dt>
            <dd className="col-span-2">
              <div className="font-black text-[#352C21]">
                {formValues.prefecture}{formValues.city}
                <span className="bg-[#91DF42]/30 px-1.5 py-0.5 rounded mx-1 border border-[#91DF42]">
                  {formValues.addressBanchi}
                </span>
                {formValues.building && (
                  <span className="ml-1">{formValues.building}</span>
                )}
              </div>
              <div className="text-[11px] text-[#5cb312] font-bold mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>全角ルール完全準拠</span>
              </div>
            </dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">電話番号</dt>
            <dd className="col-span-2 font-bold font-mono text-[#352C21]">
              {formValues.phone}（半角ハイフンなし）
            </dd>
          </div>
          <div className="py-2.5 grid grid-cols-3 gap-2">
            <dt className="text-[#352C21]/70 font-bold">メールアドレス</dt>
            <dd className="col-span-2 font-bold font-mono text-[#352C21] truncate">
              {formValues.email}
            </dd>
          </div>
        </dl>
      </div>

      {/* Next Steps / Practice Actions */}
      <div className="bg-white rounded-2xl border-2 border-[#352C21] p-5 shadow-xs text-center space-y-4">
        <h3 className="text-base font-black text-[#352C21]">
          次は何を試してみますか？
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSelectAnotherPattern}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm bg-[#FFBE34] text-[#352C21] border-2 border-[#352C21] hover:bg-[#FFBE34]/80 transition-all shadow-xs"
          >
            別のパターン（①・②・③）に挑戦する
          </button>

          <button
            onClick={onSwitchGenderAndRetry}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm bg-[#76A1ED] text-white border-2 border-[#352C21] hover:bg-[#76A1ED]/90 transition-all shadow-xs"
          >
            {profile.id === 'male' ? '佐藤さん（女性）の情報で練習' : '山田さん（男性）の情報で練習'}
          </button>

          <button
            onClick={onRetrySamePattern}
            className="w-full sm:w-auto px-4 py-3 rounded-xl font-bold text-sm bg-white text-[#352C21] border-2 border-[#352C21] hover:bg-gray-100 transition-all"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            もう一度このパターンを復習
          </button>
        </div>
      </div>
    </div>
  );
};
