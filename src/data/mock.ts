export interface Location {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  category: string;
  distance?: string;
}

export interface Excursion {
  id: string;
  locationId: string;
  title: string;
  guideName: string;
  guideAvatar: string;
  price: number;
  currency: string;
  duration: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
}

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc_1',
    title: 'Arquipélago de Bazaruto',
    subtitle: 'Inhambane',
    description: 'Um paraíso tropical com águas cristalinas, dunas de areia branca e recifes de coral deslumbrantes. Ideal para mergulho e relaxamento.',
    imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 342,
    category: 'Praia',
    distance: '750 km'
  },
  {
    id: 'loc_2',
    title: 'Ilha de Moçambique',
    subtitle: 'Nampula',
    description: 'Património Mundial da UNESCO, esta ilha histórica foi a capital de Moçambique por quase quatro séculos. Arquitetura colonial e cultura rica.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 215,
    category: 'Cultural',
    distance: '1500 km'
  },
  {
    id: 'loc_3',
    title: 'Reserva Especial de Maputo',
    subtitle: 'Maputo',
    description: 'Uma reserva natural deslumbrante que combina savana, pântanos e costa oceânica. Lar de elefantes, hipopótamos e diversas espécies de aves.',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 128,
    category: 'Natureza',
    distance: '68 km'
  },
  {
    id: 'loc_4',
    title: 'Praia do Tofo',
    subtitle: 'Inhambane',
    description: 'Famosa mundialmente pelos seus encontros com tubarões-baleia e mantas. Uma vila vibrante com excelente surf e vida noturna.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 450,
    category: 'Praia',
    distance: '480 km'
  }
];

export interface Experience {
  id: string;
  locationId: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  price: number;
  currency: string;
  duration: string;
  durationHours: number;
  location: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  category: string;
}

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp_1',
    locationId: 'loc_1',
    title: 'Aula de Culinária Moçambicana',
    hostName: 'Dona Maria',
    hostAvatar: 'https://i.pravatar.cc/150?u=maria',
    price: 1500,
    currency: 'MZN',
    duration: '2 horas',
    durationHours: 2,
    location: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 120,
    category: 'Gastronomia'
  },
  {
    id: 'exp_2',
    locationId: 'loc_2',
    title: 'Workshop de Capulana',
    hostName: 'Aisha',
    hostAvatar: 'https://i.pravatar.cc/150?u=aisha',
    price: 800,
    currency: 'MZN',
    duration: '1.5 horas',
    durationHours: 1.5,
    location: 'Ilha de Moçambique',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 85,
    category: 'Arte'
  },
  {
    id: 'exp_3',
    locationId: 'loc_4',
    title: 'Aula de Surf para Iniciantes',
    hostName: 'Pedro',
    hostAvatar: 'https://i.pravatar.cc/150?u=pedro',
    price: 2000,
    currency: 'MZN',
    duration: '2 horas',
    durationHours: 2,
    location: 'Tofo',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 200,
    category: 'Desporto'
  },
  {
    id: 'exp_4',
    locationId: 'loc_1',
    title: 'Passeio de Dhow ao Pôr do Sol',
    hostName: 'Capitão Ali',
    hostAvatar: 'https://i.pravatar.cc/150?u=ali',
    price: 1200,
    currency: 'MZN',
    duration: '1 hora',
    durationHours: 1,
    location: 'Vilanculos',
    imageUrl: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 315,
    category: 'Lazer'
  }
];

export interface Event {
  id: string;
  title: string;
  organizerName: string;
  organizerAvatar: string;
  price: number;
  currency: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
  attendees: number;
  isTrending?: boolean;
  externalLink?: string;
  contactPhone?: string;
  description?: string;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt_1',
    title: 'Festival Azgo',
    organizerName: 'Azgo Festival',
    organizerAvatar: 'https://i.pravatar.cc/150?u=azgo',
    price: 1500,
    currency: 'MZN',
    date: '15 Mai 2026',
    time: '14:00',
    location: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Música',
    attendees: 5000,
    isTrending: true,
    externalLink: 'https://azgofestival.com',
    contactPhone: '+258 84 123 4567',
    description: 'O Festival Azgo é o principal festival internacional de artes de Moçambique, reunindo música, cinema e dança de todo o mundo.'
  },
  {
    id: 'evt_2',
    title: 'Feira de Artesanato de Nampula',
    organizerName: 'Associação de Artesãos',
    organizerAvatar: 'https://i.pravatar.cc/150?u=artesao',
    price: 0,
    currency: 'MZN',
    date: '22 Jun 2026',
    time: '09:00',
    location: 'Nampula',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Cultural',
    attendees: 300,
    isTrending: false,
    description: 'Descubra o melhor do artesanato local, com peças únicas feitas por artesãos da região norte de Moçambique.'
  },
  {
    id: 'evt_3',
    title: 'Maratona de Maputo',
    organizerName: 'Maputo Runners',
    organizerAvatar: 'https://i.pravatar.cc/150?u=runners',
    price: 500,
    currency: 'MZN',
    date: '10 Ago 2026',
    time: '06:00',
    location: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Desporto',
    attendees: 1200,
    isTrending: true,
    externalLink: 'https://maputorunners.com',
    description: 'Participe na maior maratona da cidade, com percursos de 5km, 10km e 42km pelas principais avenidas de Maputo.'
  },
  {
    id: 'evt_4',
    title: 'Cimeira de Negócios África',
    organizerName: 'Câmara de Comércio',
    organizerAvatar: 'https://i.pravatar.cc/150?u=camara',
    price: 2500,
    currency: 'MZN',
    date: '05 Set 2026',
    time: '09:00',
    location: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Negócios',
    attendees: 800,
    isTrending: true,
    description: 'Um encontro dos principais líderes empresariais para discutir o futuro dos negócios e investimentos em Moçambique.'
  },
  {
    id: 'evt_5',
    title: 'Exposição de Arte Contemporânea',
    organizerName: 'Galeria Nacional',
    organizerAvatar: 'https://i.pravatar.cc/150?u=galeria',
    price: 200,
    currency: 'MZN',
    date: 'Hoje',
    time: '18:00',
    location: 'Maputo',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Exposições',
    attendees: 150,
    isTrending: false,
    description: 'Uma mostra exclusiva das obras mais recentes de artistas emergentes moçambicanos.'
  },
  {
    id: 'evt_6',
    title: 'Festa na Praia do Tofo',
    organizerName: 'Tofo Beach Club',
    organizerAvatar: 'https://i.pravatar.cc/150?u=tofo',
    price: 1000,
    currency: 'MZN',
    date: 'Este fim de semana',
    time: '22:00',
    location: 'Inhambane',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Festa',
    attendees: 600,
    isTrending: true,
    description: 'A melhor festa de praia da temporada com DJs internacionais e locais tocando até o amanhecer.'
  }
];

export const MOCK_EXCURSIONS: Excursion[] = [
  {
    id: 'exc_1',
    locationId: 'loc_1',
    title: 'Safari Oceânico de Dia Inteiro',
    guideName: 'Carlos Silva',
    guideAvatar: 'https://i.pravatar.cc/150?u=carlos',
    price: 3500,
    currency: 'MZN',
    duration: '8 horas',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 84
  },
  {
    id: 'exc_2',
    locationId: 'loc_2',
    title: 'Tour Histórico a Pé',
    guideName: 'Fátima Ali',
    guideAvatar: 'https://i.pravatar.cc/150?u=fatima',
    price: 1200,
    currency: 'MZN',
    duration: '3 horas',
    imageUrl: 'https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 156
  },
  {
    id: 'exc_3',
    locationId: 'loc_3',
    title: 'Safari 4x4 ao Pôr do Sol',
    guideName: 'João Mendes',
    guideAvatar: 'https://i.pravatar.cc/150?u=joao',
    price: 4500,
    currency: 'MZN',
    duration: '5 horas',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 42
  },
  {
    id: 'exc_4',
    locationId: 'loc_4',
    title: 'Mergulho com Tubarões Baleia',
    guideName: 'Tofo Scuba',
    guideAvatar: 'https://i.pravatar.cc/150?u=tofo',
    price: 6000,
    currency: 'MZN',
    duration: '4 horas',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 210
  }
];
