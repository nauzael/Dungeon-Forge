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

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { currentTheme, selectedThemeId, setTheme, isAutoMode, setAutoMode, allThemes } = useThemeContext();
  const [previewTheme, setPreviewTheme] = useState<AppTheme | null>(null);

  const handleThemeSelect = (theme: AppTheme) => {
    setPreviewTheme(theme);
  };

  const handleThemeConfirm = () => {
    if (previewTheme) {
      setTheme(previewTheme.id as any);
      setPreviewTheme(null);
    }
  };

  const handleCancel = () => {
    setPreviewTheme(null);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--border-radius-xl)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b flex items-center justify-between" 
          style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Temas
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Personaliza la apariencia
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-surface-highlight transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modo Auto */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setAutoMode(!isAutoMode)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
              isAutoMode ? 'ring-2 ring-primary' : ''
            }`}
            style={{ 
              backgroundColor: isAutoMode ? 'var(--color-primary)' + '15' : 'var(--color-background-secondary)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: isAutoMode ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {isAutoMode ? 'brightness_auto' : 'brightness_auto'}
              </span>
              <div className="text-left">
                <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Tema automático
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {isAutoMode ? 'Activo - sigue la luz del sistema' : 'Inactivo'}
                </p>
              </div>
            </div>
            <div 
              className={`w-12 h-6 rounded-full transition-colors ${isAutoMode ? 'bg-primary' : 'bg-surface-highlight'}`}
              style={{ backgroundColor: isAutoMode ? 'var(--color-primary)' : 'var(--color-surface-highlight)' }}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${isAutoMode ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Lista de Temas */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {allThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedThemeId === theme.id}
                onPreview={() => handleThemeSelect(theme)}
                onSelect={() => setTheme(theme.id as any)}
              />
            ))}
          </div>
        </div>

        {/* Preview Actions */}
        {previewTheme && (
          <div className="sticky bottom-0 px-6 py-4 border-t flex gap-3" 
            style={{ 
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: 'var(--color-surface-highlight)',
                color: 'var(--color-text-primary)',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleThemeConfirm}
              className="flex-1 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Aplicar {previewTheme.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ThemeCardProps {
  theme: AppTheme;
  isSelected: boolean;
  onPreview: () => void;
  onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onPreview, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl transition-all text-left border-2 ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-transparent hover:border-primary/50'
      }`}
      style={{ 
        backgroundColor: theme.colors.surface,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 
            className="font-bold text-lg"
            style={{ color: theme.colors.textPrimary }}
          >
            {theme.name}
          </h3>
          <p 
            className="text-sm mt-1"
            style={{ color: theme.colors.textMuted }}
          >
            {theme.description}
          </p>
        </div>
        {isSelected && (
          <span className="material-symbols-outlined text-primary">
            check_circle
          </span>
        )}
      </div>

      {/* Preview de colores */}
      <div className="flex gap-2">
        <div 
          className="w-8 h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          }}
          title="Fondo"
        />
        <div 
          className="w-8 h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border,
          }}
          title="Primario"
        />
        <div 
          className="w-8 h-8 rounded-full border-2"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
          title="Superficie"
        />
        <div 
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
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
        <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: theme.colors.success }}>
          <span className="material-symbols-outlined text-[14px]">verified</span>
          <span>WCAG {theme.id === 'high-contrast' ? 'AAA' : 'AA'} Compliant</span>
        </div>
      )}
    </button>
  );
};

export default ThemeSelector;
