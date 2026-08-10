import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Sparkles, Volume2 } from 'lucide-react';
import { Place } from '../types';
import { DEMO_PLACES } from '../data/demoPlaces';

interface NearbyMapProps {
  selectedPlace?: Place;
  onSelectPlace: (place: Place) => void;
  onAskNearo: (place: Place) => void;
}

export const NearbyMap: React.FC<NearbyMapProps> = ({
  selectedPlace,
  onSelectPlace,
  onAskNearo
}) => {
  const [activePin, setActivePin] = useState<Place>(selectedPlace || DEMO_PLACES[0]);

  // Normalized coordinate offsets for SVG map relative to India Gate
  const getMapPosition = (placeId: string) => {
    switch (placeId) {
      case 'india-gate':
        return { x: 50, y: 50, label: 'India Gate' };
      case 'national-museum':
        return { x: 32, y: 55, label: 'National Museum' };
      case 'agrasen-baoli':
        return { x: 42, y: 28, label: 'Agrasen Baoli' };
      case 'heritage-cafe':
        return { x: 65, y: 32, label: 'Triveni Café' };
      case 'humayuns-tomb':
        return { x: 75, y: 78, label: "Humayun's Tomb" };
      case 'lodhi-gardens':
        return { x: 28, y: 80, label: 'Lodhi Gardens' };
      default:
        return { x: 50, y: 50, label: 'Center' };
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B132B] text-white overflow-hidden shadow-lg border border-white/10 p-4 relative">
      {/* Top Map Header */}
      <div className="flex items-center justify-between mb-3 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00BFA6] animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#00BFA6]">
            Interactive Area Radar
          </span>
        </div>
        <span className="text-[11px] text-white/60 font-medium flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Central Delhi Zone</span>
        </span>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-56 sm:h-64 bg-radial from-[#101D3D] to-[#04101E] rounded-xl overflow-hidden border border-white/10">
        {/* Subtle Map Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#00BFA6_1px,transparent_1px),linear-gradient(to_bottom,#00BFA6_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Radar Rings Centered on India Gate */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-[#00BFA6]/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#00BFA6]/10 pointer-events-none" />

        {/* Rotating Radar Sweep Line */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent to-[#00BFA6] origin-left pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Landmark Pins */}
        {DEMO_PLACES.map((place) => {
          const pos = getMapPosition(place.id);
          const isCurrent = place.id === 'india-gate';
          const isSelected = activePin.id === place.id;

          return (
            <div
              key={`pin-${place.id}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                setActivePin(place);
                onSelectPlace(place);
              }}
            >
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                className={`relative flex items-center justify-center p-1.5 rounded-full shadow-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#00BFA6] text-[#0B132B]'
                    : isSelected
                    ? 'bg-[#F4B942] text-[#0B132B]'
                    : 'bg-white/20 hover:bg-white text-white hover:text-[#0B132B]'
                }`}
              >
                {isCurrent ? (
                  <Navigation className="w-4 h-4 fill-current" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}

                {/* Floating Pin Label */}
                <div
                  className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition-opacity pointer-events-none ${
                    isSelected
                      ? 'bg-white text-[#0B132B] opacity-100'
                      : 'bg-black/70 text-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {place.name}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Selected Landmark Quick Action Card */}
      {activePin && (
        <motion.div
          key={activePin.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={activePin.imageUrl}
              alt={activePin.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-lg object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">
                {activePin.name}
              </h4>
              <p className="text-[11px] text-[#00BFA6] font-medium">
                {activePin.distance} • {activePin.category}
              </p>
            </div>
          </div>

          <button
            id={`map-ask-nearo-${activePin.id}`}
            onClick={() => onAskNearo(activePin)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00BFA6] hover:bg-[#00A892] text-[#0B132B] text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ask NEARO</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
