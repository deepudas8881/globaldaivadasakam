import React, { useEffect, useState } from 'react';
import { Calendar, Download, Sparkles } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import snfLogo from '../assets/images/snf_germany_logo_1792075424089.jpg';
import guruPortrait from '../assets/images/regenerated_image_1792160414919.png';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const targetDate = new Date('2026-10-25T19:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-12 pb-20 text-center overflow-hidden bg-gradient-to-b from-[#0d4033] via-[#082f26] to-[#082f26]">
      {/* Subtle radial ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,181,109,0.22),transparent_65%)]" 
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Guru Seated Meditation Portrait & Organization Logos at the top */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8">
          {/* Sree Narayana Guru Seated Meditation Portrait (Exact Matching Image) */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#d9b56d] via-[#f9e8b2] to-[#bf9546] opacity-90 blur-lg group-hover:opacity-100 transition duration-500 animate-pulse" />
              <div className="relative p-1.5 rounded-2xl bg-gradient-to-b from-[#d9b56d] to-[#082f26] shadow-2xl">
                <img
                  src={guruPortrait}
                  alt="Sree Narayana Guru seated in deep meditation"
                  className="relative w-48 sm:w-64 h-64 sm:h-80 rounded-xl object-contain shadow-inner bg-[#031d17]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-[#031d17]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#d9b56d]/60 text-[9px] font-sans font-bold text-[#d9b56d] uppercase tracking-wider shadow-md">
                  Sacred Portrait
                </div>
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-serif italic text-[#f8f4e9] mt-3 font-normal tracking-wide drop-shadow-md">
              Sree Narayana Guru
            </h2>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#d9b56d] font-bold">
              Universal Spiritual Master (1856–1928)
            </span>
          </div>

          <div className="hidden sm:block h-36 w-px bg-[#d9b56d]/30 mx-2" />

          {/* Sree Narayana Forum Germany Logo & Emblem */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#d9b56d]/50 via-[#f1e5ca]/40 to-[#d9b56d]/50 opacity-70 blur-md group-hover:opacity-100 transition duration-500" />
              <img
                src={snfLogo}
                alt="Sree Narayana Forum for Universal Brotherhood, Germany"
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-2xl border-2 border-[#d9b56d] bg-[#f8f4e9]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Organization Attribution */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-sans tracking-wide text-[#f1e5ca]">
              <span className="uppercase font-bold text-[#d9b56d] tracking-[0.14em]">
                SN Forum Germany
              </span>
              <span 
                className="inline-block w-3.5 h-2.5 bg-gradient-to-b from-black via-[#dd0000] to-[#ffce00] rounded-xs border border-white/20" 
                title="Germany"
              />
            </div>
            <span className="text-[10px] font-sans text-stone-300">
              Conducting International Organization
            </span>
          </div>
        </div>

        {/* Chairman Attribution */}
        <div className="mb-6 inline-block px-4 py-1.5 rounded-full bg-[#05231c]/90 border border-[#d9b56d]/35 text-xs font-sans text-stone-200">
          <span>Organized under the Leadership of Chairman <strong className="text-[#d9b56d] font-bold">Dr. Varun Radhakrishnan</strong></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal leading-[1.05] text-[#f8f4e9] max-w-3xl mx-auto tracking-tight">
          One World,<br />
          <span className="italic text-[#d9b56d] font-normal">One Prayer</span>
        </h1>

        {/* Lead description */}
        <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-[#e7e2d5] leading-relaxed font-serif">
          Let us come together across borders, languages, and communities to recite Daivadasakam,
          the universal prayer composed by Sree Narayana Guru, in a shared spirit of peace and human unity.
        </p>

        {/* Static Unboxed Metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-sans tracking-wide text-[#d9b56d]">
          <span>Sunday, 25 October 2026</span>
          <span aria-hidden="true" className="opacity-60">·</span>
          <span className="font-semibold text-[#f8f4e9]">7:00 PM IST (03:30 PM CEST)</span>
          <span aria-hidden="true" className="opacity-60">·</span>
          <span>Global Daivadasakam Gathering</span>
        </div>

        {/* Countdown Strip */}
        <div className="mt-8 mb-8 inline-grid grid-cols-4 gap-3 sm:gap-6 bg-[#05231c]/85 border border-[#d9b56d]/30 rounded-xl px-5 sm:px-8 py-3.5 backdrop-blur-sm shadow-xl">
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-serif text-[#d9b56d] font-semibold tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase text-[#c1cfc7]">
              Days
            </span>
          </div>
          <div className="text-center border-l border-[#d9b56d]/20 pl-3 sm:pl-6">
            <span className="block text-2xl sm:text-3xl font-serif text-[#d9b56d] font-semibold tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase text-[#c1cfc7]">
              Hours
            </span>
          </div>
          <div className="text-center border-l border-[#d9b56d]/20 pl-3 sm:pl-6">
            <span className="block text-2xl sm:text-3xl font-serif text-[#d9b56d] font-semibold tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase text-[#c1cfc7]">
              Minutes
            </span>
          </div>
          <div className="text-center border-l border-[#d9b56d]/20 pl-3 sm:pl-6">
            <span className="block text-2xl sm:text-3xl font-serif text-[#d9b56d] font-semibold tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase text-[#c1cfc7]">
              Seconds
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 relative">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('prayer');
              const el = document.getElementById('prayer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#d9b56d] text-[#122e25] font-sans font-bold text-sm hover:brightness-110 transition-all shadow-md active:scale-[0.98] cursor-pointer border-0"
          >
            Watch Broadcast & Standby Music
          </button>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('organizer');
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-[#d9b56d] text-[#f8f4e9] bg-transparent font-sans font-bold text-sm hover:bg-[#d9b56d]/10 transition-colors active:scale-[0.98] cursor-pointer"
          >
            About Organizer (Germany)
          </button>

          {/* Add to Calendar Button with dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-[#d9b56d]/40 text-[#d9b56d] bg-[#05231c]/70 font-sans text-sm hover:border-[#d9b56d] transition-colors"
              aria-haspopup="true"
              aria-expanded={calendarMenuOpen}
            >
              <Calendar className="w-4 h-4" />
              <span>Add to Calendar</span>
            </button>

            {calendarMenuOpen && (
              <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-56 rounded-lg bg-[#05231c] border border-[#d9b56d]/40 shadow-2xl z-30 py-2 text-left font-sans text-xs">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCalendarMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[#f8f4e9] hover:bg-[#0c3b2f] hover:text-[#d9b56d] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#d9b56d]" />
                  <span>Google Calendar</span>
                </a>
                <button
                  onClick={() => {
                    downloadIcsFile();
                    setCalendarMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[#f8f4e9] hover:bg-[#0c3b2f] hover:text-[#d9b56d] transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-[#d9b56d]" />
                  <span>Download iCal / Outlook (.ics)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
