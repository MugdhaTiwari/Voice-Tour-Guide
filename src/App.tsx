/**
 * NEARO - "Know What's Near"
 * Voice-First AI Tour Companion for Tourists
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Explore } from './pages/Explore';
import { Nearby } from './pages/Nearby';
import { Profile } from './pages/Profile';
import { BottomNav, NavTab } from './components/BottomNav';
import { LanguageSelector } from './components/LanguageSelector';
import {
  ConversationTurn,
  LanguageCode,
  LocationContext,
  Place,
  UserPreferences,
  VisualCardData,
  VoiceState
} from './types';
import { DEFAULT_DEMO_LOCATIONS, locationService } from './services/locationService';
import { speechService } from './services/speechService';
import { ttsService } from './services/ttsService';
import { aiService } from './services/aiService';
import { DEMO_PLACES } from './data/demoPlaces';

const PREFERENCES_STORAGE_KEY = 'nearo_tourist_preferences_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  interests: ['History', 'Architecture', 'Culture'],
  tourStyle: 'Balanced',
  accessibility: {
    largerText: false,
    highContrast: false,
    voiceFirstMode: true,
    reducedMotion: false,
    showLiveCaptions: true
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [currentLocation, setCurrentLocation] = useState<LocationContext>(DEFAULT_DEMO_LOCATIONS[0]);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_PREFERENCES;
  });

  const [transcript, setTranscript] = useState<string>('');
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [visualCard, setVisualCard] = useState<VisualCardData | null>(null);
  const [amplitudes, setAmplitudes] = useState<number[]>([0.3, 0.5, 0.7, 0.4, 0.2]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(userPreferences));
    } catch (e) {
      // Ignore
    }
  }, [userPreferences]);

  // Clean up speech/TTS on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
      ttsService.stop();
    };
  }, []);

  /**
   * Process a voice query with full conversation context and speak the answer aloud
   */
  const executeVoiceQuery = useCallback(
    async (queryText: string, customPlaceContext?: LocationContext) => {
      if (!queryText || queryText.trim().length === 0) return;

      const activeLoc = customPlaceContext || currentLocation;
      setVoiceState('thinking');
      setTranscript(queryText);
      setErrorMessage('');

      try {
        const result = await aiService.sendVoiceQuery(
          queryText,
          conversationHistory,
          activeLoc,
          userPreferences.language,
          userPreferences
        );

        // Update visual context card
        if (result.visualCard) {
          setVisualCard(result.visualCard);
        }

        // Add user turn & assistant turn to conversation context
        const newTurns: ConversationTurn[] = [
          {
            id: `user-${Date.now()}`,
            role: 'user',
            text: queryText,
            timestamp: Date.now(),
            locationContext: activeLoc.name
          },
          {
            id: `assistant-${Date.now() + 1}`,
            role: 'assistant',
            text: result.answer,
            timestamp: Date.now() + 1,
            locationContext: result.location
          }
        ];

        setConversationHistory((prev) => [...prev, ...newTurns]);
        setSubtitleText(result.spokenText);
        setVoiceState('speaking');
        setIsPaused(false);

        // Speak the answer aloud via Text-to-Speech
        ttsService.speak(result.spokenText, userPreferences.language, {
          onStart: () => {
            setVoiceState('speaking');
            setIsPaused(false);
          },
          onEnd: () => {
            setVoiceState('idle');
            setAmplitudes([0.3, 0.4, 0.3, 0.2, 0.3]);
          },
          onPause: () => {
            setIsPaused(true);
          },
          onResume: () => {
            setIsPaused(false);
          },
          onError: (err) => {
            console.warn('TTS playback issue:', err);
            setVoiceState('idle');
          },
          onWaveformUpdate: (bands) => {
            setAmplitudes(bands);
          }
        });
      } catch (err: any) {
        console.warn('Voice query failed:', err);
        setErrorMessage("I couldn't process that query. Please tap to try again.");
        setVoiceState('error');
      }
    },
    [conversationHistory, currentLocation, userPreferences]
  );

  /**
   * Start speech recognition
   */
  const startListeningFlow = useCallback(() => {
    // Interrupt any active TTS speech
    if (ttsService.isSpeaking()) {
      ttsService.stop();
    }

    setTranscript('');
    setErrorMessage('');
    setVoiceState('listening');

    const started = speechService.startListening({
      language: userPreferences.language,
      onStart: () => {
        setVoiceState('listening');
      },
      onResult: (spokenText, isFinal) => {
        setTranscript(spokenText);
        if (isFinal && spokenText.trim().length > 0) {
          speechService.stopListening();
          executeVoiceQuery(spokenText);
        }
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setErrorMessage(err || "I couldn't hear that. Tap to try again.");
        setVoiceState('error');
      },
      onEnd: () => {
        // If ended without final result while still in listening state
        setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
      }
    });

    if (!started) {
      // Speech recognition not supported in browser, show message and reset
      setErrorMessage('Voice input is not supported in this browser. Try Chrome/Safari or tap suggested prompts below.');
      setVoiceState('error');
    }
  }, [executeVoiceQuery, userPreferences.language]);

  /**
   * Central Orb Click handler
   */
  const handleOrbClick = () => {
    if (voiceState === 'idle') {
      startListeningFlow();
    } else if (voiceState === 'listening') {
      speechService.stopListening();
      if (transcript.trim().length > 0) {
        executeVoiceQuery(transcript);
      } else {
        setVoiceState('idle');
      }
    } else if (voiceState === 'speaking') {
      // User can interrupt NEARO while it is speaking
      ttsService.stop();
      setVoiceState('idle');
    } else if (voiceState === 'error') {
      startListeningFlow();
    }
  };

  /**
   * Stop active speech or listening
   */
  const handleStopVoice = () => {
    if (voiceState === 'listening') {
      speechService.stopListening();
      setVoiceState('idle');
    } else if (voiceState === 'speaking') {
      ttsService.stop();
      setVoiceState('idle');
    }
  };

  /**
   * Pause/Resume toggle during speaking
   */
  const handlePauseToggle = () => {
    if (isPaused) {
      ttsService.resume();
      setIsPaused(false);
    } else {
      ttsService.pause();
      setIsPaused(true);
    }
  };

  /**
   * Retry voice query after error
   */
  const handleRetry = () => {
    startListeningFlow();
  };

  /**
   * Suggested prompt selection (triggers voice assistant directly)
   */
  const handleSelectPrompt = (promptText: string) => {
    executeVoiceQuery(promptText);
  };

  /**
   * When user taps "Ask NEARO" on a place card
   */
  const handleAskNearoPlace = (place: Place) => {
    setActiveTab('explore');
    locationService.setManualLocation({
      placeId: place.id,
      name: place.name,
      city: place.city,
      coordinates: place.coordinates,
      isManualSelection: true,
      landmarkDetails: place.shortDescription
    });
    setCurrentLocation({
      placeId: place.id,
      name: place.name,
      city: place.city,
      coordinates: place.coordinates,
      isManualSelection: true,
      landmarkDetails: place.shortDescription
    });

    const query = `Tell me about ${place.name}`;
    executeVoiceQuery(query, {
      placeId: place.id,
      name: place.name,
      city: place.city,
      coordinates: place.coordinates,
      isManualSelection: true
    });
  };

  /**
   * Trigger Ask button from bottom navigation
   */
  const handleTriggerAskFromNav = () => {
    setActiveTab('explore');
    if (voiceState === 'idle') {
      startListeningFlow();
    } else if (voiceState === 'speaking') {
      ttsService.stop();
      startListeningFlow();
    }
  };

  /**
   * Hackathon Demo Tour Sequence
   */
  const handleStartDemo = () => {
    setDemoStep(1);
    setCurrentLocation(DEFAULT_DEMO_LOCATIONS[0]); // India Gate
    executeVoiceQuery('Tell me about this place');
  };

  const handleTriggerDemoStep = (step: number) => {
    setDemoStep(step);
    if (step === 1) {
      executeVoiceQuery('Tell me about this place');
    } else if (step === 2) {
      executeVoiceQuery('Why was it built?');
    } else if (step === 3) {
      executeVoiceQuery('What can I see nearby?');
    }
  };

  const handleResetDemo = () => {
    setDemoStep(null);
    ttsService.stop();
    setVoiceState('idle');
  };

  return (
    <div
      className={`min-h-screen bg-[#F7F8FA] text-[#172033] flex flex-col items-center selection:bg-[#00BFA6]/20 ${
        userPreferences.accessibility.largerText ? 'text-lg' : 'text-base'
      } ${userPreferences.accessibility.highContrast ? 'contrast-125' : ''}`}
    >
      <div className="w-full max-w-lg min-h-screen bg-[#F7F8FA] flex flex-col relative shadow-sm border-x border-[#172033]/5">
        {/* Main View Container */}
        <div className="flex-1 w-full overflow-y-auto">
          {activeTab === 'explore' && (
            <Explore
              voiceState={voiceState}
              onOrbClick={handleOrbClick}
              onSelectPrompt={handleSelectPrompt}
              location={currentLocation}
              onLocationChange={(newLoc) => setCurrentLocation(newLoc)}
              language={userPreferences.language}
              onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              onOpenProfile={() => setActiveTab('profile')}
              amplitudes={amplitudes}
              transcript={transcript}
              subtitleText={subtitleText}
              errorMessage={errorMessage}
              visualCard={visualCard}
              onAskAboutPlace={(title) => executeVoiceQuery(`Tell me about ${title}`)}
              onExploreNearby={() => setActiveTab('nearby')}
              demoStep={demoStep}
              onStartDemo={handleStartDemo}
              onTriggerDemoStep={handleTriggerDemoStep}
              onResetDemo={handleResetDemo}
              onStopVoice={handleStopVoice}
              onPauseToggle={handlePauseToggle}
              onRetry={handleRetry}
              isPaused={isPaused}
              userPreferences={userPreferences}
            />
          )}

          {activeTab === 'nearby' && (
            <Nearby
              currentLocation={currentLocation}
              onAskNearoPlace={handleAskNearoPlace}
              onExplorePlaceDetails={(p) => {
                handleAskNearoPlace(p);
              }}
              userInterests={userPreferences.interests}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              preferences={userPreferences}
              onUpdatePreferences={(updated) =>
                setUserPreferences((prev) => ({ ...prev, ...updated }))
              }
              onAskAboutPlace={(title) => {
                setActiveTab('explore');
                executeVoiceQuery(`Tell me about ${title}`);
              }}
            />
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onTriggerAsk={handleTriggerAskFromNav}
          voiceState={voiceState}
        />

        {/* Language Selector Modal */}
        <LanguageSelector
          currentLanguage={userPreferences.language}
          onSelectLanguage={(lang) =>
            setUserPreferences((prev) => ({ ...prev, language: lang }))
          }
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
      </div>
    </div>
  );
}
