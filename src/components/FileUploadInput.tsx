'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Link as LinkIcon, X, Check, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadFileToSupabase } from '@/services/storage';

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'pdf';
  bucket?: 'media_desa' | 'publikasi_pdf';
  placeholder?: string;
  required?: boolean;
}

export default function FileUploadInput({
  label,
  value,
  onChange,
  accept = 'image',
  bucket = 'media_desa',
  placeholder = 'https://...',
  required = false
}: FileUploadInputProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFileToSupabase(file, bucket);
      onChange(publicUrl);
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isImage = accept === 'image';
  const acceptedTypes = isImage ? 'image/*' : 'application/pdf';

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-foreground/80">
          {label} {required && <span className="text-red-400">*</span>}
        </label>

        {/* Mode Switcher Pills */}
        <div className="flex items-center space-x-1 bg-background/60 p-0.5 rounded-lg border border-card-border text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'upload'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-muted-text hover:text-foreground'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Berkas</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              mode === 'url'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-muted-text hover:text-foreground'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Input Link</span>
          </button>
        </div>
      </div>

      {/* Mode 1: DIRECT FILE UPLOAD */}
      {mode === 'upload' ? (
        <div>
          {/* File Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 glass ${
              dragActive
                ? 'border-primary-color bg-primary-glow/20'
                : 'border-card-border hover:border-primary-color/50 bg-background/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              className="hidden"
            />

            {uploading ? (
              <div className="flex items-center space-x-2 py-3 text-primary-color">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold">Mengunggah berkas...</span>
              </div>
            ) : value ? (
              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {isImage ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-card-border bg-slate-900">
                      <Image src={value} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary-glow border border-primary-color/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary-color" />
                    </div>
                  )}

                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate">
                      {value.startsWith('data:') ? 'Berkas Lokal (Terunggah)' : value.split('/').pop()}
                    </p>
                    <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3" /> Berkas Siap Digunakan
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(''); }}
                  className="p-1.5 rounded-lg text-muted-text hover:text-red-400 hover:bg-foreground/5 transition-all"
                  title="Hapus Berkas"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-2 space-y-1.5">
                <div className="w-10 h-10 mx-auto rounded-full bg-primary-glow border border-primary-color/20 flex items-center justify-center text-primary-color">
                  {isImage ? <ImageIcon className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <p className="text-xs font-bold text-foreground">
                  Klik atau Drag berkas {isImage ? 'foto (PNG/JPG/WEBP)' : 'PDF'} di sini
                </p>
                <p className="text-[10px] text-muted-text">
                  Maksimal ukuran file 10 MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: DIRECT URL INPUT */
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-xl bg-background border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none transition-all text-foreground text-sm placeholder:text-muted-text"
          />
        </div>
      )}
    </div>
  );
}
