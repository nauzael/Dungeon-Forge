
import { DetailData } from '../../types';

export const tiefling: DetailData = { 
  name: 'Tiefling', 
  description: 'Herederos de un linaje infernal. Tu legado determina tu resistencia y el tipo de magia que fluye por tus venas.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante.' }, 
    { name: 'Otherworldly Presence', description: 'Conoces el truco Thaumaturgy. Utilizas INT, WIS o CHA como característica de lanzamiento.' }
  ],
  subspecies: [
    { 
      name: 'Abyssal', 
      description: 'Vinculado al caos infinito y la entropía del Abismo.', 
      traits: [
        { name: 'Resistencia Abisal', description: 'Ganas resistencia permanente al daño por Veneno.' },
        { name: 'Legado Abisal', description: 'Magia innata del Abismo:\nNivel 1: Poison Spray.\nNivel 3: Ray of Sickness.\nNivel 5: Hold Person.\n\nSiempre preparados, lanzables una vez gratis por Descanso Largo. Usas INT, WIS o CHA.' }
      ] 
    },
    { 
      name: 'Chthonic', 
      description: 'Vinculado a los reinos sombríos del Hades y las profundidades del inframundo.', 
      traits: [
        { name: 'Resistencia Ctónica', description: 'Ganas resistencia permanente al daño Necrótico.' },
        { name: 'Legado Ctónico', description: 'Magia innata de las sombras:\nNivel 1: Chill Touch.\nNivel 3: False Life.\nNivel 5: Ray of Enfeeblement.\n\nSiempre preparados, lanzables una vez gratis por Descanso Largo. Usas INT, WIS o CHA.' }
      ] 
    },
    { 
      name: 'Infernal', 
      description: 'Vinculado a la jerarquía de hierro y el fuego eterno de los Nueve Infiernos.', 
      traits: [
        { name: 'Resistencia Infernal', description: 'Ganas resistencia permanente al daño por Fuego.' },
        { name: 'Legado Infernal', description: 'Magia innata del infierno:\nNivel 1: Fire Bolt.\nNivel 3: Hellish Rebuke.\nNivel 5: Darkness.\n\nSiempre preparados, lanzables una vez gratis por Descanso Largo. Usas INT, WIS o CHA.' }
      ] 
    }
  ]
};
