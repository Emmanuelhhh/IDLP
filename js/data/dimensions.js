/**
 * dimensions.js — Datos de las 14 dimensiones de la plenitud
 *
 * Variable global window.DIMENSIONES consumida por render-dimensions.js.
 * Edita aquí para actualizar contenido sin tocar el HTML ni otros scripts.
 *
 * Cada entrada contiene:
 *   title  — Nombre de la dimensión (debe ser único)
 *   color  — Token de color (teal | violet | gold | emerald | warm | rose |
 *             sky | slate | purple | navy | indigo | amber | sage)
 *   icon   — Clave del ícono en ICONOS (render-dimensions.js)
 *   quote  — Frase representativa (sin comillas tipográficas; el renderer las añade)
 *   desc   — Descripción breve
 *   tips   — Array de 3 consejos accionables
 *   libros — Array de { title, author, href } ('' si no hay URL aún)
 */

window.DIMENSIONES = [

  /* 1 ─ Salud Física */
  {
    title:  'Salud Física',
    color:  'teal',
    icon:   'activity',
    quote:  'El cuerpo es el primer instrumento de toda acción humana.',
    desc:   'Tu energía, claridad mental y capacidad de acción dependen directamente de cómo cuidas tu cuerpo. No es vanidad; es la base de todo lo demás.',
    tips: [
      'Mueve tu cuerpo al menos 30 minutos diarios con constancia',
      'Duerme 7–8 horas como prioridad, no como lujo',
      'Nutre tu cuerpo con consistencia, no con perfeccionismo',
    ],
    libros: [
      { title: 'Outlive: The Science and Art of Longevity', author: 'Peter Attia',    href: '#' },
      { title: 'Why We Sleep',                              author: 'Matthew Walker', href: '#' },
    ],
  },

  /* 2 ─ Salud Mental */
  {
    title:  'Salud Mental',
    color:  'violet',
    icon:   'brain',
    quote:  'La mente clara ve más lejos que el esfuerzo ciego.',
    desc:   'Gestionar el estrés, conocer tus emociones y cultivar equilibrio psicológico no es debilidad. Es la base de toda decisión inteligente y sostenida.',
    tips: [
      'Practica la introspección regular y honesta',
      'Establece límites sanos en trabajo y relaciones',
      'Busca apoyo profesional sin vergüenza cuando lo necesites',
    ],
    libros: [
      { title: 'Feeling Good: The New Mood Therapy', author: 'David D. Burns',        href: '#' },
      { title: 'The Body Keeps the Score',           author: 'Bessel van der Kolk',   href: '#' },
    ],
  },

  /* 3 ─ Espiritualidad */
  {
    title:  'Espiritualidad',
    color:  'gold',
    icon:   'sun',
    quote:  'No es religión. Es conexión con lo que trasciende al ego.',
    desc:   'La espiritualidad es la práctica de conectar con algo mayor: el silencio, los valores, la naturaleza, el asombro genuino ante la existencia.',
    tips: [
      'Cultiva momentos de silencio y contemplación diaria',
      'Define y vive según tus valores más profundos',
      'Practica la gratitud como disciplina, no como cliché',
    ],
    libros: [
      { title: 'El poder del ahora', author: 'Eckhart Tolle',  href: '#' },
      { title: 'Meditaciones',       author: 'Marco Aurelio',  href: '#' },
    ],
  },

  /* 4 ─ Finanzas */
  {
    title:  'Finanzas',
    color:  'emerald',
    icon:   'trendingUp',
    quote:  'El dinero no es la meta. Es una herramienta de libertad.',
    desc:   'Una buena relación con el dinero no significa obsesión, sino claridad. Saber cuánto entra, cuánto sale y hacia dónde va tu energía económica.',
    tips: [
      'Conoce tu flujo real de ingresos y gastos sin excusas',
      'Invierte en ti mismo antes que en cualquier activo externo',
      'Construye un fondo de emergencia como acto de respeto propio',
    ],
    libros: [
      { title: 'The Psychology of Money',       author: 'Morgan Housel', href: '#' },
      { title: 'I Will Teach You to Be Rich',   author: 'Ramit Sethi',   href: '#' },
    ],
  },

  /* 5 ─ Familia */
  {
    title:  'Familia',
    color:  'warm',
    icon:   'home',
    quote:  'Las raíces sanas dan las ramas más altas.',
    desc:   'La familia, en su sentido más amplio, es el ecosistema de amor y pertenencia donde nos formamos. Merece presencia real, no solo presencia física.',
    tips: [
      'Crea rituales de conexión genuina y regular',
      'Escucha más de lo que hablas en conversaciones familiares',
      'Resuelve los conflictos; no los postergues indefinidamente',
    ],
    libros: [
      { title: 'Los 5 lenguajes del amor', author: 'Gary Chapman',    href: '#' },
      { title: 'Padres conscientes',       author: 'Shefali Tsabary', href: '#' },
    ],
  },

  /* 6 ─ Relaciones */
  {
    title:  'Relaciones',
    color:  'rose',
    icon:   'heart',
    quote:  'La calidad de tus relaciones define la calidad de tu vida.',
    desc:   'Invertir en relaciones profundas y recíprocas es una de las inversiones con mayor retorno en bienestar y propósito. La soledad cuesta más.',
    tips: [
      'Elige profundidad sobre cantidad de conexiones',
      'Aprende a comunicar con claridad y sin resentimiento',
      'Rodéate de personas que te inspiren a crecer',
    ],
    libros: [
      { title: 'Comunicación no violenta', author: 'Marshall B. Rosenberg',      href: '#' },
      { title: 'Attached',                 author: 'Amir Levine & Rachel Heller', href: '#' },
    ],
  },

  /* 7 ─ Aprendizaje */
  {
    title:  'Aprendizaje',
    color:  'sky',
    icon:   'bookOpen',
    quote:  'El que deja de aprender, deja de crecer.',
    desc:   'El aprendizaje continuo es la capacidad de adaptación más poderosa. No se trata de acumular títulos, sino de mantener la mente viva y en expansión.',
    tips: [
      'Dedica tiempo diario a leer o aprender algo nuevo',
      'Aprende de tus errores con análisis, no con culpa',
      'Enseña lo que sabes: es la mejor forma de consolidarlo',
    ],
    libros: [
      { title: 'Ultralearning', author: 'Scott Young',    href: '#' },
      { title: 'Make It Stick', author: 'Peter C. Brown', href: '#' },
    ],
  },

  /* 8 ─ Disciplina */
  {
    title:  'Disciplina',
    color:  'slate',
    icon:   'zap',
    quote:  'La libertad real viene de la autodisciplina, no de su ausencia.',
    desc:   'La motivación es volátil. La disciplina es confiable. Cuando construyes sistemas de acción consistente, los resultados se vuelven predecibles.',
    tips: [
      'Crea rutinas que soporten tus metas, no que las reemplacen',
      'Honra tus compromisos contigo mismo primero',
      'Reduce decisiones triviales para conservar energía mental',
    ],
    libros: [
      { title: 'The War of Art', author: 'Steven Pressfield', href: '#' },
      { title: "Can't Hurt Me",  author: 'David Goggins',     href: '#' },
    ],
  },

  /* 9 ─ Propósito */
  {
    title:  'Propósito',
    color:  'purple',
    icon:   'compass',
    quote:  'Sin un porqué profundo, el cómo siempre estará vacío.',
    desc:   'El propósito no es siempre una gran misión cósmica. A veces es saber por qué te levantas, qué construyes y para quién vives. Eso basta y eso mueve.',
    tips: [
      'Reflexiona sobre lo que te importaría haber hecho al final',
      'Alinea tus acciones diarias con tus valores centrales',
      'El propósito se descubre haciendo, no solo pensando',
    ],
    libros: [
      { title: 'El hombre en busca de sentido', author: 'Viktor E. Frankl', href: '#' },
      { title: 'Start with Why',               author: 'Simon Sinek',      href: '#' },
    ],
  },

  /* 10 ─ Trabajo y Profesión */
  {
    title:  'Trabajo y Profesión',
    color:  'navy',
    icon:   'briefcase',
    quote:  'El trabajo excelente no compensa una vida descuidada.',
    desc:   'Tu trabajo es una dimensión importante, no la única. Puede ser fuente de realización, pero nunca debe subordinar todo lo demás de manera permanente.',
    tips: [
      'Desarrolla habilidades que te distingan y que disfrutes',
      'Define límites claros entre trabajo y vida personal',
      'Busca trabajo con sentido, no solo con salario',
    ],
    libros: [
      { title: 'Deep Work',                       author: 'Cal Newport', href: '#' },
      { title: "So Good They Can't Ignore You",   author: 'Cal Newport', href: '#' },
    ],
  },

  /* 11 ─ Descanso */
  {
    title:  'Descanso',
    color:  'indigo',
    icon:   'moon',
    quote:  'Descansar no es perder tiempo. Es recuperar capacidad.',
    desc:   'El descanso es parte del rendimiento, no su opuesto. Una cultura que glorifica el agotamiento confunde actividad con avance. El cuerpo repara en silencio.',
    tips: [
      'Protege el sueño como proteges tu tiempo más valioso',
      'Distingue entre descanso activo y entretenimiento escapista',
      'Programa periodos de desconexión real y sin culpa',
    ],
    libros: [
      { title: 'Rest',       author: 'Alex Soojung-Kim Pang', href: '#' },
      { title: 'Do Nothing', author: 'Celeste Headlee',       href: '#' },
    ],
  },

  /* 12 ─ Hábitos */
  {
    title:  'Hábitos',
    color:  'teal',
    icon:   'refresh',
    quote:  'Somos lo que repetimos. La excelencia no es un acto, es un hábito.',
    desc:   'Los hábitos son el sistema operativo del comportamiento. Lo que haces automáticamente define tu trayectoria. Diseña tus rutinas con intención, no por inercia.',
    tips: [
      'Empieza con hábitos pequeños y apílalos sobre los existentes',
      'El entorno importa: diseña tu espacio para facilitar lo correcto',
      'Mide y registra: lo que se observa, mejora',
    ],
    libros: [
      { title: 'Atomic Habits',      author: 'James Clear',    href: '#' },
      { title: 'The Power of Habit', author: 'Charles Duhigg', href: '#' },
    ],
  },

  /* 13 ─ Tiempo */
  {
    title:  'Tiempo',
    color:  'amber',
    icon:   'clock',
    quote:  'No tienes falta de tiempo. Tienes falta de prioridades claras.',
    desc:   'El tiempo es el único recurso verdaderamente irrecuperable. Lo que eliges hacer con él es, literalmente, lo que eliges hacer con tu vida.',
    tips: [
      'Diseña tu semana antes de que otros la diseñen por ti',
      'Protege bloques para lo importante, no solo lo urgente',
      'Evalúa tus compromisos: ¿reflejan lo que más valoras?',
    ],
    libros: [
      { title: 'Esencialismo',    author: 'Greg McKeown',   href: '#' },
      { title: 'Four Thousand Weeks', author: 'Oliver Burkeman', href: '#' },
    ],
  },

  /* 14 ─ Contribución */
  {
    title:  'Contribución',
    color:  'sage',
    icon:   'gift',
    quote:  'La mayor fuente de significado es dar algo valioso a los demás.',
    desc:   'Contribuir a algo mayor —una comunidad, una causa, una persona— es una de las fuentes más profundas de bienestar y sentido. La generosidad renueva.',
    tips: [
      'Identifica cómo tus habilidades pueden servir a otros',
      'No esperes abundancia perfecta para comenzar a dar',
      'La contribución puede ser tiempo, atención o conocimiento',
    ],
    libros: [
      { title: 'Give and Take',               author: 'Adam Grant',  href: '#' },
      { title: 'Los dones de la imperfección', author: 'Brené Brown', href: '#' },
    ],
  },

];
