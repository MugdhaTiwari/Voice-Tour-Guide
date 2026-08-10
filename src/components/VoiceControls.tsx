import React from 'react';
import { motion } from 'motion/react';
import { Square, Pause, Play, RefreshCw, X } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceControlsProps {
  state: VoiceState;
  onStop: () => void;
  onPauseToggle?: () => void;
  onRetry: () => void;
  isPaused?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  state,
  onStop,
  onPauseToggle,
  onRetry,
  isPaused = false
}) => {
  if (state === 'idle') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center justify-center gap-3 mt-3"
    >
      {/* Listening State Controls */}
      {state === 'listening' && (
        <button
          id="cancel-listening-button"
          onClick={onStop}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#172033]/5 hover:bg-[#172033]/10 text-[#172033] text-sm font-semibold transition-colors duration-200 cursor-pointer"
          aria-label="Cancel listening"
        >
          <X className="w-4 h-4 text-[#172033]/70" />
          <span>Cancel</span>
        </button>
      )}

      {/* Speaking State Controls */}
      {state === 'speaking' && (
        <div className="flex items-center gap-2">
          {onPauseToggle && (
            <button
              id="pause-voice-button"
              onClick={onPauseToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-[#172033]/10 hover:bg-[#F7F8FA] text-[#0B132B] text-sm font-semibold transition-colors duration-200 cursor-pointer"
              aria-label={isPaused ? 'Resume speaking' : 'Pause speaking'}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 text-[#00BFA6] fill-[#00BFA6]" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-[#0B132B]" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}

          <button
            id="stop-speaking-button"
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B132B] hover:bg-[#172033] text-white text-sm font-semibold shadow-sm transition-colors duration-200 cursor-pointer"
            aria-label="Interrupt or stop NEARO speaking"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Interrupt</span>
          </button>
        </div>
      )}

      {/* Error State Controls */}
      {state === 'error' && (
        <button
          id="retry-voice-button"
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00BFA6] hover:bg-[#00A892] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          aria-label="Retry speech question"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tap to Try Again</span>
        </button>
      )}
    </motion.div>
  );
};
