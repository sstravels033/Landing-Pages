// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 12, 16, 0.9)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(11, 12, 16, 0.7)';
        navbar.style.boxShadow = 'none';
    }
});

// Book Trip via WhatsApp
function bookTrip(tripName) {
    const phoneNumber = '918409358131';
    const message = `Hey sstravels! I'm interested in booking a seat for the ${tripName} trip. Can you share more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Share Trip
function shareTrip(tripName) {
    if (navigator.share) {
        navigator.share({
            title: `Join me on the ${tripName} trip!`,
            text: `Hey! Check out this awesome weekend getaway by sstravels: ${tripName}. Let's escape!`,
            url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        alert(`Copy this link to share the ${tripName} trip: ${window.location.href}`);
    }
}

// PWA Install Prompt Logic (Mocking for demonstration)
let deferredPrompt;
const modal = document.getElementById('install-modal');
const installBtn = document.getElementById('install-btn');
const closeBtn = document.getElementById('close-modal-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show modal after a small delay
    setTimeout(() => {
        modal.classList.add('show');
    }, 3000);
});

// For demonstration purposes, if not actually PWA environment, just show it
setTimeout(() => {
    if(!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
        modal.classList.add('show');
    }
}, 5000);

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

installBtn.addEventListener('click', async () => {
    modal.classList.remove('show');
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    } else {
        alert("To install, tap the share icon and select 'Add to Home Screen'.");
    }
});

// Hide modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});
