import React, { useState } from 'react';
import { Menu, X, Radio, Lock } from 'lucide-react';
import snfLogo from '../assets/images/snf_germany_logo_1792075424089.jpg';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Top navigation items without 'Home'
  const navItems = [
    { id: 'prayer', label: 'Prayer Broadcast' },
    { id: 'daivadasakam', label: 'Daivadasakam' },
    { id: 'organizer', label: 'Organizers (Germany)' },
    { id: 'event', label: 'Event Schedule' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#05231c]/95 border-b border-[#d9b56d]/30 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Wordmark with Logo Emblem (links to prayer broadcast viewer page) */}
          <button
            onClick={() => onNavigate('prayer')}
            className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-wider text-[#d9b56d] font-display whitespace-nowrap shrink-0 hover:text-[#f1e5ca] transition-colors bg-transparent border-0 cursor-pointer text-left"
          >
            <img
              src={snfLogo}
              alt="Sree Narayana Forum for Universal Brotherhood, Germany"
              className="w-9 h-9 rounded-full object-cover border border-[#d9b56d]/70 shadow-sm bg-[#f8f4e9]"
            />
            <span className="hidden sm:inline">ONE WORLD · ONE PRAYER</span>
            <span className="sm:hidden">ONE PRAYER</span>
          </button>

          {/* Navigation Links for Public Viewers */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-sans">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer bg-transparent border-0 font-medium ${
                  currentPage === item.id 
                    ? 'text-[#d9b56d] font-bold border-b-2 border-[#d9b56d]' 
                    : 'text-[#f5eddb] hover:text-[#d9b56d]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Admin Broadcast Settings */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('admin')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold font-sans rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer border ${
                currentPage === 'admin'
                  ? 'bg-[#d9b56d] text-[#122e25] border-[#d9b56d]'
                  : 'bg-[#0c3b2f] text-[#f8f4e9] hover:bg-[#124638] border-[#d9b56d]/40'
              }`}
              title="Admin Broadcast Settings"
            >
              <Lock className="w-3.5 h-3.5 text-[#d9b56d]" />
              <span>Admin Broadcast</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#d9b56d] hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#d9b56d]/20 flex flex-col gap-2 font-sans text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.id);
                }}
                className={`text-left py-2.5 px-3 rounded transition-colors bg-transparent border-0 cursor-pointer ${
                  currentPage === item.id ? 'bg-[#0c3b2f] text-[#d9b56d] font-bold' : 'text-[#f5eddb] hover:bg-[#0c3b2f]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin');
              }}
              className="mt-2 w-full py-2.5 text-xs font-bold text-[#122e25] bg-[#d9b56d] rounded-md flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Broadcast Control</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
