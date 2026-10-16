import React, { useState } from 'react';
import { Copy, Check, ExternalLink, AlertTriangle, Video, ShieldCheck, Share2 } from 'lucide-react';

interface StudioSectionProps {
  id?: string;
}

export const StudioSection: React.FC<StudioSectionProps> = ({ id = "join" }) => {
  const [roomName, setRoomName] = useState<string>('one-world-prayer');
  const [roomPassword, setRoomPassword] = useState<string>('');
  const [generatedLinks, setGeneratedLinks] = useState<{
    guest: string;
    director: string;
    obsView: string;
  } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [activeCopiedKey, setActiveCopiedKey] = useState<string | null>(null);

  const presets = [
    { label: 'Kerala Central', slug: 'kerala-central-prayer' },
    { label: 'UAE / Dubai', slug: 'uae-dubai-prayer' },
    { label: 'UK / London', slug: 'uk-london-prayer' },
    { label: 'USA / Americas', slug: 'usa-americas-prayer' },
    { label: 'Singapore / Asia', slug: 'singapore-asia-prayer' },
    { label: 'Australia / Pacific', slug: 'australia-pacific-prayer' }
  ];

  const sanitizeRoom = (val: string): string => {
    return val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  };

  const handleGenerate = () => {
    const clean = sanitizeRoom(roomName);
    if (!clean) {
      setCopyFeedback('Please enter a room name using letters or numbers.');
      return;
    }

    setRoomName(clean);

    const guestParams = new URLSearchParams();
    guestParams.set('room', clean);
    if (roomPassword.trim()) guestParams.set('password', roomPassword.trim());
    // Audio optimization for prayer chanting
    guestParams.set('quality', '0'); // auto/good
    guestParams.set('proaudio', '1'); // high quality audio

    const directorParams = new URLSearchParams();
    directorParams.set('director', clean);
    if (roomPassword.trim()) directorParams.set('password', roomPassword.trim());

    const obsParams = new URLSearchParams();
    obsParams.set('room', clean);
    if (roomPassword.trim()) obsParams.set('password', roomPassword.trim());
    obsParams.set('view', clean);
    obsParams.set('cleanoutput', '1');

    setGeneratedLinks({
      guest: `https://vdo.ninja/?${guestParams.toString()}`,
      director: `https://vdo.ninja/?${directorParams.toString()}`,
      obsView: `https://vdo.ninja/?${obsParams.toString()}`
    });

    setCopyFeedback('Links generated successfully. Test both feeds before sharing.');
  };

  const copyToClipboard = async (text: string, label: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setActiveCopiedKey(key);
      setCopyFeedback(`${label} copied to clipboard.`);
      setTimeout(() => setActiveCopiedKey(null), 2500);
    } catch {
      setCopyFeedback('Unable to copy automatically. Please copy the link manually.');
    }
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#f8f4e9] text-[#1b2b25] scroll-mt-14 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#a37c35] mb-2">
            Remote participant studio
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#152c24] leading-tight">
            Join from your location
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#63756d] font-serif leading-relaxed">
            Generate a room link for a country or local coordinator to send a live camera and microphone feed to the event production team.
          </p>
        </div>

        {/* Studio Panel */}
        <div className="max-w-4xl mx-auto bg-[#0c3b2f] border border-[#d9b56d]/35 rounded-2xl p-6 sm:p-9 shadow-xl text-[#f8f4e9]">
          <p className="text-sm font-sans text-[#d5e1da] leading-relaxed mb-6">
            Enter a short room name, such as <strong className="text-[#d9b56d]">kerala-prayer</strong> or{' '}
            <strong className="text-[#d9b56d]">uae-prayer</strong>. The page creates links using VDO.Ninja.
            Participants need a modern browser and permission to use their camera and microphone.
          </p>

          {/* Preset Buttons */}
          <div className="mb-6">
            <span className="block text-xs font-sans text-[#f1e5ca] font-semibold mb-2">
              Quick Hub Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => {
                    setRoomName(preset.slug);
                  }}
                  className={`px-2.5 py-1 text-xs font-sans rounded-md transition-colors border ${
                    roomName === preset.slug
                      ? 'bg-[#d9b56d] text-[#122e25] font-bold border-[#d9b56d]'
                      : 'bg-[#082f26] text-[#d5e1da] border-[#d9b56d]/30 hover:bg-[#124638]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 font-sans">
            <div>
              <label htmlFor="roomName" className="block text-xs font-bold uppercase tracking-wider text-[#f1e5ca] mb-2">
                Room Name
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={60}
                autoComplete="off"
                placeholder="e.g. uae-prayer"
                className="w-full px-4 py-3 rounded-lg border border-[#8aa59a] bg-[#f9f7f0] text-[#152c24] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#d9b56d]"
              />
            </div>

            <div>
              <label htmlFor="roomPassword" className="block text-xs font-bold uppercase tracking-wider text-[#f1e5ca] mb-2">
                Optional Room Password
              </label>
              <input
                id="roomPassword"
                type="text"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                maxLength={80}
                autoComplete="new-password"
                placeholder="Leave blank if not needed"
                className="w-full px-4 py-3 rounded-lg border border-[#8aa59a] bg-[#f9f7f0] text-[#152c24] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#d9b56d]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleGenerate}
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#d9b56d] text-[#122e25] font-sans font-bold text-sm hover:brightness-110 transition-all shadow-md active:scale-95"
            >
              <Video className="w-4 h-4 mr-2" />
              <span>Generate VDO.Ninja Links</span>
            </button>

            <a
              href="https://vdo.ninja/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-[#d9b56d]/60 text-[#f8f4e9] bg-transparent font-sans font-bold text-sm hover:bg-[#d9b56d]/15 transition-colors"
            >
              <span>Open VDO.Ninja</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-80" />
            </a>
          </div>

          {/* Feedback status */}
          {copyFeedback && (
            <div className="mt-3 text-xs font-sans text-[#d9b56d]">
              {copyFeedback}
            </div>
          )}

          {/* Results Panel */}
          {generatedLinks && (
            <div className="mt-8 p-5 sm:p-6 rounded-xl bg-[#05271f] border border-[#d9b56d]/30 font-sans animate-in fade-in duration-300">
              {/* Participant Guest Link */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-[#d9b56d] flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    <span>Participant Link (Camera & Mic Feed)</span>
                  </h3>
                  <a
                    href={generatedLinks.guest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#d9b56d] hover:underline flex items-center gap-1"
                  >
                    <span>Test Feed</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-[#c1cfc7] mb-2">
                  Send this link only to the participant/coordinator who should transmit video to the room.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLinks.guest}
                    className="w-full px-3 py-2.5 rounded-md border border-[#627f72] bg-[#f8f4e9] text-[#18392d] text-xs font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedLinks.guest, 'Participant link', 'guest')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold text-xs hover:bg-[#e5c482] transition-colors"
                  >
                    {activeCopiedKey === 'guest' ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                    <span>{activeCopiedKey === 'guest' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Director Link */}
              <div className="mb-6 pt-4 border-t border-[#d9b56d]/20">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-[#f1e5ca] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#d9b56d]" />
                    <span>Director Link — Keep Private</span>
                  </h3>
                  <a
                    href={generatedLinks.director}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#d9b56d] hover:underline flex items-center gap-1"
                  >
                    <span>Open Director Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-[#c1cfc7] mb-2">
                  Share this only with the trusted production director who manages the room.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLinks.director}
                    className="w-full px-3 py-2.5 rounded-md border border-[#627f72] bg-[#f8f4e9] text-[#18392d] text-xs font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedLinks.director, 'Director link', 'director')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold text-xs hover:bg-[#e5c482] transition-colors"
                  >
                    {activeCopiedKey === 'director' ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                    <span>{activeCopiedKey === 'director' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* OBS Browser Source Link */}
              <div className="pt-4 border-t border-[#d9b56d]/20">
                <h3 className="text-sm font-bold text-[#d9b56d] mb-1">
                  OBS Studio Browser Source Link
                </h3>
                <p className="text-xs text-[#c1cfc7] mb-2">
                  Paste this link directly into OBS as a Browser Source to pull the mixed feeds directly into your broadcast scene.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLinks.obsView}
                    className="w-full px-3 py-2.5 rounded-md border border-[#627f72] bg-[#f8f4e9] text-[#18392d] text-xs font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedLinks.obsView, 'OBS link', 'obs')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#d9b56d] text-[#122e25] font-bold text-xs hover:bg-[#e5c482] transition-colors"
                  >
                    {activeCopiedKey === 'obs' ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                    <span>{activeCopiedKey === 'obs' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Container */}
          <div className="mt-8 border-l-4 border-[#d9b56d] p-4 bg-[#092d24] rounded-r-lg text-xs sm:text-sm text-[#eee4cf] leading-relaxed font-sans">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#d9b56d] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#d9b56d]">Important Production Note:</strong> VDO.Ninja is for carrying remote camera/audio feeds into a production workflow; it is not the public livestream for a large audience. The production team should collect feeds in OBS or a similar tool and send the finished programme to a scalable streaming service. Embed that service’s public player in the broadcast section above. Keep the director link private. Room passwords are a basic safeguard, not a substitute for carefully controlling who receives links.
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Production Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="border border-[#e4dccb] rounded-xl p-6 bg-white shadow-xs">
            <span className="text-xs font-bold font-sans text-[#a37c35] uppercase tracking-wider block mb-2">
              01. Coordination
            </span>
            <h3 className="text-xl font-serif text-[#152c24] mb-2 font-normal">
              Invite local coordinators
            </h3>
            <p className="text-sm font-sans text-[#63756d] leading-relaxed">
              Generate a separate room name for each location if you want to keep feeds organized. Test every participant link thoroughly before the event.
            </p>
          </div>

          <div className="border border-[#e4dccb] rounded-xl p-6 bg-white shadow-xs">
            <span className="text-xs font-bold font-sans text-[#a37c35] uppercase tracking-wider block mb-2">
              02. Mixing
            </span>
            <h3 className="text-xl font-serif text-[#152c24] mb-2 font-normal">
              Mix the programme
            </h3>
            <p className="text-sm font-sans text-[#63756d] leading-relaxed">
              The production team opens the director room and brings selected participant feeds into OBS, arranging them as a mosaic grid or showing locations one by one.
            </p>
          </div>

          <div className="border border-[#e4dccb] rounded-xl p-6 bg-white shadow-xs">
            <span className="text-xs font-bold font-sans text-[#a37c35] uppercase tracking-wider block mb-2">
              03. Public Stream
            </span>
            <h3 className="text-xl font-serif text-[#152c24] mb-2 font-normal">
              Broadcast to everyone
            </h3>
            <p className="text-sm font-sans text-[#63756d] leading-relaxed">
              Send the finished programme from OBS to your chosen public streaming provider (e.g. YouTube), then add that provider’s embed code to the livestream area.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
