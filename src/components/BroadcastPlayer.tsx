import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Music, 
  RotateCcw,
  Tv,
  LayoutGrid,
  Radio,
  Lock,
  Sparkles
} from 'lucide-react';
import defaultDevotionalSong from '../assets/audio/daivadashakam.mp3';
import { MultiStreamLiveWall } from './MultiStreamLiveWall';
import { getBroadcastMode } from '../utils/streamStorage';

interface BroadcastPlayerProps {
  id?: string;
  onOpenAdmin?: () => void;
}

export const BroadcastPlayer: React.FC<BroadcastPlayerProps> = ({ id = "prayer", onOpenAdmin }) => {
  // Viewer active display view: 'live_wall' (multi-camera live screen) vs 'standby_song' (sacred chanting audio)
  const [viewerView, setViewerView] = useState<'live_wall' | 'standby_song'>('live_wall');

  // Audio player state for standby chanting mode
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(397); // 6m 37s default
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [flameFlicker, setFlameFlicker] = useState<number>(1);

  const playerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Sync mode with admin updates if changed
  useEffect(() => {
    const mode = getBroadcastMode();
    if (mode === 'standby_song') {
      setViewerView('standby_song');
    }
  }, []);

  // Gentle organic flicker effect for diya flame simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFlameFlicker(0.92 + Math.random() * 0.16);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (!audioElementRef.current) return;

    if (!isPlaying) {
      audioElementRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    } else {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!audioElementRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      audioElementRef.current.muted = false;
    } else {
      setIsMuted(true);
      audioElementRef.current.muted = true;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVol;
    }
    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
      if (!isPlaying) {
        audioElementRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section id={id} className="py-12 sm:py-16 bg-[#082f26] border-t border-[#d9b56d]/20 scroll-mt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Real Audio Element playing the attached Daivadasakam music in standby mode */}
        <audio
          ref={audioElementRef}
          src={defaultDevotionalSong}
          onTimeUpdate={() => {
            if (audioElementRef.current) {
              setCurrentTime(audioElementRef.current.currentTime);
              if (audioElementRef.current.duration && !isNaN(audioElementRef.current.duration)) {
                setDuration(audioElementRef.current.duration);
              }
            }
          }}
          onLoadedMetadata={() => {
            if (audioElementRef.current && audioElementRef.current.duration && !isNaN(audioElementRef.current.duration)) {
              setDuration(audioElementRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          preload="auto"
        />

        {/* Section Header with Mode Toggle Tabs */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-[#d9b56d] mb-2">
            Public Viewers Broadcast · Open To All Worldwide
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#f8f4e9] leading-tight">
            Global Daivadasakam Live Broadcast
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#c1cfc7] font-serif leading-relaxed">
            Sunday, 25 October 2026 · 7:00 PM IST (03:30 PM CEST). View all worldwide location feeds live, manage audio, or listen to the sacred standby chant.
          </p>

          {/* View Mode Switcher Pills */}
          <div className="mt-6 inline-flex p-1.5 rounded-xl bg-[#031d17] border border-[#d9b56d]/35 shadow-lg gap-1.5 font-sans text-xs">
            <button
              type="button"
              onClick={() => {
                setViewerView('live_wall');
                if (audioElementRef.current) audioElementRef.current.pause();
                setIsPlaying(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                viewerView === 'live_wall'
                  ? 'bg-[#d9b56d] text-[#122e25] shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-[#0c3b2f]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Multi-Location Live Wall (All Centers)</span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse ml-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setViewerView('standby_song')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                viewerView === 'standby_song'
                  ? 'bg-[#d9b56d] text-[#122e25] shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-[#0c3b2f]'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Devotional Standby Music (06:37)</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Multi-Location Live Grid Wall (onlineserver.co.in/youtube/liveall.php style) */}
        {viewerView === 'live_wall' && (
          <MultiStreamLiveWall onOpenAdmin={onOpenAdmin} />
        )}

        {/* View Mode 2: Devotional Standby Chanting Player with Golden Diya */}
        {viewerView === 'standby_song' && (
          <div 
            ref={playerRef}
            className="max-w-4xl mx-auto relative bg-[#031d17] border border-[#d9b56d]/35 rounded-2xl p-3 sm:p-5 shadow-[0_25px_60px_rgba(0,19,15,0.65)] overflow-hidden"
          >
            {/* Top Control Bar on Player */}
            <div className="flex flex-wrap items-center justify-between pb-3 px-2 text-xs font-sans text-[#c1cfc7] border-b border-[#d9b56d]/15 mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[#d9b56d] font-semibold">
                  <Music className="w-3.5 h-3.5" />
                  <span>Devotional Daivadasakam Chanting Track (06:37)</span>
                </span>
                <span className="hidden sm:inline text-stone-500">·</span>
                <span className="hidden sm:inline text-stone-400">Authentic Sacred Invocation</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerView('live_wall')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0c3b2f] hover:bg-[#124638] text-[#d9b56d] transition-colors text-xs font-bold"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Switch to Multi-Location Live Wall</span>
                </button>
              </div>
            </div>

            {/* Active Screen Area with Animated Sacred Lamp / Diya */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#051c16] via-[#092d24] to-[#041914] flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-2">
                
                {/* Glowing Sacred Lamp / Diya Animation with Sound Waves */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div 
                    className="absolute w-32 h-32 rounded-full bg-[#d9b56d]/15 blur-xl pointer-events-none transition-transform duration-300"
                    style={{ transform: `scale(${isPlaying ? flameFlicker * 1.4 : 1})` }}
                  />

                  {/* Diya SVG Icon with animated flame */}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className={`w-4 h-7 rounded-full bg-gradient-to-t from-[#e67e22] via-[#f39c12] to-[#f1c40f] blur-[0.5px] transition-all duration-200 ${
                        isPlaying ? 'opacity-100 shadow-[0_0_25px_#f39c12]' : 'opacity-70'
                      }`}
                      style={{
                        transform: `scale(${isPlaying ? flameFlicker : 1})`,
                        borderRadius: '50% 50% 30% 30% / 70% 70% 30% 30%'
                      }}
                    />
                    <svg className="w-14 h-6 text-[#d9b56d] -mt-1" viewBox="0 0 100 40" fill="currentColor">
                      <path d="M10,10 Q50,45 90,10 Q50,22 10,10 Z" opacity="0.9" />
                      <ellipse cx="50" ry="6" rx="40" fill="#bf9546" />
                    </svg>
                  </div>
                </div>

                {/* Animated Gold Frequency Equalizer bars when playing */}
                {isPlaying && (
                  <div className="flex items-end justify-center gap-1 h-5 mb-2">
                    {[12, 18, 14, 20, 16, 22, 15, 19, 13, 21, 14, 18].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#d9b56d] rounded-full transition-all duration-150 animate-pulse"
                        style={{
                          height: `${Math.max(4, (h * flameFlicker) % 22)}px`,
                          animationDelay: `${i * 70}ms`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Song Title & Tagline */}
                <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#f8f4e9] mb-1 tracking-wide">
                  Daivadasakam (ദൈവദശകം)
                </h2>
                <p className="text-xs font-sans text-[#d9b56d] uppercase tracking-widest font-semibold mb-3">
                  Official Devotional Standby Audio (06:37 Chanting)
                </p>

                {/* Play Button */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#d9b56d] text-[#122e25] font-sans font-bold text-sm hover:bg-[#e5c482] transition-transform active:scale-95 shadow-xl cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    <span>{isPlaying ? "Pause Devotional Standby Song" : "Play Devotional Standby Song"}</span>
                  </button>

                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-[#d9b56d]/50 text-[#f8f4e9] font-sans text-xs hover:bg-[#d9b56d]/15 transition-colors cursor-pointer"
                    title="Restart song from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>

              {/* Bottom Interactive Audio Scrub Bar & Controls */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex flex-col gap-1.5 text-xs font-sans text-[#c1cfc7] bg-[#031d17]/85 backdrop-blur-md px-3 py-2.5 rounded-lg border border-[#d9b56d]/25">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-[11px] font-mono tabular-nums text-stone-400 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration > 0 ? duration : 397}
                    step="0.5"
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#d9b56d]"
                    aria-label="Seek time in song"
                  />
                  <span className="text-[11px] font-mono tabular-nums text-stone-400 w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="p-1 hover:text-[#d9b56d] transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleToggleMute}
                        className="p-1 hover:text-[#d9b56d] transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#d9b56d]" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#d9b56d] hidden sm:inline-block"
                        aria-label="Volume"
                      />
                    </div>

                    <span className="text-[11px] font-serif tracking-wide hidden sm:inline text-stone-300">
                      Playing Attached Daivadasakam Chanting
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleFullscreen}
                      className="p-1 hover:text-[#d9b56d] transition-colors"
                      title="Toggle Fullscreen"
                      aria-label="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[#c1cfc7] text-xs font-sans pt-3 px-2 leading-relaxed">
              Standby player plays the devotional Daivadasakam prayer chanting song. On 25 October 2026 at 7:00 PM IST, the live global broadcast streams will air in the Multi-Location Live Wall above.
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
