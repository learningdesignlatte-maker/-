import React from 'react';
import { 
  SquarePen, 
  MessageSquare, 
  ListFilter
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dialogue' | 'select' | 'form' | 'confirm';
  onNavigateToDialogue: () => void;
  onNavigateToSelect: () => void;
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateToDialogue,
  onNavigateToSelect,
  onOpenGuideModal,
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-[#352C21]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#76A1ED] flex items-center justify-center text-white shadow-xs">
            <SquarePen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-[#352C21] tracking-tight leading-tight">
              申込みフォーム入力練習
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

          {/* Quick Guide Modal trigger */}
          <button
            onClick={onOpenGuideModal}
            className="px-2.5 py-1 rounded-lg font-bold bg-[#FFBE34] text-[#352C21] border border-[#352C21] hover:bg-[#FFBE34]/80 shadow-2xs text-xs whitespace-nowrap"
            title="全角と半角の違い早見表"
          >
            全角/半角 早見表
          </button>
        </div>
      </div>
    </header>
  );
};
