import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Filter, Sparkles, Navigation, Volume2 } from 'lucide-react';
import { NearbyMap } from '../components/NearbyMap';
import { PlaceCard } from '../components/PlaceCard';
import { InterestCategory, LocationContext, Place } from '../types';
import { DEMO_PLACES } from '../data/demoPlaces';

interface NearbyProps {
  currentLocation: LocationContext;
  onAskNearoPlace: (place: Place) => void;
  onExplorePlaceDetails: (place: Place) => void;
  userInterests: InterestCategory[];
}

const CATEGORIES: ('All' | InterestCategory)[] = [
  'All',
  'History',
  'Architecture',
  'Art',
  'Food',
  'Nature'
];

export const Nearby: React.FC<NearbyProps> = ({
  currentLocation,
  onAskNearoPlace,
  onExplorePlaceDetails,
  userInterests
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | InterestCategory>('All');
  const [activeMapPlace, setActiveMapPlace] = useState<Place>(DEMO_PLACES[0]);

  const filteredPlaces = DEMO_PLACES.filter((place) => {
    if (selectedCategory === 'All') return true;
    return place.category === selectedCategory;
  });

  return (
    <div className="w-full flex flex-col items-center pb-28 pt-2">
      {/* Header */}
      <header className="w-full max-w-md px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00BFA6]">
            Discovery Radar
          </span>
          <h1 className="text-xl font-black tracking-tight text-[#0B132B]">
            What's Near You?
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00BFA6]/10 text-[#00BFA6] text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentLocation.name}</span>
        </div>
      </header>

      {/* Map Radar Preview */}
      <div className="w-full max-w-md px-4 mb-4">
        <NearbyMap
          selectedPlace={activeMapPlace}
          onSelectPlace={(p) => setActiveMapPlace(p)}
          onAskNearo={(p) => onAskNearoPlace(p)}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="w-full max-w-md px-4 mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isUserFavorite = cat !== 'All' && userInterests.includes(cat);

            return (
              <button
                key={cat}
                id={`nearby-category-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : isUserFavorite
                    ? 'bg-[#00BFA6]/15 text-[#00BFA6] hover:bg-[#00BFA6]/25 border border-[#00BFA6]/30'
                    : 'bg-white text-[#172033]/70 hover:bg-white hover:text-[#0B132B] border border-[#172033]/10'
                }`}
              >
                {isUserFavorite && <Sparkles className="w-3 h-3 text-[#00BFA6]" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Places Cards List */}
      <div className="w-full max-w-md px-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#172033]/60 uppercase tracking-wider">
            {filteredPlaces.length} Attractions Found
          </p>
          <span className="text-[11px] text-[#00BFA6] font-semibold">
            Tap "Ask NEARO" for voice guide
          </span>
        </div>

        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onAskNearo={onAskNearoPlace}
            onExploreDetails={onExplorePlaceDetails}
          />
        ))}
      </div>
    </div>
  );
};
