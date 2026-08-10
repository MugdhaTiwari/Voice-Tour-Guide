import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Volume2, AlertCircle, Radio } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceStatusProps {
  state: VoiceState;
  transcript?: string;
  subtitleText?: string;
  errorMessage?: string;
  showCaptions?: boolean;
}

export const VoiceStatus: React.FC<VoiceStatusProps> = ({
  state,
  transcript,
  subtitleText,
  errorMessage,
  showCaptions = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 min-h-[72px]">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="status-idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-1"
          >
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]">
              Tap to talk
            </p>
            <p className="text-xs sm:text-sm font-medium text-[#172033]/60">
              Ask anything about where you are
            </p>
          </motion.div>
        )}

        {state === 'listening' && (
          <motion.div
            key="status-listening"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2 text-[#00BFA6]">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]">
                Listening...
              </span>
            </div>
            {transcript ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-[#00BFA6] max-w-xs sm:max-w-md truncate px-3 py-1 rounded-full bg-[#00BFA6]/10 border border-[#00BFA6]/20 mt-1"
              >
                "{transcript}"
              </motion.p>
            ) : (
              <p className="text-xs sm:text-sm font-medium text-[#172033]/60">
                Speak your question naturally
              </p>
            )}
          </motion.div>
        )}

        {state === 'thinking' && (
          <motion.div
            key="status-thinking"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2 text-[#F4B942]">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]">
                Thinking...
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#172033]/60">
              Retrieving location insights
            </p>
          </motion.div>
        )}

        {state === 'speaking' && (
          <motion.div
            key="status-speaking"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2 text-[#00BFA6]">
              <Volume2 className="w-5 h-5 animate-bounce" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B132B]">
                NEARO is speaking...
              </span>
            </div>
            {showCaptions && subtitleText && (
              <p className="text-xs sm:text-sm text-[#172033]/80 line-clamp-2 max-w-sm sm:max-w-md italic mt-1 px-3">
                "{subtitleText}"
              </p>
            )}
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="status-error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-red-600">
                I couldn't hear that.
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#172033]/70">
              {errorMessage || 'Tap the orb or retry button below.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
