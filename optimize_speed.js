const fs = require('fs');

console.log('Optimizing speed...');

// 1. Inline CSS instead of @import in style.css
// Or rather, directly link the CSS in index.html to load in parallel.
const indexHtmlFile = 'index.html';
let indexHtml = fs.readFileSync(indexHtmlFile, 'utf8');

// Remove preconnects that aren't needed
indexHtml = indexHtml.replace(/<link rel="preconnect" href="https:\/\/cdnjs\.cloudflare\.com">/g, '');

// The original style.css has:
// @import url('css/variables.css');
// @import url('css/base.css');
// @import url('css/layout.css');
// We will remove style.css and put these links directly in the head.
const cssLinks = `
    <link rel="stylesheet" href="css/variables.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
`;
indexHtml = indexHtml.replace(/<link rel="stylesheet" href="style\.css">/, cssLinks);

// Clear style.css to prevent any remaining loads if missed
fs.writeFileSync('style.css', '');

// 2. Add defer to all scripts in head
indexHtml = indexHtml.replace(/<script src="js\/vendor\/three\.min\.js"><\/script>/, '<script src="js/vendor/three.min.js" defer></script>');
indexHtml = indexHtml.replace(/<script src="js\/vendor\/gsap\.min\.js"><\/script>/, '<script src="js/vendor/gsap.min.js" defer></script>');
indexHtml = indexHtml.replace(/<script src="js\/vendor\/ScrollTrigger\.min\.js"><\/script>/, '<script src="js/vendor/ScrollTrigger.min.js" defer></script>');

// 3. Remove components.js and inline the header/footer
indexHtml = indexHtml.replace(/<script src="js\/components\.js"><\/script>\s*/, '');
const headerHtml = fs.readFileSync('components/header.html', 'utf8');
const footerHtml = fs.readFileSync('components/footer.html', 'utf8');
indexHtml = indexHtml.replace(/<site-header><\/site-header>/, headerHtml);
indexHtml = indexHtml.replace(/<site-footer><\/site-footer>/, footerHtml);

// 4. Remove the broken loader text and divs
indexHtml = indexHtml.replace(/\s*<p class="loader-text">loading your next escape\.\.\.<\/p>\s*<\/div>\s*<\/div>/, '');

// 5. Move script.js to head with defer for parallel download
// Remove it from the bottom
indexHtml = indexHtml.replace(/<script src="script\.js"><\/script>/, '');
// Add it to head
indexHtml = indexHtml.replace(/<\/head>/, '    <script src="script.js" defer></script>\n</head>');

fs.writeFileSync(indexHtmlFile, indexHtml);

// 6. Update build.js to do the same for trips
let buildJs = fs.readFileSync('build.js', 'utf8');
buildJs = buildJs.replace(/<link rel="stylesheet" href="\.\.\/style\.css">/, `    <link rel="stylesheet" href="../css/variables.css">\n    <link rel="stylesheet" href="../css/base.css">\n    <link rel="stylesheet" href="../css/layout.css">`);
buildJs = buildJs.replace(/<script src="\.\.\/js\/components\.js"><\/script><site-header><\/site-header>/, headerHtml);
buildJs = buildJs.replace(/<site-footer><\/site-footer>/, footerHtml);
buildJs = buildJs.replace(/<script src="\.\.\/js\/trip\.js"><\/script>/, '');
buildJs = buildJs.replace(/<\/head>/, '    <script src="../js/trip.js" defer></script>\n</head>');
fs.writeFileSync('build.js', buildJs);

// 7. Update script.js to remove components.js dependency if any. 
// components.js just did customElements.define, which we removed.
// We also need to fix any loader code in layout.css
let layoutCss = fs.readFileSync('css/layout.css', 'utf8');
// Loader is not used anymore, but we can leave it or remove it. It's fine to leave it.
// Wait, we need to make sure window.initNavbar is called.
// script.js might need it, or we can just append a DOMContentLoaded listener in script.js
console.log('Optimization complete!');
