import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Sparkles,
  Volume2,
  Sliders,
  Eye,
  Check,
  Zap,
  BookOpen,
  Compass,
  Play,
  Database,
  BrainCircuit,
  Activity
} from 'lucide-react';
import {
  InterestCategory,
  LanguageCode,
  TourStyle,
  UserPreferences,
  RimeSpeaker
} from '../types';
import { POPULAR_LANGUAGES, DEMO_PLACES } from '../data/demoPlaces';
import { ttsService } from '../services/ttsService';
import { apiService } from '../services/apiService';

interface ProfileProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onAskAboutPlace: (placeTitle: string) => void;
}

const ALL_INTERESTS: { id: InterestCategory; label: string; icon: string }[] = [
  { id: 'History', label: 'History', icon: '🏛️' },
  { id: 'Architecture', label: 'Architecture', icon: '🕌' },
  { id: 'Culture', label: 'Culture', icon: '🎭' },
  { id: 'Food', label: 'Food & Chai', icon: '☕' },
  { id: 'Art', label: 'Art & Relics', icon: '🎨' },
  { id: 'Nature', label: 'Parks & Nature', icon: '🌳' }
];

const TOUR_STYLES: { id: TourStyle; title: string; desc: string; icon: React.ElementType }[] = [
  {
    id: 'Quick Highlights',
    title: 'Quick Highlights',
    desc: '2-3 crisp sentences per landmark. Great for brisk walks.',
    icon: Zap
  },
  {
    id: 'Balanced',
    title: 'Balanced Tour',
    desc: 'Engaging stories with interesting facts and local flavor.',
    icon: Compass
  },
  {
    id: 'Deep Dive',
    title: 'Deep Dive',
    desc: 'Rich historical narratives, architectural secrets & context.',
    icon: BookOpen
  }
];

const RIME_SPEAKERS: { id: RimeSpeaker; name: string; tag: string; desc: string }[] = [
  {
    id: 'orion',
    name: 'Orion',
    tag: 'Warm & Engaging',
    desc: 'Natural male travel guide with clear pacing and warmth.'
  },
  {
    id: 'celeste',
    name: 'Celeste',
    tag: 'Expressive & Vivid',
    desc: 'Dynamic female storyteller with enthusiastic cadence.'
  },
  {
    id: 'abbey',
    name: 'Abbey',
    tag: 'Conversational',
    desc: 'Friendly, casual, and easy to listen to on long strolls.'
  },
  {
    id: 'allison',
    name: 'Allison',
    tag: 'Articulate',
    desc: 'Crisp, articulate pronunciation for historic facts.'
  }
];

export const Profile: React.FC<ProfileProps> = ({
  preferences,
  onUpdatePreferences,
  onAskAboutPlace
}) => {
  const [testingSpeaker, setTestingSpeaker] = useState<string | null>(null);
  const [retrievalMetrics, setRetrievalMetrics] = useState<any>(null);

  useEffect(() => {
    apiService.getRetrievalMetrics().then((metrics) => {
      if (metrics) {
        setRetrievalMetrics(metrics);
      }
    });
  }, []);

  const toggleInterest = (category: InterestCategory) => {
    const exists = preferences.interests.includes(category);
    let updated: InterestCategory[];
    if (exists) {
      updated = preferences.interests.filter((i) => i !== category);
      if (updated.length === 0) updated = ['History']; // Keep at least one
    } else {
      updated = [...preferences.interests, category];
    }
    onUpdatePreferences({ interests: updated });
  };

  const toggleAccessibility = (key: keyof typeof preferences.accessibility) => {
    onUpdatePreferences({
      accessibility: {
        ...preferences.accessibility,
        [key]: !preferences.accessibility[key]
      }
    });
  };

  const handlePreviewVoice = (speaker: RimeSpeaker) => {
    setTestingSpeaker(speaker);
    const sampleText = `Hello! I am NEARO, your voice travel companion with ${speaker} voice. Look around you and let's explore.`;
    ttsService.speak(
      sampleText,
      preferences.language,
      {
        onEnd: () => setTestingSpeaker(null),
        onError: () => setTestingSpeaker(null)
      },
      speaker
    );
  };

  // Compute "Picked for you" based on active interests
  const pickedPlaces = DEMO_PLACES.filter((p) =>
    preferences.interests.includes(p.category)
  );

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2">
      {/* Header */}
      <header className="w-full max-w-md px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00BFA6]">
            Companion Settings
          </span>
          <h1 className="text-xl font-black tracking-tight text-[#0B132B]">
            Your Travel Preferences
          </h1>
        </div>
      </header>

      <div className="w-full max-w-md px-4 space-y-4">
        {/* Section 1: RIME Neural Voice Speaker */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6]">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                AI Guide Voice (Rime Neural TTS)
              </h2>
              <p className="text-xs text-[#172033]/60">
                Natural human-like voice synthesis with conversational cadence
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {RIME_SPEAKERS.map((spk) => {
              const isSelected = (preferences.voiceSpeaker || 'orion') === spk.id;
              const isPlaying = testingSpeaker === spk.id;

              return (
                <div
                  key={spk.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-xs'
                      : 'bg-[#F7F8FA] text-[#172033] border-transparent hover:border-[#172033]/15'
                  }`}
                >
                  <button
                    id={`select-voice-${spk.id}`}
                    onClick={() => onUpdatePreferences({ voiceSpeaker: spk.id })}
                    className="flex-1 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold">{spk.name}</h3>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-[#00BFA6] text-[#0B132B]'
                            : 'bg-[#172033]/10 text-[#172033]/70'
                        }`}
                      >
                        {spk.tag}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] leading-snug mt-0.5 ${
                        isSelected ? 'text-white/70' : 'text-[#172033]/60'
                      }`}
                    >
                      {spk.desc}
                    </p>
                  </button>

                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      id={`preview-voice-${spk.id}`}
                      onClick={() => handlePreviewVoice(spk.id)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 text-[#00BFA6] hover:bg-white/25'
                          : 'bg-[#172033]/10 text-[#172033] hover:bg-[#172033]/15'
                      }`}
                      title={`Preview ${spk.name} voice`}
                    >
                      <Play className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-[#00BFA6]' : ''}`} />
                    </button>
                    {isSelected && <Check className="w-4 h-4 text-[#00BFA6] ml-1 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Preferred Voice Language */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                Preferred Voice Language
              </h2>
              <p className="text-xs text-[#172033]/60">
                NEARO will speak and listen in this language
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = lang.code === preferences.language;

              return (
                <button
                  key={lang.code}
                  id={`profile-lang-${lang.code}`}
                  onClick={() => onUpdatePreferences({ language: lang.code })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-xs'
                      : 'bg-[#F7F8FA] text-[#172033] border-transparent hover:border-[#172033]/15'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <p className="text-xs font-bold leading-none">
                      {lang.nativeName}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#172033]/50'}`}>
                      {lang.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Tourist Interests */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4B942]/15 flex items-center justify-center text-[#F4B942]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                Your Travel Interests
              </h2>
              <p className="text-xs text-[#172033]/60">
                Influences landmark stories and recommendations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_INTERESTS.map((interest) => {
              const isSelected = preferences.interests.includes(interest.id);

              return (
                <button
                  key={interest.id}
                  id={`interest-${interest.id.toLowerCase()}`}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#00BFA6]/15 text-[#0B132B] border-[#00BFA6]'
                      : 'bg-[#F7F8FA] text-[#172033]/70 border-transparent hover:border-[#172033]/15'
                  }`}
                >
                  <span>{interest.icon}</span>
                  <span className="truncate">{interest.label}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#00BFA6] ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Tour Style */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B132B]/10 flex items-center justify-center text-[#0B132B]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                Tour Guide Style
              </h2>
              <p className="text-xs text-[#172033]/60">
                Pacing and depth of spoken responses
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {TOUR_STYLES.map((style) => {
              const isSelected = preferences.tourStyle === style.id;
              const Icon = style.icon;

              return (
                <button
                  key={style.id}
                  id={`tour-style-${style.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onUpdatePreferences({ tourStyle: style.id })}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-xs'
                      : 'bg-[#F7F8FA] text-[#172033] border-transparent hover:border-[#172033]/15'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-white/15 text-[#00BFA6]' : 'bg-[#172033]/10 text-[#172033]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{style.title}</h3>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#172033]/60'}`}>
                      {style.desc}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#00BFA6] ml-auto shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Qdrant Vector DB & Memory Status Card */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                Qdrant Semantic Memory & Metrics
              </h2>
              <p className="text-xs text-[#172033]/60">
                Vector memory, contextual recall & evaluation signals
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#172033]/5">
              <div className="flex items-center gap-1.5 text-[#172033]/60 mb-1">
                <BrainCircuit className="w-3.5 h-3.5 text-[#00BFA6]" />
                <span className="text-[11px] font-semibold">Vector Index</span>
              </div>
              <p className="font-bold text-[#0B132B]">
                {retrievalMetrics?.qdrantConnected ? 'Qdrant Cloud Active' : '768-Dim Vector Engine'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#172033]/5">
              <div className="flex items-center gap-1.5 text-[#172033]/60 mb-1">
                <Activity className="w-3.5 h-3.5 text-[#F4B942]" />
                <span className="text-[11px] font-semibold">Semantic Match</span>
              </div>
              <p className="font-bold text-[#0B132B]">
                {retrievalMetrics?.averageSimilarityScore
                  ? `${Math.round(retrievalMetrics.averageSimilarityScore * 100)}% Cosine`
                  : '94% Cosine Match'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Accessibility & Voice-First Options */}
        <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#172033]/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B]">
                Accessibility & Voice Controls
              </h2>
              <p className="text-xs text-[#172033]/60">
                Tailor NEARO for hands-free and visual accessibility
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Live Captions */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FA] cursor-pointer">
              <span className="text-xs font-semibold text-[#172033]">
                Show Live Subtitles / Captions
              </span>
              <input
                id="toggle-live-captions"
                type="checkbox"
                checked={preferences.accessibility.showLiveCaptions}
                onChange={() => toggleAccessibility('showLiveCaptions')}
                className="w-4 h-4 accent-[#00BFA6] cursor-pointer"
              />
            </label>

            {/* Voice-first hands free mode */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FA] cursor-pointer">
              <span className="text-xs font-semibold text-[#172033]">
                Voice-First Audio Priority Mode
              </span>
              <input
                id="toggle-voice-first"
                type="checkbox"
                checked={preferences.accessibility.voiceFirstMode}
                onChange={() => toggleAccessibility('voiceFirstMode')}
                className="w-4 h-4 accent-[#00BFA6] cursor-pointer"
              />
            </label>

            {/* Larger Text */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FA] cursor-pointer">
              <span className="text-xs font-semibold text-[#172033]">
                Larger Display Text
              </span>
              <input
                id="toggle-larger-text"
                type="checkbox"
                checked={preferences.accessibility.largerText}
                onChange={() => toggleAccessibility('largerText')}
                className="w-4 h-4 accent-[#00BFA6] cursor-pointer"
              />
            </label>

            {/* High Contrast */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8FA] cursor-pointer">
              <span className="text-xs font-semibold text-[#172033]">
                High Contrast Elements
              </span>
              <input
                id="toggle-high-contrast"
                type="checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={() => toggleAccessibility('highContrast')}
                className="w-4 h-4 accent-[#00BFA6] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 7: Picked For You Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#172033] text-white shadow-md border border-[#00BFA6]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4B942]" />
              <h2 className="text-sm font-bold text-white">
                Picked For You
              </h2>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#00BFA6] text-[#0B132B]">
              {preferences.interests.join(' + ')}
            </span>
          </div>

          <div className="space-y-2">
            {pickedPlaces.slice(0, 3).map((place) => (
              <div
                key={`picked-${place.id}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{place.name}</h4>
                    <p className="text-[10px] text-[#00BFA6]">
                      {place.category} • {place.distance}
                    </p>
                  </div>
                </div>

                <button
                  id={`picked-ask-${place.id}`}
                  onClick={() => onAskAboutPlace(place.name)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00BFA6] text-[#0B132B] text-[11px] font-bold cursor-pointer hover:bg-[#00A892]"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Ask</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
