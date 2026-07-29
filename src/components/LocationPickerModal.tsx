'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AdminModal from '@/components/AdminModal';
import { MapPin, Check } from 'lucide-react';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-2xl glass flex flex-col items-center justify-center border border-card-border gap-2">
      <div className="w-8 h-8 border-2 border-primary-color border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-muted-text">Memuat Peta Lokasi...</p>
    </div>
  ),
});

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  onConfirm: (lat: number, lng: number) => void;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  initialLat = 2.6288,
  initialLng = 98.0062,
  onConfirm,
}: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState<number>(initialLat || 2.6288);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng || 98.0062);

  // Update internal state when opening modal with new initialLat/initialLng
  React.useEffect(() => {
    if (isOpen) {
      setSelectedLat(initialLat && initialLat !== 0 ? initialLat : 2.6288);
      setSelectedLng(initialLng && initialLng !== 0 ? initialLng : 98.0062);
    }
  }, [isOpen, initialLat, initialLng]);

  const handleSave = () => {
    onConfirm(selectedLat, selectedLng);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Titik Lokasi Desa di Peta"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-xs text-muted-text">
          Cari nama lokasi, geser marker, atau klik langsung pada peta untuk menentukan posisi koordinat yang tepat.
        </p>

        {isOpen && (
          <MapPicker
            initialLat={selectedLat}
            initialLng={selectedLng}
            onChangeLocation={(lat, lng) => {
              setSelectedLat(lat);
              setSelectedLng(lng);
            }}
          />
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-foreground/5 px-3 py-2 rounded-xl w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-primary-color shrink-0" />
            <span>
              Terpilih: <strong className="font-mono text-primary-color">{selectedLat}, {selectedLng}</strong>
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]"
            >
              <Check className="w-4 h-4" />
              Gunakan Lokasi Ini
            </button>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
