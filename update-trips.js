const fs = require('fs');

let scriptJs = fs.readFileSync('script.js', 'utf8');

// Replace all 'assets/xxxxx.jpg' with 'https://picsum.photos/seed/xxxxx/800/600'
scriptJs = scriptJs.replace(/image:\s*'assets\/([a-zA-Z0-9_-]+)\.jpg'/g, "image: 'https://picsum.photos/seed/$1/800/600'");

// Add new trips to the end of the array
const newTrips = `,
        {
            id: 'tadoba',
            name: 'Tadoba Tiger Safari',
            category: 'wildlife',
            price: 7500,
            date: getNextWeekend(1),
            duration: '2 Days, 1 Night',
            badge: 'Trending',
            image: 'https://picsum.photos/seed/tadoba/800/600',
            alt: 'Majestic Bengal tiger walking through the dry deciduous forest of Tadoba Andhari Tiger Reserve',
            desc: 'The best tiger spotting destination in India. Jungle safaris and wild nature in Maharashtra.',
            highlights: ['Morning & Evening Safari', 'Tiger spotting', 'Bamboo forest stay', 'Campfire dinner'],
            stay: 'Jungle Lodge'
        },
        {
            id: 'kuntala',
            name: 'Kuntala Waterfalls',
            category: 'nature',
            price: 3500,
            date: getNextWeekend(0),
            duration: '1 Day',
            badge: 'Monsoon Special',
            image: 'https://picsum.photos/seed/kuntala/800/600',
            alt: 'Roaring Kuntala waterfalls in Adilabad district cascading down tiered rocks amidst dense green forest',
            desc: 'The highest waterfall in Telangana. A perfect monsoon road trip just a few hours north.',
            highlights: ['Waterfall trek', 'Pochera Falls visit', 'Forest drive', 'Local tribal food'],
            stay: 'Day trip'
        },
        {
            id: 'pench',
            name: 'Pench National Park',
            category: 'wildlife',
            price: 8500,
            date: getNextWeekend(2),
            duration: '2 Days, 2 Nights',
            badge: 'Premium',
            image: 'https://picsum.photos/seed/pench/800/600',
            alt: 'Dense teak forest of Pench National Park with a spotted leopard resting on a tree branch',
            desc: 'The real-life inspiration for The Jungle Book. Incredible wildlife and premium forest resorts.',
            highlights: ['Open jeep safari', 'Leopard tracking', 'Jungle Walk', 'Luxury tent stay'],
            stay: 'Luxury Tents'
        },
        {
            id: 'ajanta',
            name: 'Ajanta & Ellora Caves',
            category: 'heritage',
            price: 6500,
            date: getNextWeekend(3),
            duration: '2 Days, 1 Night',
            image: 'https://picsum.photos/seed/ajanta/800/600',
            alt: 'Ancient rock-cut caves of Ajanta featuring incredible Buddhist murals and massive carved pillars',
            desc: 'Overnight journey to Aurangabad. Explore the mind-blowing ancient rock-cut architecture.',
            highlights: ['Guided heritage tour', 'Kailasa Temple', 'Ajanta murals', 'Aurangabad food tour'],
            stay: 'Boutique Hotel'
        },
        {
            id: 'nanded',
            name: 'Hazur Sahib Nanded',
            category: 'heritage',
            price: 4500,
            date: getNextWeekend(1),
            duration: '2 Days, 1 Night',
            image: 'https://picsum.photos/seed/nanded/800/600',
            alt: 'Beautiful glowing white Gurudwara Hazur Sahib in Nanded illuminated at night with a calm sarovar',
            desc: 'A peaceful spiritual journey to one of the five takhts in Sikhism. Calm vibes and amazing langar.',
            highlights: ['Gurudwara Darshan', 'Laser show', 'Langar experience', 'Godavari river banks'],
            stay: 'Hotel'
        }
    ];`;

scriptJs = scriptJs.replace(/stay:\s*'Day trip'\s*}\s*\];/g, "stay: 'Day trip'\n        }" + newTrips);

fs.writeFileSync('script.js', scriptJs);
console.log('Successfully updated script.js with Picsum photos and 5 new Northern trips.');
