import React from 'react';
import { motion } from 'motion/react';
import { Compass, Clock, MapPin, Sparkles, HelpCircle } from 'lucide-react';
import { LanguageCode } from '../types';

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  language?: LanguageCode;
  customPrompts?: string[];
  disabled?: boolean;
}

interface PromptItem {
  id: string;
  icon: React.ElementType;
  text: Record<LanguageCode, string>;
}

const DEFAULT_PROMPTS: PromptItem[] = [
  {
    id: 'overview',
    icon: Compass,
    text: {
      en: 'Tell me about this place',
      hi: 'इस जगह के बारे में बताइए',
      es: 'Háblame de este lugar',
      fr: 'Parle-moi de cet endroit'
    }
  },
  {
    id: 'why-built',
    icon: HelpCircle,
    text: {
      en: 'Why was it built?',
      hi: 'यह क्यों बनाया गया था?',
      es: '¿Por qué se construyó?',
      fr: 'Pourquoi a-t-il été construit ?'
    }
  },
  {
    id: 'nearby',
    icon: MapPin,
    text: {
      en: "What's nearby?",
      hi: 'आसपास क्या देखने लायक है?',
      es: '¿Qué lugares hay cerca?',
      fr: 'Que voir à proximité ?'
    }
  },
  {
    id: 'interesting',
    icon: Sparkles,
    text: {
      en: 'Give me something interesting',
      hi: 'कोई रोचक रहस्य बताइए',
      es: 'Cuéntame un dato curioso',
      fr: 'Raconte-moi une anecdote'
    }
  },
  {
    id: 'history',
    icon: Clock,
    text: {
      en: 'Tell me the history',
      hi: 'इसका इतिहास बताइए',
      es: 'Cuéntame la historia',
      fr: "Raconte-moi l'histoire"
    }
  }
];

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  language = 'en',
  customPrompts,
  disabled = false
}) => {
  return (
    <div className="w-full max-w-md px-4 mt-4">
      <p className="text-xs font-semibold text-[#172033]/50 uppercase tracking-wider text-center mb-2.5">
        Suggested Spoken Prompts
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {customPrompts && customPrompts.length > 0 ? (
          customPrompts.map((prompt, idx) => (
            <motion.button
              key={`custom-prompt-${idx}`}
              id={`suggested-prompt-custom-${idx}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={disabled}
              onClick={() => onSelectPrompt(prompt)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#0B132B] text-xs sm:text-sm font-semibold shadow-xs border border-[#172033]/10 hover:border-[#00BFA6]/50 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00BFA6]" />
              <span>{prompt}</span>
            </motion.button>
          ))
        ) : (
          DEFAULT_PROMPTS.map((item) => {
            const Icon = item.icon;
            const promptLabel = item.text[language] || item.text.en;

            return (
              <motion.button
                key={item.id}
                id={`suggested-prompt-${item.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={disabled}
                onClick={() => onSelectPrompt(promptLabel)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#0B132B] text-xs sm:text-sm font-semibold shadow-xs border border-[#172033]/10 hover:border-[#00BFA6]/50 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-[#00BFA6]" />
                <span>{promptLabel}</span>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
};
