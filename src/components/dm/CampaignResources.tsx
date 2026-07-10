import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CampaignResource, Character } from '../../../types';
import { useImageZoom } from '../../../hooks/useImageZoom';
import { useDialog } from '../../../src/contexts/DialogContext';
import {
  getPartyResources,
  addPartyResource,
  deletePartyResource,
  broadcastResourceShare,
  broadcastResourceHide,
  uploadResourceImage,
  updatePartyResourcePersistence,
  migrateExistingResourceImages,
  updateResourceThumbnail,
} from '../../../utils/firebase';

const CampaignResources: React.FC<{ partyId: string; members: Character[] }> = ({ partyId, members }) => {
  const [resources, setResources] = useState<CampaignResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [activeRevealedId, setActiveRevealedId] = useState<string | null>(null);
  const [migratingCount, setMigratingCount] = useState(0);
  const [fullResolutionId, setFullResolutionId] = useState<string | null>(null); // Para cargar full res bajo demanda
  const [selectedPreviewResource, setSelectedPreviewResource] = useState<CampaignResource | null>(null);
  const previewZoom = useImageZoom({ minScale: 1, maxScale: 6, step: 0.25 });
  const dialog = useDialog();
  const [showCharSelector, setShowCharSelector] = useState<{ resource: CampaignResource } | null>(null);
  const [selectedCharIds, setSelectedCharIds] = useState<Set<string>>(new Set());
  const [revealSelections, setRevealSelections] = useState<Record<string, string[]>>({});
  const [newRes, setNewRes] = useState<{
    title: string;
    url: string;
    thumbnail_url: string;
    type: 'Map' | 'Setting' | 'NPC' | 'Item';
    description: string;
    is_persistent: boolean;
  }>({
    title: '',
    url: '',
    thumbnail_url: '',
    type: 'Setting',
    description: '',
    is_persistent: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    const data = await getPartyResources(partyId);
    setResources(data);
    setIsLoading(false);
  };

  // Auto-migrate existing images on mount
  useEffect(() => {
    fetchResources();

    // Verificar si hay recursos sin thumbnail y migrar en background
    const checkAndMigrate = async () => {
      const data = await getPartyResources(partyId);
      const unoptimized = data.filter((r) => !r.thumbnail_url);

      if (unoptimized.length > 0) {
        setMigratingCount(unoptimized.length);

        // Migrar en background
        migrateExistingResourceImages(partyId).then((result) => {
          setMigratingCount(0);
          // Refrescar recursos para ver thumbnails actualizados
          fetchResources();
        });
      }
    };

    checkAndMigrate();
  }, [partyId]);

  // Restore or reset character selections when the selector modal opens
  useEffect(() => {
    if (!showCharSelector) {
      return;
    }
    const resId = showCharSelector.resource.id!;
    const saved = revealSelections[resId];
    if (saved && saved.length > 0) {
      setSelectedCharIds(new Set(saved));
    } else {
      setSelectedCharIds(new Set());
    }
  }, [showCharSelector?.resource.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setIsUploading(true);

    try {
      const result = await uploadResourceImage(file);
      if (result) {
        setNewRes((prev) => ({
          ...prev,
          url: result.fullUrl,
          thumbnail_url: result.thumbnailUrl || prev.thumbnail_url,
        }));
      } else {
        await dialog.showAlert('Error uploading image. Check console for details.');
      }
    } catch (err) {
      await dialog.showAlert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = async () => {
    if (!newRes.title || !newRes.url) {
      await dialog.showAlert('Please add a title and upload an image.');
      return;
    }

    setIsLoading(true);
    try {
      const resourceData = {
        party_id: partyId,
        title: newRes.title,
        url: newRes.url,
        thumbnail_url: newRes.thumbnail_url || '',
        type: newRes.type || 'Setting',
        description: newRes.description || '',
        is_persistent: newRes.is_persistent !== undefined ? newRes.is_persistent : true,
      };
      const result = await addPartyResource(resourceData);
      if (result.data) {
        const savedResource = result.data;
        // Update thumbnail in background if we have one
        if (savedResource.thumbnail_url) {
          updateResourceThumbnail(savedResource.id!, savedResource.thumbnail_url);
        }
        setResources((prev) => [savedResource, ...prev]);
        fetchResources();
        setShowAdd(false);
        setNewRes({
          title: '',
          url: '',
          thumbnail_url: '',
          type: 'Setting',
          description: '',
          is_persistent: true,
        });
      } else {
        await dialog.showAlert('Failed to save resource. Check console for details.');
      }
    } catch (err) {
      await dialog.showAlert('Save failed: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealToggle = (res: CampaignResource) => {
    if (activeRevealedId === res.id) {
      broadcastResourceHide(partyId);
      setActiveRevealedId(null);
    } else {
      setShowCharSelector({ resource: res });
    }
  };

  const handleCloseCharSelector = () => {
    setShowCharSelector(null);
    setSelectedCharIds(new Set());
  };

  const handleToggleChar = (charId: string) => {
    setSelectedCharIds((prev) => {
      const next = new Set(prev);
      if (next.has(charId)) {
        next.delete(charId);
      } else {
        next.add(charId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (!showCharSelector) return;
    const allIds = members.map((m) => m.id);
    setSelectedCharIds((prev) => {
      if (prev.size === 0 || allIds.some((id) => !prev.has(id))) {
        return new Set(allIds);
      }
      return new Set();
    });
  };

  const handleRevealToSelected = () => {
    if (!showCharSelector) return;
    const res = showCharSelector.resource;
    const charIds = Array.from(selectedCharIds);
    broadcastResourceShare(partyId, {
      url: res.url,
      title: res.title,
      description: res.description,
    }, charIds);
    setRevealSelections((prev) => ({ ...prev, [res.id!]: charIds }));
    setActiveRevealedId(res.id!);
    setShowCharSelector(null);
    setSelectedCharIds(new Set());
  };

  const handleRevealToAll = () => {
    if (!showCharSelector) return;
    const res = showCharSelector.resource;
    broadcastResourceShare(partyId, {
      url: res.url,
      title: res.title,
      description: res.description,
    });
    setRevealSelections((prev) => {
      const next = { ...prev };
      delete next[res.id!];
      return next;
    });
    setActiveRevealedId(res.id!);
    setShowCharSelector(null);
    setSelectedCharIds(new Set());
  };

  const handlePersistenceToggle = async (res: CampaignResource) => {
    const newStatus = !res.is_persistent;
    const success = await updatePartyResourcePersistence(res.id!, newStatus);
    if (success) {
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, is_persistent: newStatus } : r))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (await dialog.showConfirm('Delete this resource permanently?')) {
      const success = await deletePartyResource(id);
      if (success) {
        setResources((prev) => prev.filter((r) => r.id !== id));
        if (activeRevealedId === id) {
          broadcastResourceHide(partyId);
          setActiveRevealedId(null);
        }
      }
    }
  };

  const handleViewHD = (res: CampaignResource) => {
        // Toggle: if already loading HD, switch back to thumbnail
    if (fullResolutionId === res.id) {
      setFullResolutionId(null);
    } else {
      setFullResolutionId(res.id!);
    }
  };

        // Get the correct URL (thumbnail or full)
  const getDisplayUrl = (res: CampaignResource) => {
        // If user requested HD or no thumbnail, use full
    if (fullResolutionId === res.id || !res.thumbnail_url) {
      return res.url;
    }
        // Use thumbnail for fast loading
    return res.thumbnail_url;
  };

  return (
    <>
    <div
      className="space-y-6"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchCancel={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black italic uppercase tracking-tight text-white/90 leading-none">
            Scenario Management
          </h2>
          <p className="text-[9px] font-black uppercase text-blue-400 tracking-tighter">
            Campaign Tactical Atlas
          </p>
          {migratingCount > 0 && (
            <p className="text-[8px] text-amber-400 font-bold animate-pulse">
              Optimizing {migratingCount} images...
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="size-10 rounded-radius-pill bg-blue-600 flex items-center justify-center border-4 border-[#0f172a] shadow-elev-modal shadow-blue-500/20 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-white">add</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-800/80 backdrop-blur-md rounded-radius-xl p-5 border border-blue-500/20 space-y-4 animate-slideDown shadow-2xl">
          <h3 className="text-sm font-black uppercase text-blue-400">Archive New Resource</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title (e.g. Tavern Map)"
              value={newRes.title}
              onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-radius-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video border-2 border-dashed rounded-radius-lg flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${newRes.url ? 'border-emerald-500/50' : 'border-white/10 hover:border-blue-500/30'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {newRes.thumbnail_url ? (
                <>
                  <img
                    src={newRes.thumbnail_url}
                    className="w-full h-full object-cover opacity-40"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-400 text-3xl">
                      check_circle
                    </span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase mt-2">
                      Optimized
                    </span>
                  </div>
                </>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 animate-spin text-3xl">
                    sync
                  </span>
                  <span className="text-[10px] font-black text-blue-400 uppercase">
                    Optimizing...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-3xl">
                    add_photo_alternate
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase text-center px-4">
                    Tap to upload image
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {(['Map', 'Setting', 'NPC', 'Item'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewRes({ ...newRes, type: t })}
                  className={`flex-1 py-2 rounded-radius-md text-[8px] font-black uppercase tracking-tighter border transition-all ${newRes.type === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  {t === 'Map' ? 'Map' : t === 'Setting' ? 'Setting' : t}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-radius-lg border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-white leading-none">
                  Auto Persistence
                </span>
                <p className="text-[8px] text-slate-500 uppercase font-bold">
                  Appears in Players' Notes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewRes({ ...newRes, is_persistent: !newRes.is_persistent })}
                className={`w-10 h-5 rounded-radius-pill transition-colors relative ${newRes.is_persistent ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div
                  className={`absolute top-1 size-3 rounded-radius-pill bg-white transition-all ${newRes.is_persistent ? 'right-1' : 'left-1'}`}
                ></div>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-radius-lg"
              >
                Cancel
              </button>
              <button
                disabled={isLoading || isUploading}
                onClick={handleAdd}
                className={`flex-1 py-3 text-white font-bold uppercase text-[10px] tracking-widest rounded-radius-lg shadow-elev-modal transition-all ${isLoading || isUploading ? 'bg-slate-700' : 'bg-blue-600'}`}
              >
                {isLoading ? 'Saving...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 pb-20">
        {resources.length === 0 && !isLoading && (
          <div className="text-center py-20 text-slate-600 italic font-medium">
            Atlas empty. Add maps or reference scenes.
          </div>
        )}
        {resources.map((res) => (
          <div
            key={res.id}
            className="group bg-[#1e293b] rounded-radius-2xl overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-blue-500/20"
          >
            <div
              className="h-48 relative overflow-hidden cursor-zoom-in"
              onClick={() => {
                setSelectedPreviewResource(res);
                previewZoom.resetZoom();
              }}
            >
              <img
                src={getDisplayUrl(res)}
                alt={res.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-motion-hp"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-black/60 backdrop-blur-md text-[8px] font-black uppercase text-blue-400 px-2 py-1 rounded-radius-pill border border-blue-500/20 tracking-widest w-fit">
                  {res.type}
                </span>
                {activeRevealedId === res.id && (
                  <span className="bg-red-500/80 backdrop-blur-md text-[8px] font-black uppercase text-white px-2 py-1 rounded-radius-pill border border-red-400/20 tracking-widest flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-[10px]">sensors</span> LIVE
                  </span>
                )}
                {res.is_optimizing && (
                  <span className="bg-amber-500/80 backdrop-blur-md text-[8px] font-black uppercase text-white px-2 py-1 rounded-radius-pill border border-amber-400/20 tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] animate-spin">sync</span>{' '}
                    Optimizing
                  </span>
                )}
              </div>

              {/* Badge para indicar que hay HD disponible */}
              {res.thumbnail_url && fullResolutionId !== res.id && (
                <button
                  onClick={() => handleViewHD(res)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[8px] font-black uppercase text-white px-2 py-1 rounded-radius-pill border border-white/20 tracking-widest flex items-center gap-1 hover:bg-black/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[10px]">hd</span> Ver HD
                </button>
              )}

              {/* Badge para indicar que se muestra HD */}
              {fullResolutionId === res.id && (
                <button
                  onClick={() => handleViewHD(res)}
                  className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-md text-[8px] font-black uppercase text-white px-2 py-1 rounded-radius-pill border border-blue-400/20 tracking-widest flex items-center gap-1 hover:bg-blue-600/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[10px]">hd</span> HD
                </button>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight drop-shadow-elev-modal">
                  {res.title}
                </h3>
              </div>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2 bg-slate-900/50">
              {/* REVEAL / HIDE BUTTON */}
              <button
                onClick={() => handleRevealToggle(res)}
                className={`flex flex-col items-center justify-center p-3 rounded-radius-xl border transition-all active:scale-95 ${activeRevealedId === res.id ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                <span className="material-symbols-outlined text-xl mb-1">
                  {activeRevealedId === res.id ? 'visibility_off' : 'visibility'}
                </span>
                <span className="text-[8px] font-black uppercase tracking-tighter">
                  {activeRevealedId === res.id ? 'Hide' : 'Reveal'}
                </span>
              </button>

              {/* PERSISTENCE BUTTON (SHARE) */}
              <button
                onClick={() => handlePersistenceToggle(res)}
                className={`flex flex-col items-center justify-center p-3 rounded-radius-xl border transition-all active:scale-95 ${res.is_persistent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 text-slate-500 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
              >
                <span className="material-symbols-outlined text-xl mb-1">
                  {res.is_persistent ? 'auto_stories' : 'share'}
                </span>
                <span className="text-[8px] font-black uppercase tracking-tighter">
                  {res.is_persistent ? 'Shared' : 'Share'}
                </span>
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(res.id!)}
                className="flex flex-col items-center justify-center p-3 rounded-radius-xl bg-white/5 border border-white/5 text-slate-500 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-xl mb-1">delete</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {selectedPreviewResource && createPortal(
      <div
        className="fixed inset-0 z-[220] bg-black/90 flex items-center justify-center"
        onClick={() => {
          setSelectedPreviewResource(null);
          previewZoom.resetZoom();
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-full flex flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3 gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-radius-pill bg-blue-600/90 text-[8px] font-black uppercase text-white tracking-widest">
                {selectedPreviewResource.type}
              </span>
              <h3 className="text-sm font-black uppercase italic text-white tracking-tight truncate">
                {selectedPreviewResource.title}
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedPreviewResource(null);
                previewZoom.resetZoom();
              }}
              className="w-10 h-10 rounded-radius-pill bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>

          <div
            ref={previewZoom.viewportRef}
            className="flex-1 flex items-center justify-center overflow-hidden rounded-radius-xl touch-none cursor-grab active:cursor-grabbing"
            onTouchStart={previewZoom.handleTouchStart}
            onTouchMove={previewZoom.handleTouchMove}
            onTouchEnd={previewZoom.handleTouchEnd}
            onWheel={previewZoom.handleWheel}
            onMouseDown={previewZoom.handleMouseDown}
            onMouseMove={previewZoom.handleMouseMove}
            onMouseUp={previewZoom.handleMouseUp}
            onMouseLeave={previewZoom.handleMouseUp}
          >
            <div ref={previewZoom.contentRef} style={previewZoom.transformStyle}>
              <img
                src={selectedPreviewResource.url}
                className="max-w-[92vw] max-h-[calc(100vh-9rem)] object-contain rounded-radius-md select-none"
                alt={selectedPreviewResource.title}
                draggable={false}
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={previewZoom.zoomOut}
              className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40"
            >
              <span className="material-symbols-outlined text-2xl">remove</span>
            </button>
            <span className="text-white text-sm font-bold min-w-[70px] text-center">{Math.round(previewZoom.scale * 100)}%</span>
            <button
              onClick={previewZoom.zoomIn}
              className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
            <button
              onClick={previewZoom.resetZoom}
              className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40 ml-2"
            >
              <span className="material-symbols-outlined text-2xl">fit_screen</span>
            </button>
          </div>
          <p className="text-white/50 text-xs text-center mt-2">Pinch o doble toque para zoom, arrastra para moverte</p>
        </div>
      </div>,
      document.body
    )}

    {showCharSelector && createPortal(
      <div
        className="fixed inset-0 z-[240] bg-black/80 flex items-center justify-center p-4"
        onClick={handleCloseCharSelector}
      >
        <div
          className="w-full max-w-sm bg-slate-900 rounded-radius-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-lg">visibility</span>
              Reveal to Characters
            </h3>
            <button
              onClick={handleCloseCharSelector}
              className="size-8 rounded-radius-pill bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white text-lg">close</span>
            </button>
          </div>

          {/* Toggle All / None */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
              {selectedCharIds.size} of {members.length} selected
            </span>
            <button
              onClick={handleToggleAll}
              className="text-[9px] font-black uppercase text-blue-400 tracking-tighter hover:text-blue-300 transition-colors"
            >
              {selectedCharIds.size === members.length ? 'None' : 'All'}
            </button>
          </div>

          {/* Character list */}
          <div className="max-h-[50vh] overflow-y-auto overscroll-contain divide-y divide-white/5">
            {members.map((member) => {
              const isSelected = selectedCharIds.has(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => handleToggleChar(member.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors active:bg-white/10 text-left"
                >
                  <div
                    className={`size-10 rounded-radius-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-white/5 border-white/10 text-slate-600'
                    }`}
                  >
                    {isSelected ? (
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    ) : member.imageUrl ? (
                      <img src={member.imageUrl} alt="" className="w-full h-full object-cover rounded-radius-lg" />
                    ) : (
                      <span className="material-symbols-outlined text-lg">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight truncate ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {member.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-600 truncate">
                      {member.class} · Lv{member.level}
                    </p>
                  </div>
                  <div
                    className={`size-5 rounded-radius-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-white text-[10px]">check</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 border-t border-white/10">
            <button
              onClick={handleCloseCharSelector}
              className="flex-1 py-3 bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-radius-lg hover:bg-white/10 transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleRevealToSelected}
              disabled={selectedCharIds.size === 0}
              className={`flex-1 py-3 text-white font-bold uppercase text-[10px] tracking-widest rounded-radius-lg transition-all active:scale-95 ${
                selectedCharIds.size === 0
                  ? 'bg-slate-700 text-slate-500'
                  : 'bg-emerald-600 shadow-elev-modal shadow-emerald-500/20'
              }`}
            >
              {selectedCharIds.size === 0 ? 'Select Characters' : `Reveal to ${selectedCharIds.size}`}
            </button>
            <button
              onClick={handleRevealToAll}
              className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-radius-lg shadow-elev-modal shadow-blue-500/20 transition-all active:scale-95"
            >
              All
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default CampaignResources;
