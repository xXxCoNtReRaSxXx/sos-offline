/**
 * SOS Offline V2 — Contenido de emergencias.
 *
 * Todo el contenido está embebido en JavaScript (no se hacen peticiones de red)
 * para garantizar que la aplicación funcione completamente sin conexión.
 *
 * AVISO: Esta información es educativa y NO sustituye la atención de
 * profesionales sanitarios ni de los servicios de emergencia. Ante una
 * emergencia real, llama siempre a tu número local de emergencias.
 *
 * Los números de emergencia son mantenidos por la comunidad y pueden cambiar:
 * verifica siempre el número oficial vigente de tu país/región.
 */

/**
 * Números de emergencia por país.
 * Cada país: { country, flag, services: [{ label, number }] }
 * El primer servicio se usa como número principal del botón de llamada.
 */
const EMERGENCY_NUMBERS = [
  { country: 'Unión Europea', flag: '🇪🇺', services: [{ label: 'General', number: '112' }] },
  { country: 'España', flag: '🇪🇸', services: [{ label: 'General', number: '112' }] },
  { country: 'México', flag: '🇲🇽', services: [{ label: 'General', number: '911' }, { label: 'Cruz Roja', number: '065' }] },
  { country: 'Argentina', flag: '🇦🇷', services: [{ label: 'General', number: '911' }, { label: 'Médica', number: '107' }, { label: 'Bomberos', number: '100' }, { label: 'Policía', number: '101' }] },
  { country: 'Colombia', flag: '🇨🇴', services: [{ label: 'General', number: '123' }] },
  { country: 'Chile', flag: '🇨🇱', services: [{ label: 'Médica (SAMU)', number: '131' }, { label: 'Bomberos', number: '132' }, { label: 'Policía', number: '133' }] },
  { country: 'Perú', flag: '🇵🇪', services: [{ label: 'General', number: '911' }, { label: 'Médica (SAMU)', number: '106' }, { label: 'Bomberos', number: '116' }, { label: 'Policía', number: '105' }] },
  { country: 'Brasil', flag: '🇧🇷', services: [{ label: 'Médica (SAMU)', number: '192' }, { label: 'Bomberos', number: '193' }, { label: 'Policía', number: '190' }] },
  { country: 'Bolivia', flag: '🇧🇴', services: [{ label: 'General', number: '911' }, { label: 'Médica', number: '118' }, { label: 'Bomberos', number: '119' }, { label: 'Policía', number: '110' }] },
  { country: 'Ecuador', flag: '🇪🇨', services: [{ label: 'General', number: '911' }] },
  { country: 'Venezuela', flag: '🇻🇪', services: [{ label: 'General', number: '911' }, { label: 'Bomberos', number: '171' }] },
  { country: 'Uruguay', flag: '🇺🇾', services: [{ label: 'General', number: '911' }, { label: 'Médica', number: '105' }, { label: 'Bomberos', number: '104' }] },
  { country: 'Paraguay', flag: '🇵🇾', services: [{ label: 'General', number: '911' }, { label: 'Médica', number: '141' }, { label: 'Bomberos', number: '132' }] },
  { country: 'Panamá', flag: '🇵🇦', services: [{ label: 'Médica (SUME)', number: '911' }, { label: 'Bomberos', number: '103' }, { label: 'Policía', number: '104' }] },
  { country: 'Costa Rica', flag: '🇨🇷', services: [{ label: 'General', number: '911' }] },
  { country: 'Nicaragua', flag: '🇳🇮', services: [{ label: 'General', number: '911' }, { label: 'Cruz Roja', number: '128' }, { label: 'Bomberos', number: '115' }] },
  { country: 'Honduras', flag: '🇭🇳', services: [{ label: 'General', number: '911' }] },
  { country: 'El Salvador', flag: '🇸🇻', services: [{ label: 'General', number: '911' }] },
  { country: 'Guatemala', flag: '🇬🇹', services: [{ label: 'General', number: '911' }, { label: 'Bomberos', number: '123' }] },
  { country: 'Cuba', flag: '🇨🇺', services: [{ label: 'Médica', number: '104' }, { label: 'Bomberos', number: '105' }, { label: 'Policía', number: '106' }] },
  { country: 'Rep. Dominicana', flag: '🇩🇴', services: [{ label: 'General', number: '911' }] },
  { country: 'Puerto Rico', flag: '🇵🇷', services: [{ label: 'General', number: '911' }] },
  { country: 'EE. UU. / Canadá', flag: '🇺🇸', services: [{ label: 'General', number: '911' }] },
  { country: 'Reino Unido', flag: '🇬🇧', services: [{ label: 'General', number: '999' }, { label: 'Alternativo', number: '112' }] },
];

/**
 * Guías de primeros auxilios.
 * { id, title, icon, summary, danger, steps[], donts[] }
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
    donts: ['No le des comida ni bebida.', 'No la dejes sola.'],
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
    donts: ['No metas nada en su boca.', 'No le des agua ni medicamentos durante la convulsión.'],
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
  {
    id: 'ataque-panico',
    title: 'Ataque de pánico / crisis de ansiedad',
    icon: '🫁',
    summary: 'Miedo intenso, palpitaciones, falta de aire, sensación de peligro.',
    danger: false,
    steps: [
      'Lleva a la persona a un lugar tranquilo y con menos estímulos.',
      'Habla con calma y validez: «Estás a salvo, esto pasará».',
      'Guía una respiración lenta: inhala 4 segundos, mantén 4, exhala 6.',
      'Anímala a fijar la atención en 5 cosas que ve, 4 que oye, 3 que toca (técnica de anclaje).',
      'No minimices lo que siente; acompáñala sin presionar.',
      'Busca ayuda médica si hay dolor de pecho real, desmayo o es la primera vez (podría no ser ansiedad).',
    ],
    donts: [
      'No le digas «cálmate» ni que «es una tontería».',
      'No la hagas respirar en una bolsa: ya no se recomienda.',
    ],
  },
];

/**
 * Crisis y seguridad: drogas, armas y situaciones de violencia/conflicto.
 * Mismo formato que primeros auxilios (steps + donts), con `note` opcional.
 */
const CRISIS = [
  {
    id: 'sobredosis-opioides',
    title: 'Sobredosis por opioides / fentanilo',
    icon: '💉',
    summary: 'Respiración muy lenta o ausente, labios azulados, no despierta.',
    danger: true,
    note: 'Señales: pupilas en punta de alfiler, respiración lenta o nula, piel azulada, ruidos de ahogo.',
    steps: [
      'Intenta despertar a la persona: llámala y frota con fuerza el centro del pecho.',
      'Llama a emergencias de inmediato.',
      'Si tienes naloxona (Narcan), adminístrala: una dosis en la nariz o según instrucciones del envase.',
      'Si no respira con normalidad, inicia RCP (compresiones).',
      'Repite la naloxona a los 2–3 minutos si no hay mejora y tienes otra dosis.',
      'Colócala en posición lateral de seguridad si respira y debes dejar de vigilarla un momento.',
      'Quédate con ella: el efecto de la naloxona puede pasar y recaer.',
    ],
    donts: [
      'No la dejes sola «durmiéndola».',
      'No le metas hielo, agua ni la pongas en una ducha fría.',
      'No tengas miedo de usar naloxona: no daña si no había opioides.',
    ],
  },
  {
    id: 'sobredosis-estimulantes',
    title: 'Sobredosis por estimulantes (cocaína, anfetaminas, MDMA)',
    icon: '⚡',
    summary: 'Sobrecalentamiento, agitación extrema, dolor de pecho, convulsiones.',
    danger: true,
    note: 'Señales: temperatura muy alta, sudoración, paranoia, latido acelerado, dolor en el pecho.',
    steps: [
      'Llama a emergencias.',
      'Lleva a la persona a un lugar fresco y tranquilo, con pocos estímulos.',
      'Enfría su cuerpo: paños húmedos, abanícala, afloja la ropa.',
      'Si está consciente y coherente, ofrécele pequeños sorbos de agua.',
      'Háblale con calma para reducir la agitación.',
      'Si convulsiona, protege su cabeza y no la sujetes; si pierde el conocimiento y no respira, inicia RCP.',
    ],
    donts: [
      'No la dejes sola si está agitada o paranoica.',
      'No la sujetes con fuerza: puede aumentar el sobrecalentamiento peligroso.',
    ],
  },
  {
    id: 'intoxicacion-etilica',
    title: 'Intoxicación etílica (alcohol)',
    icon: '🍾',
    summary: 'Vómitos, confusión, respiración lenta, no se le puede despertar.',
    danger: true,
    steps: [
      'Si está inconsciente o muy somnolienta, llama a emergencias.',
      'Colócala en posición lateral de seguridad para evitar que se ahogue con el vómito.',
      'Mantenla abrigada y vigila su respiración de forma continua.',
      'Si tienes que dejarla, asegúrate de que sigue de lado.',
    ],
    donts: [
      'No la dejes «dormir la borrachera» boca arriba y sin vigilancia.',
      'No le des café, comida ni más alcohol, ni la metas en una ducha fría.',
      'No la hagas caminar para «espabilar».',
    ],
  },
  {
    id: 'arma-fuego',
    title: 'Herida por arma de fuego',
    icon: '🩹',
    summary: 'Controlar la hemorragia es la prioridad para salvar la vida.',
    danger: true,
    steps: [
      'Asegúrate de que ya no hay peligro (el agresor no sigue presente).',
      'Llama a emergencias indicando «herida por arma de fuego» y la ubicación exacta.',
      'Presiona con fuerza y de forma continua sobre la herida con un paño o tu mano.',
      'Si el sangrado de un brazo o pierna no para, aplica un torniquete a unos 5–7 cm por encima de la herida (nunca sobre una articulación).',
      'Anota la hora de colocación del torniquete.',
      'Cubre las heridas en el pecho con algo que no deje entrar aire (plástico) sellado por 3 lados.',
      'Mantén a la persona abrigada y vigila su respiración hasta que llegue la ayuda.',
    ],
    donts: [
      'No busques ni intentes sacar la bala.',
      'No retires un torniquete una vez colocado: lo harán los profesionales.',
    ],
  },
  {
    id: 'arma-blanca',
    title: 'Herida por arma blanca / objeto clavado',
    icon: '🔪',
    summary: 'Objeto cortante o clavado en el cuerpo.',
    danger: true,
    steps: [
      'Comprueba que la zona es segura.',
      'Llama a emergencias.',
      'Si el objeto sigue clavado, NO lo retires: estabilízalo con paños o vendajes alrededor.',
      'Si no hay objeto clavado, presiona directamente sobre la herida para frenar el sangrado.',
      'Mantén a la persona quieta y abrigada; vigila signos de shock.',
    ],
    donts: [
      'No retires objetos clavados: pueden estar taponando un vaso sanguíneo.',
      'No le des de comer ni beber.',
    ],
  },
  {
    id: 'tiroteo',
    title: 'Tiroteo activo: Correr · Esconderse · Defenderse',
    icon: '🏃',
    summary: 'Protocolo internacional ante un atacante activo.',
    danger: true,
    note: 'Sigue el orden según tu situación: primero huir; si no puedes, esconderte; y solo como último recurso, defenderte.',
    steps: [
      'CORRER: si hay una ruta de salida segura, huye dejando tus pertenencias. Ayuda a otros si puedes, pero no te detengas.',
      'Mantén las manos visibles cuando llegue la policía y sigue sus órdenes.',
      'ESCONDERSE: si no puedes huir, refúgiate en una sala que se pueda cerrar.',
      'Bloquea la puerta, apaga las luces y silencia el móvil (sin vibración).',
      'Apártate de puertas y ventanas y mantén silencio.',
      'DEFENDERSE: solo como último recurso y si tu vida corre peligro inmediato, actúa con decisión contra el atacante.',
      'Llama a emergencias cuando sea seguro hacerlo; describe ubicación, número de atacantes y armas.',
    ],
    donts: [
      'No actives la alarma de incendios: puede atraer gente a los pasillos.',
      'No te muevas hacia el ruido de los disparos.',
    ],
  },
  {
    id: 'conflicto-armado',
    title: 'Conflicto armado / bombardeo',
    icon: '🛡️',
    summary: 'Cómo protegerte durante ataques con artillería, misiles o drones.',
    danger: true,
    steps: [
      'Ten siempre lista una bolsa de emergencia con documentos, agua, medicación y linterna.',
      'Al oír sirenas o explosiones, busca refugio: sótano, planta baja, o un pasillo interior sin ventanas.',
      'Aplica la regla de las dos paredes: ponte detrás de al menos dos muros respecto al exterior.',
      'Aléjate de ventanas, cristales y balcones.',
      'Si estás al aire libre y no hay refugio, túmbate en una zanja o depresión del terreno y protege la cabeza.',
      'Mantén una radio a pilas para seguir las indicaciones oficiales.',
      'No salgas hasta que se anuncie el fin de la alerta; cuidado con explosivos sin detonar.',
    ],
    donts: [
      'No te asomes a ventanas para mirar.',
      'No toques objetos militares ni munición sin detonar.',
    ],
  },
  {
    id: 'explosion',
    title: 'Explosión / atentado',
    icon: '💥',
    summary: 'Qué hacer inmediatamente tras una explosión.',
    danger: true,
    steps: [
      'Protégete de la caída de cristales y escombros; cúbrete la cabeza.',
      'Aléjate de la zona de la explosión de forma ordenada y rápida.',
      'Ten en cuenta el riesgo de una segunda explosión: no te concentres con la multitud cerca del lugar.',
      'No uses ascensores; usa las escaleras.',
      'Si hay humo, agáchate y cúbrete la boca y la nariz con un paño.',
      'Ayuda a controlar hemorragias graves de los heridos (presión directa, torniquete si es necesario).',
      'Llama a emergencias cuando estés en lugar seguro.',
    ],
    donts: [
      'No vuelvas a por objetos personales.',
      'No bloquees las salidas ni las vías de los servicios de emergencia.',
    ],
  },
  {
    id: 'ataque-quimico',
    title: 'Ataque químico / gas tóxico',
    icon: '☣️',
    summary: 'Exposición a gases o sustancias químicas peligrosas.',
    danger: true,
    steps: [
      'Aléjate de la fuente: si el gas está fuera, entra; si está dentro, sal y sube a un lugar elevado y ventilado.',
      'Cúbrete la nariz y la boca con un paño húmedo.',
      'Si crees que estás contaminado, quítate la ropa afectada (córtala, no la pases por la cabeza).',
      'Enjuaga la piel y los ojos con agua abundante durante varios minutos.',
      'Llama a emergencias y al centro de toxicología; indica la sustancia si la conoces.',
      'Sigue las instrucciones oficiales sobre confinarse o evacuar.',
    ],
    donts: [
      'No toques la sustancia con las manos desnudas.',
      'No te frotes los ojos.',
    ],
  },
];

/**
 * Preparación y actuación ante desastres.
 * { id, title, icon, before[], during[], after[] }
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
