import React from 'react';
import snfLogo from '../assets/images/snf_germany_logo_1792075424089.jpg';
import { Globe, Users, HeartHandshake, ShieldCheck, MapPin, Award, Quote } from 'lucide-react';

interface OrganizerSectionProps {
  id?: string;
}

export const OrganizerSection: React.FC<OrganizerSectionProps> = ({ id = "organizer" }) => {
  return (
    <section id={id} className="py-16 sm:py-24 bg-[#05231c] text-[#f8f4e9] border-t border-[#d9b56d]/25 scroll-mt-14 relative overflow-hidden">
      {/* Subtle background ambient ring */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d9b56d]/5 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.22em] text-[#d9b56d] mb-2">
            Organizing Body & Worldwide Leadership
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#f8f4e9] leading-tight">
            Sree Narayana Forum for Universal Brotherhood, Germany
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#c1cfc7] font-serif leading-relaxed max-w-2xl mx-auto">
            Spearheading the global 25 October 2026 Daivadasakam prayer gathering to unite communities worldwide in the sublime philosophy of Sree Narayana Guru.
          </p>
        </div>

        {/* Highlight Card with Logo & Mission */}
        <div className="border border-[#d9b56d]/35 rounded-2xl bg-[#082f26]/80 backdrop-blur-sm p-6 sm:p-10 shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 sm:gap-10 items-center">
            {/* Logo Emblem Presentation */}
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#d9b56d]/40 via-[#f1e5ca]/30 to-[#d9b56d]/40 blur-md group-hover:blur-lg transition-all duration-300" />
                <img
                  src={snfLogo}
                  alt="Official Emblem of Sree Narayana Forum for Universal Brotherhood, Germany"
                  className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover shadow-2xl border-2 border-[#d9b56d] bg-[#f8f4e9]"
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div 
                  className="w-5 h-3.5 bg-gradient-to-b from-black via-[#dd0000] to-[#ffce00] rounded-xs border border-white/30 shadow-xs" 
                  title="Federal Republic of Germany"
                />
                <span className="text-xs font-sans font-bold tracking-wider text-[#d9b56d] uppercase">
                  Germany · Deutschland
                </span>
              </div>
              <span className="text-[11px] font-sans text-stone-400 mt-1">
                Initiative for Universal Peace & Harmony
              </span>
            </div>

            {/* Organization Narrative & Mission */}
            <div>
              <div className="flex items-center gap-2 text-xs font-sans text-[#d9b56d] uppercase tracking-wider font-semibold mb-2">
                <ShieldCheck className="w-4 h-4 text-[#d9b56d]" />
                <span>About the Conducting Organization</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#f8f4e9] font-normal leading-snug mb-3">
                Promoting Peace, Human Dignity & Brotherhood across Continents
              </h3>

              <p className="text-sm sm:text-base font-serif text-[#e0e8e3] leading-relaxed mb-3">
                The <strong>Sree Narayana Forum for Universal Brotherhood, Germany</strong> is dedicated to advancing the profound, non-dualistic humanism of Sree Narayana Guru across Germany, Europe, and the global diaspora.
              </p>

              <p className="text-sm sm:text-base font-serif text-[#c1cfc7] leading-relaxed mb-6">
                Under the leadership of Chairman <strong>Dr. Varun Radhakrishnan</strong> and guided by the timeless proclamation <em>&ldquo;One Caste, One Religion, One God for Humankind&rdquo;</em>, the Forum organizes international cultural exchange, spiritual discourses, and humanitarian outreach.
              </p>

              {/* Three Pillars Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs pt-4 border-t border-[#d9b56d]/20">
                <div className="p-3 rounded-lg bg-[#0c3b2f]/70 border border-[#d9b56d]/20">
                  <Globe className="w-4 h-4 text-[#d9b56d] mb-1.5" />
                  <strong className="block text-[#f8f4e9] mb-1">Global Reach</strong>
                  <span className="text-[#b4c4bb] leading-normal">
                    Connecting spiritual centers, diaspora associations, and seekers across continents.
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0c3b2f]/70 border border-[#d9b56d]/20">
                  <Users className="w-4 h-4 text-[#d9b56d] mb-1.5" />
                  <strong className="block text-[#f8f4e9] mb-1">Universal Unity</strong>
                  <span className="text-[#b4c4bb] leading-normal">
                    Advancing equality, inter-community harmony, and mutual respect beyond social barriers.
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0c3b2f]/70 border border-[#d9b56d]/20">
                  <HeartHandshake className="w-4 h-4 text-[#d9b56d] mb-1.5" />
                  <strong className="block text-[#f8f4e9] mb-1">Cultural Harmony</strong>
                  <span className="text-[#b4c4bb] leading-normal">
                    Fostering cultural dialogue and peace initiatives based in Germany for global welfare.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chairman Leadership Spotlight */}
        <div className="border border-[#d9b56d]/30 rounded-xl bg-gradient-to-r from-[#0c3b2f] via-[#082f26] to-[#0c3b2f] p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#d9b56d]/20 border border-[#d9b56d] flex items-center justify-center shrink-0 text-[#d9b56d]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-sans tracking-widest text-[#d9b56d] font-bold block mb-1">
                  Organization Leadership
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#f8f4e9] font-normal">
                  Dr. Varun Radhakrishnan
                </h3>
                <p className="text-xs font-sans text-[#c1cfc7]">
                  Chairman, Sree Narayana Forum for Universal Brotherhood, Germany
                </p>
              </div>
            </div>

            <div className="sm:border-l sm:border-[#d9b56d]/20 sm:pl-6 max-w-lg">
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-[#d9b56d] shrink-0 mt-1 opacity-70" />
                <p className="text-sm font-serif italic text-[#e0e8e3] leading-relaxed">
                  &ldquo;Our vision through this global Daivadasakam prayer at 7:00 PM IST is to unite human hearts worldwide, transcending all divisions in a shared resonance of peace and mutual joy.&rdquo;
                </p>
              </div>
              <span className="block mt-2 text-[11px] font-sans text-[#d9b56d] font-semibold">
                — Message from the Chairman for 25 October 2026
              </span>
            </div>
          </div>
        </div>

        {/* Coordination Notice for Global Chapters */}
        <div className="mt-8 pt-6 border-t border-[#d9b56d]/20 flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-[#c1cfc7]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d9b56d] shrink-0" />
            <span>Headquartered in Germany · Global synchronization at 7:00 PM IST (03:30 PM Germany/CEST)</span>
          </div>
          <a
            href="#join"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold hover:bg-[#e5c482] transition-colors"
          >
            <span>Connect Local Chapter</span>
          </a>
        </div>
      </div>
    </section>
  );
};
