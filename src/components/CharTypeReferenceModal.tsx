import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ArrowRightLeft, 
  Check, 
  AlertCircle, 
  Keyboard, 
  Smartphone,
  Sparkles
} from 'lucide-react';
import { toFullWidth, toHalfWidth } from '../utils/validation';

interface CharTypeReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharTypeReferenceModal: React.FC<CharTypeReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testInput, setTestInput] = useState('');

  if (!isOpen) return null;

  // Analyze characters in the test input
  const analyzeChars = (str: string) => {
    return Array.from(str).map((char, index) => {
      const code = char.charCodeAt(0);
      let type = '';
      let isFull = false;

      if (/[0-9]/.test(char)) {
        type = '半角数字（小文字）';
        isFull = false;
      } else if (/[０-９]/.test(char)) {
        type = '全角数字（大文字）⭕';
        isFull = true;
      } else if (char === '-') {
        type = '半角ハイフン（小文字）';
        isFull = false;
      } else if (char === '－') {
        type = '全角ハイフン（大文字）⭕';
        isFull = true;
      } else if (char === 'ー') {
        type = '全角長音記号（カタカナの伸ばし棒）';
        isFull = true;
      } else if (/[a-zA-Z]/.test(char)) {
        type = '半角アルファベット';
        isFull = false;
      } else if (/[ａ-ｚＡ-Ｚ]/.test(char)) {
        type = '全角アルファベット';
        isFull = true;
      } else if (/[\u30A0-\u30FF]/.test(char)) {
        type = '全角カタカナ⭕';
        isFull = true;
      } else if (/[\u3040-\u309F]/.test(char)) {
        type = 'ひらがな';
        isFull = true;
      } else if (/[\u4E00-\u9FAF]/.test(char)) {
        type = '漢字';
        isFull = true;
      } else {
        type = 'その他記号';
        isFull = code > 255;
      }

      return { char, type, isFull, index };
    });
  };

  const analysis = analyzeChars(testInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#352C21]/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl border-3 border-[#352C21] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#FFBE34] px-5 py-3 border-b-2 border-[#352C21] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#352C21]" />
            <h3 className="text-base sm:text-lg font-black text-[#352C21]">
              「大文字（全角）」と「小文字（半角）」の違い早見表
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#352C21] hover:bg-black/10 transition-colors"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#352C21]">
          {/* Quick Explanation */}
          <div className="p-3 rounded-xl bg-amber-50 border border-[#FFBE34]">
            <p className="font-bold text-[#352C21] leading-relaxed">
              行政や資格試験の「<strong>大文字で入力してください</strong>」とは、<strong>「全角（ぜんかく）」</strong>文字のことです！
              マス目いっぱいの正方形の文字が「全角（大文字）」で、半分の細い文字が「半角（小文字）」です。
            </p>
          </div>

          {/* Side by side comparison table */}
          <div>
            <h4 className="font-black text-[#352C21] mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#76A1ED]" />
              文字の種類別 見分け方
            </h4>
            <div className="border-2 border-[#352C21] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b-2 border-[#352C21] text-xs font-black text-[#352C21]">
                  <tr>
                    <th className="p-2 sm:p-2.5 border-r border-[#352C21]/20">項目</th>
                    <th className="p-2 sm:p-2.5 border-r border-[#352C21]/20 text-red-700 bg-red-50">
                      小文字（半角）※住所でエラー
                    </th>
                    <th className="p-2 sm:p-2.5 text-[#5cb312] bg-green-50">
                      大文字（全角）※行政の住所で正解
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#352C21]/15 text-xs sm:text-sm">
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold border-r border-[#352C21]/20">番地の数字</td>
                    <td className="p-2 sm:p-2.5 font-mono text-red-600 bg-red-50/30 border-r border-[#352C21]/20">
                      1 2 3 4 5
                    </td>
                    <td className="p-2 sm:p-2.5 font-mono font-black text-[#352C21] bg-green-50/30">
                      １ ２ ３ ４ ５
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold border-r border-[#352C21]/20">ハイフン</td>
                    <td className="p-2 sm:p-2.5 font-mono text-red-600 bg-red-50/30 border-r border-[#352C21]/20">
                      - （半角マイナス）
                    </td>
                    <td className="p-2 sm:p-2.5 font-mono font-black text-[#352C21] bg-green-50/30">
                      － （全角ハイフン）
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold border-r border-[#352C21]/20">アルファベット</td>
                    <td className="p-2 sm:p-2.5 font-mono text-gray-700 border-r border-[#352C21]/20">
                      a b c A B C
                    </td>
                    <td className="p-2 sm:p-2.5 font-mono font-black text-[#352C21]">
                      ａ ｂ ｃ Ａ Ｂ Ｃ
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 font-bold border-r border-[#352C21]/20">カタカナ</td>
                    <td className="p-2 sm:p-2.5 font-mono text-red-600 bg-red-50/30 border-r border-[#352C21]/20">
                      ｱ ｲ ｳ（半角カナは不可）
                    </td>
                    <td className="p-2 sm:p-2.5 font-mono font-black text-[#352C21] bg-green-50/30">
                      ア イ ウ（全角カタカナ）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Tester Tool */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border-2 border-[#76A1ED]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-sm text-[#352C21] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#76A1ED]" />
                試し打ちチェッカー：あなたの文字は全角？半角？
              </span>
            </div>
            <p className="text-xs text-[#352C21]/70 mb-2">
              下の枠に適当に数字や文字を打ってみてください。全角か半角かを1文字ずつ判定します！
            </p>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="ここに文字を入力してみてください（例：1-1 や １－１）"
                className="flex-1 px-3 py-2 rounded-xl border-2 border-[#352C21] bg-white font-medium outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setTestInput(toFullWidth(testInput))}
                className="px-3 py-2 rounded-xl bg-[#91DF42] text-[#352C21] font-bold text-xs border border-[#352C21] hover:bg-[#91DF42]/80 shrink-0"
              >
                全角にする
              </button>
            </div>

            {testInput && (
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#352C21]/20 space-y-1">
                <div className="text-xs font-bold text-[#352C21] mb-1">判定結果：</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.map((item, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border ${
                        item.isFull
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      <span className="font-mono text-sm underline font-black">{item.char}</span>
                      <span>({item.type})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t-2 border-[#352C21] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FFBE34] text-[#352C21] font-black text-sm border-2 border-[#352C21] hover:bg-[#FFBE34]/80 shadow-xs"
          >
            閉じて練習を続ける
          </button>
        </div>
      </div>
    </div>
  );
};
