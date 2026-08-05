if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function bookTrip(tripName, tripDate, tripPrice) {
    var phone = '918409358131';
    var msg = 'Hey sstravels! 🌟 I want to book a seat for *' + tripName + '* on ' + tripDate + '. Price: ₹' + tripPrice + '/seat. Please share details!';
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
}
function shareTripDetail(tripName) {
    var shareData = {
        title: tripName + ' - sstravels',
        text: 'Hey! Check out this trip to ' + tripName + ' with sstravels! 🚀',
        url: window.location.href,
    };
    if (navigator.share) navigator.share(shareData);
    else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
    }
}