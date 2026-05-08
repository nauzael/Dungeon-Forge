/**
 * Componente de ejemplo que muestra el uso del sistema de temas
 * Este componente puede agregarse a la UI para permitir al usuario cambiar de tema
 */
import React, { useState } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

/**
 * Ejemplo de cómo usar el hook useThemeContext en un componente
 */
export const ThemeExample: React.FC = () => {
  const { currentTheme, setTheme, isAutoMode, setAutoMode, allThemes } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para abrir el selector */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
      >
        <span className="material-symbols-outlined">palette</span>
      </button>

      {/* Modal de selector de temas */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between" 
              style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-bold">Temas</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-surface-highlight"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modo Auto */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoMode}
                  onChange={(e) => setAutoMode(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span>Seguir tema del sistema</span>
              </label>
            </div>

            {/* Lista de temas */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {allThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id as any)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    currentTheme.id === theme.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.textPrimary,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{theme.name}</h3>
                      <p className="text-sm opacity-75">{theme.description}</p>
                    </div>
                    {currentTheme.id === theme.id && (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    )}
                  </div>
                  
                  {/* Preview de colores */}
                  <div className="flex gap-2 mt-3">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.background }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.surface }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeExample;
