import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ExternalLink, 
  Tv, 
  Music, 
  Sliders, 
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConfirmationModal } from './ConfirmationModal';
import { 
  getStreams, 
  addStream, 
  deleteStream, 
  setActiveStreamId, 
  getActiveStreamId, 
  getBroadcastMode, 
  setBroadcastMode,
  resetToGermanyOnly,
  BroadcastStream,
  MAX_STREAMS_LIMIT 
} from '../utils/streamStorage';

export const AdminBroadcastPage: React.FC = () => {
  const { isAdmin, adminUsername, loginWithCredentials, logout } = useAuth();

  // Login form state
  const [usernameInput, setUsernameInput] = useState('globaladmin');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin broadcast controls state
  const [streams, setStreams] = useState<BroadcastStream[]>([]);
  const [activeStreamId, setActiveId] = useState<string>('');
  const [broadcastMode, setMode] = useState<'standby_song' | 'live_stream'>('standby_song');
  
  // New stream inputs
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preview state
  const [previewStream, setPreviewStream] = useState<BroadcastStream | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; streamId: string | null }>({ isOpen: false, streamId: null });

  const loadData = () => {
    const list = getStreams();
    setStreams(list);
    const active = getActiveStreamId();
    setActiveId(active);
    setMode(getBroadcastMode());
    const currentActiveStream = list.find(s => s.id === active) || list[0] || null;
    setPreviewStream(currentActiveStream);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('snf-streams-updated', handleUpdate);
    return () => window.removeEventListener('snf-streams-updated', handleUpdate);
  }, [isAdmin]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    const res = await loginWithCredentials(usernameInput, passwordInput);
    setIsSubmitting(false);
    if (!res.success) {
      setLoginError(res.error || 'Login failed. Please verify username and password.');
    }
  };

  const handleAddStreamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    if (!newUrl.trim()) {
      setFormFeedback({ type: 'error', text: 'Please enter a stream URL or YouTube link.' });
      return;
    }

    const res = addStream(newTitle, newUrl, newLocation);
    if (res.success) {
      setFormFeedback({ type: 'success', text: 'Stream added successfully.' });
      setNewTitle('');
      setNewLocation('');
      setNewUrl('');
      setTimeout(() => setFormFeedback(null), 4000);
    } else {
      setFormFeedback({ type: 'error', text: res.message });
    }
  };

  const handleSelectActive = (id: string) => {
    setActiveStreamId(id);
    setActiveId(id);
    const stream = streams.find(s => s.id === id);
    if (stream) setPreviewStream(stream);
  };

  const handleDelete = (id: string) => {
    setDeleteModalState({ isOpen: true, streamId: id });
  };

  const confirmDelete = () => {
    if (deleteModalState.streamId) {
      deleteStream(deleteModalState.streamId);
      setDeleteModalState({ isOpen: false, streamId: null });
    }
  };

  const handleModeChange = (newMode: 'standby_song' | 'live_stream') => {
    setBroadcastMode(newMode);
    setMode(newMode);
  };

  // If not authenticated as Admin, show the Admin Login Panel
  if (!isAdmin) {
    return (
      <section className="py-16 sm:py-20 bg-[#082f26] border-t border-[#d9b56d]/20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-[#031d17] border border-[#d9b56d]/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#d9b56d]/15 border border-[#d9b56d]/40 flex items-center justify-center text-[#d9b56d] mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-serif text-[#f8f4e9]">Admin Broadcast Settings</h2>
              <p className="text-xs text-stone-300 font-sans mt-1">
                Enter your administrator credentials to configure live broadcast feeds and streaming URLs.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Administrator Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="globaladmin"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#f8f4e9] focus:outline-none focus:border-[#d9b56d]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#f8f4e9] focus:outline-none focus:border-[#d9b56d]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#d9b56d] text-[#122e25] font-bold text-sm hover:bg-[#e5c482] transition-colors shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
              >
                <Unlock className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Admin'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Admin is Logged In: Show Full Broadcast Settings & Stream Manager
  return (
    <section className="py-12 sm:py-16 bg-[#082f26] border-t border-[#d9b56d]/20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Admin Status Bar */}
        <div className="bg-[#031d17] border border-[#d9b56d]/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d9b56d]/15 border border-[#d9b56d]/40 flex items-center justify-center text-[#d9b56d]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif text-[#f8f4e9]">Admin Broadcast Control Panel</h1>
              <div className="flex items-center gap-2 text-xs font-sans text-stone-300">
                <span>Authenticated Admin: <strong className="text-[#d9b56d] font-bold">{adminUsername}</strong></span>
                <span className="text-stone-500">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Full Permissions Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-950/40 font-sans text-xs transition-colors"
            >
              Log Out of Admin
            </button>
          </div>
        </div>

        {/* Global Broadcast Mode Switcher */}
        <div className="bg-[#05231c] border border-[#d9b56d]/30 rounded-2xl p-5 sm:p-6 shadow-md">
          <h2 className="text-lg font-serif text-[#f8f4e9] mb-2 flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#d9b56d]" />
            <span>Viewer Broadcast Mode</span>
          </h2>
          <p className="text-xs font-sans text-stone-300 mb-4">
            Select what the public audience sees on the main <strong>Prayer Broadcast</strong> viewer page right now:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleModeChange('standby_song')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                broadcastMode === 'standby_song'
                  ? 'bg-[#0c3b2f] border-[#d9b56d] shadow-lg ring-1 ring-[#d9b56d]'
                  : 'bg-[#031d17] border-stone-700 hover:border-stone-500 opacity-80'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${broadcastMode === 'standby_song' ? 'bg-[#d9b56d] text-[#122e25]' : 'bg-stone-800 text-stone-400'}`}>
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-sans font-bold text-sm text-[#f8f4e9] flex items-center justify-between">
                  <span>Devotional Standby Song (Default)</span>
                  {broadcastMode === 'standby_song' && (
                    <span className="text-[10px] font-sans font-bold bg-[#d9b56d] text-[#122e25] px-2 py-0.5 rounded-full uppercase">
                      Live to Viewers
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-300 font-sans mt-1">
                  Plays the official 06:37 Daivadasakam prayer chanting audio with the sacred golden lamp visualizer.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('live_stream')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                broadcastMode === 'live_stream'
                  ? 'bg-[#0c3b2f] border-[#d9b56d] shadow-lg ring-1 ring-[#d9b56d]'
                  : 'bg-[#031d17] border-stone-700 hover:border-stone-500 opacity-80'
              }`}
            >
              <div className={`p-2.5 rounded-lg ${broadcastMode === 'live_stream' ? 'bg-red-500 text-white' : 'bg-stone-800 text-stone-400'}`}>
                <Tv className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-sans font-bold text-sm text-[#f8f4e9] flex items-center justify-between">
                  <span>Live Video Broadcast Stream</span>
                  {broadcastMode === 'live_stream' && (
                    <span className="text-[10px] font-sans font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase animate-pulse">
                      On Air Now
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-300 font-sans mt-1">
                  Switches all viewers directly to the active live stream video feed configured below.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Multi-Stream Configuration Section (Up to 1000 Streams) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Add Stream Form & Stream Management (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Add Stream Form Card */}
            <div className="bg-[#031d17] border border-[#d9b56d]/30 rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-serif text-[#f8f4e9] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#d9b56d]" />
                  <span>Add New Broadcast Stream</span>
                </h3>
                <span className="text-xs font-mono text-[#d9b56d] bg-[#0c3b2f] px-2 py-0.5 rounded border border-[#d9b56d]/30">
                  {streams.length} / {MAX_STREAMS_LIMIT} Streams
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans mb-4">
                Add YouTube Live URLs, YouTube Video IDs, or public broadcast feeds. Up to 1,000 streams can be maintained simultaneously.
              </p>

              {formFeedback && (
                <div className={`mb-4 p-3 rounded-lg text-xs font-sans flex items-center gap-2 ${
                  formFeedback.type === 'success' 
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' 
                    : 'bg-red-950/80 border border-red-500/50 text-red-200'
                }`}>
                  {formFeedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{formFeedback.text}</span>
                </div>
              )}

              <form onSubmit={handleAddStreamSubmit} className="space-y-3 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Stream Label / Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Frankfurt Central Ceremony Feed"
                      className="w-full px-3 py-2 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#f8f4e9] focus:outline-none focus:border-[#d9b56d]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Location / Venue City</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Frankfurt, Germany / Sivagiri, Kerala"
                      className="w-full px-3 py-2 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#f8f4e9] focus:outline-none focus:border-[#d9b56d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Stream URL / YouTube Embed URL *</label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtube.com/live/..."
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#d9b56d]/40 bg-[#082f26] text-[#f8f4e9] focus:outline-none focus:border-[#d9b56d]"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={streams.length >= MAX_STREAMS_LIMIT}
                    className="px-5 py-2.5 rounded-lg bg-[#d9b56d] text-[#122e25] font-bold text-xs hover:bg-[#e5c482] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Broadcast Stream ({streams.length}/{MAX_STREAMS_LIMIT})</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Configured Streams List Card */}
            <div className="bg-[#031d17] border border-[#d9b56d]/30 rounded-2xl p-5 sm:p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                <div>
                  <h3 className="text-base font-serif text-[#f8f4e9] flex items-center gap-2">
                    <Tv className="w-4 h-4 text-[#d9b56d]" />
                    <span>Configured Streams List ({streams.length})</span>
                  </h3>
                  <span className="text-[11px] text-stone-400 font-sans block">
                    Only Germany Central Stage is default. Additional locations appear when added.
                  </span>
                </div>

                {streams.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset streams list to show only Sree Narayana Forum Germany Central Stage?')) {
                        resetToGermanyOnly();
                      }
                    }}
                    className="text-[11px] font-sans px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition-colors"
                    title="Remove other streams and keep only Germany Central Stage"
                  >
                    Reset to Germany Only
                  </button>
                )}
              </div>

              {streams.length === 0 ? (
                <div className="p-8 text-center text-stone-400 font-sans text-xs border border-dashed border-stone-700 rounded-xl">
                  No streams added yet. Add your first stream above!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {streams.map((stream, idx) => {
                    const isSelected = stream.id === activeStreamId;
                    return (
                      <div
                        key={stream.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#0c3b2f] border-[#d9b56d] shadow-md'
                            : 'bg-[#05231c] border-stone-700 hover:border-stone-500'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-full bg-[#031d17] text-[#d9b56d] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-[#d9b56d]/30">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="font-sans font-bold text-xs text-[#f8f4e9] truncate flex items-center gap-2">
                              <span>{stream.title}</span>
                              {isSelected && (
                                <span className="bg-[#d9b56d] text-[#122e25] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                                  Primary Live
                                </span>
                              )}
                            </div>
                            {stream.location && (
                              <div className="text-[11px] text-[#d9b56d] font-sans truncate mt-0.5">
                                📍 {stream.location}
                              </div>
                            )}
                            <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                              {stream.url}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleSelectActive(stream.id)}
                            className={`px-3 py-1.5 rounded text-xs font-sans font-bold transition-colors ${
                              isSelected
                                ? 'bg-[#d9b56d] text-[#122e25]'
                                : 'bg-[#082f26] text-stone-200 hover:text-white border border-[#d9b56d]/40'
                            }`}
                          >
                            {isSelected ? '✓ Active Live' : 'Set as Active'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewStream(stream)}
                            className="p-1.5 rounded hover:bg-[#082f26] text-stone-300 hover:text-[#d9b56d] transition-colors"
                            title="Preview Stream in Admin"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(stream.id)}
                            className="p-1.5 rounded hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Stream"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <ConfirmationModal
                isOpen={deleteModalState.isOpen}
                title="Confirm Stream Deletion"
                message="Are you sure you want to permanently delete this stream configuration? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalState({ isOpen: false, streamId: null })}
              />
            </div>
          </div>

          {/* Right Column: Admin Stream Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#031d17] border border-[#d9b56d]/30 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-serif text-[#f8f4e9] flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#d9b56d]" />
                  <span>Admin Live Monitor</span>
                </h3>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#0c3b2f] text-emerald-300 border border-emerald-500/30">
                  {broadcastMode === 'live_stream' ? '● On Air' : 'Standby Mode'}
                </span>
              </div>

              {/* Preview Screen */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-stone-800 flex items-center justify-center">
                {previewStream?.embedUrl ? (
                  <iframe
                    src={previewStream.embedUrl}
                    title="Admin Stream Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 text-stone-500 font-sans text-xs">
                    No active stream selected for preview.
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 rounded-xl bg-[#082f26] border border-[#d9b56d]/20 text-xs font-sans space-y-1">
                <div className="text-stone-300 flex justify-between">
                  <span>Currently Monitored:</span>
                  <strong className="text-[#d9b56d] truncate max-w-[180px]">{previewStream?.title || 'None'}</strong>
                </div>
                <div className="text-stone-400 text-[11px] truncate font-mono">
                  {previewStream?.url || 'No URL configured'}
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-[#05231c] border border-[#d9b56d]/20 rounded-2xl p-4 text-xs font-sans text-stone-300 space-y-2">
              <div className="font-bold text-[#d9b56d]">Viewer Page Sync:</div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Changes made here immediately synchronize to the public <strong>Prayer Broadcast</strong> page viewed by devotees worldwide.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
