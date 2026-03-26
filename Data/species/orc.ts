
import { DetailData } from '../../types';

export const orc: DetailData = { 
  name: 'Orc', 
  description: 'Guerreros de gran vitalidad y determinación. Su furia se canaliza en ráfagas de velocidad y una voluntad de hierro para no caer.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Visión en la oscuridad de 120 pies.' }, 
    { name: 'Adrenaline Rush', description: 'Acción Adicional: Tomas la acción de Correr (Dash) y ganas HP Temporales = PB. (Usos = PB/LR).' }, 
    { name: 'Relentless Endurance', description: 'Cuando caigas a 0 HP sin morir, puedes quedar a 1 HP en su lugar. (1/Descanso Largo).' }
  ],
  subspecies: []
};
