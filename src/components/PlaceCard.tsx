import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Volume2, Sparkles, Navigation, Info } from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  onAskNearo: (place: Place) => void;
  onExploreDetails: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onAskNearo,
  onExploreDetails
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="w-full rounded-2xl bg-white shadow-xs hover:shadow-md border border-[#172033]/8 overflow-hidden transition-all duration-300 flex flex-col"
    >
      {/* Photo Header */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#0B132B]">
        <img
          src={place.imageUrl}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0B132B] text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
          {place.category}
        </div>

        {/* Distance Indicator */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
          <MapPin className="w-3 h-3 text-[#00BFA6]" />
          <span>{place.distance}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B132B] leading-snug">
            {place.name}
          </h3>
          <p className="text-xs text-[#172033]/60 font-medium">
            {place.city}
          </p>

          <p className="text-xs sm:text-sm text-[#172033]/80 leading-relaxed mt-2 line-clamp-2">
            {place.shortDescription}
          </p>

          {/* Quick Highlight Tag */}
          {place.recommendedWhy && (
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#00BFA6] font-medium bg-[#00BFA6]/8 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">{place.recommendedWhy}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#172033]/8">
          <button
            id={`explore-btn-${place.id}`}
            onClick={() => onExploreDetails(place)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F7F8FA] hover:bg-[#172033]/5 text-[#172033] text-xs font-bold transition-colors cursor-pointer border border-[#172033]/10"
          >
            <Info className="w-3.5 h-3.5 text-[#172033]/60" />
            <span>Explore</span>
          </button>

          <button
            id={`ask-nearo-btn-${place.id}`}
            onClick={() => onAskNearo(place)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0B132B] hover:bg-[#172033] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#00BFA6]" />
            <span>Ask NEARO</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
