(function checkSupport(fn) {
    var html = document.documentElement,
        WebP = new Image();

    WebP.onload = WebP.onerror = function() {
        let isSupported = (WebP.height === 2);

        if (isSupported) {
            if (html.className.indexOf('no-webp') >= 0)
                html.className = html.className.replace(/\bno-webp\b/, 'webp');
            else html.className += ' webp';
        }
    };
    WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

    });
});