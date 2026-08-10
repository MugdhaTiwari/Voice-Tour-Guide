import { Place } from '../types';

export const DEMO_PLACES: Place[] = [
  {
    id: 'india-gate',
    name: 'India Gate',
    city: 'New Delhi',
    category: 'History',
    distance: 'You are here',
    shortDescription: '42-meter triumphal arch war memorial designed by Sir Edwin Lutyens.',
    fullDescription: 'India Gate is a magnificent war memorial situated along the Rajpath in New Delhi. It honors over 84,000 soldiers of the British Indian Army who lost their lives in the First World War and Third Anglo-Afghan War.',
    facts: [
      'Stands 42 meters high and was designed by Sir Edwin Lutyens',
      'Inscribed with names of 13,300 servicemen',
      'The Amar Jawan Jyoti eternal flame burned here under the arch from 1972 until its integration with the National War Memorial in 2022',
      'Built with pale red sandstone and granite from Bharatpur'
    ],
    tags: ['war memorial', 'history', 'architecture', 'lutyens delhi', 'rajpath', 'iconic'],
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.6129,
      longitude: 77.2295
    },
    recommendedWhy: 'Prime historical starting point with expansive green lawns and evening illuminations.',
    bestTimeToVisit: 'Late afternoon to sunset (5:00 PM - 7:30 PM)',
    audioHighlights: 'Hear the echo of 1920s architecture and the story behind the solemn memorial arch.'
  },
  {
    id: 'national-museum',
    name: 'National Museum',
    city: 'New Delhi',
    category: 'Art',
    distance: '0.8 km (10 min walk)',
    shortDescription: 'India\'s premier museum showcasing 5,000 years of civilization relics and art.',
    fullDescription: 'Located on Janpath, the National Museum holds over 200,000 works of art spanning prehistoric Harappan relics, Indus Valley treasures like the famous Dancing Girl bronze, Silk Road antiquities, and Mughal miniature paintings.',
    facts: [
      'Houses the famous 4,500-year-old Indus Valley Dancing Girl figurine',
      'Contains sacred relics of Gautama Buddha excavated from Piprahwa',
      'Features an unparalleled gallery of Tanjore paintings and Chola bronzes',
      'Opened to the public in 1949 and moved to its current location in 1960'
    ],
    tags: ['museum', 'art', 'indus valley', 'artifacts', 'sculptures', 'history'],
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.6119,
      longitude: 77.2195
    },
    recommendedWhy: 'Perfect next stop after India Gate for deep cultural immersion away from the sun.',
    bestTimeToVisit: 'Morning 10:00 AM - 1:00 PM (Closed on Mondays)',
    audioHighlights: 'Listen to the mysteries of the Harappan civilization and ancient craftsmanship.'
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    city: 'New Delhi',
    category: 'Architecture',
    distance: '3.2 km (8 min drive)',
    shortDescription: 'UNESCO World Heritage Mughal garden tomb that inspired the Taj Mahal.',
    fullDescription: 'Commissioned by Empress Bega Begum in 1558, this monumental red sandstone mausoleum is the earliest example of Mughal garden tomb architecture in the Indian subcontinent.',
    facts: [
      'First garden-tomb on the Indian subcontinent, built in 1565-1572',
      'Direct architectural inspiration for the Taj Mahal in Agra',
      'Features classical Persian Charbagh (four-fold garden) layout with water channels',
      'Restored meticulously by the Aga Khan Trust for Culture'
    ],
    tags: ['unesco', 'mughal', 'architecture', 'garden tomb', 'taj mahal predecessor'],
    imageUrl: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.5933,
      longitude: 77.2507
    },
    recommendedWhy: 'Breathtaking symmetry and peaceful water gardens beloved by architecture enthusiasts.',
    bestTimeToVisit: 'Early morning (6:30 AM - 9:00 AM) for golden sunlight photography',
    audioHighlights: 'The poignant love story of Bega Begum and Persian architect Mirak Mirza Ghiyas.'
  },
  {
    id: 'heritage-cafe',
    name: 'Triveni Terrace Heritage Café',
    city: 'New Delhi',
    category: 'Food',
    distance: '1.4 km (4 min auto)',
    shortDescription: 'Artistic open-air terrace famous for artisanal masala chai and regional delicacies.',
    fullDescription: 'Tucked inside the Triveni Kala Sangam art complex on Tansen Marg, this tranquil terrace café is a favorite gathering spot for Delhi artists, theater performers, and travelers seeking authentic homestyle savory snacks.',
    facts: [
      'Legendary for its Shami Kebabs, Gunpowder Idlis, and Apple Cinnamon Cake',
      'Overlooks an intimate open-air amphitheater with lush climbing creepers',
      'Adjoins several rotating contemporary art galleries and pottery studios',
      'Founded in the 1960s as a cultural haven for classical Indian arts'
    ],
    tags: ['café', 'food', 'terrace', 'artisan chai', 'cultural hangout', 'local flavor'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.6255,
      longitude: 77.2341
    },
    recommendedWhy: 'Unwind with fragrant cardamom tea while discussing the monuments you just visited.',
    bestTimeToVisit: '4:00 PM - 7:00 PM for tea and sunset ambience',
    audioHighlights: 'Delhi culinary stories and the bohemian roots of Mandi House arts district.'
  },
  {
    id: 'agrasen-baoli',
    name: 'Agrasen ki Baoli',
    city: 'New Delhi',
    category: 'History',
    distance: '1.8 km (6 min drive)',
    shortDescription: 'Hidden 14th-century stepwell with 108 stone steps descending into cool serenity.',
    fullDescription: 'A protected heritage stepwell nestled among the skyscrapers of central Delhi. Believed to have been built by the legendary King Agrasen and rebuilt in the 14th century during the Tughlaq or Lodi era.',
    facts: [
      '60-meter-long and 15-meter-wide historical water reservoir with 108 steps',
      'Designed to capture monsoon rains and offer cool subterranean resting alcoves',
      'Famous in folklore and featured in celebrated Indian cinema like PK and Sultan',
      'Stark contrasting architecture surrounded by modern modern glass towers'
    ],
    tags: ['stepwell', 'hidden gem', 'ancient engineering', 'haunted folklore', 'stone masonry'],
    imageUrl: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.6258,
      longitude: 77.2250
    },
    recommendedWhy: 'A serene medieval stepwell hidden in plain sight right off Hailey Road.',
    bestTimeToVisit: 'Late morning before midday shadows',
    audioHighlights: 'Ancient rainwater harvesting secrets and the whispering stone arches.'
  },
  {
    id: 'lodhi-gardens',
    name: 'Lodhi Gardens & Art District',
    city: 'New Delhi',
    category: 'Nature',
    distance: '2.5 km (7 min drive)',
    shortDescription: '90-acre heritage botanical park with 15th-century Sayyid & Lodhi mausoleums.',
    fullDescription: 'A sprawling city park combining 15th-century historical tombs with landscaped botanical walking paths, ancient stone bridges, bonsai gardens, and nearby street art murals in Lodhi Colony.',
    facts: [
      'Contains the Mohammed Shah Tomb (1444) and Sikandar Lodi Tomb',
      'Home to over 110 species of trees and resident bird populations like parakeets',
      'Features the Athpula (eight-piered) stone bridge built during Emperor Akbar\'s reign',
      'Adjacent to India\'s first open-air public art district with massive street murals'
    ],
    tags: ['gardens', 'nature', 'parks', 'street art', 'peaceful walks', 'birdwatching'],
    imageUrl: 'https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?auto=format&fit=crop&w=800&q=80',
    coordinates: {
      latitude: 28.5931,
      longitude: 77.2197
    },
    recommendedWhy: 'Ideal for peaceful walking, fresh air, and encountering Delhi\'s vibrant birdlife.',
    bestTimeToVisit: 'Morning sunrise (6:00 AM - 8:30 AM)',
    audioHighlights: 'Medieval architectural transitions from the Lodhi Sultanate to early Mughal era.'
  }
];

export const POPULAR_LANGUAGES = [
  {
    code: 'en' as const,
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇬🇧',
    sampleGreeting: 'Hello! I am NEARO, your voice tour guide.'
  },
  {
    code: 'hi' as const,
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    sampleGreeting: 'नमस्ते! मैं नीरो हूँ, आपका वॉइस टूर गाइड।'
  },
  {
    code: 'es' as const,
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    sampleGreeting: '¡Hola! Soy NEARO, tu guía turístico de voz.'
  },
  {
    code: 'fr' as const,
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    sampleGreeting: 'Bonjour! Je suis NEARO, votre guide vocal.'
  }
];
