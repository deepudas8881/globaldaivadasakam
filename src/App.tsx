import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OrganizerSection } from './components/OrganizerSection';
import { BroadcastPlayer } from './components/BroadcastPlayer';
import { DaivadasakamSection } from './components/DaivadasakamSection';
import { EventSection } from './components/EventSection';
import { AdminBroadcastPage } from './components/AdminBroadcastPage';
import { Footer } from './components/Footer';

export default function App() {
  // Default to public Prayer Broadcast page (Home page removed)
  const [currentPage, setCurrentPage] = useState<string>('prayer');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#082f26] text-[#f8f4e9] flex flex-col font-serif selection:bg-[#d9b56d] selection:text-[#082f26]">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* Page 1: Public Viewers Prayer Broadcast (No permission required!) */}
        {currentPage === 'prayer' && (
          <div>
            <Hero onNavigate={handleNavigate} />
            <BroadcastPlayer id="prayer" onOpenAdmin={() => setCurrentPage('admin')} />
          </div>
        )}

        {/* Page 2: Sacred Daivadasakam Verses */}
        {currentPage === 'daivadasakam' && (
          <div className="py-8">
            <DaivadasakamSection id="daivadasakam" />
          </div>
        )}

        {/* Page 3: Conducting Organizers (Germany) */}
        {currentPage === 'organizer' && (
          <div className="py-8">
            <OrganizerSection id="organizer" />
          </div>
        )}

        {/* Page 4: Event Schedule & Countdown */}
        {currentPage === 'event' && (
          <div className="py-8">
            <EventSection id="event" />
          </div>
        )}

        {/* Page 5: Admin Broadcast Settings & 1000 Streams Management */}
        {currentPage === 'admin' && (
          <div className="py-8">
            <AdminBroadcastPage />
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
