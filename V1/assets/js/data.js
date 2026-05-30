/**
 * SOS Offline — Contenido de emergencias.
 *
 * Todo el contenido está embebido en JavaScript (no se hacen peticiones de red)
 * para garantizar que la aplicación funcione completamente sin conexión.
 *
 * AVISO: Esta información es educativa y NO sustituye la atención de
 * profesionales sanitarios ni de los servicios de emergencia. Ante una
 * emergencia real, llama siempre a tu número local de emergencias.
 *
 * Las fuentes de referencia (Cruz Roja, OMS, protocolos de primeros auxilios
 * ampliamente aceptados) se enumeran en el README. Las contribuciones que
 * mejoren la exactitud de estas guías son muy bienvenidas.
 */

const EMERGENCY_NUMBERS = [
  { region: 'Unión Europea', number: '112', label: 'Emergencias generales' },
  { region: 'España', number: '112', label: 'Emergencias generales' },
  { region: 'EE. UU. / Canadá', number: '911', label: 'Emergencias generales' },
  { region: 'México', number: '911', label: 'Emergencias generales' },
  { region: 'Argentina', number: '911', label: 'Emergencias generales' },
  { region: 'Reino Unido', number: '999', label: 'Emergencias generales' },
];

/**
 * Guías de primeros auxilios.
 * Cada guía: { id, title, icon, summary, danger, steps[], donts[] }
 * - steps: pasos en orden, lenguaje claro y accionable.
 * - donts: errores frecuentes que se deben evitar.
 */
const FIRST_AID = [
  {
    id: 'rcp',
    title: 'RCP — Reanimación cardiopulmonar (adulto)',
    icon: '❤️',
    summary: 'La persona no responde y no respira con normalidad.',
    danger: true,
    steps: [
      'Comprueba que la zona es segura para ti y para la víctima.',
      'Sacude suavemente sus hombros y pregunta en voz alta: «¿Estás bien?».',
      'Si no responde, pide ayuda y llama (o pide a alguien que llame) al número de emergencias. Pon el teléfono en altavoz.',
      'Coloca a la persona boca arriba sobre una superficie firme.',
      'Pon el talón de una mano en el centro del pecho y la otra mano encima, entrelazando los dedos.',
      'Comprime fuerte y rápido: unos 5–6 cm de profundidad, a un ritmo de 100–120 compresiones por minuto.',
      'Permite que el pecho vuelva a su posición entre compresiones, sin levantar las manos.',
      'Si estás formado, da 30 compresiones y 2 ventilaciones; si no, haz solo compresiones continuas.',
      'No te detengas hasta que llegue ayuda profesional, aparezca un desfibrilador (DEA) o la persona empiece a respirar.',
      'Si hay un DEA disponible, enciéndelo y sigue sus instrucciones de voz.',
    ],
    donts: [
      'No interrumpas las compresiones más de 10 segundos.',
      'No tengas miedo de comprimir con fuerza: una RCP suave no es eficaz.',
    ],
  },
  {
    id: 'atragantamiento',
    title: 'Atragantamiento (maniobra de Heimlich)',
    icon: '😮‍💨',
    summary: 'La persona no puede hablar, toser ni respirar.',
    danger: true,
    steps: [
      'Pregunta: «¿Te estás ahogando?». Si puede toser con fuerza, anímala a seguir tosiendo.',
      'Si no puede toser, hablar ni respirar, actúa de inmediato.',
      'Dale 5 golpes secos entre los omóplatos con el talón de la mano, inclinándola hacia delante.',
      'Si no se resuelve, colócate detrás y rodea su cintura con los brazos.',
      'Cierra el puño por encima del ombligo y por debajo del esternón; sujétalo con la otra mano.',
      'Realiza 5 compresiones abdominales fuertes hacia dentro y hacia arriba.',
      'Alterna 5 golpes en la espalda y 5 compresiones abdominales hasta expulsar el objeto.',
      'Si la persona pierde el conocimiento, llama a emergencias e inicia RCP.',
    ],
    donts: [
      'No des golpes en la espalda si la persona puede toser eficazmente.',
      'En bebés menores de 1 año NO se hace Heimlich: usa golpes en la espalda y compresiones en el pecho.',
    ],
  },
  {
    id: 'hemorragia',
    title: 'Hemorragia grave',
    icon: '🩸',
    summary: 'Sangrado abundante que no se detiene.',
    danger: true,
    steps: [
      'Protégete las manos con guantes o un plástico si es posible.',
      'Presiona directamente sobre la herida con un paño limpio o gasa.',
      'Mantén la presión firme y continua; no levantes el paño para mirar.',
      'Si el paño se empapa, coloca otro encima sin retirar el anterior.',
      'Si puedes, eleva la zona herida por encima del nivel del corazón.',
      'Llama a emergencias si el sangrado es intenso o no se detiene.',
      'Vigila signos de shock: piel pálida y fría, mareo, respiración rápida.',
    ],
    donts: [
      'No uses un torniquete salvo que el sangrado ponga en peligro la vida y no se detenga con presión.',
      'No retires objetos clavados: rodéalos con vendaje y estabilízalos.',
    ],
  },
  {
    id: 'quemadura',
    title: 'Quemaduras',
    icon: '🔥',
    summary: 'Lesión por calor, líquidos calientes, electricidad o químicos.',
    danger: false,
    steps: [
      'Aleja a la persona de la fuente de calor con seguridad.',
      'Enfría la quemadura con agua corriente templada o fresca durante 20 minutos.',
      'Retira anillos, relojes o ropa de la zona antes de que se inflame, salvo si está pegada a la piel.',
      'Cubre con un paño limpio, una gasa estéril o film transparente sin apretar.',
      'Busca atención médica si la quemadura es grande, profunda, o afecta cara, manos, genitales o articulaciones.',
    ],
    donts: [
      'No apliques hielo, pasta de dientes, mantequilla ni remedios caseros.',
      'No revientes las ampollas.',
    ],
  },
  {
    id: 'fractura',
    title: 'Fractura o esguince',
    icon: '🦴',
    summary: 'Dolor intenso, deformidad o incapacidad para mover una extremidad.',
    danger: false,
    steps: [
      'Mantén a la persona quieta y tranquila.',
      'Inmoviliza la zona en la posición en la que se encuentra.',
      'Aplica frío envuelto en un paño para reducir la inflamación (máx. 20 minutos).',
      'No intentes recolocar el hueso.',
      'Busca atención médica; llama a emergencias si hay hueso expuesto, deformidad grave o no puede moverse.',
    ],
    donts: [
      'No muevas a la persona si sospechas lesión de columna o cuello, salvo peligro inminente.',
      'No le des de comer ni beber por si necesita cirugía.',
    ],
  },
  {
    id: 'inconsciencia',
    title: 'Persona inconsciente que respira',
    icon: '😴',
    summary: 'No responde pero respira con normalidad.',
    danger: true,
    steps: [
      'Comprueba que respira con normalidad durante 10 segundos.',
      'Colócala en posición lateral de seguridad (de lado, con la cabeza ligeramente hacia atrás).',
      'Asegúrate de que la vía aérea queda despejada.',
      'Llama a emergencias.',
      'Vigila la respiración de forma continua hasta que llegue la ayuda.',
      'Si deja de respirar con normalidad, inicia RCP.',
    ],
    donts: [
      'No le des comida ni bebida.',
      'No la dejes sola.',
    ],
  },
  {
    id: 'convulsion',
    title: 'Convulsiones',
    icon: '⚡',
    summary: 'Movimientos involuntarios y pérdida de conciencia.',
    danger: false,
    steps: [
      'Mantén la calma y aparta objetos peligrosos de alrededor.',
      'Protege su cabeza con algo blando (una chaqueta doblada).',
      'No la sujetes ni intentes detener los movimientos.',
      'Cronometra la duración de la convulsión.',
      'Cuando terminen los movimientos, colócala en posición lateral de seguridad.',
      'Llama a emergencias si dura más de 5 minutos, se repite, hay lesión, o es la primera convulsión.',
    ],
    donts: [
      'No metas nada en su boca.',
      'No le des agua ni medicamentos durante la convulsión.',
    ],
  },
  {
    id: 'golpe-calor',
    title: 'Golpe de calor',
    icon: '🌡️',
    summary: 'Temperatura alta, piel caliente, confusión, posible pérdida de conciencia.',
    danger: true,
    steps: [
      'Lleva a la persona a un lugar fresco y a la sombra.',
      'Quítale el exceso de ropa.',
      'Enfría su cuerpo: paños húmedos, agua fresca, abanícala.',
      'Si está consciente, dale pequeños sorbos de agua.',
      'Llama a emergencias si hay confusión, vómitos o pérdida de conciencia.',
    ],
    donts: [
      'No des líquidos a una persona con conciencia alterada.',
      'No uses agua helada de golpe en personas mayores o con problemas de corazón.',
    ],
  },
  {
    id: 'alergia',
    title: 'Reacción alérgica grave (anafilaxia)',
    icon: '🐝',
    summary: 'Hinchazón, dificultad para respirar, ronchas, mareo tras alérgeno.',
    danger: true,
    steps: [
      'Llama a emergencias de inmediato.',
      'Si la persona tiene autoinyector de adrenalina (p. ej. EpiPen), ayúdala a usarlo en el muslo.',
      'Ayúdala a sentarse para facilitar la respiración; si está mareada, túmbala con las piernas elevadas.',
      'Si lleva una segunda dosis y no mejora en 5–15 minutos, puede repetirse según indicación.',
      'Si pierde el conocimiento y deja de respirar, inicia RCP.',
    ],
    donts: [
      'No la dejes sola ni la hagas caminar.',
      'No esperes a ver si mejora sola: la anafilaxia puede agravarse en minutos.',
    ],
  },
  {
    id: 'intoxicacion',
    title: 'Intoxicación o envenenamiento',
    icon: '☠️',
    summary: 'Ingesta o contacto con una sustancia tóxica.',
    danger: true,
    steps: [
      'Identifica la sustancia si puedes y mantén el envase a mano.',
      'Llama a emergencias o al centro de toxicología de tu país.',
      'Sigue exactamente sus instrucciones.',
      'Si hay sustancia en la piel u ojos, enjuaga con agua abundante.',
    ],
    donts: [
      'No provoques el vómito salvo que un profesional te lo indique.',
      'No des nada de comer ni beber sin indicación.',
    ],
  },
];

/**
 * Listas de preparación y actuación ante desastres.
 * Cada guía: { id, title, icon, before[], during[], after[] }
 */
const DISASTERS = [
  {
    id: 'kit-72h',
    title: 'Kit de emergencia (72 horas)',
    icon: '🎒',
    before: [
      'Agua: 3 litros por persona y día (mínimo 3 días).',
      'Alimentos no perecederos y abrelatas manual.',
      'Botiquín de primeros auxilios y medicación personal.',
      'Linterna y pilas de repuesto (o linterna de manivela).',
      'Radio a pilas o de manivela.',
      'Cargador externo (power bank) cargado.',
      'Copias de documentos importantes en bolsa impermeable.',
      'Dinero en efectivo en billetes pequeños.',
      'Mantas térmicas, ropa de abrigo y calzado resistente.',
      'Silbato, mascarillas, guantes y artículos de higiene.',
      'Lista de contactos de emergencia en papel.',
    ],
    during: [],
    after: [],
  },
  {
    id: 'terremoto',
    title: 'Terremoto',
    icon: '🏚️',
    before: [
      'Identifica zonas seguras: bajo mesas resistentes, junto a paredes maestras.',
      'Fija muebles altos y objetos pesados a la pared.',
      'Ten preparado el kit de emergencia accesible.',
    ],
    during: [
      'AGÁCHATE, CÚBRETE y AGÁRRATE bajo una mesa resistente.',
      'Aléjate de ventanas, cristales y objetos que puedan caer.',
      'Si estás en la cama, quédate y protege tu cabeza con la almohada.',
      'Si estás al aire libre, ve a un espacio abierto lejos de edificios y cables.',
      'No uses ascensores.',
    ],
    after: [
      'Comprueba si hay heridos y presta primeros auxilios.',
      'Espera réplicas y aléjate de estructuras dañadas.',
      'Cierra el gas si hueles fugas y no enciendas llamas.',
      'Escucha la radio para recibir instrucciones oficiales.',
    ],
  },
  {
    id: 'inundacion',
    title: 'Inundación',
    icon: '🌊',
    before: [
      'Conoce si vives en zona inundable y las rutas de evacuación.',
      'Ten el kit de emergencia y documentos en alto y a mano.',
      'Sigue los avisos meteorológicos oficiales.',
    ],
    during: [
      'Busca terreno elevado de inmediato.',
      'No camines ni conduzcas por agua en movimiento: 15 cm bastan para tirarte.',
      'Desconecta la electricidad si es seguro hacerlo.',
      'Evita puentes sobre aguas rápidas.',
    ],
    after: [
      'No vuelvas a casa hasta que las autoridades lo autoricen.',
      'No bebas agua del grifo hasta confirmar que es potable.',
      'Desecha alimentos que hayan tocado el agua de la inundación.',
      'Documenta los daños con fotos para el seguro.',
    ],
  },
  {
    id: 'incendio',
    title: 'Incendio en el hogar',
    icon: '🔥',
    before: [
      'Instala detectores de humo y revísalos periódicamente.',
      'Planifica y practica dos rutas de salida de casa.',
      'Ten un extintor accesible y aprende a usarlo.',
    ],
    during: [
      'Sal de inmediato y mantén la calma; cada segundo cuenta.',
      'Mantente agachado: el aire más limpio está cerca del suelo.',
      'Comprueba las puertas con el dorso de la mano antes de abrirlas; si están calientes, no las abras.',
      'Si se prende tu ropa: párate, túmbate y rueda.',
      'Una vez fuera, NO vuelvas a entrar.',
      'Llama a emergencias desde un lugar seguro.',
    ],
    after: [
      'Recibe atención médica si has inhalado humo.',
      'No entres en el edificio hasta que los bomberos lo autoricen.',
    ],
  },
  {
    id: 'apagon',
    title: 'Apagón prolongado',
    icon: '🔌',
    before: [
      'Ten linternas y power banks cargados.',
      'Guarda agua y alimentos que no necesiten refrigeración.',
    ],
    during: [
      'Mantén el frigorífico y congelador cerrados para conservar el frío.',
      'Usa linternas en lugar de velas para evitar incendios.',
      'Desconecta aparatos electrónicos para protegerlos de subidas de tensión.',
      'Reserva la batería del móvil para emergencias.',
    ],
    after: [
      'Revisa los alimentos refrigerados antes de consumirlos.',
      'Reconecta los aparatos de forma gradual.',
    ],
  },
];
