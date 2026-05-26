import React, { useState } from 'react';
import { saveCharacterToCloud } from '../utils/firebase';
import { Character } from '../types';

interface Props {
  currentUserId: string;
  currentUserEmail: string | null;
  onClose: () => void;
}

interface SupabaseCharacterRow {
  id: string;
  user_id: string;
  data: Character;
  party_id: string | null;
  updated_at: string;
  deleted_at: string | null;
}

type Step = 'form' | 'preview' | 'migrating' | 'done';

interface MigrationResult {
  name: string;
  id: string;
  status: 'ok' | 'error' | 'skip';
  error?: string;
}

const MigrationTool: React.FC<Props> = ({ currentUserId, currentUserEmail, onClose }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [characters, setCharacters] = useState<SupabaseCharacterRow[]>([]);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 1000;

  // Paso 1: Leer personajes de Supabase
  const fetchFromSupabase = async () => {
    setError(null);
    const url = supabaseUrl.replace(/\/$/, '');

    if (!url || !serviceKey) {
      setError('Completa la URL y el Service Role Key.');
      return;
    }
    if (!url.includes('supabase.co') && !url.includes('supabase.io')) {
      setError('La URL no parece ser de Supabase. Ejemplo: https://xxxx.supabase.co');
      return;
    }

    try {
      let allChars: SupabaseCharacterRow[] = [];
      let page = 0;

      while (true) {
        const offset = page * PAGE_SIZE;
        const res = await fetch(
          `${url}/rest/v1/characters?select=*&deleted_at=is.null&order=id&offset=${offset}&limit=${PAGE_SIZE}`,
          {
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          const body = await res.text();
          if (res.status === 401 || res.status === 403) {
            throw new Error('Credenciales inválidas. Asegúrate de usar el Service Role Key (no la anon key).');
          }
          if (res.status === 404) {
            throw new Error('No se encontró la tabla "characters". Verifica la URL del proyecto.');
          }
          throw new Error(`Error ${res.status}: ${body}`);
        }

        const data: SupabaseCharacterRow[] = await res.json();
        allChars = allChars.concat(data);
        if (data.length < PAGE_SIZE) break;
        page++;
      }

      setCharacters(allChars);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido al conectar con Supabase.');
    }
  };

  // Paso 2: Migrar a Firebase
  const runMigration = async () => {
    setStep('migrating');
    setResults([]);
    setProgress(0);

    const migrationResults: MigrationResult[] = [];

    for (let i = 0; i < characters.length; i++) {
      const row = characters[i];
      const charData: Character = typeof row.data === 'string'
        ? JSON.parse(row.data as unknown as string)
        : row.data;

      const charName = charData?.name || row.id;

      try {
        const result = await saveCharacterToCloud(charData, currentUserId);
        if (result.error) throw result.error;
        migrationResults.push({ name: charName, id: row.id, status: 'ok' });
      } catch (e) {
        migrationResults.push({
          name: charName,
          id: row.id,
          status: 'error',
          error: e instanceof Error ? e.message : 'Error desconocido',
        });
      }

      setProgress(Math.round(((i + 1) / characters.length) * 100));
      setResults([...migrationResults]);

      // Pequeña pausa para no saturar Firestore
      if (i > 0 && i % 20 === 0) {
        await new Promise(r => setTimeout(r, 300));
      }
    }

    setStep('done');
  };

  const ok    = results.filter(r => r.status === 'ok').length;
  const errs  = results.filter(r => r.status === 'error').length;

  // Agrupar personajes por Supabase user_id para mostrar en preview
  const byUser = characters.reduce<Record<string, SupabaseCharacterRow[]>>((acc, c) => {
    acc[c.user_id] = acc[c.user_id] || [];
    acc[c.user_id].push(c);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a1a2e] shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">sync_alt</span>
            <span className="font-bold text-white">Migración Supabase → Firebase</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* PASO: FORM */}
          {step === 'form' && (
            <>
              <p className="text-sm text-white/60">
                Tus personajes de Supabase serán copiados a Firebase bajo tu cuenta actual
                {currentUserEmail ? ` (${currentUserEmail})` : ''}.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                    URL del proyecto Supabase
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={e => setSupabaseUrl(e.target.value)}
                    placeholder="https://xxxx.supabase.co"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-xs text-white/30 mt-1">
                    Supabase Dashboard → Settings → API → URL
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                    Service Role Key
                  </label>
                  <input
                    type="password"
                    value={serviceKey}
                    onChange={e => setServiceKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <p className="text-xs text-white/30 mt-1">
                    Supabase Dashboard → Settings → API → service_role (NO la anon key)
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-900/30 border border-red-500/30 px-3 py-2 text-sm text-red-300">
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">error</span>
                  {error}
                </div>
              )}

              <button
                onClick={fetchFromSupabase}
                disabled={!supabaseUrl || !serviceKey}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-black text-sm transition-colors"
              >
                Conectar y previsualizar datos
              </button>
            </>
          )}

          {/* PASO: PREVIEW */}
          {step === 'preview' && (
            <>
              {characters.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                  No se encontraron personajes en Supabase.
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-green-900/20 border border-green-500/30 px-3 py-2 text-sm text-green-300">
                    <span className="material-symbols-outlined text-sm mr-1 align-middle">check_circle</span>
                    Se encontraron <strong>{characters.length}</strong> personaje(s) en Supabase.
                    Serán migrados a tu cuenta Firebase.
                  </div>

                  {/* Lista agrupada por usuario Supabase */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(byUser).map(([uid, chars]) => (
                      <div key={uid} className="rounded-lg bg-white/5 p-3">
                        <p className="text-xs text-white/30 font-mono mb-2 truncate">
                          Supabase UID: {uid}
                        </p>
                        <div className="space-y-1">
                          {chars.map(c => {
                            const charData = typeof c.data === 'string' ? JSON.parse(c.data as unknown as string) : c.data;
                            return (
                              <div key={c.id} className="flex items-center gap-2 text-sm text-white/70">
                                <span className="material-symbols-outlined text-sm text-white/30">person</span>
                                <span className="font-medium">{charData?.name || c.id}</span>
                                <span className="text-white/30 text-xs">{charData?.class} Nv.{charData?.level}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-amber-900/20 border border-amber-500/30 px-3 py-2 text-xs text-amber-300">
                    <span className="material-symbols-outlined text-xs mr-1 align-middle">info</span>
                    Todos los personajes se asignarán a tu cuenta Firebase actual.
                    Si ya existen en Firebase, se actualizarán con los datos de Supabase.
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
                >
                  Volver
                </button>
                {characters.length > 0 && (
                  <button
                    onClick={runMigration}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-black text-sm transition-colors"
                  >
                    Migrar {characters.length} personaje(s)
                  </button>
                )}
              </div>
            </>
          )}

          {/* PASO: MIGRANDO */}
          {step === 'migrating' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>Migrando personajes...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.map(r => (
                  <div key={r.id} className="flex items-center gap-2 text-sm py-0.5">
                    {r.status === 'ok' && <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>}
                    {r.status === 'error' && <span className="material-symbols-outlined text-sm text-red-400">error</span>}
                    <span className={r.status === 'error' ? 'text-red-300' : 'text-white/70'}>{r.name}</span>
                    {r.error && <span className="text-xs text-red-400 truncate">{r.error}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO: DONE */}
          {step === 'done' && (
            <div className="space-y-4 text-center py-4">
              <span className="material-symbols-outlined text-5xl text-green-400 block">task_alt</span>
              <h3 className="font-bold text-white text-lg">¡Migración completada!</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-green-400">{ok}</p>
                  <p className="text-xs text-white/40">migrados</p>
                </div>
                {errs > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-black text-red-400">{errs}</p>
                    <p className="text-xs text-white/40">errores</p>
                  </div>
                )}
              </div>
              {errs > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 text-left">
                  {results.filter(r => r.status === 'error').map(r => (
                    <div key={r.id} className="text-xs text-red-300 bg-red-900/20 rounded px-2 py-1">
                      <strong>{r.name}:</strong> {r.error}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-white/40">
                Recarga la app para ver tus personajes migrados.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-black text-sm transition-colors"
              >
                Cerrar y recargar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MigrationTool;
