/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PracticePatternId, 
  PersonaProfile, 
  FormValues, 
  FontSize 
} from './types';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { Navbar } from './components/Navbar';
import { StickyLicenseCard } from './components/StickyLicenseCard';
import { DialogueIntro } from './components/DialogueIntro';
import { PatternSelection } from './components/PatternSelection';
import { PracticeForm } from './components/PracticeForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { CharTypeReferenceModal } from './components/CharTypeReferenceModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dialogue' | 'select' | 'form' | 'confirm'>('dialogue');
  const [currentGender, setCurrentGender] = useState<'male' | 'female'>('male');
  const [activePattern, setActivePattern] = useState<PracticePatternId>('pattern1');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const currentProfile: PersonaProfile = SAMPLE_PROFILES[currentGender];

  // Form values state initialized empty
  const [formValues, setFormValues] = useState<FormValues>({
    kanjiName: '',
    kanaName: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    postalCode: '',
    prefecture: '',
    city: '',
    addressBanchi: '',
    building: '',
    phone: '',
    email: '',
  });

  // Switch gender profile
  const handleSwitchGender = (gender: 'male' | 'female') => {
    setCurrentGender(gender);
  };

  // Quick fill helper (correct or with intentional mistake)
  const handleFillExample = (profile: PersonaProfile, withMistake: boolean = false) => {
    if (withMistake) {
      // Fill with the half-width address mistake requested in prompt
      setFormValues({
        kanjiName: profile.name,
        kanaName: profile.nameKana,
        birthYear: profile.birthYear,
        birthMonth: profile.birthMonth,
        birthDay: profile.birthDay,
        postalCode: profile.postalCodeRaw,
        prefecture: profile.prefecture,
        city: profile.city,
        addressBanchi: profile.addressBanchiHan, // "千代田1-1" or "梅田2-3-4" (HALF-WIDTH MISTAKE!)
        building: profile.buildingHan,
        phone: profile.phoneNumberHanNoHyphen,
        email: profile.email,
      });
    } else {
      // Fill with correct full-width address
      setFormValues({
        kanjiName: profile.name,
        kanaName: profile.nameKana,
        birthYear: profile.birthYear,
        birthMonth: profile.birthMonth,
        birthDay: profile.birthDay,
        postalCode: profile.postalCodeRaw,
        prefecture: profile.prefecture,
        city: profile.city,
        addressBanchi: profile.addressBanchiZen, // "千代田１－１" (FULL-WIDTH CORRECT!)
        building: profile.buildingZen,
        phone: profile.phoneNumberHanNoHyphen,
        email: profile.email,
      });
    }
  };

  // Start practice from dialogue
  const handleStartPractice = () => {
    setCurrentView('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select pattern directly from dialogue or pattern selection page
  const handleSelectPattern = (patternId: PracticePatternId) => {
    setActivePattern(patternId);
    // Clear form for fresh challenge
    setFormValues({
      kanjiName: '',
      kanaName: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      postalCode: '',
      prefecture: '',
      city: '',
      addressBanchi: '',
      building: '',
      phone: '',
      email: '',
    });
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form passed validation
  const handleFormComplete = (submittedValues: FormValues) => {
    setFormValues(submittedValues);
    setCurrentView('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to retry same pattern
  const handleRetrySamePattern = () => {
    setFormValues({
      kanjiName: '',
      kanaName: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      postalCode: '',
      prefecture: '',
      city: '',
      addressBanchi: '',
      building: '',
      phone: '',
      email: '',
    });
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch gender and retry
  const handleSwitchGenderAndRetry = () => {
    const nextGender = currentGender === 'male' ? 'female' : 'male';
    setCurrentGender(nextGender);
    setFormValues({
      kanjiName: '',
      kanaName: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      postalCode: '',
      prefecture: '',
      city: '',
      addressBanchi: '',
      building: '',
      phone: '',
      email: '',
    });
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#352C21] flex flex-col font-sans selection:bg-[#FFB5B8] selection:text-[#352C21]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateToDialogue={() => {
          setCurrentView('dialogue');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToSelect={() => {
          setCurrentView('select');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
      />

      {/* Sticky Driver's License Card (Displayed after selecting an input pattern) */}
      {currentView === 'form' && (
        <StickyLicenseCard
          currentProfile={currentProfile}
          onSwitchGender={handleSwitchGender}
          onFillExample={handleFillExample}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white pb-16">
        {currentView === 'dialogue' && (
          <DialogueIntro
            onStartPractice={handleStartPractice}
            onSelectPatternDirectly={handleSelectPattern}
          />
        )}

        {currentView === 'select' && (
          <PatternSelection
            currentProfile={currentProfile}
            onSelectPattern={handleSelectPattern}
            onBackToDialogue={() => {
              setCurrentView('dialogue');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
          />
        )}

        {currentView === 'form' && (
          <PracticeForm
            patternId={activePattern}
            currentProfile={currentProfile}
            fontSize={fontSize}
            formValues={formValues}
            setFormValues={setFormValues}
            onComplete={handleFormComplete}
            onBackToPatternSelect={() => {
              setCurrentView('select');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
          />
        )}

        {currentView === 'confirm' && (
          <ConfirmationScreen
            formValues={formValues}
            profile={currentProfile}
            patternId={activePattern}
            onRetrySamePattern={handleRetrySamePattern}
            onSelectAnotherPattern={() => {
              setCurrentView('select');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchGenderAndRetry={handleSwitchGenderAndRetry}
          />
        )}
      </main>

      {/* Character Width Guide Modal */}
      <CharTypeReferenceModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#352C21]/20 py-4 px-4 text-center text-xs text-[#352C21]/70">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#91DF42]" />
            <span className="font-bold">教室 実践入力トレーニング教材</span>
          </div>
          <div className="text-[11px] text-[#352C21]/60">
            ※本教材で使用している氏名・住所・電話番号はすべて練習用の架空のデータです。
          </div>
        </div>
      </footer>
    </div>
  );
}
