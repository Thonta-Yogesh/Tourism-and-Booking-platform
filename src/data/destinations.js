// Destinations data — extracted from Angular DestinationsService
// Plain JavaScript module replacing TypeScript service + RxJS Observable

export const destinations = [
  {
    id: 1,
    name: 'Bali',
    description: 'A beautiful island in Indonesia known for its lush forests, stunning temples, and beautiful beaches.',
    location: 'Indonesia',
    imageUrl: '/assets/images/destinations/bali/main.jpg',
    price: 1200,
    rating: 4.8,
    type: 'Beach',
    popularity: 'High',
    images: [
      '/assets/images/destinations/bali/1.jpg',
      '/assets/images/destinations/bali/2.jpg',
      '/assets/images/destinations/bali/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'April to October',
      language: 'Balinese',
      currency: 'Indonesian Rupiah (IDR)'
    },
    highlights: ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Kuta Beach'],
    duration: '5 Days / 4 Nights',
    reviews: [
      { author: 'John Smith', avatar: '/assets/images/avatars/avatar-1.jpg', rating: 5, text: 'Bali was absolutely stunning! The tour was perfectly organized.', date: 'June 2025' },
      { author: 'Sarah Johnson', avatar: '/assets/images/avatars/avatar-2.jpg', rating: 5, text: 'The temples were breathtaking and the food was amazing!', date: 'May 2025' },
      { author: 'Mike Davis', avatar: '/assets/images/avatars/avatar-3.jpg', rating: 4, text: 'Stunning sunsets at Uluwatu. Highly recommend this tour.', date: 'July 2025' },
      { author: 'Emma Wilson', avatar: '/assets/images/avatars/avatar-5.jpg', rating: 4, text: 'Crowded but beautiful. The monkeys are cheeky!', date: 'August 2025' },
      { author: 'Ryan Garcia', avatar: '/assets/images/avatars/avatar-6.jpg', rating: 5, text: 'Incredible value for the price. Hotels were top notch.', date: 'September 2025' }
    ]
  },
  {
    id: 2,
    name: 'Paris',
    description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
    location: 'France',
    imageUrl: '/assets/images/destinations/paris/main.jpg',
    price: 1500,
    rating: 4.7,
    type: 'City',
    popularity: 'High',
    images: [
      '/assets/images/destinations/paris/1.jpg',
      '/assets/images/destinations/paris/2.jpg',
      '/assets/images/destinations/paris/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'June to August',
      language: 'French',
      currency: 'Euro (EUR)'
    },
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
    duration: '4 Days / 3 Nights',
    reviews: [
      { author: 'Emily Clark', avatar: '/assets/images/avatars/avatar-5.jpg', rating: 5, text: 'Paris is always a good idea. The itinerary was perfect.', date: 'August 2025' },
      { author: 'James Wilson', avatar: '/assets/images/avatars/avatar-6.jpg', rating: 4, text: 'Loved the Louvre tour. The queues were long but worth it.', date: 'July 2025' },
      { author: 'Sophia Rossi', avatar: '/assets/images/avatars/avatar-7.jpg', rating: 5, text: 'Romantic and beautiful. The dinner cruise was the highlight.', date: 'September 2025' },
      { author: 'Daniel Kim', avatar: '/assets/images/avatars/avatar-8.jpg', rating: 5, text: 'Walked everywhere. The architecture is stunning.', date: 'October 2025' },
      { author: 'Laura Martinez', avatar: '/assets/images/avatars/avatar-9.jpg', rating: 4, text: 'Expensive but worth it for the food alone.', date: 'June 2025' }
    ]
  },
  {
    id: 3,
    name: 'Kyoto',
    description: 'Famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
    location: 'Japan',
    imageUrl: '/assets/images/destinations/kyoto/main.jpg',
    price: 1800,
    rating: 4.9,
    type: 'Cultural',
    popularity: 'Medium',
    images: [
      '/assets/images/destinations/kyoto/1.jpg',
      '/assets/images/destinations/kyoto/2.jpg',
      '/assets/images/destinations/kyoto/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'March to May & October to November',
      language: 'Japanese',
      currency: 'Japanese Yen (JPY)'
    },
    highlights: ['Fushimi Inari-taisha', 'Kinkaku-ji', 'Arashiyama Bamboo Grove'],
    duration: '6 Days / 5 Nights',
    reviews: [
      { author: 'Kenji Sato', avatar: '/assets/images/avatars/avatar-8.jpg', rating: 5, text: 'The atmosphere in Kyoto is unmatched. Arashiyama was serene.', date: 'November 2025' },
      { author: 'Liam Brown', avatar: '/assets/images/avatars/avatar-9.jpg', rating: 5, text: 'Gion district at night is like stepping back in time.', date: 'October 2025' },
      { author: 'Olivia Martin', avatar: '/assets/images/avatars/avatar-10.jpg', rating: 4, text: 'Beautiful temples. A bit crowded but very organized.', date: 'December 2025' },
      { author: 'Hiroshi Tanaka', avatar: '/assets/images/avatars/avatar-11.jpg', rating: 5, text: 'The autumn colors were breathtaking.', date: 'November 2025' },
      { author: 'Sarah Connor', avatar: '/assets/images/avatars/avatar-12.jpg', rating: 5, text: 'Peaceful and spiritual. A must-visit.', date: 'October 2025' }
    ]
  },
  {
    id: 4,
    name: 'Santorini',
    description: 'A beautiful Greek island known for its white-washed buildings and stunning sunsets.',
    location: 'Greece',
    imageUrl: '/assets/images/destinations/santorini/main.jpg',
    price: 2000,
    rating: 4.9,
    type: 'Beach',
    popularity: 'High',
    images: [
      '/assets/images/destinations/santorini/1.jpg',
      '/assets/images/destinations/santorini/2.jpg',
      '/assets/images/destinations/santorini/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'May to October',
      language: 'Greek',
      currency: 'Euro (EUR)'
    },
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera'],
    duration: '5 Days / 4 Nights',
    reviews: [
      { author: 'Ava Taylor', avatar: '/assets/images/avatars/avatar-11.jpg', rating: 5, text: 'The sunsets in Oia are truly world-class. A dream trip.', date: 'June 2025' },
      { author: 'Noah White', avatar: '/assets/images/avatars/avatar-12.jpg', rating: 5, text: 'Crystal clear waters and amazing food. Santorini is paradise.', date: 'May 2025' },
      { author: 'Lucas Harris', avatar: '/assets/images/avatars/avatar-13.jpg', rating: 4, text: 'A bit pricey but the views are worth every penny.', date: 'July 2025' },
      { author: 'Elena Rodriguez', avatar: '/assets/images/avatars/avatar-14.jpg', rating: 5, text: 'Walking through Oia felt like a dream.', date: 'August 2025' },
      { author: 'Mark Stevens', avatar: '/assets/images/avatars/avatar-15.jpg', rating: 5, text: 'Best honeymoon destination ever.', date: 'September 2025' }
    ]
  },
  {
    id: 5,
    name: 'Machu Picchu',
    description: 'An Incan citadel set high in the Andes Mountains in Peru.',
    location: 'Peru',
    imageUrl: '/assets/images/destinations/machu-picchu/main.jpg',
    price: 2200,
    rating: 5.0,
    type: 'Cultural',
    popularity: 'High',
    images: [
      '/assets/images/destinations/machu-picchu/1.jpg',
      '/assets/images/destinations/machu-picchu/2.jpg',
      '/assets/images/destinations/machu-picchu/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'April to October',
      language: 'Spanish',
      currency: 'Sol (PEN)'
    },
    highlights: ['Inca Trail', 'Huayna Picchu', 'Sun Gate'],
    duration: '7 Days / 6 Nights',
    reviews: [
      { author: 'Isabella Garcia', avatar: '/assets/images/avatars/avatar-14.jpg', rating: 5, text: 'Hiking the Inca Trail was a life-changing experience.', date: 'August 2025' },
      { author: 'Mason Martinez', avatar: '/assets/images/avatars/avatar-15.jpg', rating: 5, text: 'The view from the Sun Gate at sunrise is unforgettable.', date: 'September 2025' },
      { author: 'Ethan Robinson', avatar: '/assets/images/avatars/avatar-16.jpg', rating: 5, text: 'Physically demanding but absolutely worth the effort.', date: 'July 2025' },
      { author: 'Maria Santos', avatar: '/assets/images/avatars/avatar-17.jpg', rating: 5, text: 'The guides were incredibly helpful and knowledgeable.', date: 'October 2025' },
      { author: 'Tom Baker', avatar: '/assets/images/avatars/avatar-18.jpg', rating: 4, text: 'Altitude sickness is real, take it slow!', date: 'June 2025' }
    ]
  },
  {
    id: 6,
    name: 'Grand Canyon',
    description: 'One of the most spectacular examples of erosion anywhere on Earth.',
    location: 'USA',
    imageUrl: '/assets/images/destinations/grand-canyon/main.jpg',
    price: 1000,
    rating: 4.8,
    type: 'Nature',
    popularity: 'High',
    images: [
      '/assets/images/destinations/grand-canyon/1.jpg',
      '/assets/images/destinations/grand-canyon/2.jpg',
      '/assets/images/destinations/grand-canyon/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'March to May & September to November',
      language: 'English',
      currency: 'US Dollar (USD)'
    },
    highlights: ['South Rim', 'Colorado River', 'Bright Angel Trail'],
    duration: '3 Days / 2 Nights',
    reviews: [
      { author: 'Charlotte Lee', avatar: '/assets/images/avatars/avatar-1.jpg', rating: 5, text: 'The sheer scale of the Grand Canyon is humbling.', date: 'April 2025' },
      { author: 'William Davis', avatar: '/assets/images/avatars/avatar-2.jpg', rating: 5, text: 'Sunrise at the South Rim is an experience unlike any other.', date: 'March 2025' },
      { author: 'Amelia Moore', avatar: '/assets/images/avatars/avatar-3.jpg', rating: 4, text: 'The helicopter tour was incredible. Highly recommend.', date: 'May 2025' },
      { author: 'Henry Wilson', avatar: '/assets/images/avatars/avatar-4.jpg', rating: 5, text: 'Hiked down Bright Angel Trail. Challenging but rewarding.', date: 'October 2025' },
      { author: 'Mia Thompson', avatar: '/assets/images/avatars/avatar-5.jpg', rating: 4, text: 'Beautiful at every angle. The stargazing at night was exceptional.', date: 'September 2025' }
    ]
  },
  {
    id: 7,
    name: 'Swiss Alps',
    description: 'A winter wonderland of spectacular mountains, ski resorts, and charming villages.',
    location: 'Switzerland',
    imageUrl: '/assets/images/destinations/swiss-alps/main.jpg',
    price: 2500,
    rating: 4.9,
    type: 'Mountain',
    popularity: 'Medium',
    images: [
      '/assets/images/destinations/swiss-alps/1.jpg',
      '/assets/images/destinations/swiss-alps/2.jpg',
      '/assets/images/destinations/swiss-alps/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'December to March & June to August',
      language: 'German, French, Italian',
      currency: 'Swiss Franc (CHF)'
    },
    highlights: ['Jungfraujoch', 'Matterhorn', 'Grindelwald'],
    duration: '6 Days / 5 Nights',
    reviews: [
      { author: 'Oliver Jackson', avatar: '/assets/images/avatars/avatar-6.jpg', rating: 5, text: 'Skiing in the Swiss Alps was a dream come true.', date: 'January 2026' },
      { author: 'Sophie Turner', avatar: '/assets/images/avatars/avatar-7.jpg', rating: 5, text: 'The views from Jungfraujoch are absolutely breathtaking.', date: 'February 2026' },
      { author: 'Luca Ferrari', avatar: '/assets/images/avatars/avatar-8.jpg', rating: 5, text: 'The village of Grindelwald is charming and picturesque.', date: 'December 2025' },
      { author: 'Ingrid Bergman', avatar: '/assets/images/avatars/avatar-9.jpg', rating: 4, text: 'Expensive but absolutely worth it for the scenery.', date: 'January 2026' },
      { author: 'Max Schneider', avatar: '/assets/images/avatars/avatar-10.jpg', rating: 5, text: 'The train rides through the Alps are magical.', date: 'February 2026' }
    ]
  },
  {
    id: 8,
    name: 'Dubai',
    description: 'A city of superlatives, known for luxury shopping, ultramodern architecture and a lively nightlife.',
    location: 'UAE',
    imageUrl: '/assets/images/destinations/dubai/main.jpg',
    price: 1600,
    rating: 4.6,
    type: 'City',
    popularity: 'High',
    images: [
      '/assets/images/destinations/dubai/1.jpg',
      '/assets/images/destinations/dubai/2.jpg',
      '/assets/images/destinations/dubai/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'November to March',
      language: 'Arabic',
      currency: 'UAE Dirham (AED)'
    },
    highlights: ['Burj Khalifa', 'The Dubai Mall', 'Palm Jumeirah'],
    duration: '5 Days / 4 Nights',
    reviews: [
      { author: 'Alexander Scott', avatar: '/assets/images/avatars/avatar-3.jpg', rating: 5, text: 'Dubai is the future. The architecture is mind-blowing.', date: 'December 2025' },
      { author: 'Mia King', avatar: '/assets/images/avatars/avatar-4.jpg', rating: 4, text: 'Very modern and clean. The shopping is endless.', date: 'November 2025' },
      { author: 'Daniel Wright', avatar: '/assets/images/avatars/avatar-5.jpg', rating: 5, text: 'The desert safari and Burj Khalifa view were highlights.', date: 'January 2026' },
      { author: 'Fatima Al-Sayed', avatar: '/assets/images/avatars/avatar-6.jpg', rating: 5, text: 'Luxury defined. The service is impeccable.', date: 'February 2026' },
      { author: 'John Doe', avatar: '/assets/images/avatars/avatar-7.jpg', rating: 4, text: 'Hot, but the malls are air conditioned paradise.', date: 'March 2026' }
    ]
  },
  {
    id: 9,
    name: 'Rome',
    description: 'The capital city of Italy. It is famous for its history, art, architecture, and monuments.',
    location: 'Italy',
    imageUrl: '/assets/images/destinations/rome/main.jpg',
    price: 1400,
    rating: 4.8,
    type: 'City',
    popularity: 'High',
    images: [
      '/assets/images/destinations/rome/1.jpg',
      '/assets/images/destinations/rome/2.jpg',
      '/assets/images/destinations/rome/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'October to April',
      language: 'Italian',
      currency: 'Euro (EUR)'
    },
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    duration: '5 Days / 4 Nights',
    reviews: [
      { author: 'Grace Lopez', avatar: '/assets/images/avatars/avatar-6.jpg', rating: 5, text: 'History around every corner. The food is incredible.', date: 'October 2025' },
      { author: 'Jack Hill', avatar: '/assets/images/avatars/avatar-7.jpg', rating: 4, text: 'The Colosseum tour was very informative. A must-visit.', date: 'September 2025' },
      { author: 'Chloe Green', avatar: '/assets/images/avatars/avatar-8.jpg', rating: 5, text: 'Vatican City was awe-inspiring. Rome captured my heart.', date: 'November 2025' },
      { author: 'Mario Rossi', avatar: '/assets/images/avatars/avatar-9.jpg', rating: 5, text: 'Pizza, pasta, and history. What more could you want?', date: 'October 2025' },
      { author: 'Julia Styles', avatar: '/assets/images/avatars/avatar-10.jpg', rating: 4, text: 'Beautiful chaos. Watch out for scooters!', date: 'September 2025' }
    ]
  },
  {
    id: 10,
    name: 'New York',
    description: 'The city that never sleeps. Known for its skyscrapers, Broadway shows, and diverse culture.',
    location: 'USA',
    imageUrl: '/assets/images/destinations/new-york/main.jpg',
    price: 1900,
    rating: 4.7,
    type: 'City',
    popularity: 'High',
    images: [
      '/assets/images/destinations/new-york/1.jpg',
      '/assets/images/destinations/new-york/2.jpg',
      '/assets/images/destinations/new-york/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'April to June & September to November',
      language: 'English',
      currency: 'US Dollar (USD)'
    },
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty'],
    duration: '4 Days / 3 Nights',
    reviews: [
      { author: 'Sebastian Adams', avatar: '/assets/images/avatars/avatar-9.jpg', rating: 5, text: 'The energy in NYC is unlike anywhere else. Loved the subway.', date: 'May 2025' },
      { author: 'Zoe Baker', avatar: '/assets/images/avatars/avatar-10.jpg', rating: 4, text: 'Central Park is a nice escape from the city hustle.', date: 'June 2025' },
      { author: 'Matthew Gonzalez', avatar: '/assets/images/avatars/avatar-11.jpg', rating: 5, text: 'Broadway show was fantastic! A classic NYC experience.', date: 'April 2025' },
      { author: 'Rachel Green', avatar: '/assets/images/avatars/avatar-12.jpg', rating: 5, text: 'Shopping on 5th Avenue was a dream.', date: 'May 2025' },
      { author: 'Ross Geller', avatar: '/assets/images/avatars/avatar-13.jpg', rating: 4, text: 'Museums are world class. Dinosaurs!', date: 'June 2025' }
    ]
  },
  {
    id: 11,
    name: 'Cairo',
    description: 'The capital of Egypt and the largest city in the Arab world. Famous for the Giza Pyramids.',
    location: 'Egypt',
    imageUrl: '/assets/images/destinations/cairo/main.jpg',
    price: 1100,
    rating: 4.6,
    type: 'Cultural',
    popularity: 'Medium',
    images: [
      '/assets/images/destinations/cairo/1.jpg',
      '/assets/images/destinations/cairo/2.jpg',
      '/assets/images/destinations/cairo/3.jpg'
    ],
    tourismInfo: {
      bestTimeToVisit: 'October to April',
      language: 'Arabic',
      currency: 'Egyptian Pound (EGP)'
    },
    highlights: ['Great Sphinx', 'Giza Necropolis', 'Khan el-Khalili'],
    duration: '6 Days / 5 Nights',
    reviews: [
      { author: 'Victoria Nelson', avatar: '/assets/images/avatars/avatar-12.jpg', rating: 5, text: 'Seeing the Pyramids in person is a surreal experience.', date: 'November 2025' },
      { author: 'Joseph Carter', avatar: '/assets/images/avatars/avatar-13.jpg', rating: 4, text: 'Chaotic but charming. The history is overwhelming.', date: 'December 2025' },
      { author: 'Lily Mitchell', avatar: '/assets/images/avatars/avatar-14.jpg', rating: 4, text: 'The museum is a treasure trove. Guide was excellent.', date: 'January 2026' },
      { author: 'Omar Sharif', avatar: '/assets/images/avatars/avatar-15.jpg', rating: 5, text: 'The Nile cruise at dinner is magical.', date: 'February 2026' },
      { author: "Sarah O'Connor", avatar: '/assets/images/avatars/avatar-16.jpg', rating: 4, text: 'Pyramids are bigger than you imagine.', date: 'March 2026' }
    ]
  }
]

export function getDestinations() {
  return destinations
}

export function getDestinationById(id) {
  return destinations.find(d => d.id === Number(id)) || null
}

export function getTopDestinations(limit = 6) {
  return [...destinations]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}
