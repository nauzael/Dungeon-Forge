export interface CriticalEffect {
  roll: number;
  physical: string;
  magic: string;
}

export const CRITICAL_TABLE: CriticalEffect[] = [
  { roll: 1, physical: "Golpe Preciso: Haces el daño máximo posible con tu arma sin necesidad de tirar el dado de daño base.", magic: "Eco Arcano: La magia resuena; el hechizo se repite una vez más en el mismo turno sin gastar acción." },
  { roll: 2, physical: "Sangrado profuso: Provocas una herida grave. El enemigo sufre 1d6 de daño extra al inicio de su turno.", magic: "Vínculo Elemental: La magia se adhiere; el enemigo se vuelve vulnerable a ese tipo de daño por 1 turno." },
  { roll: 3, physical: "Desarme heroico: Golpeas con tanta destreza que el arma o escudo del enemigo sale volando 6 metros.", magic: "Sello de Silencio: La energía sella las cuerdas vocales del objetivo; no puede hablar por 1 turno." },
  { roll: 4, physical: "Golpe a la pierna: Destrozas la movilidad del objetivo. Su velocidad se reduce a 0 hasta que sea curado.", magic: "Grilletes mágicos: Zarcillos de energía atan al enemigo, dejándolo apresado por 1 turno." },
  { roll: 5, physical: "Romper guardia: Dejas al enemigo totalmente expuesto. El próximo ataque contra él tiene ventaja.", magic: "Brecha mental: El impacto satura su mente; tiene desventaja en su próxima tirada de salvación." },
  { roll: 6, physical: "Empujón violento: La fuerza del impacto empuja al enemigo 3 metros hacia atrás y lo derriba.", magic: "Onda de choque: Una explosión de fuerza mágica empuja a todos los enemigos a 1.5m de distancia." },
  { roll: 7, physical: "Tajo/Impacto en el rostro: Sangre o tierra en los ojos. El enemigo queda cegado por 1 turno.", magic: "Resplandor cegador: Un destello intenso quema las retinas del objetivo, cegándolo por 1 turno." },
  { roll: 8, physical: "Mano entumecida: Golpeas su brazo dominante. Tiene desventaja en todos sus ataques durante su turno.", magic: "Drenaje de energía: Absoluta sincronía mágica; recuperas un espacio de conjuro de nivel 1." },
  { roll: 9, physical: "Ataque coordinado: Abres una brecha perfecta. Un aliado a 1.5m puede usar su reacción para atacarlo.", magic: "Transferencia vital: Parte de la energía del impacto sana a un aliado cercano, recuperando 2d6 puntos de golpe." },
  { roll: 10, physical: "Conmoción: Un golpe brutal a la cabeza o el cuerpo. El enemigo queda aturdido por 1 turno.", magic: "Sobrecarga estática: El exceso de energía recorre su cuerpo, dejándolo paralizado por 1 turno." },
  { roll: 11, physical: "Hendidura: Si el objetivo muere por tu golpe, puedes hacer un ataque adicional a otro enemigo adyacente.", magic: "Explosión en cadena: La magia rebota; la mitad del daño infligido salta a otro enemigo a menos de 3m." },
  { roll: 12, physical: "Falta de aire: Un impacto directo en el plexo solar o pecho. El enemigo pierde su acción extra en su turno.", magic: "Lentitud: El flujo del tiempo se altera a su alrededor. Sufre los efectos del hechizo Lentitud por 1 turno." },
  { roll: 13, physical: "Adrenalina pura: El clamor de la batalla te fortalece. Recuperas 1d10 puntos de golpe inmediatamente.", magic: "Escudo de maná: La magia residual forma una barrera a tu alrededor; ganas 2d6 puntos de golpe temporales." },
  { roll: 14, physical: "Ruptura de armadura: Destrozas su protección. El enemigo sufre una penalización permanente de -2 a su CA.", magic: "Fragilidad mágica: Anulas sus defensas. El objetivo pierde cualquier resistencia al daño durante este combate." },
  { roll: 15, physical: "Intimidación brutal: Tu ataque es tan aterrador que el enemigo queda asustado de ti por 1 turno.", magic: "Presencia imponente: La magnitud de tu magia deja asustados a todos los enemigos a menos de 6 metros." },
  { roll: 16, physical: "Golpe de gracia: Encuentras un punto vital crítico. Añades 2d10 de daño adicional al total.", magic: "Crítico puro: Dominio total de las artes arcanas; lanzas tres veces los dados de daño del hechizo en lugar de dos." },
  { roll: 17, physical: "Maestría marcial: Tan pronto como terminas tu movimiento, puedes realizar un ataque adicional.", magic: "Claridad mental: Tu mente trabaja a la velocidad de la luz; puedes lanzar un Truco adicional inmediatamente." },
  { roll: 18, physical: "Contraataque preparado: Quedas en una guardia perfecta. Puedes usar tu reacción para atacar si alguien te falla.", magic: "Espejismo arcano: Tu figura parpadea. Creas una ilusión perfecta de ti mismo que atrae el próximo ataque enemigo." },
  { roll: 19, physical: "¡Inspirador!: Tu hazaña levanta la moral. Todos tus aliados tienen ventaja en su próximo ataque.", magic: "Aura de poder: Brillas con intensidad. Tus aliados cercanos tienen ventaja en tiradas de salvación por 1 minuto." },
  { roll: 20, physical: "¡Leyenda viviente!: Ejecución perfecta. Si el enemigo es un esbirro, muere; si es un jefe, cae a 0 puntos de golpe.", magic: "¡Apoteosis!: Milagro arcano. Si el hechizo tiene duración, se vuelve permanente (o se aplica su efecto más extremo)." },
];

export const FUMBLE_TABLE: CriticalEffect[] = [
  { roll: 1, physical: "Tropiezo: Pierdes el equilibrio y caes al suelo (derribado).", magic: "Retroceso: La energía estalla en tus manos; recibes el daño del hechizo." },
  { roll: 2, physical: "Atasco: Tu arma se encasquilla, se atasca o se enreda.", magic: "Agotamiento: El esfuerzo mágico te agota; pierdes tu acción extra." },
  { roll: 3, physical: "Fuego amigo: Golpeas por accidente a un aliado cercano.", magic: "Desvío: El hechizo rebota o se desvía hacia un aliado cercano." },
  { roll: 4, physical: "Desarme: Tu arma sale volando 1d4 metros en una dirección aleatoria.", magic: "Chispas cegadoras: Un destello repentino te deja cegado por 1 turno." },
  { roll: 5, physical: "Rotura: Tu armadura o escudo sufre un daño parcial (-1 a la CA).", magic: "Drenaje: La trama mágica te absorbe; pierdes un espacio de hechizo inferior." },
  { roll: 6, physical: "Tirón muscular: Sufres un calambre (desventaja en tiradas de Fuerza).", magic: "Confusión mental: Olvidas qué hacías (desventaja en tiradas de Inteligencia)." },
  { roll: 7, physical: "Ceguera temporal: Polvo o sangre en los ojos (desventaja en tu próximo ataque).", magic: "Humo denso: El hechizo genera una nube de humo que oscurece tu área." },
  { roll: 8, physical: "Arma mellada: El filo se estropea (haces el daño mínimo el resto del combate).", magic: "Hechizo 'Pop': El hechizo falla y solo produce un inofensivo chorro de confeti." },
  { roll: 9, physical: "Vibración dolorosa: El choque de armas te deja aturdido por 1 turno.", magic: "Sobrecarga rúnica: La magia estática te deja paralizado por 1 turno." },
  { roll: 10, physical: "Daño colateral: Rompes un objeto importante del entorno (cuerda, pilar, mesa).", magic: "Teletransporte inestable: Te teletransportas 3 metros en una dirección aleatoria." },
  { roll: 11, physical: "Mordisco: Te muerdes la lengua al atacar; no puedes hablar con claridad.", magic: "Disfonía mágica: Tu voz se vuelve de pito; fallan los componentes verbales." },
  { roll: 12, physical: "Correa rota: Tu escudo o parte de tu equipo queda colgando e inutilizado.", magic: "Quemadura por escarcha/fuego: Tus manos duelen; fallan los componentes somáticos." },
  { roll: 13, physical: "Mareo: Das vueltas de más y te mareas (velocidad reducida a la mitad).", magic: "Visión borrosa: La magia altera tu vista (penalizador a la percepción visual)." },
  { roll: 14, physical: "Apertura letal: Das un golpe tan torpe que provocas un ataque de oportunidad.", magic: "Absorción: El objetivo absorbe la energía de tu hechizo y se cura en lugar de sufrir daño." },
  { roll: 15, physical: "Fallo de vestuario: Se te rompe el cinturón; se te caen los pantalones (-1.5m movimiento).", magic: "Tinte arcano: Tu ropa y tu piel cambian a un color brillante y neón." },
  { roll: 16, physical: "Atascado: Tu arma se clava profundamente en el suelo, madera o piedra.", magic: "Invocación errónea: En lugar del hechizo, invocas un conejo asustado." },
  { roll: 17, physical: "Grito ridículo: Haces un ruido que alerta a todos los enemigos de la zona.", magic: "Faro arcano: Brillas como una antorcha, perdiendo cualquier sigilo." },
  { roll: 18, physical: "Esguince: Te tuerces un tobillo al avanzar; recibes 1d4 de daño contundente.", magic: "Amnesia mágica: Olvidas el hechizo que acabas de intentar lanzar por 1 minuto." },
  { roll: 19, physical: "Desorientación: Giras sobre ti mismo y terminas dándole la espalda al enemigo.", magic: "Inversión de gravedad: Flotas un metro en el aire, quedando vulnerable." },
  { roll: 20, physical: "¡Desastre Físico! Tira dos veces más en esta tabla y aplica ambos resultados.", magic: "¡Caos Arcano! Tira en la tabla de Magia Salvaje (o tira dos veces más en esta tabla)." },
];

export const rollOnTable = (table: CriticalEffect[], rollValue?: number): CriticalEffect => {
  const value = rollValue || Math.floor(Math.random() * 20) + 1;
  return table.find(e => e.roll === value) || table[table.length - 1];
};
