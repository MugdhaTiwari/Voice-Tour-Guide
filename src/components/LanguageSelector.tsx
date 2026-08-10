import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check, X, Volume2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { POPULAR_LANGUAGES } from '../data/demoPlaces';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  isOpen,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-[#172033]/10 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#172033]/8 bg-[#F7F8FA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B132B]">
                    Choose Guide Language
                  </h3>
                  <p className="text-xs text-[#172033]/60">
                    NEARO will speak in this language
                  </p>
                </div>
              </div>

              <button
                id="close-language-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#172033]/60 hover:text-[#0B132B] shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Options List */}
            <div className="p-4 space-y-2">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;

                return (
                  <button
                    key={lang.code}
                    id={`lang-select-${lang.code}`}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B132B] text-white shadow-md'
                        : 'bg-[#F7F8FA] hover:bg-[#172033]/5 text-[#172033]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm leading-tight">
                            {lang.nativeName}
                          </span>
                          <span
                            className={`text-xs ${
                              isSelected ? 'text-white/70' : 'text-[#172033]/50'
                            }`}
                          >
                            ({lang.name})
                          </span>
                        </div>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            isSelected ? 'text-[#00BFA6]' : 'text-[#172033]/60'
                          }`}
                        >
                          "{lang.sampleGreeting}"
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#00BFA6] flex items-center justify-center text-[#0B132B] shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
