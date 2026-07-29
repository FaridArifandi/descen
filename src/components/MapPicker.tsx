'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, MapPin, Loader2, X, Check } from 'lucide-react';

// Custom Pin Marker Icon
const createPinIcon = (color: string = '#00d2ff') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40" height="40" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-picker-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const pinIcon = createPinIcon('#00d2ff');

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onChangeLocation: (lat: number, lng: number) => void;
}

// Controller component to handle map pan/zoom programmatically
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1 });
  }, [map, center, zoom]);
  return null;
}

// Map events handler component for click interactions
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  initialLat = 2.6288,
  initialLng = 98.0062,
  onChangeLocation,
}: MapPickerProps) {
  // Default center: Subulussalam if lat/lng is 0 or unassigned
  const defaultLat = initialLat && initialLat !== 0 ? initialLat : 2.6288;
  const defaultLng = initialLng && initialLng !== 0 ? initialLng : 98.0062;

  const [position, setPosition] = useState<[number, number]>([defaultLat, defaultLng]);
  const [zoom, setZoom] = useState<number>(14);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const handleUpdatePosition = useCallback(
    (lat: number, lng: number, newZoom?: number) => {
      // Round to 6 decimal places
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));
      setPosition([roundedLat, roundedLng]);
      if (newZoom) setZoom(newZoom);
      onChangeLocation(roundedLat, roundedLng);
    },
    [onChangeLocation]
  );

  // Search location using Nominatim API
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);
    setShowDropdown(true);

    try {
      // Append Kota Subulussalam or Indonesia context if not provided
      const queryWithContext = `${searchQuery}, Subulussalam, Indonesia`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryWithContext
        )}&limit=5`
      );

      let data: SearchResult[] = await res.json();

      // If no results with subulussalam context, try raw search
      if (!data || data.length === 0) {
        const fallbackRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=5`
        );
        data = await fallbackRes.json();
      }

      setSearchResults(data || []);
      if (!data || data.length === 0) {
        setErrorMsg('Lokasi tidak ditemukan. Coba gunakan kata kunci lain.');
      }
    } catch {
      setErrorMsg('Gagal mencari lokasi. Periksa koneksi internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    handleUpdatePosition(lat, lon, 15);
    setShowDropdown(false);
    setSearchQuery(result.display_name.split(',')[0]); // Keep short name in input
  };

  // Get user's current GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation tidak didukung oleh browser Anda.');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleUpdatePosition(latitude, longitude, 16);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Izin lokasi ditolak oleh browser.');
        } else {
          setErrorMsg('Gagal mendapatkan lokasi GPS saat ini.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-card-border shadow-lg flex flex-col">
      {/* Top Floating Search Bar (Grab / Gmaps Style) */}
      <div
        ref={searchContainerRef}
        className="absolute top-3 left-3 right-3 z-[1000] max-w-lg mx-auto"
      >
        <form
          onSubmit={handleSearch}
          className="relative flex items-center bg-background/90 backdrop-blur-md rounded-2xl border border-card-border shadow-xl px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-color/40"
        >
          <Search className="w-4 h-4 text-muted-text shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            placeholder="Cari lokasi / jalan / desa di Subulussalam..."
            className="w-full bg-transparent outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowDropdown(false);
              }}
              className="p-1 text-muted-text hover:text-foreground shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className="ml-1 px-3 py-1.5 rounded-xl bg-primary-color text-white text-xs font-semibold hover:opacity-90 transition-all shrink-0 flex items-center gap-1 shadow-sm"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cari'}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="mt-2 bg-background/95 backdrop-blur-md border border-card-border rounded-2xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-card-border/50">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-primary-color/10 transition-colors flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 text-primary-color shrink-0 mt-0.5" />
                <span className="text-xs text-foreground font-medium line-clamp-2">
                  {item.display_name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Error message alert */}
        {errorMsg && (
          <div className="mt-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-md text-red-400 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="p-0.5">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Floating GPS Button */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        title="Gunakan lokasi GPS saya saat ini"
        className="absolute bottom-14 right-3 z-[1000] p-2.5 rounded-2xl bg-background/90 backdrop-blur-md border border-card-border text-foreground hover:text-primary-color hover:bg-primary-color/10 shadow-xl transition-all flex items-center gap-2 text-xs font-semibold"
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 text-primary-color animate-spin" />
        ) : (
          <Navigation className="w-4 h-4 text-primary-color" />
        )}
        <span className="hidden sm:inline">Lokasi Saya</span>
      </button>

      {/* Bottom Floating Coordinates Display */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] pointer-events-none">
        <div className="pointer-events-auto max-w-fit mx-auto px-4 py-2 rounded-xl bg-background/90 backdrop-blur-md border border-card-border shadow-xl flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-foreground font-semibold">
            <span className="text-primary-color">Lat:</span> {position[0]}
            <span className="text-primary-color ml-2">Lng:</span> {position[1]}
          </div>
          <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> Pin Dipilih
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10 cursor-crosshair"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={position} zoom={zoom} />
        <MapClickHandler
          onSelect={(lat, lng) => handleUpdatePosition(lat, lng)}
        />

        <Marker
          position={position}
          icon={pinIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              handleUpdatePosition(pos.lat, pos.lng);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
