import React, { useState } from 'react';
import { Calendar, Download, Check, ShieldCheck } from 'lucide-react';
import { EVENT_DETAILS } from '../data/verses';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import snfLogo from '../assets/images/snf_germany_logo_1792075424089.jpg';

interface EventSectionProps {
  id?: string;
}

export const EventSection: React.FC<EventSectionProps> = ({ id = "event" }) => {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleDownload = () => {
    downloadIcsFile();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#082f26] border-t border-[#d9b56d]/20 scroll-mt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#d9b56d] mb-2">
            Save the date
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#f8f4e9] leading-tight">
            About the gathering
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c1cfc7] font-serif leading-relaxed">
            A shared recitation to bring people together through the universal message of Daivadasakam.
          </p>
        </div>

        {/* Primary Event Box */}
        <div className="max-w-3xl mx-auto border border-[#d9b56d]/35 rounded-2xl p-6 sm:p-10 bg-white/[0.035] backdrop-blur-xs shadow-xl mb-12">
          {/* Conducting Organization Highlight Banner */}
          <div className="mb-6 pb-6 border-b border-[#d9b56d]/25 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={snfLogo}
              alt="Sree Narayana Forum for Universal Brotherhood, Germany"
              className="w-16 h-16 rounded-full object-cover border border-[#d9b56d] bg-[#f8f4e9] shrink-0"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-sans text-[#d9b56d] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Program Conducted & Spearheaded By</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#f8f4e9] font-normal">
                Sree Narayana Forum for Universal Brotherhood, Germany
              </h3>
              <p className="text-xs font-sans text-[#c1cfc7] mt-0.5">
                Chairman: <strong className="text-[#d9b56d] font-semibold">Dr. Varun Radhakrishnan</strong> · Connecting global chapters worldwide.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 font-serif">
            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Event</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg">
              One World, One Prayer — Global Daivadasakam Prayer
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Date & Time</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg">
              <strong className="text-[#f1e5ca]">Sunday, 25 October 2026</strong> at <span className="text-[#d9b56d] font-bold">7:00 PM IST</span> (India Time) / 03:30 PM CEST (Germany)
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Conducted By</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg font-medium text-[#f1e5ca]">
              Sree Narayana Forum for Universal Brotherhood, Germany
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Chairman</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg font-semibold text-[#d9b56d]">
              Dr. Varun Radhakrishnan
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Prayer</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg">
              Daivadasakam, composed by Sree Narayana Guru (1914)
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Purpose</dt>
            <dd className="m-0 text-[#f8f4e9] text-base sm:text-lg">
              Peace, unity, universal brotherhood, and the well-being of all creation
            </dd>

            <dt className="text-[#d9b56d] font-normal text-sm sm:text-base">Participation</dt>
            <dd className="m-0 text-[#e0e8e3] text-sm sm:text-base leading-relaxed">
              Join through your local coordinator, community prayer group, or follow the official public livestream when announced.
            </dd>
          </dl>

          {/* Quick Calendar Export Strip */}
          <div className="mt-8 pt-6 border-t border-[#d9b56d]/20 flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
            <span className="text-[#c1cfc7]">
              Synchronize this landmark gathering with your personal calendar:
            </span>
            <div className="flex items-center gap-3">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold hover:bg-[#e5c482] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </a>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#d9b56d]/60 text-[#f8f4e9] hover:bg-[#d9b56d]/15 transition-colors"
              >
                {downloaded ? <Check className="w-3.5 h-3.5 text-[#d9b56d]" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloaded ? 'Downloaded .ics' : 'Apple / Outlook (.ics)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Hub Timezones */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-serif text-[#d9b56d]">
              Coordinated Global Time Windows
            </h3>
            <p className="text-xs text-[#c1cfc7] font-sans mt-1">
              Main simultaneous recitation window on Sunday, 25 October 2026
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {EVENT_DETAILS.timezones.map((tz) => (
              <div
                key={tz.city}
                className="p-4 rounded-xl border border-[#d9b56d]/25 bg-[#05231c]/60 text-center"
              >
                <div className="text-xs font-sans text-[#c1cfc7] mb-1 font-medium">{tz.city}</div>
                <div className="text-lg font-serif text-[#d9b56d] font-semibold tabular-nums">{tz.time}</div>
                <div className="text-[10px] font-sans text-stone-400 mt-1">{tz.zone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
