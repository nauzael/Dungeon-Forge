
import { DetailData } from '../../types';

export const goliath: DetailData = { 
  name: 'Goliath', 
  description: 'Parientes lejanos de los gigantes, los goliats poseen una fuerza prodigiosa y una resistencia forjada en las cumbres más altas.', 
  size: 'Medium', 
  speed: 35, 
  traits: [
    { name: 'Large Form', description: 'A partir del nivel 5, como Acción Adicional, puedes volverte de tamaño Grande durante 10 minutos. Ganas ventaja en pruebas de Fuerza y tu velocidad aumenta 10 pies (1/Descanso Largo).' }, 
    { name: 'Powerful Build', description: 'Tienes ventaja en salvaciones para terminar la condición Agarrado. Cuentas como un tamaño superior para capacidad de carga.' }
  ],
  subspecies: [
    { 
      name: 'Cloud Giant', 
      description: 'Descendiente de los maestros de la niebla.', 
      traits: [{ name: 'Salto de la Nube', description: 'Como Acción Adicional, puedes teletransportarte mágicamente hasta 30 pies a un espacio que veas (usos igual a PB por Descanso Largo).' }] 
    },
    { 
      name: 'Fire Giant', 
      description: 'Descendiente de los señores de la forja.', 
      traits: [{ name: 'Quemadura del Fuego', description: 'Al golpear a un objetivo con un ataque y hacerle daño, infliges 1d10 daño de fuego extra (usos igual a PB por Descanso Largo).' }] 
    },
    { 
      name: 'Frost Giant', 
      description: 'Descendiente de los gigantes del hielo.', 
      traits: [{ name: 'Escalofrío de la Escarcha', description: 'Al golpear a un objetivo con un ataque y hacerle daño, infliges 1d6 daño de frío extra y reduces su velocidad en 10 pies hasta el inicio de tu próximo turno (usos igual a PB por Descanso Largo).' }] 
    },
    { 
      name: 'Hill Giant', 
      description: 'Descendiente de los gigantes de las colinas.', 
      traits: [{ name: 'Tropiezo de la Colina', description: 'Al golpear a una criatura de tamaño Grande o menor con un ataque y hacerle daño, puedes hacer que el objetivo quede Derribado (usos igual a PB por Descanso Largo).' }] 
    },
    { 
      name: 'Stone Giant', 
      description: 'Descendiente de los gigantes de las cavernas.', 
      traits: [{ name: 'Aguante de la Piedra', description: 'Como Reacción al recibir daño, puedes lanzar 1d12 y reducir el daño en esa cantidad + mod. Constitución (usos igual a PB por Descanso Largo).' }] 
    },
    { 
      name: 'Storm Giant', 
      description: 'Descendiente de los videntes de la tempestad.', 
      traits: [{ name: 'Trueno de la Tormenta', description: 'Como Reacción al recibir daño de una criatura a 60 pies, infliges 1d8 daño de Trueno a esa criatura (usos igual a PB por Descanso Largo).' }] 
    }
  ]
};
