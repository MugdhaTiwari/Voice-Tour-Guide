import React, { useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Volume2, Sparkles, AlertCircle, StopCircle, RefreshCw } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceOrbProps {
  state: VoiceState;
  onClick: () => void;
  amplitudes?: number[];
  disabled?: boolean;
  size?: 'normal' | 'compact';
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  onClick,
  amplitudes = [0.4, 0.6, 0.8, 0.5, 0.3],
  disabled = false,
  size = 'normal'
}) => {
  const isCompact = size === 'compact';
  const orbSize = isCompact ? 'w-44 h-44 sm:w-52 sm:h-52' : 'w-56 h-56 sm:w-64 sm:h-64';
  const uniqueId = useId();

  // Determine state-based visuals
  const getStateColors = () => {
    switch (state) {
      case 'listening':
        return {
          glow: 'rgba(0, 191, 166, 0.45)',
          ring: 'border-[#00BFA6]',
          core: 'from-[#00BFA6] via-[#0B132B] to-[#04101E]',
          accent: '#00BFA6'
        };
      case 'thinking':
        return {
          glow: 'rgba(244, 185, 66, 0.45)',
          ring: 'border-[#F4B942]',
          core: 'from-[#0B132B] via-[#1C2C54] to-[#F4B942]/30',
          accent: '#F4B942'
        };
      case 'speaking':
        return {
          glow: 'rgba(0, 191, 166, 0.55)',
          ring: 'border-[#00BFA6]',
          core: 'from-[#04101E] via-[#0B132B] to-[#00BFA6]/40',
          accent: '#00BFA6'
        };
      case 'error':
        return {
          glow: 'rgba(239, 68, 68, 0.35)',
          ring: 'border-red-400',
          core: 'from-[#0B132B] via-[#2A151B] to-red-950/40',
          accent: '#EF4444'
        };
      case 'idle':
      default:
        return {
          glow: 'rgba(0, 191, 166, 0.25)',
          ring: 'border-[#00BFA6]/40',
          core: 'from-[#0B132B] via-[#101D3D] to-[#04101E]',
          accent: '#00BFA6'
        };
    }
  };

  const colors = getStateColors();

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Outer Pulse Halo 1 */}
      {state === 'listening' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-[#00BFA6]/15"
          animate={{
            scale: [1, 1.35, 1.45],
            opacity: [0.6, 0.2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      )}

      {/* Outer Pulse Halo 2 (Speaking/Listening) */}
      {(state === 'speaking' || state === 'listening') && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: state === 'speaking' 
              ? 'radial-gradient(circle, rgba(0,191,166,0.2) 0%, rgba(244,185,66,0.05) 70%, transparent 100%)' 
              : 'radial-gradient(circle, rgba(0,191,166,0.25) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Thinking Cosmic Swirl Orbit */}
      {state === 'thinking' && (
        <motion.div
          className="absolute -inset-4 rounded-full border-2 border-dashed border-[#F4B942]/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Main Interactive Button Orb */}
      <motion.button
        id="nearo-voice-orb-button"
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${orbSize} rounded-full flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/40 transition-shadow duration-300`}
        style={{
          boxShadow: `0 0 45px ${colors.glow}, inset 0 0 25px rgba(255,255,255,0.1)`
        }}
        aria-label={
          state === 'idle'
            ? 'Start listening to voice query'
            : state === 'listening'
            ? 'Stop listening'
            : state === 'speaking'
            ? 'Interrupt NEARO speaking'
            : 'Voice assistant'
        }
      >
        {/* Deep Orb Gradient Sphere */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-b ${colors.core} border border-white/15 overflow-hidden backdrop-blur-sm`}
        >
          {/* Subtle Inner Glass Highlight */}
          <div className="absolute top-2 left-6 right-6 h-1/3 rounded-full bg-gradient-to-b from-white/20 to-transparent blur-[2px]" />

          {/* Animated Waveform Visualization for Speaking */}
          {state === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-8">
              {amplitudes.map((amp, idx) => (
                <motion.div
                  key={`wave-${idx}`}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#00BFA6] via-[#F4B942] to-white"
                  animate={{
                    height: `${Math.max(16, amp * 80)}px`,
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 0.15,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          )}

          {/* Animated Waveform Circles for Listening */}
          {state === 'listening' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full border border-[#00BFA6]/40"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-20 h-20 rounded-full border border-[#00BFA6]/60"
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>

        {/* Center Icon Graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="icon-idle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-[#00BFA6]" />
                </div>
              </motion.div>
            )}

            {state === 'listening' && (
              <motion.div
                key="icon-listening"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00BFA6]/20 flex items-center justify-center border border-[#00BFA6] shadow-lg">
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-[#00BFA6] animate-pulse" />
                </div>
              </motion.div>
            )}

            {state === 'thinking' && (
              <motion.div
                key="icon-thinking"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F4B942]/20 flex items-center justify-center border border-[#F4B942]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#F4B942]" />
                </motion.div>
              </motion.div>
            )}

            {state === 'speaking' && (
              <motion.div
                key="icon-speaking"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#00BFA6]" />
                </div>
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                key="icon-error"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-400">
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Outer Rotating Edge Ring */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
      </motion.button>
    </div>
  );
};
