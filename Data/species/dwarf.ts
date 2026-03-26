
import { DetailData } from '../../types';

export const dwarf: DetailData = { 
  name: 'Dwarf', 
  description: 'Resistentes y vinculados a la piedra. Los enanos de 2024 son más duros y perceptivos que nunca.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Visión en la oscuridad superior de 120 pies.' }, 
    { name: 'Dwarven Resilience', description: 'Resistencia a daño por Veneno. Ventaja en salvaciones contra la condición Envenenado.' }, 
    { name: 'Dwarven Toughness', description: 'Tu máximo de HP aumenta en 1 por cada nivel que poseas.' }, 
    { name: 'Stonecunning', description: 'Acción Adicional: Ganas Sentido de la Vibración (Tremorsense) de 60ft sobre piedra por 10 min. (Usos = PB/LR).' }
  ],
  subspecies: []
};
