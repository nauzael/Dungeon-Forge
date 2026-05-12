/**
 * Componente de prueba para diagnosticar problemas de Theme
 */
import React from 'react';

const ThemeTest: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-lg z-[999] text-xs">
      <div>🎨 Theme System Loaded</div>
      <div>CSS Vars Available: {getCSSVariables()}</div>
    </div>
  );
};

function getCSSVariables(): string {
  const root = document.documentElement;
  const bg = getComputedStyle(root).getPropertyValue('--color-background');
  return bg ? 'YES' : 'NO';
}

export default ThemeTest;
