'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Globe, 
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createPesanKontak } from '@/services/database';

export default function Kontak() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await createPesanKontak({
      nama: formData.name,
      email: formData.email,
      subjek: formData.subject,
      isi: formData.message
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Page Title */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Hubungi <span className="text-primary-color">Kami</span>
          </h1>
          <p className="text-muted-text max-w-2xl mx-auto text-sm sm:text-base mt-2 leading-relaxed">
            Apakah Anda memiliki pertanyaan mengenai program pembinaan Desa Cantik atau publikasi data statistik Kota Subulussalam? Silakan hubungi kami.
          </p>
        </section>

        {/* Contact Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info Cards Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass rounded-3xl p-6 sm:p-8 border border-card-border space-y-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-color" />
                  <span>Informasi Kontak BPS</span>
                </h2>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <MapPin className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Alamat Kantor</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1 leading-relaxed">
                        Badan Pusat Statistik Kota Subulussalam<br />
                        Jalan Teuku Umar, Kota Subulussalam, Aceh, Indonesia
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Phone className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Nomor Telepon</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1">
                        (0654) 123456
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Mail className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">E-mail Resmi</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1 hover:text-primary-color transition-colors">
                        <a href="mailto:bps1119@bps.go.id">bps1119@bps.go.id</a>
                      </p>
                    </div>
                  </div>

                  {/* Web */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Globe className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Website Resmi BPS</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1 hover:text-primary-color transition-colors">
                        <a 
                          href="https://subulussalamkota.bps.go.id" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          subulussalamkota.bps.go.id
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="glass rounded-3xl p-6 sm:p-8 border border-card-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Kirim Pesan Langsung</h2>
                
                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                    <h3 className="font-bold text-foreground">Pesan Berhasil Dikirim</h3>
                    <p className="text-xs sm:text-sm text-muted-text mt-1 max-w-xs">
                      Terima kasih atas tanggapan Anda. Kami akan meninjau pesan Anda sesegera mungkin.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/95">Nama Lengkap</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground/95">Alamat Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/95">Subjek Pesan</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground/95">Isi Pesan</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-primary-color text-white font-semibold hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 text-sm mt-4 shadow-[0_0_15px_var(--primary-glow)]"
                    >
                      {isSubmitting ? (
                        <span>Mengirimkan...</span>
                      ) : (
                        <>
                          <span>Kirim Pesan</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
