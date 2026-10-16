import React from 'react';
import { ArrowUp } from 'lucide-react';
import snfLogo from '../assets/images/snf_germany_logo_1792075424089.jpg';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-14 bg-[#05231c] border-t border-[#d9b56d]/30 text-[#c5d3ca] font-sans text-xs sm:text-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Emblem Logo */}
        <div className="mb-4">
          <img
            src={snfLogo}
            alt="Sree Narayana Forum for Universal Brotherhood, Germany"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-[#d9b56d] shadow-lg bg-[#f8f4e9]"
          />
        </div>

        <strong className="text-[#d9b56d] font-serif text-xl tracking-wide block mb-1">
          Sree Narayana Forum for Universal Brotherhood, Germany
        </strong>
        <p className="text-[#f1e5ca] font-serif text-base mb-1">
          One World · One Prayer · Global Daivadasakam Prayer
        </p>
        <p className="text-stone-300 font-sans text-xs mb-1">
          Sunday, 25 October 2026 at 7:00 PM IST (03:30 PM CEST) · Worldwide Gathering
        </p>
        <p className="text-stone-300 font-sans text-xs mb-2">
          Chairman: <strong className="text-[#d9b56d] font-semibold">Dr. Varun Radhakrishnan</strong>
        </p>
        <p className="text-stone-400 text-xs max-w-lg mx-auto mb-6">
          Conducted and coordinated internationally under the eternal message of Sree Narayana Guru: 
          <em> &ldquo;One Caste, One Religion, One God for Humankind&rdquo;</em>
        </p>

        {/* Quick Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-[#d9b56d]/90 mb-8 font-medium">
          <button
            onClick={() => onNavigate ? onNavigate('prayer') : scrollToTop()}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-[#d9b56d]"
          >
            Prayer Broadcast
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate ? onNavigate('daivadasakam') : scrollToTop()}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-[#d9b56d]"
          >
            Daivadasakam Verses
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate ? onNavigate('organizer') : scrollToTop()}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-[#d9b56d]"
          >
            About Organizer (Germany)
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate ? onNavigate('event') : scrollToTop()}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-[#d9b56d]"
          >
            Event Details
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate ? onNavigate('admin') : scrollToTop()}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-[#d9b56d]"
          >
            Admin Broadcast
          </button>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d9b56d]/30 hover:border-[#d9b56d] text-xs text-[#d9b56d] transition-colors"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Return to Top</span>
        </button>

        <p className="mt-8 text-stone-500 text-[11px]">
          © 2026 Sree Narayana Forum for Universal Brotherhood, Germany. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
