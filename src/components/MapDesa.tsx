'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Desa, Kecamatan } from '@/types';
import { encodeDesaSlug } from '@/lib/slug';

// Custom Marker Icon SVG for Leaflet
const createCustomIcon = (color: string = '#00d2ff') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const defaultIcon = createCustomIcon('#00d2ff');

interface MapDesaProps {
  desaList: Desa[];
  kecamatanList: Kecamatan[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapDesa({
  desaList,
  kecamatanList,
  center = [2.6288, 98.0062], // Subulussalam center coordinates
  zoom = 11,
  height = '450px'
}: MapDesaProps) {

  useEffect(() => {
    // Fix default marker icon missing issue in Next.js Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const getKecamatanName = (id: number) => {
    return kecamatanList.find(k => k.id === id)?.nama || '';
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-card-border shadow-lg" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {desaList.map(desa => (
          <Marker
            key={desa.id}
            position={[desa.latitude || 2.6288, desa.longitude || 98.0062]}
            icon={defaultIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 min-w-[200px]">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary-color text-white inline-block mb-1">
                  Kec. {getKecamatanName(desa.kecamatanId)}
                </span>
                <h4 className="font-bold text-base text-slate-900 leading-tight">
                  {desa.nama}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {desa.profilAbstrak}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    Binaan {desa.tahunPembinaan}
                  </span>
                  <Link
                    href={`/desa/${encodeDesaSlug(desa.id, desa.nama)}`}
                    className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>Detail Data</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
