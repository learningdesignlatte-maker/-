import React, { useState, useRef, useEffect } from 'react';
import { 
  PracticePatternId, 
  PersonaProfile, 
  FormValues, 
  FormErrors, 
  FontSize 
} from '../types';
import { 
  validateForm, 
  toFullWidth, 
  toHalfWidth, 
  hiraganaToKatakana,
  hasHalfWidthAlphaNumOrHyphen
} from '../utils/validation';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  Sparkles, 
  Keyboard, 
  Smartphone, 
  ArrowLeft, 
  ArrowRight,
  RotateCcw,
  Lightbulb,
  FileText
} from 'lucide-react';

interface PracticeFormProps {
  patternId: PracticePatternId;
  currentProfile: PersonaProfile;
  fontSize: FontSize;
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  onComplete: (values: FormValues) => void;
  onBackToPatternSelect: () => void;
  onOpenGuideModal: () => void;
}

export const PracticeForm: React.FC<PracticeFormProps> = ({
  patternId,
  currentProfile,
  fontSize,
  formValues,
  setFormValues,
  onComplete,
  onBackToPatternSelect,
  onOpenGuideModal,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [showTeacherAdvice, setShowTeacherAdvice] = useState(false);
  const [activeDeviceHint, setActiveDeviceHint] = useState<'pc' | 'sp'>('pc');

  const warningBannerRef = useRef<HTMLDivElement>(null);

  // Pattern specifics
  const isPattern1 = patternId === 'pattern1';
  const isPattern2 = patternId === 'pattern2'; // faint placeholder emphasis
  const isPattern3 = patternId === 'pattern3'; // real-time pink highlight
  const isExam = patternId === 'patternExam';

  // Pattern descriptions
  const getPatternTitle = () => {
    switch (patternId) {
      case 'pattern1':
        return '【パターン①：一括警告型】行政・資格試験で最も多いタイプ';
      case 'pattern2':
        return '【パターン②：うっすら入力例型】プレースホルダーに惑わされない練習';
      case 'pattern3':
        return '【パターン③：即時ピンク変化型】枠を離れた瞬間にリアルタイム指摘';
      case 'patternExam':
        return '【本番シミュレーション】全国技能検定 受験申込受付フォーム';
    }
  };

  const getPatternBadge = () => {
    switch (patternId) {
      case 'pattern1':
        return { bg: 'bg-[#FFB5B8]', text: 'パターン①：一括警告' };
      case 'pattern2':
        return { bg: 'bg-[#FFBE34]', text: 'パターン②：入力例あり' };
      case 'pattern3':
        return { bg: 'bg-[#91DF42]', text: 'パターン③：即時ピンク' };
      case 'patternExam':
        return { bg: 'bg-[#9D4895] text-white', text: '実戦テスト' };
    }
  };

  // Handle Input Changes
  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => {
      const next = { ...prev, [field]: value };
      // In pattern 3 (instant validation), validate field immediately if touched
      if (isPattern3) {
        const valErrors = validateForm(next);
        setErrors(valErrors);
      }
      return next;
    });
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (isPattern3) {
      const valErrors = validateForm(formValues);
      setErrors(valErrors);
    }
  };

  // Submit & Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to top warning banner smoothly
      setShowTeacherAdvice(true);
      setTimeout(() => {
        warningBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else {
      // All passed!
      onComplete(formValues);
    }
  };

  // Helper: inject the typical mistake (half-width 1-1 in address)
  const handleInjectMistake = () => {
    setFormValues({
      kanjiName: currentProfile.name,
      kanaName: currentProfile.nameKana,
      birthYear: currentProfile.birthYear,
      birthMonth: currentProfile.birthMonth,
      birthDay: currentProfile.birthDay,
      postalCode: currentProfile.postalCodeRaw,
      prefecture: currentProfile.prefecture,
      city: currentProfile.city,
      addressBanchi: currentProfile.addressBanchiHan, // "千代田1-1" (MISTAKE!)
      building: currentProfile.buildingHan, // "パソコンハイツ201号室" (MISTAKE!)
      phone: currentProfile.phoneNumberHanNoHyphen,
      email: currentProfile.email,
    });
    setHasSubmitted(true);
    const errs = validateForm({
      ...formValues,
      addressBanchi: currentProfile.addressBanchiHan,
      building: currentProfile.buildingHan,
    });
    setErrors(errs);
    setShowTeacherAdvice(true);
    setTimeout(() => {
      warningBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // Helper: auto-fix address banchi to full-width
  const handleAutoFixAddress = () => {
    setFormValues((prev) => {
      const fixedBanchi = toFullWidth(prev.addressBanchi);
      const fixedBuilding = toFullWidth(prev.building);
      const next = { ...prev, addressBanchi: fixedBanchi, building: fixedBuilding };
      if (hasSubmitted || isPattern3) {
        setErrors(validateForm(next));
      }
      return next;
    });
  };

  // Font size classes
  const fontClass = fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';
  const labelFontClass = fontSize === 'xlarge' ? 'text-base' : fontSize === 'large' ? 'text-sm' : 'text-xs';

  // Determine if a field has an error visible right now
  const shouldShowFieldError = (fieldName: keyof FormValues): boolean => {
    if (isPattern1 || isExam) {
      // Only show error messages after submit button was clicked
      return hasSubmitted && !!errors[fieldName];
    }
    if (isPattern3) {
      // In Pattern 3, show if touched OR submitted
      return (touchedFields[fieldName] || hasSubmitted) && !!errors[fieldName];
    }
    if (isPattern2) {
      return hasSubmitted && !!errors[fieldName];
    }
    return false;
  };

  // Input background styling (Pattern 3 turns pink immediately, Pattern 1 turns red/pink on submit)
  const getInputStyle = (fieldName: keyof FormValues): string => {
    const isErr = shouldShowFieldError(fieldName);
    if (isErr) {
      // Pink error state
      return 'bg-[#FFB5B8]/30 border-2 border-red-500 text-[#352C21] focus:ring-2 focus:ring-red-400';
    }
    if (isPattern3 && touchedFields[fieldName] && !errors[fieldName] && formValues[fieldName]) {
      // Success green tint in pattern 3
      return 'bg-[#91DF42]/10 border-2 border-[#91DF42] text-[#352C21]';
    }
    return 'bg-white border-2 border-[#352C21]/30 hover:border-[#352C21] text-[#352C21] focus:border-[#76A1ED] focus:ring-2 focus:ring-[#76A1ED]/30';
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className={`max-w-4xl mx-auto py-6 px-3 sm:px-6 ${fontClass}`}>
      {/* Pattern Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[#352C21]/15">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToPatternSelect}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[#352C21] text-xs font-bold text-[#352C21] hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>パターン一覧へ戻る</span>
          </button>
          <span className={`text-xs font-black px-2.5 py-1 rounded-md border border-[#352C21] ${getPatternBadge().bg}`}>
            {getPatternBadge().text}
          </span>
        </div>

        {/* Experiment buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleInjectMistake}
            className="px-3 py-1.5 rounded-lg font-bold bg-[#FFB5B8] text-[#352C21] border border-[#352C21] hover:bg-[#FFB5B8]/80 transition-colors shadow-2xs"
            title="わざと小文字（半角 1-1）を入力して、指定の警告文を体験します"
          >
            ⚠ わざと小文字で試す（警告体験）
          </button>
          <button
            type="button"
            onClick={onOpenGuideModal}
            className="px-3 py-1.5 rounded-lg font-bold bg-[#FFBE34] text-[#352C21] border border-[#352C21] hover:bg-[#FFBE34]/80 transition-colors shadow-2xs"
          >
            全角/半角早見表
          </button>
        </div>
      </div>

      {/* Form Title & Scenario Description */}
      <div className="bg-white rounded-xl border-2 border-[#352C21] p-4 sm:p-5 mb-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-[#352C21]">
          {getPatternTitle()}
        </h1>
        <p className="text-xs sm:text-sm text-[#352C21]/80 mt-1 leading-relaxed">
          {isPattern1 && '【注意】このタイプは途中で教えてくれません。入力が終わったら一番下の「次へ（確認画面へ）」を押してください。もし誤りがあると画面上部に赤文字の警告が出現します。'}
          {isPattern2 && '【注意】入力欄の中に薄い文字（プレースホルダー）が表示されています。「もう入っている」と勘違いして飛ばさず、見本カードの情報をしっかり入力してください。'}
          {isPattern3 && '【注意】入力欄を離れた瞬間、もし小文字（半角）などの誤りがあると、マスが薄いピンク色に変わってその場で教えてくれます。'}
          {isExam && '【模擬本番】行政ポータル・公的資格試験の公式申込画面です。お手本カード（山田さん・佐藤さん）の情報どおりに正確にミスなく登録してください。'}
        </p>
      </div>

      {/* CRITICAL WARNING BANNER AT TOP (Requested by User) */}
      {hasSubmitted && errorCount > 0 && (
        <div
          ref={warningBannerRef}
          role="alert"
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-red-50 border-3 border-red-500 shadow-md animate-shake"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-red-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-base sm:text-lg font-black text-red-700 flex flex-wrap items-center gap-2">
                <span>【ご入力内容に誤りがあります】</span>
                <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {errorCount}箇所の修正が必要です
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-red-800 mt-1">
                以下の警告文をご確認の上、ピンク色・赤枠になっている入力欄を修正してください。
              </p>

              {/* List of prominent red warnings */}
              <ul className="mt-3 space-y-1.5 p-3 rounded-xl bg-white border-2 border-red-300 text-xs sm:text-sm">
                {errors.addressBanchi && (
                  <li className="flex items-start gap-1.5 text-red-600 font-black">
                    <span className="shrink-0">※</span>
                    <div>
                      <span className="underline">{errors.addressBanchi.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.addressBanchi.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.building && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <div>
                      <span>{errors.building.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.building.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.kanaName && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <div>
                      <span>{errors.kanaName.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.kanaName.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.postalCode && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <div>
                      <span>{errors.postalCode.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.postalCode.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.phone && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <div>
                      <span>{errors.phone.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.phone.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.email && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <div>
                      <span>{errors.email.message}</span>
                      <span className="text-xs font-medium text-gray-700 block sm:inline sm:ml-2">
                        {errors.email.tip}
                      </span>
                    </div>
                  </li>
                )}

                {errors.kanjiName && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <span>{errors.kanjiName.message}</span>
                  </li>
                )}

                {errors.prefecture && (
                  <li className="flex items-start gap-1.5 text-red-600 font-bold">
                    <span className="shrink-0">※</span>
                    <span>{errors.prefecture.message}</span>
                  </li>
                )}
              </ul>

              {/* Teacher's helpful hint drawer right inside the error banner */}
              {errors.addressBanchi?.causeType === 'han_instead_of_zen' && (
                <div className="mt-3 p-3 rounded-xl bg-[#FFBE34]/20 border-2 border-[#FFBE34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <img
                      src="/assets/aistudio/teacher_c479ee1c.png"
                      alt="先生"
                      className="w-10 h-10 rounded-full border border-[#352C21] shrink-0 object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-[#352C21]">
                        先生からのアドバイス：住所の番地が小文字（半角）になっています！
                      </div>
                      <div className="text-xs text-[#352C21]/80 mt-0.5">
                        入力された「<span className="font-mono font-bold text-red-600">{formValues.addressBanchi}</span>」を、大文字（全角）の「<span className="font-mono font-bold text-[#5cb312]">{toFullWidth(formValues.addressBanchi)}</span>」に修正しましょう！
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFixAddress}
                    className="w-full sm:w-auto shrink-0 px-3 py-1.5 rounded-lg bg-[#91DF42] text-[#352C21] font-bold text-xs border border-[#352C21] hover:bg-[#91DF42]/80 transition-all shadow-xs"
                  >
                    ワンクリックで大文字（全角）に変換
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-[#352C21] p-4 sm:p-8 shadow-sm space-y-6">
        {/* Form Section Header */}
        <div className="border-b-2 border-[#352C21]/15 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-[#352C21] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#76A1ED]" />
              <span>申請者 基本情報入力</span>
            </h2>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
              ※すべて必須項目です
            </span>
          </div>
          <p className="text-xs text-[#352C21]/70 mt-1">
            上部の「見本カード（{currentProfile.name}さん）」の通りに入力してください。
          </p>
        </div>

        {/* 1. Name Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kanji Name */}
          <div>
            <label className={`block font-black text-[#352C21] mb-1 ${labelFontClass}`}>
              氏名（漢字）
              <span className="text-red-600 ml-1">※必須</span>
            </label>
            <input
              type="text"
              value={formValues.kanjiName}
              onChange={(e) => handleChange('kanjiName', e.target.value)}
              onBlur={() => handleBlur('kanjiName')}
              placeholder={isPattern2 ? `例：${currentProfile.name}` : ''}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-medium ${getInputStyle('kanjiName')}`}
            />
            {shouldShowFieldError('kanjiName') && (
              <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                <span>{errors.kanjiName?.message}</span>
              </p>
            )}
          </div>

          {/* Kana Name (Full-width Katakana) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
                フリガナ（カタカナ）
                <span className="text-red-600 ml-1">※必須</span>
              </label>
              <span className="text-[11px] font-bold text-[#9D4895] bg-[#9D4895]/10 px-1.5 py-0.2 rounded">
                全角カタカナ
              </span>
            </div>
            <input
              type="text"
              value={formValues.kanaName}
              onChange={(e) => handleChange('kanaName', e.target.value)}
              onBlur={() => handleBlur('kanaName')}
              placeholder={isPattern2 ? `例：${currentProfile.nameKana}` : ''}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-medium ${getInputStyle('kanaName')}`}
            />
            {shouldShowFieldError('kanaName') && (
              <div className="mt-1 space-y-0.5">
                <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <span>{errors.kanaName?.message}</span>
                </p>
                <p className="text-[11px] text-[#352C21]/80">
                  {errors.kanaName?.tip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Birth Date */}
        <div>
          <label className={`block font-black text-[#352C21] mb-1 ${labelFontClass}`}>
            生年月日
            <span className="text-red-600 ml-1">※必須</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div className="relative">
              <input
                type="text"
                value={formValues.birthYear}
                onChange={(e) => handleChange('birthYear', e.target.value)}
                onBlur={() => handleBlur('birthYear')}
                placeholder={isPattern2 ? currentProfile.birthYear : '西暦 (例:1977)'}
                className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('birthYear')}`}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-[#352C21]/60 pointer-events-none">年</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formValues.birthMonth}
                onChange={(e) => handleChange('birthMonth', e.target.value)}
                onBlur={() => handleBlur('birthMonth')}
                placeholder={isPattern2 ? currentProfile.birthMonth : '月 (例:05)'}
                className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('birthYear')}`}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-[#352C21]/60 pointer-events-none">月</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={formValues.birthDay}
                onChange={(e) => handleChange('birthDay', e.target.value)}
                onBlur={() => handleBlur('birthDay')}
                placeholder={isPattern2 ? currentProfile.birthDay : '日 (例:14)'}
                className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('birthYear')}`}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-[#352C21]/60 pointer-events-none">日</span>
            </div>
          </div>
          {shouldShowFieldError('birthYear') && (
            <p className="text-xs font-bold text-red-600 mt-1">
              {errors.birthYear?.message}
            </p>
          )}
        </div>

        {/* 3. Postal Code */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
              郵便番号
              <span className="text-red-600 ml-1">※必須</span>
            </label>
            <span className="text-[11px] font-bold text-[#76A1ED] bg-[#76A1ED]/10 px-1.5 py-0.2 rounded">
              半角数字7桁（ハイフンなし）
            </span>
          </div>
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-sm font-bold text-[#352C21]">〒</span>
            <input
              type="text"
              value={formValues.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              onBlur={() => handleBlur('postalCode')}
              placeholder={isPattern2 ? currentProfile.postalCodeRaw : '1000001'}
              maxLength={8}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('postalCode')}`}
            />
          </div>
          {shouldShowFieldError('postalCode') && (
            <div className="mt-1">
              <p className="text-xs font-bold text-red-600">
                {errors.postalCode?.message}
              </p>
              <p className="text-[11px] text-[#352C21]/80">
                {errors.postalCode?.tip}
              </p>
            </div>
          )}
        </div>

        {/* 4. Prefecture & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block font-black text-[#352C21] mb-1 ${labelFontClass}`}>
              都道府県
              <span className="text-red-600 ml-1">※必須</span>
            </label>
            <input
              type="text"
              value={formValues.prefecture}
              onChange={(e) => handleChange('prefecture', e.target.value)}
              onBlur={() => handleBlur('prefecture')}
              placeholder={isPattern2 ? currentProfile.prefecture : '例：東京都'}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-medium ${getInputStyle('prefecture')}`}
            />
            {shouldShowFieldError('prefecture') && (
              <p className="text-xs font-bold text-red-600 mt-1">
                {errors.prefecture?.message}
              </p>
            )}
          </div>

          <div>
            <label className={`block font-black text-[#352C21] mb-1 ${labelFontClass}`}>
              市区町村
              <span className="text-red-600 ml-1">※必須</span>
            </label>
            <input
              type="text"
              value={formValues.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              placeholder={isPattern2 ? currentProfile.city : '例：千代田区'}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-medium ${getInputStyle('city')}`}
            />
            {shouldShowFieldError('city') && (
              <p className="text-xs font-bold text-red-600 mt-1">
                {errors.city?.message}
              </p>
            )}
          </div>
        </div>

        {/* 5. Address Banchi (CRITICAL COMPONENT TARGET) */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-[#FFBE34]">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
            <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
              町名・番地（数字・ハイフンは大文字で入力）
              <span className="text-red-600 ml-1">※必須</span>
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-[#FFB5B8] text-[#352C21] border border-[#352C21]/30">
                ★大文字（全角）必須
              </span>
            </div>
          </div>

          <div className="text-xs text-[#352C21]/80 mb-2">
            ※番地や号の数字・ハイフンは必ず全角（大文字）で入力してください。小文字（半角 1-1）で入力すると警告が出ます。
          </div>

          <input
            type="text"
            value={formValues.addressBanchi}
            onChange={(e) => handleChange('addressBanchi', e.target.value)}
            onBlur={() => handleBlur('addressBanchi')}
            placeholder={isPattern2 ? `例：${currentProfile.addressBanchiZen}` : '例：千代田１－１（全角）'}
            className={`w-full px-3.5 py-3 rounded-xl transition-all outline-none font-bold text-base ${getInputStyle('addressBanchi')}`}
          />

          {/* Specific Warning for Address Banchi */}
          {shouldShowFieldError('addressBanchi') ? (
            <div className="mt-2 p-2.5 rounded-xl bg-red-100/90 border border-red-400 text-xs text-red-800 space-y-1">
              <div className="font-black text-red-700 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errors.addressBanchi?.message}</span>
              </div>
              <p className="leading-relaxed">
                {errors.addressBanchi?.tip}
              </p>
              {hasHalfWidthAlphaNumOrHyphen(formValues.addressBanchi) && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-700">
                    現在の入力: 「<span className="font-mono text-red-600 font-bold">{formValues.addressBanchi}</span>」
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFixAddress}
                    className="px-2.5 py-1 rounded bg-[#91DF42] text-[#352C21] font-bold text-[11px] border border-[#352C21] hover:bg-[#91DF42]/80"
                  >
                    全角「{toFullWidth(formValues.addressBanchi)}」に変換する
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Success indicator when correctly filled in full-width
            formValues.addressBanchi && !hasHalfWidthAlphaNumOrHyphen(formValues.addressBanchi) && (
              <div className="mt-2 text-xs font-bold text-[#5cb312] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>大文字（全角）で正しく入力されています！</span>
              </div>
            )
          )}

          {/* Device typing hint toggle */}
          <div className="mt-3 pt-2.5 border-t border-[#352C21]/15 text-xs text-[#352C21]/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#FFBE34]" />
                大文字（全角）の打ち方ヒント：
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveDeviceHint('pc')}
                  className={`px-2 py-0.5 rounded font-bold border ${
                    activeDeviceHint === 'pc' ? 'bg-[#76A1ED] text-white border-[#352C21]' : 'bg-white text-[#352C21]'
                  }`}
                >
                  パソコン
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeviceHint('sp')}
                  className={`px-2 py-0.5 rounded font-bold border ${
                    activeDeviceHint === 'sp' ? 'bg-[#9D4895] text-white border-[#352C21]' : 'bg-white text-[#352C21]'
                  }`}
                >
                  スマホ
                </button>
              </div>
            </div>

            {activeDeviceHint === 'pc' ? (
              <p className="text-[11px] bg-white p-2 rounded-lg border border-[#352C21]/20">
                パソコンの場合：テンキーではなく、キーボード上部の数字キーで打ち変換候補から「１」を選ぶか、入力直後にファンクションキーの「<strong className="text-blue-700">F9</strong>」キーを押すと全角になります。
              </p>
            ) : (
              <p className="text-[11px] bg-white p-2 rounded-lg border border-[#352C21]/20">
                スマホの場合：ひらがな入力（あいう）の状態で「１」と打ち、変換候補から全角の数字を選ぶか、数字キーボードを長押しして全角数字を選択してください。
              </p>
            )}
          </div>
        </div>

        {/* 6. Building (Optional / Full-width) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
              建物名・部屋番号
              <span className="text-gray-500 text-xs ml-1 font-normal">（任意）</span>
            </label>
            <span className="text-[11px] font-bold text-[#FFBE34] bg-[#FFBE34]/20 px-1.5 py-0.2 rounded">
              ※数字は大文字（全角）
            </span>
          </div>
          <input
            type="text"
            value={formValues.building}
            onChange={(e) => handleChange('building', e.target.value)}
            onBlur={() => handleBlur('building')}
            placeholder={isPattern2 ? currentProfile.buildingZen : '例：パソコンハイツ２０１号室'}
            className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-medium ${getInputStyle('building')}`}
          />
          {shouldShowFieldError('building') && (
            <p className="text-xs font-bold text-red-600 mt-1">
              {errors.building?.message}
            </p>
          )}
        </div>

        {/* 7. Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
                電話番号
                <span className="text-red-600 ml-1">※必須</span>
              </label>
              <span className="text-[11px] font-bold text-[#76A1ED] bg-[#76A1ED]/10 px-1.5 py-0.2 rounded">
                半角・ハイフンなし
              </span>
            </div>
            <input
              type="text"
              value={formValues.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder={isPattern2 ? currentProfile.phoneNumberHanNoHyphen : '09012345678'}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('phone')}`}
            />
            {shouldShowFieldError('phone') && (
              <div className="mt-1">
                <p className="text-xs font-bold text-red-600">
                  {errors.phone?.message}
                </p>
                <p className="text-[11px] text-[#352C21]/80">
                  {errors.phone?.tip}
                </p>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block font-black text-[#352C21] ${labelFontClass}`}>
                メールアドレス
                <span className="text-red-600 ml-1">※必須</span>
              </label>
              <span className="text-[11px] font-bold text-[#9D4895] bg-[#9D4895]/10 px-1.5 py-0.2 rounded">
                半角英数小文字
              </span>
            </div>
            <input
              type="email"
              value={formValues.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder={isPattern2 ? currentProfile.email : 'yamada@example.com'}
              className={`w-full px-3 py-2.5 rounded-xl transition-all outline-none font-mono ${getInputStyle('email')}`}
            />
            {shouldShowFieldError('email') && (
              <div className="mt-1">
                <p className="text-xs font-bold text-red-600">
                  {errors.email?.message}
                </p>
                <p className="text-[11px] text-[#352C21]/80">
                  {errors.email?.tip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action Area */}
        <div className="pt-6 border-t-2 border-[#352C21]/15 flex flex-col items-center gap-3">
          <button
            type="submit"
            className="w-full sm:w-80 py-4 px-6 rounded-2xl font-black text-lg text-[#352C21] bg-[#FFBE34] border-3 border-[#352C21] hover:bg-[#FFBE34]/85 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>次へ（確認画面へ進む）</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-[#352C21]/70 text-center">
            ※誤りがある場合、画面上部に赤い文字で警告メッセージが表示されます。
          </p>
        </div>
      </form>
    </div>
  );
};
