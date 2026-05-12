/**
 * Componente ThemeSelector
 * Permite al usuario seleccionar y cambiar entre temas
 */
import React, { useState } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { AppTheme } from '../types/theme';

interface ThemeSelectorProps {
  onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { currentTheme, selectedThemeId, setTheme, isAutoMode, setAutoMode, allThemes } = useThemeContext();
  const [previewTheme, setPreviewTheme] = useState<AppTheme | null>(null);

  const handleThemeSelect = (theme: AppTheme) => {
    setTheme(theme.id as any);
    setPreviewTheme(null);
    onClose?.();
  };

  const handleCancel = () => {
    setPreviewTheme(null);
    onClose?.();
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleCancel}
    >
      <div 
        className="w-full max-w-sm bg-surface rounded-2xl md:rounded-2xl shadow-2xl overflow-hidden animate-slideUp max-h-[85vh] md:max-h-auto flex flex-col"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-xl)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between bg-surface" 
          style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-lg md:text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Temas
            </h2>
            <p className="text-xs md:text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Personaliza la apariencia
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 md:p-2 rounded-full hover:bg-surface-highlight transition-colors shrink-0"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Contenido Scrolleable */}
        <div className="overflow-y-auto flex-1">
          {/* Modo Auto */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setAutoMode(!isAutoMode)}
              className={`w-full flex items-center justify-between p-2.5 md:p-3 rounded-lg transition-all ${
                isAutoMode ? 'ring-2 ring-primary' : ''
              }`}
              style={{ 
                backgroundColor: isAutoMode ? 'var(--color-primary)' + '15' : 'var(--color-background-secondary)',
              }}
            >
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <span className="material-symbols-outlined text-sm md:text-base shrink-0" style={{ color: isAutoMode ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  brightness_auto
                </span>
                <div className="text-left min-w-0">
                  <p className="font-medium text-sm md:text-base" style={{ color: 'var(--color-text-primary)' }}>
                    Automático
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {isAutoMode ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>
              <div 
                className={`w-10 h-5 rounded-full transition-colors shrink-0 ${isAutoMode ? 'bg-primary' : 'bg-surface-highlight'}`}
                style={{ backgroundColor: isAutoMode ? 'var(--color-primary)' : 'var(--color-surface-highlight)' }}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${isAutoMode ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          {/* Lista de Temas */}
          <div className="px-4 md:px-6 py-3 md:py-4 space-y-2 md:space-y-3">
            {allThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedThemeId === theme.id}
                onSelect={() => handleThemeSelect(theme)}
              />
            ))}
          </div>
        </div>

        {/* Footer - Info de cierre */}
        <div className="px-4 md:px-6 py-2 text-center border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Toca fuera o usa el botón X para cerrar
          </p>
        </div>
      </div>
    </div>
  );
};

interface ThemeCardProps {
  theme: AppTheme;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 md:p-4 rounded-lg transition-all text-left border-2 active:scale-95 ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-transparent hover:border-primary/50'
      }`}
      style={{ 
        backgroundColor: theme.colors.surface,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 
            className="font-bold text-sm md:text-base"
            style={{ color: theme.colors.textPrimary }}
          >
            {theme.name}
          </h3>
          <p 
            className="text-xs md:text-sm mt-0.5"
            style={{ color: theme.colors.textMuted }}
          >
            {theme.description}
          </p>
        </div>
        {isSelected && (
          <span className="material-symbols-outlined text-base shrink-0" style={{ color: 'var(--color-primary)' }}>
            check_circle
          </span>
        )}
      </div>

      {/* Preview de colores */}
      <div className="flex gap-1.5 md:gap-2">
        <div 
          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          }}
          title="Fondo"
        />
        <div 
          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border,
          }}
          title="Primario"
        />
        <div 
          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
          title="Superficie"
        />
        <div 
          className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center"
          style={{ 
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.border,
          }}
          title="Texto"
        >
          <span 
            className="text-xs font-bold"
            style={{ color: theme.colors.textPrimary }}
          >
            A
          </span>
        </div>
      </div>

      {/* Badge de accesibilidad */}
      {theme.wcagCompliant && (
        <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: theme.colors.success }}>
          <span className="material-symbols-outlined text-[12px] md:text-[14px]">verified</span>
          <span>WCAG {theme.id === 'high-contrast' ? 'AAA' : 'AA'}</span>
        </div>
      )}
    </button>
  );
};

export default ThemeSelector;
