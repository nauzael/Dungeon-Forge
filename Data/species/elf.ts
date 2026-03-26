
import { DetailData } from '../../types';

export const elf: DetailData = { 
  name: 'Elf', 
  description: 'Gente mágica de gracia sobrenatural. Tus ancestros del Reino Salvaje o la Infraoscuridad definen tu herencia mágica.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Puedes ver en luz tenue hasta 60 pies como si fuera luz brillante, y en la oscuridad como si fuera luz tenue.' }, 
    { name: 'Fey Ancestry', description: 'Tienes ventaja en las tiradas de salvación que hagas para evitar o finalizar la condición Encantado. Además, la magia no puede dormirte.' }, 
    { name: 'Keen Senses', description: 'Ganas competencia en una de estas habilidades a tu elección: Perspicacia (Insight), Percepción o Supervivencia (Survival).' }, 
    { name: 'Trance', description: 'No necesitas dormir. En su lugar, meditas profundamente durante 4 horas para obtener los mismos beneficios que un humano de un descanso de 8 horas.' }
  ],
  subspecies: [
    { 
      name: 'High Elf', 
      description: 'Lazos con el Reino Salvaje y la magia arcana pura de los planos superiores.', 
      traits: [
        { name: 'Magia de Elfo Alto', description: 'Conoces el truco Prestidigitation. Siempre que termines un Descanso Largo, puedes sustituir ese truco por otro de la lista de Mago.\n\nAl nivel 3: Detect Magic.\nAl nivel 5: Misty Step.\n\nSiempre tienes estos conjuros preparados y puedes lanzarlos una vez sin gastar espacio por Descanso Largo. INT, WIS o CHA es tu aptitud mágica.' }
      ] 
    },
    { 
      name: 'Wood Elf', 
      description: 'Cazadores rápidos sintonizados con el poder de los bosques primordiales.', 
      traits: [
        { name: 'Magia de Elfo del Bosque', description: 'Conoces el truco Druidcraft.\n\nAl nivel 3: Longstrider.\nAl nivel 5: Pass without Trace.\n\nSiempre tienes estos conjuros preparados y puedes lanzarlos una vez sin gastar espacio por Descanso Largo. INT, WIS o CHA es tu aptitud mágica.' },
        { name: 'Pies Veloces', description: 'Tu velocidad al caminar aumenta a 35 pies.' }
      ] 
    },
    { 
      name: 'Drow', 
      description: 'Adaptados a la oscuridad profunda de la Underdark, con magia heredada de las sombras.', 
      traits: [
        { name: 'Magia Drow', description: 'Conoces el truco Dancing Lights.\n\nAl nivel 3: Faerie Fire.\nAl nivel 5: Darkness.\n\nSiempre tienes estos conjuros preparados y puedes lanzarlos una vez sin gastar espacio por Descanso Largo. INT, WIS o CHA es tu aptitud mágica.' },
        { name: 'Visión en la Oscuridad Superior', description: 'Tu visión en la oscuridad tiene un alcance de 120 pies.' }
      ] 
    }
  ]
};
