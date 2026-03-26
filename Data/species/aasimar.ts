
import { DetailData } from '../../types';

export const aasimar: DetailData = { 
  name: 'Aasimar', 
  description: 'Mortales con una chispa de los Planos Superiores en sus almas. Pueden manifestar esta herencia para traer curación o furia celestial.', 
  size: 'Medium or Small', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Visión en la oscuridad de 60 pies.' }, 
    { name: 'Celestial Resistance', description: 'Resistencia a daño Necrótico y Radiante.' }, 
    { name: 'Healing Hands', description: 'Acción Mágica: Toca una criatura y lanza tantos d4 como tu PB. Recupera esa vida. (1/Descanso Largo).' }, 
    { name: 'Light Bearer', description: 'Conoces el truco Light. Carisma es tu aptitud mágica para él.' }
  ],
  subspecies: [
    { 
      name: 'Heavenly Wings', 
      description: 'Manifestación de alas espectrales para el vuelo.', 
      traits: [
        { name: 'Revelación Celestial: Alas', description: 'Nivel 3+. Como Acción Adicional, te transformas por 1 min: Ganas Velocidad de Vuelo igual a tu velocidad. Una vez por turno al dañar con ataque o conjuro, infliges daño Radiante extra igual a tu PB.' }
      ] 
    },
    { 
      name: 'Inner Radiance', 
      description: 'Emanación de luz abrasadora desde tu interior.', 
      traits: [
        { name: 'Revelación Celestial: Resplandor', description: 'Nivel 3+. Como Acción Adicional, te transformas por 1 min: Emites luz brillante (10ft) y tenue (10ft extra). Al final de cada uno de tus turnos, cada criatura a 10ft recibe daño Radiante igual a tu PB. Una vez por turno al dañar, infliges daño Radiante extra igual a tu PB.' }
      ] 
    },
    { 
      name: 'Necrotic Shroud', 
      description: 'Aura de oscuridad aterradora.', 
      traits: [
        { name: 'Revelación Celestial: Sudario', description: 'Nivel 3+. Como Acción Adicional, te transformas por 1 min: Tus ojos se vuelven pozos de oscuridad y brotan alas sin plumas. Criaturas a 10ft (excepto aliados) deben superar salvación de Carisma (CD 8+CHA+PB) o quedar Asustadas hasta el final de tu siguiente turno. Una vez por turno al dañar, infliges daño Necrótico extra igual a tu PB.' }
      ] 
    }
  ]
};
