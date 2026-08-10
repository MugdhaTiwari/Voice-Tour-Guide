import { KnowledgeItem, LanguageCode } from '../types';

export const DEMO_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'india-gate',
    name: 'India Gate',
    location: 'New Delhi',
    category: 'History',
    tags: ['war memorial', 'lutyens', 'history', 'rajpath', 'first world war', 'monument'],
    relatedAttractions: ['national-museum', 'agrasen-baoli', 'humayuns-tomb'],
    overview: {
      en: 'This is India Gate, a grand 42-meter triumphal arch war memorial located in the heart of New Delhi along the Kartavya Path. It honors over 84,000 soldiers of the British Indian Army who lost their lives between 1914 and 1921.',
      hi: 'यह इंडिया गेट है, नई दिल्ली के कर्तव्य पथ पर स्थित 42 मीटर ऊँचा भव्य युद्ध स्मारक। यह 1914 से 1921 के बीच प्रथम विश्व युद्ध और अफगान युद्ध में शहीद हुए 84,000 से अधिक वीर सैनिकों की स्मृति में बनाया गया है।',
      es: 'Esta es la Puerta de la India, un impresionante arco de triunfo conmemorativo de 42 metros de altura ubicado en Nueva Delhi. Rinde homenaje a más de 84,000 soldados del ejército indio.',
      fr: "Voici la Porte de l'Inde (India Gate), un majestueux arc de triomphe commémoratif de 42 mètres situé à New Delhi, rendant hommage à plus de 84 000 soldats tombés au combat."
    },
    whyBuilt: {
      en: 'India Gate was built to commemorate the valiant Indian and British soldiers who died fighting in World War I in France, Flanders, Mesopotamia, and East Africa, as well as the Third Anglo-Afghan War. The foundation stone was laid in February 1921 by the Duke of Connaught.',
      hi: 'इंडिया गेट का निर्माण प्रथम विश्व युद्ध और तीसरे अफगान युद्ध में बलिदान देने वाले भारतीय सैनिकों के सम्मान में किया गया था। इसकी आधारशिला फरवरी 1921 में ड्यूक ऑफ कनॉट द्वारा रखी गई थी।',
      es: 'Fue construido para conmemorar a los valientes soldados que murieron luchando en la Primera Guerra Mundial y en la Tercera Guerra Anglo-Afgana. Su piedra fundamental fue colocada en 1921.',
      fr: 'Il a été érigé pour commémorer les soldats tombés lors de la Première Guerre mondiale et de la troisième guerre anglo-afghane. La première pierre a été posée en 1921.'
    },
    history: {
      en: 'Designed by renowned British architect Sir Edwin Lutyens, India Gate took a decade to complete and was officially dedicated in 1931. Lutyens drew inspiration from the Arc de Triomphe in Paris, using pale red and yellow sandstone quarried from Bharatpur.',
      hi: 'प्रसिद्ध वास्तुकार सर एडविन लुटियंस द्वारा डिजाइन किए गए इस स्मारक को बनने में 10 साल लगे और 1931 में इसका उद्घाटन हुआ। इसकी वास्तुकला पेरिस के आर्क डी ट्रायम्फ से प्रेरित है।',
      es: 'Diseñado por el arquitecto Sir Edwin Lutyens, tardó diez años en completarse y se inauguró en 1931. Se inspira en el Arco del Triunfo de París.',
      fr: "Conçu par le célèbre architecte Sir Edwin Lutyens, il a fallu dix ans pour l'achever et a été inauguré en 1931, s'inspirant de l'Arc de Triomphe de Paris."
    },
    nearbyRecommendation: {
      en: 'Nearby, you can explore the National Museum just 800 meters west on Janpath to discover ancient Indus Valley artifacts, or visit the tranquil 14th-century Agrasen ki Baoli stepwell on Hailey Road.',
      hi: 'पास में ही, आप 800 मीटर की दूरी पर राष्ट्रीय संग्रहालय देख सकते हैं जहाँ हड़प्पा सभ्यता की अनमोल कलाकृतियाँ हैं, या फिर शांत अग्रसेन की बावली जा सकते हैं।',
      es: 'Cerca de aquí, puedes visitar el Museo Nacional a solo 800 metros para ver tesoros de la civilización del Indo, o el histórico pozo escalonado Agrasen ki Baoli.',
      fr: "À proximité, vous pouvez explorer le Musée National à seulement 800 mètres sur Janpath, ou visiter le puits à degrés médiéval d'Agrasen ki Baoli."
    },
    interestingFacts: {
      en: [
        'Over 13,300 soldiers names, including some British officers, are engraved on the arch walls.',
        'The Amar Jawan Jyoti was established here in 1972 after the Indo-Pak War and burned continuously for 50 years.',
        'At night, the arch is illuminated with dramatic tricolor lights reflecting on the surrounding water fountains.'
      ],
      hi: [
        'स्मारक की दीवारों पर 13,300 से अधिक सैनिकों के नाम उत्कीर्ण हैं।',
        'यहाँ 1972 से प्रज्ज्वलित अमर जवान ज्योति 50 वर्षों तक लगातार जलती रही।',
        'शाम को यह तिरंगे की खूबसूरत रोशनी और फव्वारों से जगमगा उठता है।'
      ],
      es: [
        'Más de 13,300 nombres de soldados están grabados en las paredes del arco.',
        'La llama eterna Amar Jawan Jyoti ardió aquí durante 50 años.',
        'Por la noche se ilumina con los colores nacionales de la India.'
      ],
      fr: [
        'Plus de 13 300 noms de soldats sont gravés sur les murs du monument.',
        'La flamme éternelle Amar Jawan Jyoti a brûlé ici pendant 50 ans.',
        'La nuit, le monument est magnifiquement illuminé aux couleurs du drapeau indien.'
      ]
    }
  },
  {
    id: 'national-museum',
    name: 'National Museum',
    location: 'New Delhi',
    category: 'Art',
    tags: ['museum', 'art', 'indus valley', 'sculpture', 'buddha relics', 'janpath'],
    relatedAttractions: ['india-gate', 'heritage-cafe', 'agrasen-baoli'],
    overview: {
      en: 'The National Museum is one of India\'s largest cultural institutions. It houses extraordinary treasures spanning 5,000 years, including the famous bronze Dancing Girl from Harappa, Sacred Buddha relics, and rare Silk Road manuscripts.',
      hi: 'राष्ट्रीय संग्रहालय भारत का सबसे बड़ा सांस्कृतिक संग्रहालय है। यहाँ 5,000 वर्षों का इतिहास संरक्षित है, जिसमें प्रसिद्ध हड़प्पा की नर्तकी की कांस्य मूर्ति और भगवान बुद्ध के पवित्र अवशेष शामिल हैं।',
      es: 'El Museo Nacional es una de las instituciones culturales más importantes de la India. Alberga más de 200,000 obras de arte desde la civilización del Valle del Indo hasta la era moderna.',
      fr: "Le Musée National est l'un des plus grands musées d'Inde, abritant 5 000 ans de trésors artistiques, notamment la célèbre statue de la Danseuse d'Harappa et les reliques du Bouddha."
    },
    whyBuilt: {
      en: 'It was conceived after the grand 1947 exhibition of Indian art at Burlington House in London. The exhibition generated such worldwide awe that leaders decided to create a permanent national repository in Delhi.',
      hi: 'इसकी स्थापना 1947 में लंदन में आयोजित भारतीय कला की भव्य प्रदर्शनी के बाद की गई थी, ताकि भारत की समृद्ध ऐतिहासिक धरोहर को एक छत के नीचे सहेजा जा सके।',
      es: 'Fue concebido tras el éxito de una histórica exposición de arte indio en Londres en 1947, para conservar el patrimonio milenario de la nación.',
      fr: "Il a été créé après le succès d'une exposition majeure d'art indien à Londres en 1947 pour rassembler et préserver l'héritage artistique indien."
    },
    history: {
      en: 'Inaugurated at the Rashtrapati Bhavan in 1949 and moved to its present Janpath building in 1960, its foundation stone was laid by Prime Minister Jawaharlal Nehru.',
      hi: 'इसकी शुरुआत 1949 में राष्ट्रपति भवन में हुई और 1960 में जनपथ स्थित मौजूदा इमारत में स्थानांतरित किया गया, जिसका शिलान्यास पंडित नेहरू ने किया था।',
      es: 'Fue inaugurado en 1949 y trasladado a su edificio actual en 1960 por el Primer Ministro Jawaharlal Nehru.',
      fr: 'Inauguré en 1949 et installé dans son bâtiment actuel en 1960, sa première pierre fut posée par Jawaharlal Nehru.'
    },
    nearbyRecommendation: {
      en: 'After exploring the museum, you can walk 5 minutes to Triveni Terrace Café for refreshing masala chai, or take a short auto ride to Humayun\'s Tomb.',
      hi: 'संग्रहालय देखने के बाद आप पास ही त्रिवेणी टेरेस कैफे में चाय की चुस्की ले सकते हैं या हुमायूँ का मकबरा देखने जा सकते हैं।',
      es: 'Después del museo, puedes caminar al Triveni Terrace Café para degustar un té masala artesanal.',
      fr: 'Après le musée, vous pouvez rejoindre le Triveni Terrace Café pour savourer un thé masala indien.'
    },
    interestingFacts: {
      en: [
        'The 4,500-year-old Dancing Girl bronze is only 10.5 centimeters tall but embodies astonishing metallurgical mastery.',
        'It has an exclusive gallery of Tanjore gold leaf paintings and Chola Dynasty bronze masterpieces.'
      ],
      hi: [
        '4,500 साल पुरानी डांसिंग गर्ल की मूर्ति मात्र 10.5 सेमी ऊँची है लेकिन अद्भुत धातु कला का प्रमाण है।',
        'यहाँ भगवान बुद्ध के अवशेषों वाला एक विशेष स्वर्ण मंडप भी है।'
      ],
      es: [
        'La figura de bronce de la Chica Bailarina tiene 4,500 años y mide solo 10.5 cm.',
        'Posee una galería exclusiva de pinturas con láminas de oro de Tanjore.'
      ],
      fr: [
        "La Danseuse d'Harappa en bronze a 4 500 ans et ne mesure que 10,5 cm de hauteur.",
        "Le musée abrite une précieuse collection de peintures royales à la feuille d'or."
      ]
    }
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    location: 'New Delhi',
    category: 'Architecture',
    tags: ['mughal', 'unesco', 'architecture', 'garden tomb', 'taj mahal predecessor'],
    relatedAttractions: ['lodhi-gardens', 'india-gate', 'national-museum'],
    overview: {
      en: "Humayun's Tomb is a UNESCO World Heritage site and the grand precursor to the Taj Mahal. Built in 1570 by Empress Bega Begum, it introduced the Persian four-part Charbagh garden tomb concept to India.",
      hi: 'हुमायूँ का मकबरा यूनेस्को विश्व धरोहर स्थल है और ताजमहल का पूर्ववर्ती रूप माना जाता है। 1570 में महारानी बेगा बेगम द्वारा निर्मित, यह भारत का पहला भव्य चारबाग उद्यान मकबरा है।',
      es: "La Tumba de Humayun es Patrimonio de la Humanidad por la UNESCO y la inspiración directa del Taj Mahal. Fue construida en 1570 con jardines de estilo persa Charbagh.",
      fr: "Le tombeau de Humayun est un chef-d'œuvre classé au patrimoine mondial de l'UNESCO et le précurseur direct du Taj Mahal, achevé en 1570."
    },
    whyBuilt: {
      en: 'It was commissioned by Empress Bega Begum as a loving eternal memorial for her husband, the second Mughal Emperor Humayun, symbolizing the celestial paradise on Earth.',
      hi: 'यह मकबरा महारानी बेगा बेगम ने अपने पति मुग़ल सम्राट हुमायूँ की याद में बनवाया था, जो पृथ्वी पर जन्नत के बगीचे का प्रतीक है।',
      es: 'Fue encargado por la emperatriz Bega Begum en memoria de su esposo, el segundo emperador mogol Humayun.',
      fr: "Il a été commandé par l'impératrice Bega Begum en hommage d'amour éternel à son époux, le second empereur moghol Humayun."
    },
    history: {
      en: 'Persian architect Mirak Mirza Ghiyas designed the structure, combining red sandstone with white marble inlays. It served as a refuge during the 1857 war before being conserved back to glory.',
      hi: 'ईरानी वास्तुकार मीरक मिर्जा गियास ने इसका नक्शा बनाया था, जिसमें लाल बलुआ पत्थर और सफेद संगमरमर का नायाब संगम है।',
      es: 'El arquitecto persa Mirak Mirza Ghiyas diseñó la estructura combinando arenisca roja e incrustaciones de mármol blanco.',
      fr: "L'architecte persan Mirak Mirza Ghiyas a conçu l'édifice en mariant grès rouge et marbre blanc raffiné."
    },
    nearbyRecommendation: {
      en: 'Just 10 minutes away are the tranquil Lodhi Gardens with 15th-century stone tombs and blooming floral pathways.',
      hi: 'यहाँ से सिर्फ 10 मिनट की दूरी पर हरे-भरे लोधी गार्डन हैं जहाँ ऐतिहासिक मकबरे और खूबसूरत रास्ते हैं।',
      es: 'A solo 10 minutos se encuentran los tranquilos Jardines Lodhi.',
      fr: 'À seulement 10 minutes se trouvent les paisibles Jardins de Lodhi.'
    },
    interestingFacts: {
      en: [
        'It is known as the "Dormitory of the Mughals" because over 150 members of the royal family are buried here.',
        'The water channels were engineered to maintain a flowing cooling effect throughout the summer.'
      ],
      hi: [
        'इसे "मुगलों का शयनागार" भी कहा जाता है क्योंकि यहाँ राजपरिवार के 150 से अधिक सदस्य दफन हैं।',
        'उद्यानों की जल नहरें गर्मियों में प्राकृतिक शीतलता बनाए रखने के लिए बनाई गई थीं।'
      ],
      es: [
        'Se le conoce como el "Dormitorio de los Mogoles" porque aquí reposan más de 150 miembros de la dinastía.',
        'El sistema hidráulico mantenía los jardines frescos en los calurosos veranos.'
      ],
      fr: [
        'Il est surnommé le "Dortoir des Moghols" car plus de 150 membres de la famille royale y sont inhumés.',
        'Son ingénieux système de canaux offrait une fraîcheur naturelle aux jardins.'
      ]
    }
  }
];

export const GENERAL_DEMO_QA: Record<string, Record<LanguageCode, { answer: string; relatedPlaceId?: string; followUps: string[] }>> = {
  'tell me about this place': {
    en: {
      answer: 'This is India Gate, a grand 42-meter triumphal arch war memorial in New Delhi. It honors over 84,000 soldiers who served and sacrificed their lives in the First World War and Third Anglo-Afghan War.',
      relatedPlaceId: 'india-gate',
      followUps: ['Why was it built?', 'What can I see nearby?', 'Who designed this arch?']
    },
    hi: {
      answer: 'यह इंडिया गेट है, नई दिल्ली का 42 मीटर ऊँचा प्रसिद्ध युद्ध स्मारक। यह प्रथम विश्व युद्ध और अफगान युद्ध में बलिदान देने वाले 84,000 से अधिक भारतीय सैनिकों की याद में बनाया गया है।',
      relatedPlaceId: 'india-gate',
      followUps: ['यह क्यों बनाया गया था?', 'आसपास क्या देखने लायक है?', 'इसके वास्तुकार कौन थे?']
    },
    es: {
      answer: 'Esta es la Puerta de la India, un majestuoso arco de triunfo militar de 42 metros de altura en Nueva Delhi en honor a más de 84,000 soldados.',
      relatedPlaceId: 'india-gate',
      followUps: ['¿Por qué se construyó?', '¿Qué lugares hay cerca?', '¿Quién diseñó el arco?']
    },
    fr: {
      answer: "Voici la Porte de l'Inde, un arc de triomphe de 42 mètres situé au cœur de New Delhi, honorant plus de 84 000 soldats.",
      relatedPlaceId: 'india-gate',
      followUps: ['Pourquoi a-t-elle été construite ?', 'Que voir aux alentours ?', 'Qui est son architecte ?']
    }
  },
  'why was it built': {
    en: {
      answer: 'It was built by the Imperial War Graves Commission to commemorate the valor of Indian soldiers who fought in World War I in France, East Africa, and Mesopotamia. The foundation stone was laid in February 1921.',
      relatedPlaceId: 'india-gate',
      followUps: ['What can I see nearby?', 'Tell me an interesting secret', 'Who designed it?']
    },
    hi: {
      answer: 'इसका निर्माण प्रथम विश्व युद्ध में फ्रांस, मेसोपोटामिया और अफ्रीका में सर्वोच्च बलिदान देने वाले भारतीय सैनिकों की वीरता को अमर करने के लिए किया गया था। इसकी नींव 1921 में रखी गई थी।',
      relatedPlaceId: 'india-gate',
      followUps: ['आसपास क्या देखने लायक है?', 'कोई रोचक तथ्य बताइए', 'किसने बनवाया था?']
    },
    es: {
      answer: 'Fue construida para conmemorar el valor de los soldados que lucharon en la Primera Guerra Mundial y en la Guerra Anglo-Afgana. Su construcción comenzó en 1921.',
      relatedPlaceId: 'india-gate',
      followUps: ['¿Qué hay cerca?', 'Cuéntame un dato curioso', '¿Quién fue el arquitecto?']
    },
    fr: {
      answer: "Elle a été érigée pour honorer le courage des soldats indiens ayant combattu pendant la Première Guerre mondiale. La première pierre fut posée en février 1921.",
      relatedPlaceId: 'india-gate',
      followUps: ['Que voir aux alentours ?', 'Raconte-moi un fait insolite', 'Qui l’a dessinée ?']
    }
  },
  'what can i see nearby': {
    en: {
      answer: 'Just 800 meters west along Janpath is the National Museum, home to 5,000 years of civilization artifacts like the Harappan Dancing Girl. You can also explore the hidden 14th-century stepwell Agrasen ki Baoli or enjoy chai at Triveni Terrace Café.',
      relatedPlaceId: 'national-museum',
      followUps: ['Tell me about the National Museum', 'Tell me about the hidden stepwell', 'Where is good food nearby?']
    },
    hi: {
      answer: 'यहाँ से सिर्फ 800 मीटर की दूरी पर राष्ट्रीय संग्रहालय है जहाँ 5,000 साल पुरानी ऐतिहासिक कलाकृतियाँ हैं। इसके अलावा आप गुप्त अग्रसेन की बावली या त्रिवेणी टेरेस कैफे में चाय का आनंद ले सकते हैं।',
      relatedPlaceId: 'national-museum',
      followUps: ['राष्ट्रीय संग्रहालय के बारे में बताइए', 'अग्रसेन की बावली के बारे में बताइए', 'आसपास अच्छा खाना कहाँ मिलेगा?']
    },
    es: {
      answer: 'A solo 800 metros al oeste se encuentra el Museo Nacional con 5,000 años de historia, y el místico pozo escalonado Agrasen ki Baoli.',
      relatedPlaceId: 'national-museum',
      followUps: ['Háblame del Museo Nacional', 'Háblame del pozo escalonado', '¿Dónde puedo comer algo típico?']
    },
    fr: {
      answer: "À seulement 800 mètres à l'ouest, vous trouverez le Musée National avec 5 000 ans d'histoire et le puits à degrés d'Agrasen ki Baoli.",
      relatedPlaceId: 'national-museum',
      followUps: ['Parle-moi du Musée National', 'Parle-moi du puits médiéval', 'Où manger un bon plat local ?']
    }
  }
};
