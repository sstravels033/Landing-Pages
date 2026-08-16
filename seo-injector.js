const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const siteUrl = 'https://sstravels.site';

// Helper to format title case
function toTitleCase(str) {
    return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const fileName = path.basename(filePath, '.html');
    const isIndex = fileName === 'index';
    const title = isIndex ? 'SS Travels - Best Travel Agency' : `${toTitleCase(fileName)} Tour Package - SS Travels`;
    const description = isIndex ? 'Discover the best travel packages across India with SS Travels.' : `Explore the amazing ${toTitleCase(fileName)} with SS Travels. Book your tour package today for an unforgettable experience.`;
    const url = isIndex ? `${siteUrl}/` : `${siteUrl}/trips/${fileName}.html`;
    
    // Check and update Schema JSON-LD
    const schemaOrg = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "SS Travels",
      "url": "${siteUrl}",
      "description": "${description}"
    }
    </script>
    `;
    
    // Missing SEO Meta tags
    const seoTags = `
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    ${schemaOrg}
    `;

    // Remove old specific tags if they exist to prevent duplication, simplified for script approach
    // We'll inject right before </head>
    if (!content.includes('og:title')) {
        content = content.replace('</head>', `${seoTags}\n</head>`);
        
        if (content.includes('<title>')) {
            content = content.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
        } else {
            content = content.replace('</head>', `<title>${title}</title>\n</head>`);
        }
        
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated SEO tags in ${filePath}`);
    } else {
        console.log(`Skipped ${filePath} - already contains SEO tags`);
    }
}

// Process index
processHtmlFile(path.join(baseDir, 'index.html'));

// Process trips
const tripsDir = path.join(baseDir, 'trips');
if (fs.existsSync(tripsDir)) {
    const tripFiles = fs.readdirSync(tripsDir).filter(f => f.endsWith('.html'));
    for (const file of tripFiles) {
        processHtmlFile(path.join(tripsDir, file));
    }
}

console.log('SEO update complete.');
