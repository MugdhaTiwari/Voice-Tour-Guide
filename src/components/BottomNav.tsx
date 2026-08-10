import React from 'react';
import { motion } from 'motion/react';
import { Compass, MapPin, Mic, User } from 'lucide-react';
import { VoiceState } from '../types';

export type NavTab = 'explore' | 'nearby' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerAsk: () => void;
  voiceState: VoiceState;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onTriggerAsk,
  voiceState
}) => {
  const isListeningOrSpeaking = voiceState === 'listening' || voiceState === 'speaking';

  return (
    <nav
      id="nearo-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#172033]/8 px-4 py-2 pb-safe"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Explore Tab */}
        <button
          id="nav-tab-explore"
          onClick={() => onTabChange('explore')}
          className={`flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors ${
            activeTab === 'explore'
              ? 'text-[#00BFA6] font-bold'
              : 'text-[#172033]/60 hover:text-[#0B132B]'
          }`}
          aria-label="Explore Tab"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">Explore</span>
          {activeTab === 'explore' && (
            <motion.div
              layoutId="nav-indicator"
              className="w-1 h-1 rounded-full bg-[#00BFA6] mt-0.5"
            />
          )}
        </button>

        {/* Nearby Tab */}
        <button
          id="nav-tab-nearby"
          onClick={() => onTabChange('nearby')}
          className={`flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors ${
            activeTab === 'nearby'
              ? 'text-[#00BFA6] font-bold'
              : 'text-[#172033]/60 hover:text-[#0B132B]'
          }`}
          aria-label="Nearby Tab"
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">Nearby</span>
          {activeTab === 'nearby' && (
            <motion.div
              layoutId="nav-indicator"
              className="w-1 h-1 rounded-full bg-[#00BFA6] mt-0.5"
            />
          )}
        </button>

        {/* Central Visually Emphasized ASK Voice Button */}
        <div className="relative -top-5 flex flex-col items-center px-2">
          <motion.button
            id="nav-center-ask-button"
            onClick={onTriggerAsk}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
              isListeningOrSpeaking
                ? 'bg-[#00BFA6] text-[#0B132B] ring-4 ring-[#00BFA6]/30 shadow-[#00BFA6]/40'
                : 'bg-[#0B132B] text-white shadow-xl hover:bg-[#172033]'
            }`}
            aria-label="Talk to NEARO voice assistant"
          >
            <Mic className={`w-6 h-6 ${isListeningOrSpeaking ? 'animate-pulse text-[#0B132B]' : 'text-[#00BFA6]'}`} />
          </motion.button>
          <span className="text-[10px] font-bold text-[#0B132B] mt-0.5 tracking-tight">
            Ask
          </span>
        </div>

        {/* Profile Tab */}
        <button
          id="nav-tab-profile"
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors ${
            activeTab === 'profile'
              ? 'text-[#00BFA6] font-bold'
              : 'text-[#172033]/60 hover:text-[#0B132B]'
          }`}
          aria-label="Profile and Preferences Tab"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">Profile</span>
          {activeTab === 'profile' && (
            <motion.div
              layoutId="nav-indicator"
              className="w-1 h-1 rounded-full bg-[#00BFA6] mt-0.5"
            />
          )}
        </button>
      </div>
    </nav>
  );
};
