import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Sparkles, Volume2, ArrowRight, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { VisualCardData } from '../types';
import { apiService } from '../services/apiService';

interface SupportingCardProps {
  cardData: VisualCardData;
  onAskAboutPlace: (placeTitle: string) => void;
  onExploreNearby?: () => void;
}

export const SupportingCard: React.FC<SupportingCardProps> = ({
  cardData,
  onAskAboutPlace,
  onExploreNearby
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (rating: 'positive' | 'negative') => {
    setFeedbackGiven(rating);
    apiService.submitRetrievalFeedback({
      queryId: cardData.queryId || `qry_${Date.now()}`,
      query: `Query about ${cardData.title}`,
      placeId: cardData.placeId,
      placeName: cardData.title,
      rating,
      timestamp: Date.now()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md px-4 mt-4"
    >
      <div className="rounded-2xl bg-white shadow-md border border-[#172033]/10 overflow-hidden">
        {/* Card Image Banner if present */}
        {cardData.imageUrl && (
          <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#0B132B]">
            <img
              src={cardData.imageUrl}
              alt={cardData.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {cardData.badge && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#00BFA6] text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
                {cardData.badge}
              </div>
            )}

            {cardData.distance && (
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                <MapPin className="w-3 h-3 text-[#00BFA6]" />
                <span>{cardData.distance}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00BFA6]">
                {cardData.category}
              </span>
              <h3 className="text-base font-bold text-[#0B132B] leading-tight">
                {cardData.title}
              </h3>
              <p className="text-xs text-[#172033]/60 font-medium">
                {cardData.subtitle}
              </p>
            </div>

            {/* Subtle Qdrant Evaluation / Feedback Button */}
            <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-lg border border-[#172033]/5">
              {feedbackGiven ? (
                <span className="flex items-center gap-1 text-[10px] text-[#00BFA6] font-bold px-1">
                  <Check className="w-3 h-3" />
                  <span>Saved</span>
                </span>
              ) : (
                <>
                  <button
                    id="feedback-thumbs-up"
                    onClick={() => handleFeedback('positive')}
                    className="p-1 hover:text-[#00BFA6] text-[#172033]/50 transition-colors cursor-pointer"
                    title="Helpful recommendation"
                    aria-label="Helpful recommendation"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id="feedback-thumbs-down"
                    onClick={() => handleFeedback('negative')}
                    className="p-1 hover:text-red-500 text-[#172033]/50 transition-colors cursor-pointer"
                    title="Not relevant"
                    aria-label="Not relevant"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-[#172033]/80 leading-relaxed mt-2 line-clamp-2">
            {cardData.description}
          </p>

          {/* Quick bullet facts if available */}
          {cardData.facts && cardData.facts.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#172033]/8 space-y-1">
              {cardData.facts.slice(0, 2).map((fact, idx) => (
                <div key={`fact-${idx}`} className="flex items-start gap-1.5 text-[11px] text-[#172033]/70">
                  <Sparkles className="w-3 h-3 text-[#F4B942] shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2 mt-3 pt-2">
            <button
              id={`ask-about-${cardData.placeId || 'landmark'}`}
              onClick={() => onAskAboutPlace(cardData.title)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0B132B] hover:bg-[#172033] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#00BFA6]" />
              <span>Ask NEARO about this</span>
            </button>

            {onExploreNearby && (
              <button
                id="explore-nearby-button"
                onClick={onExploreNearby}
                className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#00BFA6]/10 hover:bg-[#00BFA6]/20 text-[#00BFA6] text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Nearby</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
