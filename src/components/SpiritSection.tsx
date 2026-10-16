import React from 'react';

export const SpiritSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#082f26] border-t border-[#d9b56d]/20 text-[#f8f4e9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Head */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#d9b56d] mb-2">
            The spirit of the prayer
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#f8f4e9] leading-tight">
            One world. One humanity.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#c1cfc7] font-serif leading-relaxed">
            May this collective prayer remind us to work for one another’s happiness and the well-being of all.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="border border-[#d9b56d]/30 rounded-2xl p-6 sm:p-8 bg-white/[0.035] hover:bg-white/[0.05] transition-colors">
            <h3 className="font-serif text-2xl font-normal text-[#d9b56d] mb-3">
              Unity
            </h3>
            <p className="text-sm font-serif text-[#d7e1da] leading-relaxed">
              Come together beyond borders, languages, ethnicities, and differences. Recognizing the single thread of consciousness uniting all humanity.
            </p>
          </article>

          <article className="border border-[#d9b56d]/30 rounded-2xl p-6 sm:p-8 bg-white/[0.035] hover:bg-white/[0.05] transition-colors">
            <h3 className="font-serif text-2xl font-normal text-[#d9b56d] mb-3">
              Compassion
            </h3>
            <p className="text-sm font-serif text-[#d7e1da] leading-relaxed">
              Let our thoughts, words, and actions contribute unconditionally to the happiness, upliftment, and relief of all living beings.
            </p>
          </article>

          <article className="border border-[#d9b56d]/30 rounded-2xl p-6 sm:p-8 bg-white/[0.035] hover:bg-white/[0.05] transition-colors">
            <h3 className="font-serif text-2xl font-normal text-[#d9b56d] mb-3">
              Participation
            </h3>
            <p className="text-sm font-serif text-[#d7e1da] leading-relaxed">
              Join through your local fellowship, temple, community center, or home sanctuary, and synchronize with the global prayer wave.
            </p>
          </article>
        </div>

        {/* Guru's timeless quote block */}
        <div className="mt-14 max-w-3xl mx-auto text-center border-t border-b border-[#d9b56d]/25 py-8 px-4">
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#f1e5ca] leading-relaxed">
            &ldquo;One Caste, One Religion, One God for humankind; <br className="hidden sm:inline" />
            Whatever one performs for one&apos;s own happiness should also yield happiness to others.&rdquo;
          </blockquote>
          <cite className="block mt-3 text-xs font-sans tracking-widest uppercase text-[#d9b56d] not-italic font-bold">
            — Sree Narayana Guru (1856 – 1928)
          </cite>
        </div>
      </div>
    </section>
  );
};
