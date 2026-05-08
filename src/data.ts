import type { CardData, ThemeTerm, Article, Track, ChatMessage, NetworkNode, NetworkEdge } from './types'

export const STANDARD_CLOSER_TERMS: ThemeTerm[] = [
  { name: 'Sklaverei & Aufstand', count: 2341 },
  { name: 'Saint-Domingue', count: 1126 },
  { name: 'Unabhängigkeit', count: 842 },
  { name: 'Revolution', count: 736 },
  { name: 'Kolonialismus', count: 628 },
]

export const STANDARD_ALSO_IMPORTANT: ThemeTerm[] = [
  { name: 'Französische Revolution', count: 1304 },
  { name: 'Plantagenwirtschaft', count: 612 },
  { name: 'Abschaffung der Sklaverei', count: 487 },
  { name: 'Atlantische Welt', count: 421 },
  { name: 'Versklavung', count: 310 },
]

export const STANDARD_RELATED: ThemeTerm[] = [
  { name: 'Karibik', count: 1938 },
  { name: 'Dekolonisierung', count: 823 },
  { name: 'Emanzipation', count: 692 },
  { name: 'Menschenrechte', count: 501 },
  { name: 'Rassismus', count: 412 },
]

export const GND_NARROWER: ThemeTerm[] = [
  { name: 'Sklavenaufstand', count: 2341, gndId: '4034552-0' },
  { name: 'Saint-Domingue', count: 1126, gndId: '4027561-3' },
  { name: 'Unabhängigkeit', count: 842, gndId: '4123645-2' },
  { name: 'Revolution', count: 736, gndId: '4010170-0' },
  { name: 'Kolonialismus', count: 628, gndId: '4027396-0' },
]

export const GND_BROADER: ThemeTerm[] = [
  { name: 'Französische Revolution', count: 1304, gndId: '4018728-0' },
  { name: 'Bürgertum', count: 612, gndId: '4008983-7' },
  { name: 'Abolitionismus', count: 487, gndId: '4000021-0' },
  { name: 'Atlantische Welt', count: 421, gndId: '4029984-6' },
  { name: 'Versklavung', count: 310, gndId: '4057706-7' },
]

export const GND_RELATED: ThemeTerm[] = [
  { name: 'Karibik', count: 1938, gndId: '4029896-2' },
  { name: 'Dekolonisierung', count: 823, gndId: '4011155-2' },
  { name: 'Emanzipation', count: 692, gndId: '4034345-8' },
  { name: 'Menschenrechte', count: 501, gndId: '4074725-6' },
  { name: 'Rassismus', count: 412, gndId: '4047793-4' },
]

export const STANDARD_CARDS: CardData[] = [
  {
    id: 'overview',
    title: 'Thema im Überblick',
    description: 'Wichtige Fakten und Zusammenhänge',
    count: 1,
    iconType: 'theme',
    color: 'teal',
    openLabel: 'Überblick öffnen',
    viewAllLabel: '',
    items: [
      {
        title: 'Haitianische Revolution (1791–1804)',
        subtitle: 'Aufstand der versklavten Menschen in der französischen Kolonie Saint-Domingue. Führte 1804 zur ersten unabhängigen Republik in Lateinamerika.',
      },
    ],
  },
  {
    id: 'books',
    title: 'Bücher & Texte',
    description: 'Monografien, Aufsätze, Quellen',
    count: 328,
    iconType: 'book',
    color: 'teal',
    viewAllLabel: 'Alle 328 anzeigen',
    items: [
      { title: 'Die haitianische Revolution', author: 'C. L. R. James', year: '1938' },
      { title: 'Welten der Gewalt', author: 'L. R. Conrad', year: '2007' },
      { title: 'Haïti: Die Aftershocks', author: 'L. A. Daut', year: '2012' },
    ],
  },
  {
    id: 'persons',
    title: 'Wichtige Personen',
    description: 'Akteur*innen und Wegbereiter',
    count: 198,
    iconType: 'person',
    color: 'purple',
    viewAllLabel: 'Alle 198 anzeigen',
    items: [
      { title: 'Toussaint Louverture', role: 'Führer', dates: '1743–1803' },
      { title: 'Jean-Jacques Dessalines', role: 'Staatsgründer', dates: '1758–1806' },
      { title: 'Henri Christophe', role: 'König von Haïti', dates: '1767–1820' },
    ],
  },
  {
    id: 'places',
    title: 'Orte',
    description: 'Wichtige Orte & Regionen',
    count: 68,
    iconType: 'place',
    color: 'orange',
    viewAllLabel: 'Alle 68 anzeigen',
    items: [
      { title: 'Haiti', gndId: '4021750-3' },
      { title: 'Saint-Domingue', gndId: '4027561-3' },
      { title: 'Cap-Haïtien', gndId: '2048526-7' },
      { title: 'Port-au-Prince', gndId: '4032866-8' },
    ],
  },
  {
    id: 'orgs',
    title: 'Gruppen & Einrichtungen',
    description: 'Organisationen, Gruppen, Behörden',
    count: 44,
    iconType: 'building',
    color: 'teal',
    viewAllLabel: 'Alle 44 anzeigen',
    items: [
      { title: 'Französische Kolonialverwaltung', subtitle: 'Administration in Saint-Domingue' },
      { title: 'Nationalkonvent (Frankreich)', subtitle: 'Revolutionsregierung 1792–1795' },
      { title: 'Revolutionsarmee von Saint-Domingue' },
      { title: 'Plantagenbesitzer in Saint-Domingue' },
    ],
  },
  {
    id: 'more',
    title: 'Mehr zum Thema',
    description: 'Ähnliche und ergänzende Themen',
    count: 16,
    iconType: 'idea',
    color: 'yellow',
    viewAllLabel: 'Alle 16 Themen anzeigen',
    items: [
      { title: 'Sklaverei', gndId: '4027967-7' },
      { title: 'Kolonialismus', gndId: '4027396-0' },
      { title: 'Emanzipation', gndId: '4034345-8' },
      { title: 'Atlantische Revolutionen', gndId: '4029984-6' },
    ],
  },
]

export const GND_CARDS: CardData[] = [
  {
    id: 'themenraum',
    title: 'Themenraum',
    description: 'Oberbegriff und thematische Einordnung',
    count: 1,
    iconType: 'theme',
    color: 'teal',
    openLabel: 'Themenraum öffnen',
    viewAllLabel: '',
    items: [
      {
        title: 'Haitianische Revolution (GND 4061765-1)',
        subtitle: 'Sklavenaufstand und Revolution in Saint-Domingue (1791–1804), die zur Abschaffung der Sklaverei und zur Unabhängigkeit Haitis als erstem unabhängigen Staat Lateinamerikas führte.',
      },
    ],
  },
  {
    id: 'works',
    title: 'Werke',
    description: 'Bücher, Aufsätze, Quellen, Medien',
    count: 328,
    iconType: 'book',
    color: 'teal',
    viewAllLabel: 'Alle 328 Werke anzeigen',
    items: [
      { title: 'Die haitianische Revolution', author: 'C. L. R. James', year: '1938' },
      { title: 'Welten der Gewalt', author: 'L. R. Conrad', year: '2007' },
      { title: 'Haïti: Die Aftershocks', author: 'L. A. Daut', year: '2012' },
    ],
  },
  {
    id: 'persons-gnd',
    title: 'Personen',
    description: 'Autorinnen, Zeitzeuginnen, Mitwirkende',
    count: 198,
    iconType: 'person',
    color: 'purple',
    viewAllLabel: 'Alle 198 Personen anzeigen',
    items: [
      { title: 'Toussaint Louverture', role: 'Führer', dates: '1743–1803', gndId: '118545209' },
      { title: 'Jean-Jacques Dessalines', role: 'Staatsgründer', dates: '1758–1806', gndId: '119182521' },
      { title: 'Henri Christophe', role: 'König von Haïti', dates: '1767–1802', gndId: '118521950' },
    ],
  },
  {
    id: 'places-gnd',
    title: 'Orte',
    description: 'Geografische Orte und Regionen',
    count: 68,
    iconType: 'place',
    color: 'orange',
    viewAllLabel: 'Alle 68 Orte anzeigen',
    items: [
      { title: 'Haiti', subtitle: 'Staat', gndId: '4021570-3' },
      { title: 'Saint-Domingue', subtitle: 'Kolonie', gndId: '4021561-3' },
      { title: 'Cap-Haïtien', subtitle: 'Stadt', gndId: '4032867-1' },
      { title: 'Port-au-Prince', subtitle: 'Hauptstadt', gndId: '4032866-8' },
    ],
  },
  {
    id: 'koerp',
    title: 'Körperschaften',
    description: 'Française, Vereine, Organisationen',
    count: 44,
    iconType: 'building',
    color: 'teal',
    viewAllLabel: 'Alle 44 Körperschaften anzeigen',
    items: [
      { title: 'Französische Kolonialverwaltung', subtitle: 'Administration in Saint-Domingue' },
      { title: 'Nationalkonvent (Frankreich)', subtitle: 'Revolutionsregierung 1792–1795' },
      { title: 'Revolutionsarmee von Saint-Domingue', subtitle: 'Militärverband' },
      { title: 'Pflanzereite von Saint-Domingue', subtitle: 'Soziale Gruppe' },
    ],
  },
  {
    id: 'related-gnd',
    title: 'Verwandte Themen',
    description: 'Thematisch verbundene Sachbegriffe',
    count: 16,
    iconType: 'idea',
    color: 'yellow',
    viewAllLabel: 'Alle 16 Themen anzeigen',
    items: [
      { title: 'Sklaverei', gndId: '4027967-7' },
      { title: 'Kolonialismus', gndId: '4027396-0' },
      { title: 'Emanzipation', gndId: '4043445-8' },
      { title: 'Atlantische Revolutionen', gndId: '4029984-6' },
    ],
  },
]

export const STANDARD_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    isBot: true,
    time: '09:18',
    text: 'Hallo! Ich helfe Ihnen gern bei Ihrer Suche. Stellen Sie Ihre Frage – zum Beispiel: Was war die Haitianische Revolution? Wer war Toussaint Louverture? Ich gebe Ihnen Tipps, passende Begriffe und zeige, wo Sie vertrauenswürdige Quellen finden.',
  },
]

export const GND_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    isBot: true,
    time: '09:18',
    text: 'Wie kann ich Ihnen bei „Haitianische Revolution" helfen?\n\nIch helfe Ihnen, Ihre Fragestellung zu schärfen und neue Perspektiven aufzudecken. Mögliche Blickwinkel sind z. B. Sklaverei, Kolonialismus, Unabhängigkeit, Akteure, Karibik, Frankreich, Quellenarten.',
  },
]

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Haiti im Schatten der Kolonialgeschichte',
    date: '12.05.2024',
    category: 'Kultur & Wissen',
    source: 'Deutschlandfunk Kultur',
    type: 'presse',
  },
  {
    id: '2',
    title: 'Warum die Revolution von 1804 bis heute wirkt',
    date: '03.04.2024',
    category: 'Meinung',
    type: 'presse',
  },
  {
    id: '3',
    title: 'Neubewert: Die Haitianische Revolution in Lehrplänen',
    date: '21.03.2024',
    category: 'Bildung',
    source: 'Süddeutsche Zeitung',
    type: 'online',
  },
  {
    id: '4',
    title: 'Erinnerung und Gerechtigkeit in der Karibik',
    date: '15.02.2024',
    category: 'Gesellschaft',
    source: 'WDR 5',
    type: 'rundfunk',
  },
  {
    id: '5',
    title: 'Von Paris nach Port-au-Prince – Spuren der Revolution',
    date: '28.01.2024',
    category: 'Architektur',
    type: 'online',
  },
]

export const GND_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Haiti im Schatten der Kolonialgeschichte – Warum die Revolution von 1804 bis heute nachwirkt',
    date: '12.05.2024',
    category: 'Kulturredaktion',
    source: 'Deutschlandfunk Kultur',
    type: 'presse',
  },
  {
    id: '2',
    title: 'Neu bewerten: Die Haitianische Revolution im Lehrplan – Bildungsdebatten fordern stärkere Schwarze Geschichte',
    date: '03.04.2024',
    category: 'Historisches Magazin',
    type: 'presse',
  },
  {
    id: '3',
    title: 'Erinnerung und Gerechtigkeit in der Karibik – Gedenkitinitiativen in Cap-Haïtien und Port-au-Prince',
    date: '21.03.2024',
    category: 'Wissenschaftsportal',
    type: 'online',
  },
  {
    id: '4',
    title: 'Von Paris nach Port-au-Prince – Spuren der Revolution – Eine Ausstellung beleuchtet transatlantische Verbindungen',
    date: '15.02.2024',
    category: 'Archivblick',
    type: 'debatte',
  },
  {
    id: '5',
    title: 'Debatte: Reparationsforderungen und ihre Geschichte – Was würde eine Anerkennung der Sklaverei bedeuten?',
    date: '28.01.2024',
    category: 'Debattenraum',
    type: 'debatte',
  },
]

export const TRACKS: Track[] = [
  {
    title: 'Die Haitianische Revolution – Einführung',
    duration: '42:18',
    type: 'Dokumentation',
    src: '/audio/The Dark Librarian is Rising (Remastered) (Cover).mp3',
  },
  {
    title: 'C. L. R. James und die Bedeutung der Revolution',
    duration: '31:14',
    type: 'Vortrag',
    src: '/audio/Metadaten im 4_4 Takt.mp3',
  },
  {
    title: 'Von Saint-Domingue zur Republik Haïti',
    duration: '18:36',
    type: 'Historischer Überblick',
    src: '/audio/Stranger Facts vs Netflix.mp3',
  },
]

export const NETWORK_NODES_STANDARD: NetworkNode[] = [
  { id: 'center', label: ['Haitianische', 'Revolution', '(1791–1804)'], type: 'theme', x: 188, y: 170, r: 52, isCenter: true },
  { id: 'louverture', label: ['Toussaint', 'Louverture', '(1743–1803)'], type: 'person', x: 68, y: 72, r: 36 },
  { id: 'haiti', label: ['Haiti'], type: 'place', x: 308, y: 58, r: 34 },
  { id: 'work', label: ['Die haitianische', 'Revolution', '(GND 1065832313)'], type: 'work', x: 68, y: 282, r: 26 },
  { id: 'sklaverei', label: ['Sklaverei', '(GND 4027967-7)'], type: 'theme', x: 315, y: 278, r: 26 },
  { id: 'kol', label: ['Französische', 'Kolonialverwaltung', '(GND 10877654623)'], type: 'org', x: 188, y: 338, r: 22 },
]

export const NETWORK_EDGES_STANDARD: NetworkEdge[] = [
  { from: 'louverture', to: 'center', label: 'führte', labelOffset: [-12, -8] },
  { from: 'center', to: 'haiti', label: 'spielte sich ab in', labelOffset: [4, -12] },
  { from: 'work', to: 'center', label: 'ist ein', labelOffset: [-12, 4] },
  { from: 'center', to: 'haiti', label: 'hängt zusammen mit', labelOffset: [8, 8] },
  { from: 'center', to: 'sklaverei', label: 'führte zu', labelOffset: [4, 4] },
  { from: 'kol', to: 'center', label: 'verwaltete', labelOffset: [4, -4] },
]

export const NETWORK_NODES_GND: NetworkNode[] = [
  { id: 'center', label: ['Haitianische', 'Revolution', '(GND 4061765-1)'], type: 'theme', x: 188, y: 170, r: 52, isCenter: true },
  { id: 'louverture', label: ['Toussaint', 'Louverture', '(GND 118545209)'], type: 'person', x: 68, y: 72, r: 36 },
  { id: 'haiti', label: ['Haiti'], type: 'place', x: 308, y: 58, r: 34 },
  { id: 'work', label: ['Die haitianische', 'Revolution', '(GND 1065432313)'], type: 'work', x: 68, y: 282, r: 26 },
  { id: 'sklaverei', label: ['Sklaverei', '(GND 4027967-7)'], type: 'theme', x: 315, y: 278, r: 26 },
  { id: 'kol', label: ['Französische', 'Kolonialverwaltung', '(GND 10877654230)'], type: 'org', x: 188, y: 338, r: 22 },
]

export const NETWORK_EDGES_GND: NetworkEdge[] = [
  { from: 'louverture', to: 'center', label: 'befasst sich mit', labelOffset: [-8, -8] },
  { from: 'center', to: 'haiti', label: 'wirkt in', labelOffset: [4, -14] },
  { from: 'work', to: 'center', label: 'verwandt mit', labelOffset: [-8, 4] },
  { from: 'center', to: 'haiti', label: 'hat Akteur', labelOffset: [8, 8] },
  { from: 'center', to: 'sklaverei', label: 'führte zu', labelOffset: [4, 4] },
  { from: 'kol', to: 'center', label: 'verwaltete', labelOffset: [4, -4] },
]
