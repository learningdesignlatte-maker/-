import React from 'react';
import { PracticePatternId, PersonaProfile } from '../types';
import { 
  ArrowRight, 
  FileCheck2
} from 'lucide-react';

interface PatternSelectionProps {
  currentProfile: PersonaProfile;
  onSelectPattern: (patternId: PracticePatternId) => void;
  onBackToDialogue: () => void;
  onOpenGuideModal: () => void;
}

export const PatternSelection: React.FC<PatternSelectionProps> = ({
  currentProfile,
  onSelectPattern,
  onBackToDialogue,
  onOpenGuideModal,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#352C21] tracking-tight">
          挑戦する入力パターンを選んでください
        </h1>
      </div>

      {/* The Pattern Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pattern 1 */}
        <div className="bg-white rounded-2xl border-2 border-[#352C21] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div>
            <h2 className="text-lg font-black text-[#352C21] group-hover:text-red-700 transition-colors">
              パターン①：一括警告型
            </h2>
            <p className="text-xs font-bold text-red-600 mt-1">
              「次へ」を押した瞬間に画面上部に赤文字警告が出るタイプ
            </p>

            <div className="mt-4 p-3 rounded-lg bg-red-50/60 border border-red-200 text-xs text-[#352C21] space-y-1.5">
              <div className="font-bold text-[#352C21]">
                実際のシチュエーション：
              </div>
              <p className="font-bold text-[#352C21] leading-relaxed">
                入力中は何も言われないため安心していると、「次へ」を押した瞬間に画面の上に『※住所は全角で入力してください』と赤文字が出て、枠が赤くなります。
              </p>
            </div>

            <div className="mt-3 text-xs text-[#352C21]/90">
              <span className="font-bold text-[#352C21]">身につくスキル：</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-[#352C21]/80">
                <li>画面上部に飛んだ警告文を落ち着いて読む</li>
                <li>赤枠になった「番地の半角」を見つけて直す</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectPattern('pattern1')}
            className="mt-6 w-full py-3 px-4 rounded-xl font-black text-sm bg-[#FFB5B8] text-[#352C21] border-2 border-[#352C21] hover:bg-[#FFB5B8]/80 shadow-xs active:scale-98 flex items-center justify-center gap-2 transition-all"
          >
            <span>パターン①に挑戦</span>
            <ArrowRight className="w-4 h-4 text-[#352C21]" />
          </button>
        </div>

        {/* Pattern 2 */}
        <div className="bg-white rounded-2xl border-2 border-[#352C21] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div>
            <h2 className="text-lg font-black text-[#352C21] group-hover:text-amber-700 transition-colors">
              パターン②：うっすら入力例型
            </h2>
            <p className="text-xs font-bold text-amber-700 mt-1">
              最初から枠内に薄い文字（プレースホルダー）があるタイプ
            </p>

            <div className="mt-4 p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-[#352C21] space-y-1.5">
              <div className="font-bold text-[#352C21]">
                実際のシチュエーション：
              </div>
              <p className="font-bold text-[#352C21] leading-relaxed">
                枠の中に「例：千代田１－１」と薄い字が入っています。「すでに入っている」と飛ばして怒られたり、ハイフンの有無を見落とすトラブルを体験できます。
              </p>
            </div>

            <div className="mt-3 text-xs text-[#352C21]/90">
              <span className="font-bold text-[#352C21]">身につくスキル：</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-[#352C21]/80">
                <li>薄い例示文字と本物の入力文字の見分け</li>
                <li>入力例に合わせた全角・半角の見極め</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectPattern('pattern2')}
            className="mt-6 w-full py-3 px-4 rounded-xl font-black text-sm bg-[#FFBE34] text-[#352C21] border-2 border-[#352C21] hover:bg-[#FFBE34]/80 shadow-xs active:scale-98 flex items-center justify-center gap-2 transition-all"
          >
            <span>パターン②に挑戦</span>
            <ArrowRight className="w-4 h-4 text-[#352C21]" />
          </button>
        </div>

        {/* Pattern 3 */}
        <div className="bg-white rounded-2xl border-2 border-[#352C21] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div>
            <h2 className="text-lg font-black text-[#352C21] group-hover:text-green-700 transition-colors">
              パターン③：即時ピンク変化型
            </h2>
            <p className="text-xs font-bold text-[#5cb312] mt-1">
              入力欄を離れた瞬間に枠がピンク色になり即座に指摘されるタイプ
            </p>

            <div className="mt-4 p-3 rounded-lg bg-green-50/60 border border-green-200 text-xs text-[#352C21] space-y-1.5">
              <div className="font-bold text-[#352C21]">
                実際のシチュエーション：
              </div>
              <p className="font-bold text-[#352C21] leading-relaxed">
                半角で住所を打って次の項目に移った瞬間、マスが薄いピンクに変わり「※全角で入力してください」と警告が出ます。その場で直せば青や緑に戻ります。
              </p>
            </div>

            <div className="mt-3 text-xs text-[#352C21]/90">
              <span className="font-bold text-[#352C21]">身につくスキル：</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-[#352C21]/80">
                <li>ピンク色に変わった枠をすぐに見直す</li>
                <li>入力途中でのリアルタイム修正に慣れる</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => onSelectPattern('pattern3')}
            className="mt-6 w-full py-3 px-4 rounded-xl font-black text-sm bg-[#91DF42] text-[#352C21] border-2 border-[#352C21] hover:bg-[#91DF42]/80 shadow-xs active:scale-98 flex items-center justify-center gap-2 transition-all"
          >
            <span>パターン③に挑戦</span>
            <ArrowRight className="w-4 h-4 text-[#352C21]" />
          </button>
        </div>
      </div>

      {/* Special Bonus: Full Exam Mode */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 via-white to-blue-50 rounded-2xl border-2 border-[#352C21] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#9D4895] text-white text-xs font-bold mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            総仕上げ
          </div>
          <h3 className="text-lg font-black text-[#352C21]">
            全国技能検定・行政申請 本番シミュレーション
          </h3>
          <p className="text-xs sm:text-sm text-[#352C21]/80 mt-1">
            公的試験や行政ポータルを完全再現！ヒントなしで全項目を正しく入力し、一発合格を目指しましょう！
          </p>
        </div>

        <button
          onClick={() => onSelectPattern('patternExam')}
          className="shrink-0 py-3 px-6 rounded-xl font-black text-sm bg-[#9D4895] text-white border-2 border-[#352C21] hover:bg-[#9D4895]/90 shadow-md active:scale-98 flex items-center gap-2 transition-all"
        >
          <span>本番テストに挑戦する</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
