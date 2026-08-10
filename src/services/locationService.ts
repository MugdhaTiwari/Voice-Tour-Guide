/**
 * locationService.ts
 * 
 * Provides geolocation and landmark context for NEARO.
 * Handles device GPS with graceful fallbacks to manual destination
 * selection so the app works reliably in indoor demo settings or when
 * GPS permission is denied.
 */

import { Coordinates, LocationContext } from '../types';
import { DEMO_PLACES } from '../data/demoPlaces';

export const DEFAULT_DEMO_LOCATIONS: LocationContext[] = [
  {
    placeId: 'india-gate',
    name: 'India Gate',
    city: 'New Delhi',
    coordinates: { latitude: 28.6129, longitude: 77.2295 },
    isManualSelection: false,
    landmarkDetails: 'Triumphal arch war memorial along Kartavya Path.'
  },
  {
    placeId: 'national-museum',
    name: 'National Museum',
    city: 'New Delhi',
    coordinates: { latitude: 28.6119, longitude: 77.2195 },
    isManualSelection: true,
    landmarkDetails: "Premier museum housing 5,000 years of civilization art on Janpath."
  },
  {
    placeId: 'humayuns-tomb',
    name: "Humayun's Tomb",
    city: 'New Delhi',
    coordinates: { latitude: 28.5933, longitude: 77.2507 },
    isManualSelection: true,
    landmarkDetails: 'UNESCO World Heritage Mughal garden tomb in Nizamuddin East.'
  },
  {
    placeId: 'agrasen-baoli',
    name: 'Agrasen ki Baoli',
    city: 'New Delhi',
    coordinates: { latitude: 28.6258, longitude: 77.2250 },
    isManualSelection: true,
    landmarkDetails: 'Hidden 14th-century stepwell near Connaught Place.'
  }
];

class LocationService {
  private currentLocation: LocationContext = DEFAULT_DEMO_LOCATIONS[0];
  private watchId: number | null = null;

  public getCurrentContext(): LocationContext {
    return this.currentLocation;
  }

  public setManualLocation(location: LocationContext): void {
    this.currentLocation = {
      ...location,
      isManualSelection: true
    };
  }

  public selectPlaceAsLocation(placeId: string): LocationContext {
    const place = DEMO_PLACES.find((p) => p.id === placeId);
    if (place) {
      this.currentLocation = {
        placeId: place.id,
        name: place.name,
        city: place.city,
        coordinates: place.coordinates,
        isManualSelection: true,
        landmarkDetails: place.shortDescription
      };
    }
    return this.currentLocation;
  }

  /**
   * Attempts to obtain real device coordinates via browser Geolocation API
   */
  public async requestDeviceLocation(): Promise<{ success: boolean; location: LocationContext; error?: string }> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        success: false,
        location: this.currentLocation,
        error: 'Location access is unavailable in this browser.'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Find nearest landmark to coordinates
          const nearest = this.findNearestPlace(coords);

          this.currentLocation = {
            placeId: nearest ? nearest.id : 'device-loc',
            name: nearest ? nearest.name : 'Current Location',
            city: nearest ? nearest.city : 'Nearby Exploration',
            coordinates: coords,
            isManualSelection: false,
            landmarkDetails: nearest ? nearest.shortDescription : 'GPS location active.'
          };

          resolve({
            success: true,
            location: this.currentLocation
          });
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err.message);
          resolve({
            success: false,
            location: this.currentLocation,
            error: 'Location access is unavailable. Using demo destination.'
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Computes Haversine distance between two coordinates in kilometers
   */
  public calculateDistanceKm(from: Coordinates, to: Coordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(to.latitude - from.latitude);
    const dLon = this.deg2rad(to.longitude - from.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(from.latitude)) *
        Math.cos(this.deg2rad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  public formatDistance(km: number): string {
    if (km < 0.05) return 'You are here';
    if (km < 1) {
      return `${Math.round(km * 1000)} m away`;
    }
    return `${km.toFixed(1)} km away`;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private findNearestPlace(coords: Coordinates) {
    let minDistance = Infinity;
    let nearest = DEMO_PLACES[0];

    for (const place of DEMO_PLACES) {
      const dist = this.calculateDistanceKm(coords, place.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = place;
      }
    }
    return nearest;
  }
}

export const locationService = new LocationService();
