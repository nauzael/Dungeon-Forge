/**
 * 🔍 Debug Logger - Sistema de logging para diagnosticar problemas en producción
 *
 * Almacena eventos en memoria y localStorage para visualización en UI
 * Útil cuando no hay acceso a console (app instalada)
 */

export interface DebugEvent {
  timestamp: number;
  timestamp_iso: string;
  source: string; // [Realtime], [DM], [Supabase], etc.
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: unknown;
}

class DebugLogger {
  private events: DebugEvent[] = [];
  private maxEvents = 100; // Mantener solo últimos 100 eventos
  private storageKey = 'debug-events-log';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Registrar evento de debug
   */
  public log(
    source: string,
    message: string,
    level: 'info' | 'warn' | 'error' = 'info',
    data?: unknown
  ) {
    const event: DebugEvent = {
      timestamp: Date.now(),
      timestamp_iso: new Date().toISOString(),
      source,
      level,
      message,
      data,
    };

    // Agregar al array en memoria
    this.events.push(event);

    // Mantener límite de eventos
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Guardar en localStorage (últimos 20 eventos para no sobrecargar)
    try {
      const toStore = this.events.slice(-20);
      localStorage.setItem(this.storageKey, JSON.stringify(toStore));
    } catch {
      // localStorage lleno, ignorar
    }

    // También loguear en console para development
    console.log(`${source} [${level.toUpperCase()}] ${message}`, data || '');
  }

  /**
   * Obtener todos los eventos
   */
  public getEvents(): DebugEvent[] {
    return [...this.events];
  }

  /**
   * Obtener últimos N eventos
   */
  public getLatestEvents(count: number = 20): DebugEvent[] {
    return this.events.slice(-count);
  }

  /**
   * Limpiar eventos
   */
  public clear() {
    this.events = [];
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // ignorar
    }
  }

  /**
   * Cargar eventos desde localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.events = JSON.parse(stored) as DebugEvent[];
      }
    } catch {
      // ignorar
    }
  }

  /**
   * Obtener resumen de status actual
   */
  public getSummary() {
    return {
      totalEvents: this.events.length,
      lastEvent: this.events[this.events.length - 1] || null,
      errors: this.events.filter((e) => e.level === 'error').length,
      warnings: this.events.filter((e) => e.level === 'warn').length,
      lastError: this.events.findLast((e) => e.level === 'error'),
    };
  }
}

// Singleton
export const debugLogger = new DebugLogger();
