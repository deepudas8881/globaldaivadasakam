import React, { useState, useEffect } from 'react';
import { DAIVADASAKAM_VERSES, Verse } from '../data/verses';
import { Play, Pause, ChevronRight, ChevronDown, Copy, Check, BookOpen, Volume2, Music } from 'lucide-react';
import { sacredAudio } from '../utils/audioDrone';

interface DaivadasakamSectionProps {
  id?: string;
}

export const DaivadasakamSection: React.FC<DaivadasakamSectionProps> = ({ id = "daivadasakam" }) => {
  const [openVerses, setOpenVerses] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false
  });
  const [viewScript, setViewScript] = useState<'all' | 'malayalam' | 'translit' | 'meaning'>('all');
  const [isChanting, setIsChanting] = useState<boolean>(false);
  const [activeChantVerse, setActiveChantVerse] = useState<number>(1);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  // Chant along stepper timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChanting) {
      timer = setInterval(() => {
        setActiveChantVerse((prev) => {
          const next = prev < 10 ? prev + 1 : 1;
          sacredAudio.playBellChime();
          setOpenVerses((current) => ({ ...current, [next]: true }));
          return next;
        });
      }, 10000); // 10 seconds per verse for chanting
    }
    return () => clearInterval(timer);
  }, [isChanting]);

  const toggleVerse = (num: number) => {
    setOpenVerses((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    DAIVADASAKAM_VERSES.forEach((v) => {
      allOpen[v.number] = true;
    });
    setOpenVerses(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<number, boolean> = {};
    DAIVADASAKAM_VERSES.forEach((v) => {
      allClosed[v.number] = false;
    });
    setOpenVerses(allClosed);
  };

  const handleStartChanting = () => {
    if (!isChanting) {
      setIsChanting(true);
      setActiveChantVerse(1);
      sacredAudio.playBellChime();
      setOpenVerses((prev) => ({ ...prev, 1: true }));
    } else {
      setIsChanting(false);
    }
  };

  const handleCopyAll = async () => {
    const text = DAIVADASAKAM_VERSES.map(
      (v) =>
        `ദൈവദശകം — ${v.titleMalayalam}\n\n${v.malayalam.join('\n')}\n\nTransliteration:\n${v.transliteration.join('\n')}\n\nMeaning:\n${v.meaning}\n`
    ).join('\n---------------------------\n\n');

    try {
      await navigator.clipboard.writeText(
        `DAIVADASAKAM (ദൈവദശകം) — Sree Narayana Guru\nOne World, One Prayer (25 October 2026)\n\n${text}`
      );
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#f8f4e9] text-[#1b2b25] scroll-mt-14 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#a37c35] mb-2">
            A prayer by Sree Narayana Guru
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#152c24] leading-tight">
            Daivadasakam
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#63756d] font-serif leading-relaxed">
            A prayer that turns our thoughts toward unity, compassion and the well-being of all.
          </p>
        </div>

        {/* Toolbar & Reading Mode Selector */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-white/80 rounded-xl border border-[#e4dccb] shadow-xs">
          {/* Script view mode toggle */}
          <div className="flex items-center gap-1 bg-[#f0eae1] p-1 rounded-lg text-xs font-sans">
            <button
              onClick={() => setViewScript('all')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewScript === 'all' ? 'bg-white text-[#152c24] shadow-xs' : 'text-[#63756d] hover:text-[#152c24]'
              }`}
            >
              Complete (Bilingual)
            </button>
            <button
              onClick={() => setViewScript('malayalam')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewScript === 'malayalam' ? 'bg-white text-[#152c24] shadow-xs' : 'text-[#63756d] hover:text-[#152c24]'
              }`}
            >
              മലയാളം മാത്രം
            </button>
            <button
              onClick={() => setViewScript('translit')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewScript === 'translit' ? 'bg-white text-[#152c24] shadow-xs' : 'text-[#63756d] hover:text-[#152c24]'
              }`}
            >
              Transliteration
            </button>
            <button
              onClick={() => setViewScript('meaning')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                viewScript === 'meaning' ? 'bg-white text-[#152c24] shadow-xs' : 'text-[#63756d] hover:text-[#152c24]'
              }`}
            >
              Meaning Only
            </button>
          </div>

          {/* Recitation actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
            <a
              href="#prayer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold hover:bg-[#e5c482] transition-colors shadow-xs"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Play Attached Song (06:37)</span>
            </a>

            <button
              onClick={handleStartChanting}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-semibold transition-all ${
                isChanting
                  ? 'bg-[#082f26] text-[#f8f4e9] border-[#082f26]'
                  : 'bg-white border-[#d9b56d] text-[#745a2a] hover:bg-[#faf6ee]'
              }`}
            >
              {isChanting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isChanting ? `Chanting Verse ${activeChantVerse}/10` : 'Chant-Along Mode'}</span>
            </button>

            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-[#63756d] hover:text-[#152c24] font-medium"
            >
              Expand All
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-[#63756d] hover:text-[#152c24] font-medium"
            >
              Collapse
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#745a2a] hover:text-[#152c24] font-medium"
              title="Copy all verses text"
            >
              {copiedState ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedState ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Chanting active alert if recitation mode is on */}
        {isChanting && (
          <div className="mb-6 p-4 rounded-xl bg-[#082f26] text-[#f8f4e9] flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-[#d9b56d] animate-pulse" />
              <div>
                <p className="text-xs uppercase font-sans tracking-widest text-[#d9b56d] font-bold">
                  Recitation Guide Active
                </p>
                <p className="text-sm font-serif">
                  Currently guiding Verse {activeChantVerse} of 10. Temple bell chimes every 10 seconds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChantVerse((prev) => (prev > 1 ? prev - 1 : 10));
                  sacredAudio.playBellChime();
                }}
                className="px-2.5 py-1 rounded bg-[#0c3b2f] hover:bg-[#124638] text-xs font-sans text-stone-200"
              >
                Prev
              </button>
              <button
                onClick={() => {
                  setActiveChantVerse((prev) => (prev < 10 ? prev + 1 : 1));
                  sacredAudio.playBellChime();
                }}
                className="px-2.5 py-1 rounded bg-[#d9b56d] hover:bg-[#e5c482] text-xs font-sans font-bold text-[#122e25]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* 10 Verses Grid / Accordion */}
        <div className="space-y-3.5">
          {DAIVADASAKAM_VERSES.map((verse: Verse) => {
            const isOpen = openVerses[verse.number] ?? false;
            const isCurrentlyChanted = isChanting && activeChantVerse === verse.number;

            return (
              <div
                key={verse.number}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isCurrentlyChanted
                    ? 'border-[#a37c35] ring-2 ring-[#d9b56d]/50 bg-amber-50/50 shadow-md'
                    : 'border-[#e4dccb] bg-white hover:border-[#cfc4b0]'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => toggleVerse(verse.number)}
                  className="w-full flex items-center justify-between p-4 sm:px-6 text-left cursor-pointer focus:outline-none select-none transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#f4ece0] text-[#745a2a] flex items-center justify-center text-xs font-bold font-sans">
                      {verse.number}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#745a2a]">
                        {verse.titleMalayalam}
                      </h3>
                      <p className="text-xs text-[#8a9991] font-sans">
                        {verse.titleEnglish}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#745a2a]">
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#f0eae1] grid gap-5">
                    {/* Malayalam Verses */}
                    {(viewScript === 'all' || viewScript === 'malayalam') && (
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#a37c35] font-sans font-semibold mb-2">
                          മലയാള മൂലരൂപം
                        </div>
                        <div className="text-lg sm:text-xl font-malayalam text-[#1e342b] leading-loose whitespace-pre-line pl-3 border-l-2 border-[#d9b56d]/50">
                          {verse.malayalam.join('\n')}
                        </div>
                      </div>
                    )}

                    {/* Transliteration */}
                    {(viewScript === 'all' || viewScript === 'translit') && (
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#8a9991] font-sans font-semibold mb-2">
                          Roman Transliteration
                        </div>
                        <div className="text-sm sm:text-base font-serif italic text-[#3c5248] leading-relaxed whitespace-pre-line pl-3 border-l-2 border-stone-200">
                          {verse.transliteration.join('\n')}
                        </div>
                      </div>
                    )}

                    {/* Poetic Meaning & Contemplation */}
                    {(viewScript === 'all' || viewScript === 'meaning') && (
                      <div className="bg-[#faf7f0] p-4 rounded-lg border border-[#e8e0d1]">
                        <div className="text-[11px] uppercase tracking-wider text-[#a37c35] font-sans font-semibold mb-1">
                          Universal Meaning & Reflection
                        </div>
                        <p className="text-sm font-serif text-[#2a3c35] leading-relaxed mb-2">
                          {verse.meaning}
                        </p>
                        <p className="text-xs text-[#6e7d76] font-sans italic">
                          Essence: {verse.contemplation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Verification Note from Original Prompt */}
        <p className="text-center text-xs text-[#6b776f] font-sans mt-8 max-w-2xl mx-auto leading-relaxed">
          Note: Please verify the displayed verse text against the approved event edition before publishing;
          replace any placeholder or variant wording with the organisers’ official text.
        </p>
      </div>
    </section>
  );
};
