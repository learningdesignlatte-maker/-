import React from 'react';
import { FontSize } from '../types';
import { 
  Laptop, 
  HelpCircle, 
  Type, 
  MessageSquare, 
  ListFilter,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dialogue' | 'select' | 'form' | 'confirm';
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  onNavigateToDialogue: () => void;
  onNavigateToSelect: () => void;
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  fontSize,
  setFontSize,
  onNavigateToDialogue,
  onNavigateToSelect,
  onOpenGuideModal,
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-[#352C21]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#76A1ED] border-2 border-[#352C21] flex items-center justify-center text-white shadow-xs">
            <Laptop className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded bg-[#FFBE34] text-[#352C21] border border-[#352C21]/30">
                教室専用
              </span>
              <span className="text-xs font-bold text-[#9D4895]">入力トレーニング</span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-[#352C21] tracking-tight leading-tight">
              行政・資格試験フォーム入力マスター
            </h1>
          </div>
        </div>

        {/* Controls: Nav & Font Size */}
        <div className="flex items-center gap-2 text-xs">
          {/* Navigation Shortcuts */}
          <div className="hidden md:flex items-center gap-1.5 border-r border-[#352C21]/20 pr-2">
            <button
              onClick={onNavigateToDialogue}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
                currentView === 'dialogue'
                  ? 'bg-[#76A1ED] text-white border-[#352C21]'
                  : 'bg-white text-[#352C21] border-gray-300 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>会話解説</span>
            </button>

            <button
              onClick={onNavigateToSelect}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
                currentView === 'select'
                  ? 'bg-[#FFBE34] text-[#352C21] border-[#352C21]'
                  : 'bg-white text-[#352C21] border-gray-300 hover:bg-gray-100'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>パターン選択</span>
            </button>
          </div>

          {/* Font Size Selector (Crucial for computer class elderly users) */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-[#352C21]/20">
            <Type className="w-3.5 h-3.5 text-[#352C21]/70 ml-1 hidden xs:inline" />
            <span className="text-[11px] font-bold text-[#352C21]/70 mr-0.5 hidden xs:inline">文字:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                fontSize === 'normal'
                  ? 'bg-[#352C21] text-white shadow-2xs'
                  : 'text-[#352C21] hover:bg-gray-200'
              }`}
            >
              標準
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                fontSize === 'large'
                  ? 'bg-[#352C21] text-white shadow-2xs'
                  : 'text-[#352C21] hover:bg-gray-200'
              }`}
            >
              大
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                fontSize === 'xlarge'
                  ? 'bg-[#352C21] text-white shadow-2xs'
                  : 'text-[#352C21] hover:bg-gray-200'
              }`}
            >
              特大
            </button>
          </div>

          {/* Quick Guide Modal trigger */}
          <button
            onClick={onOpenGuideModal}
            className="px-2.5 py-1 rounded-lg font-bold bg-[#FFBE34] text-[#352C21] border border-[#352C21] hover:bg-[#FFBE34]/80 shadow-2xs flex items-center gap-1"
            title="全角と半角の違い早見表"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">全角/半角早見表</span>
          </button>
        </div>
      </div>
    </header>
  );
};
