import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Filter, 
  Grid, 
  LayoutGrid, 
  Square, 
  Columns, 
  Search, 
  Check, 
  Radio, 
  Settings, 
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { 
  getStreams, 
  buildEmbedUrl, 
  BroadcastStream 
} from '../utils/streamStorage';

interface MultiStreamLiveWallProps {
  onOpenAdmin?: () => void;
}

type GridLayout = 'auto' | '1' | '2' | '4' | '6' | '9';

export const MultiStreamLiveWall: React.FC<MultiStreamLiveWallProps> = ({ onOpenAdmin }) => {
  const [allStreams, setAllStreams] = useState<BroadcastStream[]>([]);
  const [selectedStreamIds, setSelectedStreamIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layout, setLayout] = useState<GridLayout>('auto');
  
  // Track mute status for each stream id: { [streamId]: boolean }
  // Requirement: First video sound only in default, others muted in default
  const [muteStatus, setMuteStatus] = useState<Record<string, boolean>>({});

  // Fullscreen container ref for global full screen
  const wallContainerRef = useRef<HTMLDivElement>(null);
  const [isWallFullscreen, setIsWallFullscreen] = useState<boolean>(false);
  const [focusedStreamId, setFocusedStreamId] = useState<string | null>(null);

  // Load streams from storage
  const loadStreams = () => {
    const list = getStreams();
    setAllStreams(list);
    
    // Select all streams by default if none selected yet
    setSelectedStreamIds((prev) => {
      if (prev.length === 0) {
        return list.map((s) => s.id);
      }
      return prev;
    });

    // Default audio: first video has sound, all others are muted
    setMuteStatus((prev) => {
      if (Object.keys(prev).length === 0 && list.length > 0) {
        const initialMuteMap: Record<string, boolean> = {};
        list.forEach((s, index) => {
          initialMuteMap[s.id] = index !== 0; // index 0 is false (unmuted), all others true (muted)
        });
        return initialMuteMap;
      }
      return prev;
    });
  };

  useEffect(() => {
    loadStreams();
    const handleUpdate = () => loadStreams();
    window.addEventListener('snf-streams-updated', handleUpdate);
    return () => window.removeEventListener('snf-streams-updated', handleUpdate);
  }, []);

  // Filter streams by search and selection
  const filteredStreams = allStreams.filter((stream) => {
    const matchesSearch = 
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stream.location && stream.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const isSelected = selectedStreamIds.includes(stream.id);
    return matchesSearch && isSelected;
  });

  // Toggle selection of a location
  const toggleLocationSelection = (id: string) => {
    setSelectedStreamIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllLocations = () => {
    setSelectedStreamIds(allStreams.map((s) => s.id));
  };

  const deselectAllLocations = () => {
    setSelectedStreamIds([]);
  };

  // Sound management: Toggle mute for a specific stream
  const toggleMute = (streamId: string) => {
    setMuteStatus((prev) => ({
      ...prev,
      [streamId]: !prev[streamId]
    }));
  };

  // Solo audio: unmute this stream and mute all other streams
  const handleSoloAudio = (targetId: string) => {
    setMuteStatus(() => {
      const updated: Record<string, boolean> = {};
      allStreams.forEach((s) => {
        updated[s.id] = s.id !== targetId;
      });
      return updated;
    });
  };

  // Toggle fullscreen for individual stream card
  const handleToggleCardFullscreen = (streamId: string) => {
    const element = document.getElementById(`stream-card-${streamId}`);
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Toggle fullscreen for entire multi-stream wall
  const handleToggleWallFullscreen = () => {
    if (!wallContainerRef.current) return;
    if (!document.fullscreenElement) {
      wallContainerRef.current.requestFullscreen().catch(() => {});
      setIsWallFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsWallFullscreen(false);
    }
  };

  // Dynamic Grid Class generator based on layout selection
  const getGridClass = () => {
    if (layout === '1') return 'grid-cols-1 max-w-5xl mx-auto';
    if (layout === '2') return 'grid-cols-1 md:grid-cols-2';
    if (layout === '4') return 'grid-cols-1 sm:grid-cols-2';
    if (layout === '6') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (layout === '9') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
    
    // Auto responsive mode
    const count = filteredStreams.length;
    if (count <= 1) return 'grid-cols-1 max-w-4xl mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className="space-y-6">
      
      {/* Control Toolbar (Location Filters, Search & Grid Size) */}
      <div className="bg-[#05231c] border border-[#d9b56d]/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Left: Search & Location count info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations / feeds..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#d9b56d]/30 bg-[#082f26] text-[#f8f4e9] text-xs font-sans focus:outline-none focus:border-[#d9b56d]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-sans text-stone-300">
              <span className="font-semibold text-[#d9b56d]">
                {filteredStreams.length} of {allStreams.length}
              </span>
              <span>Locations Active</span>
            </div>
          </div>

          {/* Right: Grid Layout Switcher & Wall Fullscreen */}
          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <span className="text-stone-400 hidden sm:inline mr-1 flex items-center gap-1">
              <LayoutGrid className="w-3.5 h-3.5 text-[#d9b56d]" /> Grid:
            </span>

            {/* Layout buttons */}
            <div className="flex items-center rounded-lg bg-[#082f26] border border-[#d9b56d]/25 p-1 gap-1">
              <button
                type="button"
                onClick={() => setLayout('auto')}
                className={`px-2 py-1 rounded transition-colors ${
                  layout === 'auto' ? 'bg-[#d9b56d] text-[#122e25] font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="Auto Grid Layout"
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setLayout('1')}
                className={`px-2 py-1 rounded transition-colors ${
                  layout === '1' ? 'bg-[#d9b56d] text-[#122e25] font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="Single Screen Focus"
              >
                1x1
              </button>
              <button
                type="button"
                onClick={() => setLayout('2')}
                className={`px-2 py-1 rounded transition-colors ${
                  layout === '2' ? 'bg-[#d9b56d] text-[#122e25] font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="2 Screens Split"
              >
                1x2
              </button>
              <button
                type="button"
                onClick={() => setLayout('4')}
                className={`px-2 py-1 rounded transition-colors ${
                  layout === '4' ? 'bg-[#d9b56d] text-[#122e25] font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="4 Screens Quad Grid"
              >
                2x2
              </button>
              <button
                type="button"
                onClick={() => setLayout('6')}
                className={`px-2 py-1 rounded transition-colors ${
                  layout === '6' ? 'bg-[#d9b56d] text-[#122e25] font-bold' : 'text-stone-300 hover:text-white'
                }`}
                title="6 Screens Multi-Wall"
              >
                3x2
              </button>
            </div>

            {/* Global Wall Fullscreen Button */}
            <button
              type="button"
              onClick={handleToggleWallFullscreen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#d9b56d] hover:bg-[#d9b56d] hover:text-[#122e25] font-bold transition-all"
              title="Fullscreen Multi-Location Wall"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wall Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Location Selection Chips: Viewers can toggle what locations they want to see */}
        <div className="mt-3 pt-3 border-t border-[#d9b56d]/15 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-sans font-bold text-stone-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#d9b56d]" /> Location Feeds:
            </span>

            {allStreams.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={selectAllLocations}
                  className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#0c3b2f] hover:bg-[#124638] text-[#d9b56d] border border-[#d9b56d]/30"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={deselectAllLocations}
                  className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#0c3b2f] hover:bg-[#124638] text-stone-400 border border-stone-700"
                >
                  Clear
                </button>
                <div className="h-4 w-px bg-stone-700 mx-1 hidden sm:block" />
              </>
            )}

            {/* Individual Location Chips */}
            <div className="flex flex-wrap gap-1.5">
              {allStreams.map((stream, idx) => {
                const isChecked = selectedStreamIds.includes(stream.id);
                return (
                  <button
                    key={stream.id}
                    type="button"
                    onClick={() => toggleLocationSelection(stream.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans transition-all border ${
                      isChecked
                        ? 'bg-[#0c3b2f] border-[#d9b56d] text-[#f8f4e9] font-medium'
                        : 'bg-[#031d17] border-stone-800 text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? (idx === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-[#d9b56d]') : 'bg-stone-600'}`} />
                    <span className="truncate max-w-[150px] sm:max-w-[220px]">
                      {stream.location || stream.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {allStreams.length === 1 && (
            <span className="text-[11px] text-stone-400 font-sans italic">
              Additional location feeds appear here when created by Admin.
            </span>
          )}
        </div>
      </div>

      {/* Main Multi-Screen Grid Wall */}
      <div 
        ref={wallContainerRef} 
        className={`relative transition-all ${
          isWallFullscreen ? 'p-4 bg-[#031d17] overflow-y-auto h-screen' : ''
        }`}
      >
        {filteredStreams.length === 0 ? (
          <div className="p-16 text-center bg-[#031d17] border border-dashed border-[#d9b56d]/30 rounded-2xl text-stone-400 font-sans text-xs space-y-3">
            <Tv className="w-10 h-10 text-stone-600 mx-auto" />
            <p>No locations selected or matching your search filter.</p>
            <button
              onClick={selectAllLocations}
              className="px-4 py-2 rounded-lg bg-[#d9b56d] text-[#122e25] font-bold text-xs"
            >
              Show All Location Feeds
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-5 ${getGridClass()}`}>
            {filteredStreams.map((stream, idx) => {
              const isMuted = muteStatus[stream.id] ?? (idx !== 0); // first is unmuted by default, rest muted
              const embedUrl = buildEmbedUrl(stream.url, isMuted);

              return (
                <div
                  key={stream.id}
                  id={`stream-card-${stream.id}`}
                  className="group relative bg-[#031d17] border border-[#d9b56d]/30 hover:border-[#d9b56d]/70 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 flex flex-col"
                >
                  {/* Top Bar for each Broadcast Window */}
                  <div className="bg-[#05231c]/95 px-3 py-2 border-b border-[#d9b56d]/20 flex items-center justify-between text-xs font-sans gap-2">
                    
                    {/* Location Badge */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-[#f8f4e9] truncate block text-[11px] sm:text-xs">
                          {stream.location || stream.title}
                        </span>
                      </div>
                    </div>

                    {/* Window Controls: Mute/Unmute & Individual Fullscreen */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      
                      {/* Audio Toggle Button with default state indicator */}
                      <button
                        type="button"
                        onClick={() => toggleMute(stream.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-sans font-bold transition-all cursor-pointer ${
                          !isMuted 
                            ? 'bg-emerald-500 text-slate-950 ring-1 ring-emerald-300 shadow-sm animate-pulse' 
                            : 'bg-[#082f26] text-stone-400 hover:text-white border border-stone-700'
                        }`}
                        title={!isMuted ? "Audio Active (Click to Mute)" : "Muted in Default (Click to Unmute)"}
                      >
                        {!isMuted ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Audio ON</span>
                          </>
                        ) : (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Muted</span>
                          </>
                        )}
                      </button>

                      {/* Solo Audio Option */}
                      <button
                        type="button"
                        onClick={() => handleSoloAudio(stream.id)}
                        className="p-1 rounded bg-[#082f26] text-stone-400 hover:text-[#d9b56d] transition-colors border border-stone-700 text-[10px] hidden sm:inline-block px-1.5"
                        title="Listen only to this location (mutes all others)"
                      >
                        Solo
                      </button>

                      {/* Individual Fullscreen Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleCardFullscreen(stream.id)}
                        className="p-1 rounded bg-[#082f26] text-stone-300 hover:text-[#d9b56d] transition-colors border border-stone-700"
                        title="Fullscreen this live stream"
                        aria-label="Fullscreen this live stream"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Video Player Box */}
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={embedUrl}
                      title={stream.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Card Bottom Info Bar */}
                  <div className="bg-[#031d17] px-3 py-1.5 flex items-center justify-between text-[11px] font-sans text-stone-400 border-t border-stone-800">
                    <span className="truncate">{stream.title}</span>
                    <span className="text-[10px] text-stone-500 font-mono shrink-0">
                      Feed #{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Viewer Audio & Layout Guide Note */}
      <div className="bg-[#05231c]/70 border border-[#d9b56d]/20 rounded-xl p-3.5 text-xs font-sans text-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d9b56d] shrink-0" />
          <span>
            <strong>Audio Management:</strong> In default, only the first live video plays sound. All other location windows remain muted in default. Click <strong>&ldquo;Muted&rdquo;</strong> on any window to unmute it, or click <strong>&ldquo;Solo&rdquo;</strong> to hear that specific venue alone.
          </span>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="shrink-0 text-xs text-[#d9b56d] hover:underline flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Stream Settings</span>
          </button>
        )}
      </div>

    </div>
  );
};
