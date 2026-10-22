import React, { useState } from 'react';
import { PersonaProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { 
  CreditCard, 
  ChevronUp, 
  ChevronDown, 
  UserCheck, 
  Copy, 
  Check, 
  ArrowRightLeft
} from 'lucide-react';

interface StickyLicenseCardProps {
  currentProfile: PersonaProfile;
  onSwitchGender: (gender: 'male' | 'female') => void;
  onFillExample: (profile: PersonaProfile, withMistake?: boolean) => void;
  onOpenGuideModal: () => void;
}

export const StickyLicenseCard: React.FC<StickyLicenseCardProps> = ({
  currentProfile,
  onSwitchGender,
  onFillExample,
  onOpenGuideModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const isMale = currentProfile.id === 'male';

  return (
    <aside 
      aria-label="お手本見本カード" 
      className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#352C21]/20 shadow-md transition-all"
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-1.5">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-[#352C21]/10 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-white bg-[#9D4895]">
              <CreditCard className="w-3.5 h-3.5" />
              お手本カード
            </span>
            <span className="text-[#352C21] font-bold hidden sm:inline">
              ※本人の情報は入力せず、このカードの情報で練習してください
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Gender Toggle Button */}
            <button
              onClick={() => onSwitchGender(isMale ? 'female' : 'male')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border border-[#352C21] text-[#352C21] hover:bg-[#FFBE34] transition-colors shadow-xs active:scale-95"
              title="男性と女性のお手本を切り替えます"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#352C21]" />
              <span>{isMale ? '佐藤さん(女性)に切替' : '山田さん(男性)に切替'}</span>
            </button>

            {/* Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md text-[#352C21] hover:bg-black/5"
              title={isCollapsed ? 'カードを詳しく見る' : 'カードを最小化する'}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsed view (Slim Bar) */}
        {isCollapsed ? (
          <div className="py-1 flex items-center justify-between text-xs text-[#352C21]">
            <div className="flex items-center gap-2 truncate">
              <img
                src={currentProfile.photoUrl}
                alt={currentProfile.name}
                className="w-6 h-6 rounded-full border border-[#352C21] object-cover"
              />
              <span className="font-bold">{currentProfile.name}</span>
              <span className="text-[#352C21]/70 truncate">
                {currentProfile.prefecture}{currentProfile.city}{currentProfile.addressBanchiZen}
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-xs font-bold text-[#76A1ED] underline ml-2 whitespace-nowrap"
            >
              カードを広げる
            </button>
          </div>
        ) : (
          /* Expanded Driver's License Card */
          <div className="mt-1.5 p-2 sm:p-3 rounded-lg border-2 border-[#352C21] bg-white relative shadow-sm">
            {/* Simulated Driver's License Header */}
            <div className={`flex items-center justify-between px-3 py-1 rounded-t-md text-white font-extrabold text-xs sm:text-sm tracking-wide ${isMale ? 'bg-[#76A1ED]' : 'bg-[#9D4895]'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs bg-white text-[#352C21] px-1.5 py-0.2 rounded font-black">
                  練習見本
                </span>
                <span>練習用身元確認証（運転免許証タイプ）</span>
              </div>
              <span className="text-[11px] opacity-90 hidden sm:inline">
                {currentProfile.licenseNumber}
              </span>
            </div>

            {/* License Gold/Accent Stripe */}
            <div className="h-1.5 w-full bg-[#FFBE34] mb-2" />

            {/* Card Content Body */}
            <div className="space-y-2 text-xs sm:text-sm">
              {/* Top Row: Name & Birth Date (Left) + Photo (Right) */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  {/* Name */}
                  <div className="flex items-baseline gap-2 border-b border-dashed border-[#352C21]/20 pb-1">
                    <span className="text-[#352C21]/70 text-[11px] w-12 sm:w-16 shrink-0">氏名</span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-[#352C21]">
                        {currentProfile.name}
                      </span>
                      <span className="text-xs text-[#352C21] font-bold bg-[#76A1ED]/20 px-1.5 py-0.5 rounded">
                        フリガナ: {currentProfile.nameKana}
                      </span>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="flex items-center gap-2 border-b border-dashed border-[#352C21]/20 pb-1">
                    <span className="text-[#352C21]/70 text-[11px] w-12 sm:w-16 shrink-0">生年月日</span>
                    <span className="font-bold text-[#352C21] text-xs sm:text-sm">
                      {currentProfile.birthDateFull}
                    </span>
                  </div>
                </div>

                {/* Photo box placed at top */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded border-2 border-[#352C21] overflow-hidden bg-white shadow-xs shrink-0">
                  <img
                    src={currentProfile.photoUrl}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#352C21]/80 text-[10px] text-white text-center py-0.5 font-bold">
                    {currentProfile.gender}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-baseline gap-2 border-b border-dashed border-[#352C21]/20 pb-1">
                <span className="text-[#352C21]/70 text-[11px] w-12 sm:w-16 shrink-0">
                  住所
                </span>
                <div className="font-bold text-[#352C21] leading-snug">
                  〒{currentProfile.postalCodeHyphen} {currentProfile.prefecture}{currentProfile.city}{currentProfile.addressBanchiZen} {currentProfile.buildingZen}
                </div>
              </div>

              {/* Phone & Email (Full width) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#352C21] pt-0.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[#352C21]/70 text-[11px] shrink-0">電話番号:</span>
                  <span className="font-bold font-mono text-xs sm:text-sm">
                    {currentProfile.phoneNumberHanHyphen}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[#352C21]/70 text-[11px] shrink-0">メール:</span>
                  <span className="font-bold font-mono truncate text-xs sm:text-sm">
                    {currentProfile.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
