// ============================================
// sstravels - Main JavaScript
// ============================================

(function () {
    'use strict';

    // ============================================
    // Trip Data
    // ============================================
    const TRIPS = [
        {
            id: 'goa',
            name: 'Goa Beach Vibes',
            category: 'beach',
            price: 6000,
            date: getNextWeekend(0),
            duration: '2 Days / 1 Night',
            badge: 'Trending',
            badgeType: 'trending',
            image: 'assets/goa.jpg',
            alt: 'Aerial view of a stunning Goa beach at sunset with golden sand stretching along turquoise Arabian Sea waters, palm trees casting long shadows, colorful beach shacks lit with fairy lights, and young travelers dancing near a bonfire on the shore',
            desc: 'Sun, sand, and unforgettable vibes. Experience the best of North Goa beaches, nightlife, and seafood.',
            highlights: ['Baga & Calangute beaches', 'Night market exploration', 'Beach bonfire & music', 'Seafood dinner by the sea'],
            stay: 'Hotel (shared rooms)'
        },
        {
            id: 'hampi',
            name: 'Hampi Heritage & Tents',
            category: 'heritage',
            price: 4500,
            date: getNextWeekend(1),
            duration: '2 Days / 1 Night',
            badge: 'Must Go',
            image: 'assets/hampi.jpg',
            alt: 'Majestic ancient stone ruins of Hampi at golden hour, massive granite boulders scattered across the landscape, the iconic Virupaksha temple towering in the background, with a group of young backpackers exploring the Tungabhadra riverbank',
            desc: 'Explore ancient ruins by day, camp under the stars by night. A surreal escape into history.',
            highlights: ['Virupaksha Temple sunrise', 'Coracle ride on Tungabhadra', 'Sunset at Matanga Hill', 'Tent camping under stars'],
            stay: 'Tent camping'
        },
        {
            id: 'araku',
            name: 'Araku Valley Escape',
            category: 'mountain',
            price: 5000,
            date: getNextWeekend(2),
            duration: '2 Days / 1 Night',
            badge: 'Nature',
            image: 'assets/araku.jpg',
            alt: 'Misty morning panorama of Araku Valley with lush green coffee plantations carpeting rolling hills, wispy clouds floating between valleys, a narrow gauge train winding through the Eastern Ghats, and tribal art installations visible along the scenic route',
            desc: 'Lush valleys, misty mornings, and fresh coffee. The perfect nature retreat to recharge your soul.',
            highlights: ['Borra Caves exploration', 'Coffee plantation tour', 'Tribal museum visit', 'Valley viewpoint sunrise'],
            stay: 'Resort'
        },
        {
            id: 'chirala',
            name: 'Chirala Beach Camping',
            category: 'beach',
            price: 3500,
            date: getNextWeekend(3),
            duration: '2 Days / 1 Night',
            badge: 'Budget',
            image: 'assets/chirala.jpg',
            alt: 'Pristine untouched beach at Chirala during twilight with deep blue waves crashing on clean sandy shore, colorful camping tents lined up near the dunes, a blazing orange bonfire surrounded by young adults playing guitar, and a starry sky beginning to emerge',
            desc: 'Bonfires, music, and ocean waves. The perfect quick weekend escape from Hyderabad.',
            highlights: ['Beach camping setup', 'Bonfire & music night', 'Sunrise yoga by the sea', 'Water sports activities'],
            stay: 'Beach tents'
        },
        {
            id: 'pondicherry',
            name: 'Pondicherry French Vibes',
            category: 'beach',
            price: 7000,
            date: getNextWeekend(4),
            duration: '2 Days / 1 Night',
            badge: 'Popular',
            badgeType: 'trending',
            image: 'assets/pondicherry.jpg',
            alt: 'Charming French Quarter street in Pondicherry with vibrant yellow and blue colonial buildings, bougainvillea cascading over walls, a vintage bicycle parked by a cafe, the Promenade Beach visible at the end of the street with crashing waves and a lighthouse',
            desc: 'French colonial charm meets Indian soul. Cafes, beaches, and the serene Auroville.',
            highlights: ['French Quarter walk', 'Promenade Beach sunrise', 'Auroville & Matrimandir', 'Cafe hopping & shopping'],
            stay: 'Heritage hostel'
        },
        {
            id: 'gandikota',
            name: 'Gandikota Grand Canyon',
            category: 'adventure',
            price: 3800,
            date: getNextWeekend(5),
            duration: '2 Days / 1 Night',
            badge: 'Adventure',
            image: 'assets/gandikota.jpg',
            alt: 'Dramatic gorge of Gandikota at sunrise, known as the Grand Canyon of India, with deep red and orange sandstone cliff walls plunging into the Pennar River below, ancient fort ruins perched on the cliff edge, and a camping tent set up at the viewpoint',
            desc: 'India\'s own Grand Canyon. Cliff camping, fort exploration, and jaw-dropping gorge views.',
            highlights: ['Canyon cliff viewpoint', 'Gandikota Fort ruins', 'Pennar River kayaking', 'Cliff-edge tent camping'],
            stay: 'Cliff camping'
        },
        {
            id: 'vizag',
            name: 'Vizag Coastal Drive',
            category: 'beach',
            price: 5500,
            date: getNextWeekend(6),
            duration: '2 Days / 1 Night',
            image: 'assets/vizag.jpg',
            alt: 'Breathtaking panoramic view of Visakhapatnam coastline from Kailasagiri hilltop with the vast Bay of Bengal stretching to the horizon, Rama Krishna Beach curving below, submarine museum visible on the shore, and lush green hills meeting the blue ocean',
            desc: 'Coastal roads, hilltop views, and submarine tours. Vizag is the beach city done right.',
            highlights: ['RK Beach & Submarine Museum', 'Kailasagiri hilltop cable car', 'Yarada Beach sunset', 'Dolphin\'s Nose viewpoint'],
            stay: 'Hotel'
        },
        {
            id: 'coorg',
            name: 'Coorg Coffee Land',
            category: 'mountain',
            price: 6500,
            date: getNextWeekend(7),
            duration: '2 Days / 1 Night',
            badge: 'Refreshing',
            image: 'assets/coorg.jpg',
            alt: 'Serene morning in Coorg coffee estate with rows of coffee plants covered in morning dew, misty Western Ghats mountains in the background, a traditional Kodava homestay with red-tiled roof surrounded by spice gardens, and a waterfall visible in the distance',
            desc: 'Misty hills, coffee aroma, and waterfalls. Coorg is where you go to feel alive again.',
            highlights: ['Abbey Falls trek', 'Coffee estate tour & tasting', 'Raja\'s Seat sunset', 'Dubare elephant camp'],
            stay: 'Homestay'
        },
        {
            id: 'warangal',
            name: 'Warangal Heritage Walk',
            category: 'heritage',
            price: 2800,
            date: getNextWeekend(1),
            duration: '1 Day',
            image: 'assets/warangal.jpg',
            alt: 'Ancient Kakatiya Kala Thoranam gateway of Warangal standing tall against a dramatic sky, intricate stone carvings on the thousand-pillar temple, Ramappa temple lake reflecting the ornate Kakatiya architecture, surrounded by manicured green lawns',
            desc: 'A quick dive into Kakatiya glory. Temples, forts, and incredible stone carvings — all in a day.',
            highlights: ['Thousand Pillar Temple', 'Warangal Fort & Thoranam', 'Ramappa Temple (UNESCO)', 'Pakhal Lake visit'],
            stay: 'Day trip'
        },
        {
            id: 'gokarna',
            name: 'Gokarna Trail & Beaches',
            category: 'beach',
            price: 5800,
            date: getNextWeekend(8),
            duration: '2 Days / 1 Night',
            image: 'assets/gokarna.jpg',
            alt: 'Stunning aerial view of Om Beach in Gokarna shaped like the sacred Om symbol, pristine golden sand between rocky headlands, turquoise waves lapping the shore, a trail of hikers visible on the coastal path connecting beaches, and rustic beach huts nestled in palm groves',
            desc: 'Quieter than Goa, more beautiful than most. Hike between hidden beaches and sleep under palm trees.',
            highlights: ['Beach trek trail (5 beaches)', 'Om Beach camping', 'Mahabaleshwar Temple', 'Cliff jumping at Half Moon'],
            stay: 'Beach huts'
        },
        {
            id: 'mysore',
            name: 'Mysore Royal Retreat',
            category: 'heritage',
            price: 5200,
            date: getNextWeekend(9),
            duration: '2 Days / 1 Night',
            image: 'assets/mysore.jpg',
            alt: 'Magnificent Mysore Palace illuminated with thousands of golden lights at dusk, Indo-Saracenic architecture gleaming against a purple twilight sky, the palace gardens in the foreground with visitors admiring the spectacle, and Chamundi Hills silhouetted in the background',
            desc: 'Royal palaces, vibrant markets, and Chamundi Hills. Mysore is heritage meets street food heaven.',
            highlights: ['Mysore Palace light show', 'Chamundi Hills sunrise', 'Brindavan Gardens', 'Devaraja Market shopping'],
            stay: 'Hotel'
        },
        {
            id: 'dandeli',
            name: 'Dandeli Adventure Rush',
            category: 'adventure',
            price: 5500,
            date: getNextWeekend(10),
            duration: '2 Days / 1 Night',
            badge: 'Thrilling',
            image: 'assets/dandeli.jpg',
            alt: 'Thrilling white water rafting scene on the Kali River in Dandeli with a group of young adventurers in orange life jackets paddling through class III rapids, lush dense Western Ghats forest flanking both sides of the river, sunlight filtering through the canopy',
            desc: 'White water rafting, jungle safaris, and zip-lining. For the adrenaline junkies in the group.',
            highlights: ['White water rafting (Class III)', 'Jungle safari drive', 'Zip-lining over the river', 'Night camping by Kali River'],
            stay: 'Riverside tents'
        },
        {
            id: 'ooty',
            name: 'Ooty Hill Station Chill',
            category: 'mountain',
            price: 5800,
            date: getNextWeekend(11),
            duration: '2 Days / 1 Night',
            image: 'assets/ooty.jpg',
            alt: 'Charming Nilgiri Mountain Railway toy train chugging through a misty tea plantation in Ooty, emerald green tea bushes stretching across rolling hills, eucalyptus trees lining the tracks, Ooty Lake visible in the valley below reflecting the cloudy sky',
            desc: 'Toy trains, tea gardens, and misty mornings. Classic hill station vibes for a relaxed weekend.',
            highlights: ['Nilgiri Mountain Railway ride', 'Tea factory tour', 'Ooty Lake boating', 'Doddabetta Peak views'],
            stay: 'Hotel'
        },
        {
            id: 'lambasingi',
            name: 'Lambasingi Frost Camp',
            category: 'mountain',
            price: 4000,
            date: getNextWeekend(3),
            duration: '2 Days / 1 Night',
            badge: 'Hidden Gem',
            image: 'assets/lambasingi.jpg',
            alt: 'Ethereal foggy morning at Lambasingi viewpoint with thick white clouds settled in the valley below like a sea of cotton, pine forest on the hillside catching golden dawn light, camping tents perched on the cliff edge, known as the Kashmir of Andhra Pradesh',
            desc: 'Andhra\'s Kashmir. Sub-zero feels, dense fog, and sunrise above the clouds. Unreal.',
            highlights: ['Cloud valley sunrise', 'Kothapalli waterfalls trek', 'Bonfire in the cold', 'Coffee estate walk'],
            stay: 'Camping'
        },
        {
            id: 'srisailam',
            name: 'Srisailam Temple & Tiger Reserve',
            category: 'adventure',
            price: 3500,
            date: getNextWeekend(2),
            duration: '1 Day',
            image: 'assets/srisailam.jpg',
            alt: 'Majestic Srisailam Mallikarjuna temple complex atop Nallamala Hills with ancient Dravidian gopuram towers, the sacred Krishna River flowing through a deep gorge below, dense Nallamala forest covering the surrounding hills, and Srisailam dam releasing water in a cascade',
            desc: 'Ancient temple on a cliff, tiger reserve forests, and the mighty Krishna river gorge.',
            highlights: ['Mallikarjuna Jyotirlinga', 'Krishna River boat ride', 'Nallamala forest drive', 'Pathalaganga viewpoint'],
            stay: 'Day trip'
        },
        {
            id: 'ananthagiri',
            name: 'Ananthagiri Quick Escape',
            category: 'mountain',
            price: 2500,
            date: getNextWeekend(0),
            duration: '1 Day',
            badge: 'Closest',
            image: 'assets/ananthagiri.jpg',
            alt: 'Peaceful Ananthagiri Hills forest trail just 80km from Hyderabad, tall eucalyptus and teak trees forming a green canopy over a winding red-dirt path, a small waterfall trickling over mossy rocks, morning mist hanging between the trees, perfect for a day hike',
            desc: 'Just 80km from Hyderabad. Quick morning trek, waterfalls, and back by evening.',
            highlights: ['Forest trek trails', 'Hidden waterfalls', 'Anantha Padmanabha Temple', 'Picnic by the stream'],
            stay: 'Day trip'
        }
    ];

    function getNextWeekend(weeksFromNow) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
        const nextSat = new Date(today);
        nextSat.setDate(today.getDate() + daysUntilSat + (weeksFromNow * 7));
        const nextSun = new Date(nextSat);
        nextSun.setDate(nextSat.getDate() + 1);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${nextSat.getDate()} ${months[nextSat.getMonth()]} - ${nextSun.getDate()} ${months[nextSun.getMonth()]}`;
    }

    // ============================================
    // Loader
    // ============================================
    document.body.classList.add('loading');
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.getElementById('loader').classList.add('hidden');
            document.body.classList.remove('loading');
            initAnimations();
        }, 1800);
    });

    // ============================================
    // Three.js Particle Background
    // ============================================
    function initThreeBackground() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles (fewer on mobile for performance)
        const isMobile = window.innerWidth <= 768;
        const particlesCount = isMobile ? 600 : 1500;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const colorPalette = [
            [1.0, 0.18, 0.33],   // pink
            [0.0, 0.9, 1.0],     // cyan
            [0.49, 0.23, 0.93],  // purple
            [1.0, 0.42, 0.21],   // orange
        ];

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color[0];
            colors[i * 3 + 1] = color[1];
            colors[i * 3 + 2] = color[2];
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connection lines
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(300 * 6);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.08,
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);

            particles.rotation.x += 0.0003;
            particles.rotation.y += 0.0005;

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Update connection lines
            const posArr = geometry.attributes.position.array;
            let lineIdx = 0;
            const maxDist = 1.5;
            const checkCount = isMobile ? 40 : 100;
            for (let i = 0; i < Math.min(particlesCount, checkCount); i++) {
                for (let j = i + 1; j < Math.min(particlesCount, checkCount); j++) {
                    if (lineIdx >= 300) break;
                    const dx = posArr[i * 3] - posArr[j * 3];
                    const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                    const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < maxDist) {
                        linePositions[lineIdx * 6] = posArr[i * 3];
                        linePositions[lineIdx * 6 + 1] = posArr[i * 3 + 1];
                        linePositions[lineIdx * 6 + 2] = posArr[i * 3 + 2];
                        linePositions[lineIdx * 6 + 3] = posArr[j * 3];
                        linePositions[lineIdx * 6 + 4] = posArr[j * 3 + 1];
                        linePositions[lineIdx * 6 + 5] = posArr[j * 3 + 2];
                        lineIdx++;
                    }
                }
                if (lineIdx >= 300) break;
            }
            lineGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initThreeBackground();

    // ============================================
    // Custom Cursor
    // ============================================
    function initCursor() {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;
        if (window.innerWidth <= 768) return;

        let cursorX = 0, cursorY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', function (e) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            dot.style.left = cursorX - 4 + 'px';
            dot.style.top = cursorY - 4 + 'px';
        });

        function animateRing() {
            ringX += (cursorX - ringX) * 0.15;
            ringY += (cursorY - ringY) * 0.15;
            ring.style.left = ringX - 17.5 + 'px';
            ring.style.top = ringY - 17.5 + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.querySelectorAll('a, button, .trip-card, .filter-btn').forEach(function (el) {
            el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
            el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
        });
    }

    initCursor();

    // ============================================
    // Navbar
    // ============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // Render Trip Cards
    // ============================================
    const tripsGrid = document.getElementById('trips-grid');
    const loadMoreBtn = document.getElementById('load-more');
    let visibleTrips = 8;
    let currentFilter = 'all';

    function renderTrips() {
        const filtered = currentFilter === 'all'
            ? TRIPS
            : TRIPS.filter(function (t) { return t.category === currentFilter; });

        const toShow = filtered.slice(0, visibleTrips);
        tripsGrid.innerHTML = '';

        toShow.forEach(function (trip, idx) {
            const card = document.createElement('div');
            card.className = 'trip-card';
            card.setAttribute('data-category', trip.category);
            card.style.transitionDelay = (idx * 0.05) + 's';

            let highlightsHtml = "";
            trip.highlights.forEach(function(h) {
                highlightsHtml += "<li><i class='fa-solid fa-check-circle'></i> " + h + "</li>";
            });

            card.innerHTML = '\
                <div class="card-image">\
                    <img src="' + trip.image + '" alt="' + trip.alt + '" loading="lazy">\
                    ' + (trip.badge ? '<span class="card-badge ' + (trip.badgeType || '') + '">' + trip.badge + '</span>' : '') + '\
                    <span class="card-price">₹' + trip.price.toLocaleString('en-IN') + '/seat</span>\
                </div>\
                <div class="card-content">\
                    <h3 class="card-title">' + trip.name + '</h3>\
                    <div class="card-meta">\
                        <span><i class="fa-regular fa-calendar"></i> ' + trip.date + '</span>\
                        <span><i class="fa-regular fa-clock"></i> ' + trip.duration + '</span>\
                        <span><i class="fa-solid fa-campground"></i> ' + trip.stay + '</span>\
                    </div>\
                    <p class="card-desc">' + trip.desc + '</p>\
                    <div class="card-expanded-content">\
                        <ul class="expanded-highlights">' + highlightsHtml + '</ul>\
                        <div class="card-expanded-link"><a href="trips/' + trip.id + '.html" >View Full Details &rarr;</a></div>\
                    </div>\
                    <div class="card-actions">\
                        <button class="card-btn card-btn-book" data-trip="' + trip.id + '"><i class="fa-brands fa-whatsapp"></i> Book Seat</button>\
                        <button class="card-btn card-btn-share" data-trip-name="' + trip.name + '" data-trip-url="trips/' + trip.id + '.html"><i class="fa-solid fa-share-nodes"></i></button>\
                    </div>\
                    <div class="expand-icon"><i class="fa-solid fa-chevron-down"></i></div>\
                </div>';

            card.addEventListener('click', function (e) {
                if (!e.target.closest('.card-btn') && !e.target.closest('a')) {
                    card.classList.toggle('expanded');
                }
            });

            tripsGrid.appendChild(card);

            setTimeout(function () { card.classList.add('visible'); }, 100 + idx * 80);
        });

        // Show/hide load more
        if (filtered.length > visibleTrips) {
            loadMoreBtn.classList.add('visible');
        } else {
            loadMoreBtn.classList.remove('visible');
        }

        // Attach card button events
        document.querySelectorAll('.card-btn-book').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var tripId = btn.getAttribute('data-trip');
                var trip = TRIPS.find(function (t) { return t.id === tripId; });
                bookTrip(trip);
            });
        });

        document.querySelectorAll('.card-btn-share').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                shareTrip(btn.getAttribute('data-trip-name'), btn.getAttribute('data-trip-url'));
            });
        });
    }

    renderTrips();

    // Load More
    loadMoreBtn.addEventListener('click', function () {
        visibleTrips += 6;
        renderTrips();
    });

    // Filter Tabs
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            visibleTrips = 8;
            renderTrips();
        });
    });

    // ============================================
    // Trip Modal
    // ============================================
    const tripModal = document.getElementById('trip-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    function openTripModal(trip) {
        var highlightsHtml = trip.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('');
        modalBody.innerHTML = '\
            <img class="modal-image" src="' + trip.image + '" alt="' + trip.alt + '">\
            <div class="modal-info">\
                <h2>' + trip.name + '</h2>\
                <div class="modal-meta">\
                    <span><i class="fa-regular fa-calendar"></i> ' + trip.date + '</span>\
                    <span><i class="fa-regular fa-clock"></i> ' + trip.duration + '</span>\
                    <span><i class="fa-solid fa-campground"></i> ' + trip.stay + '</span>\
                    <span><i class="fa-solid fa-indian-rupee-sign"></i> ' + trip.price.toLocaleString('en-IN') + ' per seat</span>\
                </div>\
                <p class="modal-desc">' + trip.desc + '</p>\
                <div class="modal-highlights">\
                    <h4>Trip Highlights</h4>\
                    <ul>' + highlightsHtml + '</ul>\
                </div>\
                <div class="modal-actions">\
                    <button class="btn btn-primary" onclick="window.ssBookTrip(\'' + trip.id + '\')"><i class="fa-brands fa-whatsapp"></i> <span>Book on WhatsApp</span></button>\
                    <button class="btn btn-glass" onclick="window.ssShareTrip(\'' + trip.name + '\')"><i class="fa-solid fa-share-nodes"></i> <span>Share</span></button>\
                </div>\
            </div>';

        tripModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    modalClose.addEventListener('click', closeTripModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeTripModal);

    function closeTripModal() {
        tripModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && tripModal.classList.contains('open')) {
            closeTripModal();
        }
    });

    // ============================================
    // Book & Share
    // ============================================
    function bookTrip(trip) {
        var phone = '918409358131';
        var msg = 'Hey sstravels! 🌟 I want to book a seat for *' + trip.name + '* on ' + trip.date + '. Price: ₹' + trip.price + '/seat. Please share details!';
        window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    }

    function shareTrip(tripName, tripUrl) {
        var url = tripUrl ? (window.location.href.split('index.html')[0] + tripUrl) : window.location.href;
        var shareData = {
            title: tripName + ' - sstravels',
            text: 'Hey! Check out this trip to ' + tripName + ' with sstravels! 🚀',
            url: url
        };
        if (navigator.share) {
            navigator.share(shareData).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareData.text + ' ' + shareData.url).then(function () {
                showToast('Link copied to clipboard!');
            });
        } else {
            showToast('Copy this link: ' + shareData.url);
        }
    }

    // Expose globally for modal onclick
    window.ssBookTrip = function (tripId) {
        var trip = TRIPS.find(function (t) { return t.id === tripId; });
        if (trip) bookTrip(trip);
    };
    window.ssShareTrip = shareTrip;

    // Toast notification
    function showToast(msg) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#25D366;color:white;padding:0.8rem 1.5rem;border-radius:50px;font-size:0.9rem;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.3s ease;';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function () { toast.style.opacity = '1'; }, 50);
        setTimeout(function () {
            toast.style.opacity = '0';
            setTimeout(function () { toast.remove(); }, 300);
        }, 2500);
    }

    // ============================================
    // GSAP Scroll Animations
    // ============================================
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero title reveal
        gsap.to('.title-line', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.3,
        });

        gsap.to('.hero-subtitle', { opacity: 1, duration: 0.8, delay: 0.9, ease: 'power2.out' });
        gsap.to('.hero-cta', { opacity: 1, duration: 0.8, delay: 1.1, ease: 'power2.out' });
        gsap.to('.hero-stats', { opacity: 1, duration: 0.8, delay: 1.3, ease: 'power2.out' });

        // Counter animation
        document.querySelectorAll('.stat-num').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            gsap.to(el, {
                innerHTML: target,
                duration: 2,
                delay: 1.5,
                snap: { innerHTML: 1 },
                ease: 'power2.out',
            });
        });

        // Section titles
        gsap.utils.toArray('.section-title[data-animate="reveal"]').forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out',
            });
        });

        // Safety cards
        gsap.utils.toArray('.safety-card').forEach(function (el, i) {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: 'power2.out',
                onComplete: function () { el.classList.add('visible'); }
            });
        });

        // Step cards
        gsap.utils.toArray('.step-card').forEach(function (el, i) {
            gsap.to(el, {
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power2.out',
                onComplete: function () { el.classList.add('visible'); }
            });
        });

        // Map section
        gsap.from('.india-map', {
            scrollTrigger: { trigger: '.map-section', start: 'top 70%' },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power3.out',
        });

        // Route lines animate in
        gsap.utils.toArray('.route-line').forEach(function (line, i) {
            gsap.from(line, {
                scrollTrigger: { trigger: '.map-section', start: 'top 60%' },
                strokeDashoffset: 100,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.05,
                ease: 'power2.out',
            });
        });
    }

    // ============================================
    // PWA Install
    // ============================================
    var deferredPrompt;
    var installModal = document.getElementById('install-modal');
    var installBtn = document.getElementById('install-btn');
    var dismissBtn = document.getElementById('dismiss-install');

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(function () { installModal.classList.add('show'); }, 4000);
    });

    // Show install suggestion after 8 seconds for all users
    setTimeout(function () {
        if (!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
            installModal.classList.add('show');
        }
    }, 8000);

    if (installBtn) {
        installBtn.addEventListener('click', function () {
            installModal.classList.remove('show');
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
            } else {
                showToast("Tap your browser's Share → Add to Home Screen");
            }
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', function () { installModal.classList.remove('show'); });
    }

    // ============================================
    // Smooth scroll for nav links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // Magnetic Button Effect
    // ============================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('.magnetic').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ============================================
    // Service Worker Registration
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').catch(function () {});
        });
    }

})();

window.initNavbar = function() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if(hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
};
