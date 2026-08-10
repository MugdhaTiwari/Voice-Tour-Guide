import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, ChevronDown, Check, Compass, LocateFixed } from 'lucide-react';
import { LocationContext } from '../types';
import { DEFAULT_DEMO_LOCATIONS, locationService } from '../services/locationService';

interface LocationCardProps {
  location: LocationContext;
  onLocationChange: (newLocation: LocationContext) => void;
  onLocationRequested?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onLocationChange,
  onLocationRequested
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleDeviceGPS = async () => {
    setLocating(true);
    const result = await locationService.requestDeviceLocation();
    setLocating(false);
    if (result.success) {
      onLocationChange(result.location);
    }
    setIsOpen(false);
    onLocationRequested?.();
  };

  const handleSelectLocation = (loc: LocationContext) => {
    locationService.setManualLocation(loc);
    onLocationChange(loc);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-md px-4">
      {/* Location Badge & Selector Button */}
      <motion.button
        id="location-badge-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs border border-[#172033]/8 hover:border-[#00BFA6]/40 transition-all duration-200 cursor-pointer"
        aria-label="Change current exploration landmark"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#00BFA6]/10 flex items-center justify-center text-[#00BFA6] shrink-0">
            <MapPin className="w-5 h-5 fill-[#00BFA6]/20" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#172033]/50 flex items-center gap-1">
              <span>You're exploring</span>
              {location.isManualSelection && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00BFA6]" />
              )}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0B132B] leading-tight">
              {location.name}
            </h2>
            <p className="text-xs text-[#172033]/60 font-medium">
              {location.city} • Near Kartavya Path
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00BFA6] bg-[#00BFA6]/8 px-2.5 py-1.5 rounded-lg shrink-0">
          <Navigation className="w-3.5 h-3.5" />
          <span>Change</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </motion.button>

      {/* Destination Switcher Dropdown Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 p-3 rounded-2xl bg-white shadow-xl border border-[#172033]/10 z-30 relative"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#172033]/8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B132B]">
                Choose Landmark Destination
              </span>
              <button
                id="gps-locate-button"
                onClick={handleDeviceGPS}
                disabled={locating}
                className="flex items-center gap-1 text-xs font-bold text-[#00BFA6] hover:underline cursor-pointer disabled:opacity-50"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>{locating ? 'Locating...' : 'Use GPS'}</span>
              </button>
            </div>

            <div className="space-y-1">
              {DEFAULT_DEMO_LOCATIONS.map((dest) => {
                const isSelected = dest.placeId === location.placeId;
                return (
                  <button
                    key={dest.placeId}
                    id={`dest-option-${dest.placeId}`}
                    onClick={() => handleSelectLocation(dest)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#00BFA6]/10 text-[#0B132B] font-bold'
                        : 'hover:bg-[#F7F8FA] text-[#172033]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className={`w-4 h-4 ${isSelected ? 'text-[#00BFA6]' : 'text-[#172033]/40'}`} />
                      <div>
                        <p className="font-semibold text-sm leading-tight">{dest.name}</p>
                        <p className="text-[11px] text-[#172033]/60 font-normal">
                          {dest.landmarkDetails}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#00BFA6] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
