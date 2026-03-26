
import React, { useState } from 'react';
import { joinParty } from '../utils/supabase';
import { Character } from '../types';

interface JoinPartyModalProps {
  character: Character;
  onClose: () => void;
  onJoined: (partyId: string) => void;
}

const JoinPartyModal: React.FC<JoinPartyModalProps> = ({ character, onClose, onJoined }) => {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!code.trim()) return;
    setIsJoining(true);
    setError('');
    const { partyId, error: joinError } = await joinParty(character, code.toUpperCase());
    
    if (partyId) {
      onJoined(partyId);
      onClose();
    } else {
      setError(joinError || 'CÓDIGO INVÁLIDO O ERROR DE CONEXIÓN.');
    }
    setIsJoining(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1e293b] dark:bg-surface-dark rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-blue-500/20 text-center animate-scaleUp">
        <div className="size-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <span className="material-symbols-outlined text-3xl">hub</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Unirse a la Party</h2>
        <p className="text-slate-400 text-xs mb-6 px-2">
          Ingresa el código que te dio tu DM para que pueda ver tus estadísticas en tiempo real.
        </p>

        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ej: DF-8291)"
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-blue-400 focus:outline-none focus:border-blue-500/50 mb-4 uppercase"
        />

        {error && <p className="text-red-500 text-[10px] mb-4 font-bold uppercase">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="py-3 rounded-xl font-bold text-xs text-slate-500 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleJoin}
            disabled={isJoining}
            className="py-3 rounded-xl font-black text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
          >
            {isJoining ? 'Uniendo...' : 'Vincular'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPartyModal;
