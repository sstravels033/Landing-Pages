const fs = require('fs');
let scriptJs = fs.readFileSync('script.js', 'utf8');

const newTrip = `,
        {
            id: 'up-heritage',
            name: 'Kashi, Ayodhya & Prayagraj',
            category: 'heritage',
            price: 15000,
            date: getNextWeekend(2),
            duration: '7 Days, 6 Nights',
            badge: 'Spiritual',
            image: 'https://picsum.photos/seed/kashi/800/600',
            alt: 'Ghats of Varanasi illuminated with beautiful evening Ganga Aarti',
            desc: 'The ultimate 7-day spiritual journey through the sacred cities of Uttar Pradesh. Witness the divine Ganga Aarti, the holy Sangam, and the grand Ram Mandir.',
            highlights: ['Kashi Vishwanath Darshan', 'Evening Ganga Aarti', 'Triveni Sangam dip', 'Ayodhya Ram Mandir', 'Boat ride at dawn'],
            stay: 'Premium Hotels'
        }
    ];`;

scriptJs = scriptJs.replace(/stay:\s*'Hotel'\s*}\s*\];/g, "stay: 'Hotel'\n        }" + newTrip);
fs.writeFileSync('script.js', scriptJs);
console.log('Successfully added Kashi-Ayodhya-Prayagraj 7-day trip.');
