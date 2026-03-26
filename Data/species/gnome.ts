
import { DetailData } from '../../types';

export const gnome: DetailData = { 
  name: 'Gnome', 
  description: 'Mentes brillantes y curiosas. Sus linajes reflejan su conexión con la tierra o los mecanismos.', 
  size: 'Small', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Visión en la oscuridad de 60 pies.' }, 
    { name: 'Gnomish Cunning', description: 'Ventaja en salvaciones de Inteligencia, Sabiduría y Carisma contra efectos mágicos.' }
  ],
  subspecies: [
    { 
      name: 'Forest Gnome', 
      description: 'Vives en armonía con la naturaleza y las ilusiones.', 
      traits: [
        { name: 'Ilusionista Natural', description: 'Conoces el truco Minor Illusion.' },
        { name: 'Hablar con Bestias Pequeñas', description: 'Siempre tienes preparado el conjuro Speak with Animals. Puedes lanzarlo sin gastar espacios de conjuro un número de veces igual a tu PB por Descanso Largo.' }
      ] 
    },
    { 
      name: 'Rock Gnome', 
      description: 'Inventores y artesanos con gran curiosidad tecnológica.', 
      traits: [
        { name: 'Saber del Artífice', description: 'Conoces los trucos Mending y Prestidigitation.' },
        { name: 'Dispositivos de Relojería', description: 'Puedes gastar 10 min para crear un dispositivo Tiny (juguete, encendedor, música). Produce un efecto de Prestidigitation al activarse con BA. Puedes tener 3 a la vez; duran 8h.' }
      ] 
    }
  ]
};
