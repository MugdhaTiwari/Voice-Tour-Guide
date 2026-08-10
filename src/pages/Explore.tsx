import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, User, Sparkles, Volume2, Radio } from 'lucide-react';
import { VoiceOrb } from '../components/VoiceOrb';
import { VoiceStatus } from '../components/VoiceStatus';
import { VoiceControls } from '../components/VoiceControls';
import { LocationCard } from '../components/LocationCard';
import { SuggestedPrompts } from '../components/SuggestedPrompts';
import { SupportingCard } from '../components/SupportingCard';
import { DemoTourBanner } from '../components/DemoTourBanner';
import {
  LanguageCode,
  LocationContext,
  UserPreferences,
  VisualCardData,
  VoiceState
} from '../types';
import { POPULAR_LANGUAGES } from '../data/demoPlaces';

interface ExploreProps {
  voiceState: VoiceState;
  onOrbClick: () => void;
  onSelectPrompt: (prompt: string) => void;
  location: LocationContext;
  onLocationChange: (newLoc: LocationContext) => void;
  language: LanguageCode;
  onOpenLanguageModal: () => void;
  onOpenProfile: () => void;
  amplitudes: number[];
  transcript: string;
  subtitleText: string;
  errorMessage: string;
  visualCard: VisualCardData | null;
  onAskAboutPlace: (placeTitle: string) => void;
  onExploreNearby: () => void;
  demoStep: number | null;
  onStartDemo: () => void;
  onTriggerDemoStep: (step: number) => void;
  onResetDemo: () => void;
  onStopVoice: () => void;
  onPauseToggle: () => void;
  onRetry: () => void;
  isPaused: boolean;
  userPreferences: UserPreferences;
}

export const Explore: React.FC<ExploreProps> = ({
  voiceState,
  onOrbClick,
  onSelectPrompt,
  location,
  onLocationChange,
  language,
  onOpenLanguageModal,
  onOpenProfile,
  amplitudes,
  transcript,
  subtitleText,
  errorMessage,
  visualCard,
  onAskAboutPlace,
  onExploreNearby,
  demoStep,
  onStartDemo,
  onTriggerDemoStep,
  onResetDemo,
  onStopVoice,
  onPauseToggle,
  onRetry,
  isPaused,
  userPreferences
}) => {
  const currentLangObj = POPULAR_LANGUAGES.find((l) => l.code === language) || POPULAR_LANGUAGES[0];

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2">
      {/* Top Header */}
      <header className="w-full max-w-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#0B132B] flex items-center justify-center text-[#00BFA6] shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#0B132B] leading-none">
              NEARO
            </h1>
            <p className="text-[11px] font-semibold text-[#00BFA6] tracking-wide mt-0.5">
              Know What's Near
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector Button */}
          <button
            id="explore-language-button"
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-xs border border-[#172033]/10 hover:border-[#00BFA6]/50 text-[#0B132B] text-xs font-bold transition-all cursor-pointer"
            aria-label="Change language"
          >
            <span>{currentLangObj.flag}</span>
            <span className="hidden sm:inline text-xs">{currentLangObj.name}</span>
          </button>

          {/* Profile Trigger Button */}
          <button
            id="explore-profile-button"
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-white shadow-xs border border-[#172033]/10 flex items-center justify-center text-[#0B132B] hover:text-[#00BFA6] transition-colors cursor-pointer"
            aria-label="User Profile and Preferences"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hackathon Interactive Demo Flow Banner */}
      <DemoTourBanner
        currentStep={demoStep}
        onStartDemo={onStartDemo}
        onTriggerStep={onTriggerDemoStep}
        onResetDemo={onResetDemo}
        isSpeaking={voiceState === 'speaking'}
      />

      {/* Main Location Badge */}
      <LocationCard
        location={location}
        onLocationChange={onLocationChange}
      />

      {/* Main Voice Interactive Section */}
      <main className="w-full flex flex-col items-center mt-4">
        {/* Above Voice Orb Title Prompt */}
        <p className="text-xs sm:text-sm font-semibold text-[#172033]/70 text-center tracking-tight mb-1">
          What would you like to discover?
        </p>

        {/* Central Voice Orb */}
        <VoiceOrb
          state={voiceState}
          onClick={onOrbClick}
          amplitudes={amplitudes}
        />

        {/* Voice Status & Live Feedback */}
        <VoiceStatus
          state={voiceState}
          transcript={transcript}
          subtitleText={subtitleText}
          errorMessage={errorMessage}
          showCaptions={userPreferences.accessibility.showLiveCaptions}
        />

        {/* Dynamic Voice Controls (Interrupt, Pause, Resume, Retry) */}
        <VoiceControls
          state={voiceState}
          onStop={onStopVoice}
          onPauseToggle={onPauseToggle}
          onRetry={onRetry}
          isPaused={isPaused}
        />

        {/* Suggested Spoken Prompts */}
        {voiceState === 'idle' && (
          <SuggestedPrompts
            onSelectPrompt={onSelectPrompt}
            language={language}
          />
        )}

        {/* Supporting Visual Context Card (Glides in when NEARO speaks about a place) */}
        <AnimatePresence>
          {visualCard && (
            <SupportingCard
              key={`card-${visualCard.title}`}
              cardData={visualCard}
              onAskAboutPlace={onAskAboutPlace}
              onExploreNearby={onExploreNearby}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
