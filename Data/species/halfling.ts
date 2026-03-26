
import { DetailData } from '../../types';

export const halfling: DetailData = { 
  name: 'Halfling', 
  description: 'Pequeños, valientes y bendecidos con una suerte legendaria que les permite evitar el desastre.', 
  size: 'Small', 
  speed: 30, 
  traits: [
    { name: 'Brave', description: 'Ventaja en salvaciones para evitar o terminar la condición Asustado.' }, 
    { name: 'Halfling Nimbleness', description: 'Puedes moverte a través del espacio de cualquier criatura que sea un tamaño mayor que tú.' }, 
    { name: 'Luck', description: 'Cuando saques un 1 en un dado de d20 para una Prueba (D20 Test), puedes volver a lanzar el dado y debes usar el nuevo resultado.' },
    { name: 'Naturally Stealthy', description: 'Puedes realizar la acción de Esconderte incluso cuando solo estás oculto por una criatura un tamaño mayor que tú.' }
  ],
  subspecies: []
};
