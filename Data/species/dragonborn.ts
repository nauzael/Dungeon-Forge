
import { DetailData } from '../../types';

export const dragonborn: DetailData = { 
  name: 'Dragonborn', 
  description: 'Orgullosos descendientes de dragones. Poseen un aliento elemental devastador y una resistencia innata.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Visión en la oscuridad de 60 pies.' },
    { name: 'Breath Weapon', description: 'Acción de Ataque (reemplaza un ataque): Exhala energía elemental. Daño 1d10 (escala a 2d10 en nvl 5, 3d10 en 11, 4d10 en 17). Salvación (CD 8+CON+PB) para mitad de daño. (Usos = PB por Descanso Largo).' }, 
    { name: 'Draconic Flight', description: 'Nivel 5: Como Acción Adicional, ganas alas espectrales y velocidad de vuelo igual a tu velocidad durante 10 minutos (1/Descanso Largo).' },
    { name: 'Damage Resistance', description: 'Tienes resistencia al tipo de daño asociado a tu ancestro dracónico.' }
  ],
  subspecies: [
    { name: 'Negro', description: 'Ancestro Cromático (Ácido).', traits: [{ name: 'Aliento de Ácido', description: 'Tu arma de aliento se manifiesta como una Línea de 30 pies de largo y 5 pies de ancho.' }, { name: 'Resistencia al Ácido', description: 'Ganas resistencia permanente al daño por Ácido.' }] },
    { name: 'Azul', description: 'Ancestro Cromático (Rayo).', traits: [{ name: 'Aliento de Rayo', description: 'Tu arma de aliento se manifiesta como una Línea de 30 pies de largo y 5 pies de ancho.' }, { name: 'Resistencia al Rayo', description: 'Ganas resistencia permanente al daño por Rayo.' }] },
    { name: 'Cobre', description: 'Ancestro Metálico (Ácido).', traits: [{ name: 'Aliento de Ácido', description: 'Tu arma de aliento se manifiesta como una Línea de 30 pies de largo y 5 pies de ancho.' }, { name: 'Resistencia al Ácido', description: 'Ganas resistencia permanente al daño por Ácido.' }] },
    { name: 'Bronce', description: 'Ancestro Metálico (Rayo).', traits: [{ name: 'Aliento de Rayo', description: 'Tu arma de aliento se manifiesta como una Línea de 30 pies de largo y 5 pies de ancho.' }, { name: 'Resistencia al Rayo', description: 'Ganas resistencia permanente al daño por Rayo.' }] },
    { name: 'Latón', description: 'Ancestro Metálico (Fuego).', traits: [{ name: 'Aliento de Fuego', description: 'Tu arma de aliento se manifiesta como una Línea de 30 pies de largo y 5 pies de ancho.' }, { name: 'Resistencia al Fuego', description: 'Ganas resistencia permanente al daño por Fuego.' }] },
    { name: 'Rojo', description: 'Ancestro Cromático (Fuego).', traits: [{ name: 'Aliento de Fuego', description: 'Tu arma de aliento se manifiesta como un Cono de 15 pies.' }, { name: 'Resistencia al Fuego', description: 'Ganas resistencia permanente al daño por Fuego.' }] },
    { name: 'Oro', description: 'Ancestro Metálico (Fuego).', traits: [{ name: 'Aliento de Fuego', description: 'Tu arma de aliento se manifiesta como un Cono de 15 pies.' }, { name: 'Resistencia al Fuego', description: 'Ganas resistencia permanente al daño por Fuego.' }] },
    { name: 'Verde', description: 'Ancestro Cromático (Veneno).', traits: [{ name: 'Aliento de Veneno', description: 'Tu arma de aliento se manifiesta como un Cono de 15 pies.' }, { name: 'Resistencia al Veneno', description: 'Ganas resistencia permanente al daño por Veneno.' }] },
    { name: 'Blanco', description: 'Ancestro Cromático (Frío).', traits: [{ name: 'Aliento de Frío', description: 'Tu arma de aliento se manifiesta como un Cono de 15 pies.' }, { name: 'Resistencia al Frío', description: 'Ganas resistencia permanente al daño por Frío.' }] },
    { name: 'Plata', description: 'Ancestro Metálico (Frío).', traits: [{ name: 'Aliento de Frío', description: 'Tu arma de aliento se manifiesta como un Cono de 15 pies.' }, { name: 'Resistencia al Frío', description: 'Ganas resistencia permanente al daño por Frío.' }] }
  ]
};
